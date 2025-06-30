import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import { authCheckerForCandidate } from '../middleware/authMiddleware.js'
import Jobs from '../models/jobs.js'
import Users from '../models/user.js'
import submitApplication from '../models/submitApplication.js'
import mongoose from 'mongoose'
import { uploadResume } from '../middleware/resumeUploadMiddleware.js'
dotenv.config()
const SECRET_KEY = process.env.SECRET_KEY

const router = express.Router()

router.get('/getJobs/:companyname',authCheckerForCandidate,async(req,res)=>{
    const companyname = decodeURI(req.params.companyname)
    console.log(companyname)
    try{
        const jobs = await Jobs.find({companyName:companyname})
        return res.json(jobs)
    }catch(error){
        return res.json({message:error.name})
    }
})

router.get('/getJobs',authCheckerForCandidate,async(req,res)=>{
    try{
        const jobs = await Jobs.find()
        res.json(jobs)
    }catch(error){
        console.log(error.name)
        return res.status(404).json({message:error.name})
    }
})

router.get('/customSearch',authCheckerForCandidate,async(req,res)=>{
    const filter = {}
    if(req.query.companyname){
        filter.companyName = (req.query.companyname)
        console.log(req.query.companyname)
    }
    if(req.query.location){
        filter.jobLocation = req.query.location
    }
    try{
        console.log(filter)
        const filteredjobs = await Jobs.find(filter)
        return res.json(filteredjobs)
    }catch(error){
        return res.status(404).json({message:"Error"+error.name})
    }
})



router.post('/applyToJob/:id', authCheckerForCandidate,uploadResume, async (req, res) => {
  try {
     console.log("REQ FILE:", req.file);
    console.log("REQ BODY:", req.body);
    const jobId = new mongoose.Types.ObjectId(req.params.id);
    const username = req.user.username;
    console.log(req.body.file)
    const userDetails = await Users.findOne({ username });
    if (!userDetails) {
      return res.status(404).json({ message: "User not found." });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Resume file is required." });
    }

    const resumePath = req.file.path; 

    const newApplication = new submitApplication({
      jobId,
      username,
      submitTime: new Date(),
      resume: resumePath
    });

    await newApplication.save();

    return res.status(200).json({ message: "Applied to the job with resume uploaded." });

  } catch (error) {
    console.error("Error applying:", error);
    return res.status(500).json({ message: "Failed to apply: " + error.message });
  }
});







export default router