import {Queue} from 'bullmq'
import IORedis from 'ioredis'
import {connection} from './server.js'

const resumeQueue = new Queue('resumeQueue',{connection})

export const addResumeJob = async(data)=>{
    await resumeQueue.add('parser-resume',data)
        console.log('Job added to queue...')
}