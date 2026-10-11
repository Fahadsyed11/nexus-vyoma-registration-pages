import path from "node:path";
import { NextRequest, NextResponse } from "next/server";

import { connectToDatabase } from "@/database/db";
import RegisterUser from "@/database/schema/register-user.schema"

import { uploadImageToS3 } from "@/utilities/aws/helper.aws";
import { destructureSumbitBody } from "./destructure-body";

export async function POST(request: NextRequest) {
    try {
        await connectToDatabase()
        // Add DTO validation Here
        const body = await request.formData();

        const { data, issues, success: isValid } = destructureSumbitBody(body);

        if (!isValid) {
            return NextResponse.json({
                message: "Invalid form data",
                data: null,
                error: issues,
                redirect: false,
                redirectUrl: null
            }, { status: 400 })
        } else if (!data) {
            return NextResponse.json({
                message: "No data provided",
                data: null,
                error: "No data provided",
                redirect: false,
                redirectUrl: null
            }, { status: 400 })
        }

        const { city, state, full_name, email, phone_number, institution, degree, year_of_study } = data;

        // Check if the image is present and is a File
        const image = body.get("image");
        if (!(image instanceof File) || image.size === 0) {
            return NextResponse.json(
                { message: "A valid image is required" },
                { status: 400 }
            );
        }

        const maxSize = 20 * 1024 * 1024; // 20 MB
        if (image.size > maxSize) {
            return NextResponse.json(
                { message: "Image must be 20 MB or smaller" },
                { status: 400 }
            );
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
                redirectUrl: `/register/check-email?email=${email}`
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

        return NextResponse.json({
            message: "User created successfully",
            data: createUser,
            error: null,
            redirect: true,
            redirectUrl: `/register/check-email?email=${email}`
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