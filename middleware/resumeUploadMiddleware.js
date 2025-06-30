import multer from 'multer'
import path from 'path'

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'uploads/resume')
    },
    filename:function(req,file,cb){
        const ext = path.extname(file.originalname)
        const uniqueName = `${req.user.username}-${Date.now()}${ext}`
        cb(null,uniqueName)
    }
})

const fileFilter = (req,file,cb)=>{
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if(allowedTypes.includes(file.mimetype)){
        cb(null,true)
    }
    else{
        cb(new Error('Only PDF, DOC, and DOCX files are allowed'), false);

    }
}


const upload = multer({
    storage:storage,
    fileFilter:fileFilter,
    limits:{fileSize:5*1024*1024}
})

export const uploadResume = upload.single('resume')