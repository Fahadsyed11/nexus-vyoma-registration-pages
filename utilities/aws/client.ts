import { S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
    region: process.env.AWS_REGION!,
    maxAttempts: 3,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    }
})

export default s3Client;


// https://nexus-vyoma.s3.ap-south-2.amazonaws.com/profile/653f90f8-0f21-48d6-8fc5-9c51c9ba9357.jpg