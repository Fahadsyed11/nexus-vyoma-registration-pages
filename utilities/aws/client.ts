import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const s3Client = new S3Client({
    region: process.env.AWS_REGION!,
    maxAttempts: 3,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    }
});

const sesClient = new SESClient({
    region: process.env.AWS_REGION!,
    maxAttempts: 3,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    }
})

export { s3Client, sesClient, SendEmailCommand, PutObjectCommand };


// https://nexus-vyoma.s3.ap-south-2.amazonaws.com/profile/653f90f8-0f21-48d6-8fc5-9c51c9ba9357.jpg