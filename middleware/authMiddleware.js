import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
dotenv.config()
const app = express()
const SECRET_KEY = process.env.SECRET_KEY

export const authCheckerForRecruiter = (req,res,next)=>{
    const authHeader = req.get('x-auth-token')
    const token = authHeader&&authHeader.split(' ')[1]
    if(!token){
        return res.status(404).json({message:"ReLogin again ..."})
    }
    const roleDecode = jwt.verify(token,SECRET_KEY)
    if(roleDecode.role!==process.env.RECRUITER){
        return res.status(401).json({message:"You are not a recruiter"})
    }
    req.user = roleDecode
    next()
}


export const authCheckerForCandidate = (req,res,next)=>{
    const authHeader = req.get('x-auth-token')
    const token = authHeader&&authHeader.split(' ')[1]
    console.log(token)
    if(!token){
        return res.status(401).json({message:"Relogin..."})
    }
    const decodeRole = jwt.verify(token,SECRET_KEY)
    if(decodeRole.role!=='user'){
        return res.status(401).json({message:"You dont have proper access reLogin..."})
    }
    req.user = decodeRole
    next()
}