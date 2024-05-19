import dotenv from "dotenv";
dotenv.config({
    path: "./.env",
  });

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

const AWS_ACCOUNT_ID = process.env.AWS_ACCOUNT_ID;
const AWS_IAM_USER = process.env.AWS_IAM_USER;
const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

const S3_BUCKET_NAME = "ritwik-private";
const S3_BUCKET_REGION = "ap-south-1";
const IMG_ID = "fuckyou.jpg";
const IMG_URL =
    "https://ritwik-private.s3.ap-south-1.amazonaws.com/fuckyou.jpg";

const s3Client = new S3Client({
    region: S3_BUCKET_REGION,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
    },
});

async function getObject(imageId) {
    const command = new GetObjectCommand({
        Bucket: S3_BUCKET_NAME,
        Key: imageId,
    });

    const url = await getSignedUrl(s3Client, command, {
        expiresIn: 30,  // in seconds
    });

    return url;
}

async function putObject(pathName, fileName, contentType) {
    const command = new PutObjectCommand({
        Bucket: S3_BUCKET_NAME,
        Key: `${pathName}${fileName}`,
        contentType: contentType,
    });

    const url = await getSignedUrl(s3Client, command, {
        // expiresIn: 120,
    })

    return url;
}

async function deleteObject(imageId) {
    const command = new DeleteObjectCommand({
        Bucket: S3_BUCKET_NAME,
        Key: imageId,
    })

    const response = await s3Client.send(command)

    return response
}

async function init() {
    // // Get the doc link
    // const uploadedDocId = ""
    // const url = await getObject(uploadedDocId || IMG_ID)
    // console.log("URL ==>", url)

    // // Upload link (will upload here ...)
    // const pathName = `user-uploads/`
    // const fileName = `image-${Date.now()}.jpeg`
    // const imageContentType = "image/jpeg"
    // const urlForUploading = await putObject(pathName, fileName, imageContentType)
    // console.log("URL for uploading ==>", urlForUploading);

    // // Delete the doc using its id/key
    // const deletedDocId = "user-uploads/image-1716013160484.jpeg"
    // const response = await deleteObject(deletedDocId)
    // console.log(response)
    // console.log("Deleted !")
}

init()