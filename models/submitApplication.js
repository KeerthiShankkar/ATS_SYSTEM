import mongoose from 'mongoose'

const submitApplicationSchema = new mongoose.Schema({
    jobId:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    submitTime:{
        type:Date,
        required:true
    },
    resume:{
        type:String,
        required:true
    },
    passedThroughQueue:{
        type:Boolean,
        default:false
    }
})

export default mongoose.model('SubmitApplication', submitApplicationSchema)