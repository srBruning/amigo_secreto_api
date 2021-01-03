require("dotenv-safe").config();
const AppPicture = require('../models/AppPicture');

const aws = require('aws-sdk');
const s3 = new aws.S3();
 
const deleteS3Picture = async (appPicture) => {
    return s3.deleteObject({
        Bucket: process.env.S3_BUCKET,
        Key: appPicture.key,
    }).promise();
}

const deleteLocalPicture = async (appPicture) => {
}

class PictureService { 

    
    async deletePicture(appPicture){
        if(process.env.STORAGE_TYPE === 's3'){
            return deleteS3Picture(appPicture)
        }
        //return deleteLocalPicture(appPicture);
    }
}


module.exports = new PictureService();