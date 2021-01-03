const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const aws = require('aws-sdk');
const multerS3 = require('multer-sharp-s3');
const dateFormat = require('dateformat');

const createFileName = (req, file, cb, desc) => {
    if(!desc){
        desc = file.originalname.substring(0,file.originalname.lastIndexOf('.'));
    }

    crypto.randomBytes(16, (err, hash) => {
        if (err) return cb(err);
        
        const data = new Date();
        const dataFormatada = dateFormat(new Date(), "yyyymmddHHMMss");                

        const userId = req.userId ? req.userId : 0;
        file.key = `${hash.toString('hex')}-${userId}-${dataFormatada}_${desc}`;

        cb(null, file.key);
    });
}


const storageTypes = {
    local: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.resolve(__dirname, "..", "..", "tmp", "uploads"));
        }, 
        filename: createFileName
    }),
    s3: multerS3({
        s3: new aws.S3(),
        Bucket: process.env.S3_BUCKET,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        ACL: 'public-read',

        Key: (req, file, cb) => {
            return createFileName(req, file, cb, 'x');
        },
        resize: {
          width: 150, 
          height: 150
        },
        toFormat: 'webp',
        withoutEnlargement: true,
    })

}


module.exports = {
    dest: path.resolve(__dirname, "..", "..", "tmp", "uploads"),
    storage: storageTypes[process.env.STORAGE_TYPE], 
    limits: {
        fileSize: 2*1024*1024
    },

    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            "image/jpeg", 
            "image/pjpeg", 
            "image/png", 
            "image/gif",
        ];

        if(allowedMimes.includes(file.mimetype)){
            cb(null, true);
        }else{
            cb(new Error("Invalid file type."));
        }
    }

};