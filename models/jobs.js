
import mongoose from "mongoose"

const jobSchema = new mongoose.Schema({
    companyName:{
        type:String,
        required:true
    },
    jobTitle:{
        type:String,
        required:true
    },
    jobDescription:{
        type:String,
        required:true
    },
    postDate:{
        type:Date,
        required:true
    },
    expireDate:{
        type:Date,
        required:false
    },
    jobLocation:{
        type:String,
        required:true
    },
    aboutTheCompany:{
        type:String,
        required:true
    },
    postedBy:{
        type:String,
        required:true
    }

})
export default mongoose.model('Jobs',jobSchema)