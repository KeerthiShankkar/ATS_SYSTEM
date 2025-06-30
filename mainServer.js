import express from 'express'
import dotenv from 'dotenv'
import userRoute from './routes/users.js'
import mongoose from 'mongoose'
import recruiterRoute from './routes/recruiter.js'
import candidatesRoute from './routes/candidates.js'
import testMQ from './routes/testMQ.js'
import fs from 'fs'
dotenv.config()

const PORT = process.env.PORT_MAIN_SERVER
const app = express()
app.use(express.json())


const resumeDir = 'uploads/resume';
if (!fs.existsSync(resumeDir)) {
  fs.mkdirSync(resumeDir, { recursive: true });
}


const dbConnection = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log('DB connected')
    }catch(error){('failed connecting to the DB')
    }
}

dbConnection()

app.use('/users',userRoute)
app.use('/recruiter',recruiterRoute)
app.use('/candidates',candidatesRoute)
app.use('/testmq',testMQ)

app.listen(PORT,()=>{
    console.log(`server up on port ${PORT}`)
})