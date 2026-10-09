import { NextRequest, NextResponse } from "next/server";

import { connectToDatabase } from "@/database/db";
import RegisterUser from "@/database/schema/register-user.schema"
import path from "node:path";
import { uploadImageToS3 } from "@/utilities/aws/helper.aws";
import { destructureSumbitBody } from "./destructure-body";
import { sendWelcomeEmail } from "@/utilities/emails/welcome-qr";

export async function POST(request: NextRequest) {
    try {
        await connectToDatabase()
        // Add DTO validation Here
        const body = await request.formData();

        const {
            full_name,
            email,
            phone_number,
            state,
            city,
            degree,
            institution,
            year_of_study } = destructureSumbitBody(body);

        // Check if the image is present and is a File
        const image = body.get("image");
        if (!(image instanceof File)) {
            throw new Error("Image is required");
        }
        const extension = path.extname(image.name).toLowerCase().replace(".", "");

        const buffer = Buffer.from(await image.arrayBuffer());

        const checkRegisterUser = await RegisterUser.findOne({
            email
        });

        if (checkRegisterUser) {
            return NextResponse.json({
                message: "User already registered",
                data: null,
                error: null,
                redirect: true,
                redirectUrl: `/check-email?email=${email}`
            }, { status: 400 })
        }

        const { success, url, error } = await uploadImageToS3(buffer, extension, image.type)

        if (!success) {
            return NextResponse.json({
                message: "Error uploading image",
                data: null,
                error,
                redirect: false,
                redirectUrl: null
            }, { status: 500 })
        }

        const createUser = await RegisterUser.create({
            full_name,
            email,
            phone_number,
            city,
            state,
            institution,
            degree,
            year_of_study,
            profile_image: url
        });
        if (!createUser) {
            return NextResponse.json({
                message: "Error creating user",
                data: null,
                error: "Error creating user",
                redirect: false,
                redirectUrl: null
            }, { status: 500 })
        }

        await sendWelcomeEmail(email, full_name);

        return NextResponse.json({
            message: "User created successfully",
            data: createUser,
            error: null,
            redirect: true,
            redirectUrl: `/check-email?email=${email}`
        }, { status: 201 });


    } catch (error) {
        return NextResponse.json({
            message: "Error fetching event data",
            data: null,
            error: error instanceof Error ? error.message : "Unknown error",
            redirect: false,
            redirectUrl: null
        }, { status: 500 })
    }
}