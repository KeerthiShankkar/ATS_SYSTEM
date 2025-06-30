import {Queue} from 'bullmq'
import IORedis from 'ioredis'

export const connection = new IORedis({
    host:'127.0.0.1',
    port:6379,
    maxRetriesPerRequest: null

})

connection.on('connect',()=>{
    console.log('redis connected')
})
connection.on('error',()=>{
    console.log('redis error')
})


