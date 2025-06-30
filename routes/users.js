import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'
import User from '../models/user.js'
import dotenv from 'dotenv'
dotenv.config()
const SECRET_KEY = process.env.SECRET_KEY
console.log(SECRET_KEY)

const router = express.Router()


router.post('/register',async(req,res)=>{
    try{
    const{username,password} = req.body
    const existingUser = await User.findOne({username})
    if(existingUser){
        return res.status(400).json({message:"User name already exists..."})
    }
    const hashedPassword = bcrypt.hashSync(password,10)
    const newUser = await User.create({
        username,
        password:hashedPassword
    })
    return res.status(200).json({message:"Profile created successfully..."})
}catch(error){
    console.log(error.name)
    return res.status(500).json({message:"Internal server error..."})
}
})

router.post('/login',async(req,res)=>{
    const{username,password} = req.body
    if(!username||!password){
        return res.status(401).json('Please enter both the fields')
    }
    const user = await User.findOne({username})
    if(!user){
        return res.status(401).json("Invalid username or password...")
    }
    const isMatch = bcrypt.compareSync(password,user.password)
    if(!isMatch){
        return res.status(401).json('Invalid username or password...')
    }
    let token
    if(username.includes('recruiterFr')){
         token = jwt.sign({username:user.username,role:process.env.RECRUITER},SECRET_KEY)
    }
    else{
        token =  jwt.sign({username:user.username,role:'user'},SECRET_KEY)
    }
    return res.status(200).json({message:'Login success',userToken:token})
    
})



export default router