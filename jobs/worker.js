import { Worker } from 'bullmq';
import { connection } from './server.js';
import fs from 'fs';
import path from 'path';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import axios from 'axios';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import submitApplication from '../models/submitApplication.js';
import Jobs from '../models/jobs.js';
import { getSimilarity } from '../util/computeSimilarity.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected in Worker'))
.catch(err => {
  console.error('❌ MongoDB connection error in Worker:', err);
  process.exit(1); 
});

const resumeWorker = new Worker(
  'resumeQueue',
  async (job) => {
    try {
      const { resumePath } = job.data;
      console.log('📄 Job Data:', job.data);
      const normalizedPath = resumePath.replace(/\\/g, '/');
      const projectRoot = path.resolve('../'); 
      const absolutePath = path.join(projectRoot, normalizedPath);

      console.log('📂 Reading resume from:', absolutePath);

      const data = new Uint8Array(fs.readFileSync(absolutePath));
      const pdf = await getDocument({ data }).promise;

      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map(item => item.str).join(' ');
        fullText += pageText + '\n';
      }

      return fullText;

    } catch (error) {
      console.error(`❌ Job ${job.id} failed:`, error.message);
      throw error;
    }
  },
  { connection }
);

// resumeWorker.on('completed', async (job, result) => {
//   console.log(`✅ Job ${job.id} completed`);
//   console.log('⏳ Running LLM inference...');

//   try {
//     const jobId = job.data.jobId;
//     const jobDoc = await Jobs.findById(jobId);

//     if (!jobDoc) {
//       console.error('❌ Job document not found');
//       return;
//     }

//     const jobDescription = jobDoc.jobDescription;
//     const rawPrompt = process.env.PROMPT;

//     const finalPrompt = rawPrompt
//       .replace('{{JD}}', jobDescription)
//       .replace('{{resume_text}}', result);
//     console.log(finalPrompt)

//     const response = await axios.post('http://localhost:11434/api/generate', {
//       model: 'mistral:latest',
//       prompt: finalPrompt,
//       stream: false
//     });

//     console.log('✅ LLM Response:', response.data);

//   } catch (err) {
//     console.error('❌ Error during LLM generation:', err.message);
//   }
// });
resumeWorker.on('completed', async (job, result) => {
  console.log(`✅ Job ${job.id} completed`);
  console.log('⏳ Calculating semantic match...');

  try {
    const jobId = job.data.jobId;
    const jobDoc = await Jobs.findById(jobId);

    if (!jobDoc) {
      console.error('❌ Job document not found');
      return;
    }

    const jobDescription = jobDoc.jobDescription;

    const similarity = await getSimilarity(result, jobDescription);
    const score = (similarity * 100).toFixed(2);

    console.log(`🎯 Match Score: ${score}%`);

    // Optional: Save the score to MongoDB
    await submitApplication.updateOne(
      { jobId: jobId, resumePath: job.data.resumePath },
      { $set: { matchScore: score } },
      { upsert: true }
    );

  } catch (err) {
    console.error('❌ Error during similarity calculation:', err.message);
  }
});

resumeWorker.on('failed', (job) => {
  console.log(`❌ Job ${job.id} failed`);
});
