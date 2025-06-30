import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'
import User from '../models/user.js'
import dotenv from 'dotenv'
import { authCheckerForRecruiter } from '../middleware/authMiddleware.js'
import Jobs from '../models/jobs.js'
dotenv.config()
const SECRET_KEY = process.env.SECRET_KEY
console.log(SECRET_KEY)

const router = express.Router()

router.get('/',authCheckerForRecruiter,async (req,res)=>{
    const users = await User.find()
    res.json(users)
})
router.post('/postJob',authCheckerForRecruiter,async(req,res)=>{
    const {companyName,jobTitle,jobDescription,postDate,expireDate,jobLocation,aboutTheCompany,postedBy} = req.body
    const job = new Jobs({companyName,jobTitle,jobDescription,postDate,expireDate,jobLocation,aboutTheCompany,postedBy})
    await job.save()
    return res.send(job)
})
 

export default router