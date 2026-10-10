import { randomUUID } from "node:crypto";
import { s3Client, sesClient, SendEmailCommand, PutObjectCommand } from "./client"


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

export async function sendEmailWithSES(to: string, subject: string, html: string, text?: string) {
    const from = "no-reply@islec.edu.in";

    try {
        const response = await sesClient.send(
            new SendEmailCommand({
                Source: from,
                Destination: {
                    ToAddresses: [to],
                },
                Message: {
                    Subject: {
                        Data: subject,
                        Charset: "UTF-8",
                    },
                    Body: {
                        Text: {
                            Data: text,
                            Charset: "UTF-8",
                        },
                        Html: {
                            Data: html,
                            Charset: "UTF-8",
                        },
                    },
                },
            }),
        )

        return {
            success: true,
            messageId: response.MessageId,
            error: null,
        }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
            messageId: null,
        }
    }
}
