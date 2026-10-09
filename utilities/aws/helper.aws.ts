import { randomUUID } from "node:crypto";
import s3Client from "./client"
import { PutObjectCommand } from "@aws-sdk/client-s3";


export async function uploadImageToS3(file: Buffer, extension: string, contentType: string) {
    const allowedTypes: Record<string, string> = {
        "image/jpeg": "jpg",
        "image/png": "png",
        "image/webp": "webp",
    };

    if (allowedTypes[contentType] !== extension.toLowerCase()) {
        // return "Unsupported image type or extension";
        return {
            success: false,
            error: "Unsupported image type or extension",
            url: null,
            key: null,
            result: null,
        }
    }

    const fileName = `${randomUUID()}.${extension.toLowerCase()}`;
    const key = `profile/${fileName}`;
    console.log({ key })

    try {
        const result = await s3Client.send(
            new PutObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME!,
                Key: key,
                Body: file,
                ContentType: contentType,
            })
        )

        return {
            success: true,
            url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
            key: key,
            result,
            error: null,
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
            url: null,
            key: null,
            result: null,
        }
    }
}
