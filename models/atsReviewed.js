import mongoose from 'mongoose'

const atsReview = new mongoose.Schema({
    
    jobId:{
        type:String,
        required:true
    },
    jobtitle:{
        type:String,
        required:true
    },
    candidatename:{
        type:String,
        required:true
    },
    resumescore:{
        type:Number,
        required:true
    },
    fitnesstojob:{
        type:String,
        required:true
    },

})
const atsReviewModel = mongoose.model('atsReview', atsReview);