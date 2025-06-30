import express from 'express';
import submitApplication from '../models/submitApplication.js';
import { addResumeJob } from '../jobs/resumeProcessProducer.js';

const router = express.Router();

router.get('/mqJob', async (req, res) => {
  try {
    console.log('📥 Hit /mqJob route');
    const pendingResumes = await submitApplication.find({ passedThroughQueue: false });
    console.log(`🔍 Found ${pendingResumes.length} resumes`);

    for(const resume of pendingResumes){
        await addResumeJob({
            candidateName:resume.username,
            resumePath:resume.resume,
            jobId:resume.jobId,
            jobDoc:resume._id.toString()
        })
        resume.passedThroughQueue = true
        await resume.save()
    }
  

    return res.status(200).json({
        message: `Resumes added to queue username:`
    })


} catch (err) {
    console.error('❌ Error fetching resumes:', err.message);
    res.status(500).json({ message: 'Server error while fetching resumes' });
  }
});

export default router;
