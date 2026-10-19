import path from "node:path";
import { NextRequest, NextResponse } from "next/server";

import { connectToDatabase } from "@/database/db";
import RegisterUser from "@/database/schema/register-user.schema"

import { uploadImageToS3 } from "@/utilities/aws/helper.aws";
import { destructureSumbitBody } from "./destructure-body";

import { cookies } from "next/headers";
import { signJWT } from "@/utilities/jwt";

export async function POST(request: NextRequest) {
    try {
        await connectToDatabase();

        const contentType = request.headers.get("content-type") || "";
        let bodyPayload: FormData | Record<string, unknown>;
        let imageFile: File | null = null;

        if (contentType.includes("application/json")) {
            bodyPayload = (await request.json().catch(() => ({}))) as Record<string, unknown>;
        } else {
            const formData = await request.formData();
            bodyPayload = formData;
            const img = formData.get("image");
            if (img instanceof File && img.size > 0) {
                imageFile = img;
            }
        }

        const { data, issues, success: isValid } = destructureSumbitBody(bodyPayload);

        if (!isValid) {
            return NextResponse.json({
                message: "Invalid form data",
                data: null,
                error: issues,
                redirect: false,
                redirectUrl: null
            }, { status: 400 });
        } else if (!data) {
            return NextResponse.json({
                message: "No data provided",
                data: null,
                error: "No data provided",
                redirect: false,
                redirectUrl: null
            }, { status: 400 });
        }

        const { city, state, full_name, email, phone_number, institution, degree, year_of_study } = data;

        let profileImageUrl = "default";

        if (imageFile) {
            const maxSize = 20 * 1024 * 1024; // 20 MB
            if (imageFile.size > maxSize) {
                return NextResponse.json(
                    { message: "Image must be 20 MB or smaller" },
                    { status: 400 }
                );
            }

            const extension = path.extname(imageFile.name).toLowerCase().replace(".", "");
            const buffer = Buffer.from(await imageFile.arrayBuffer());
            const { success, url, error } = await uploadImageToS3(buffer, extension, imageFile.type);

            if (!success) {
                return NextResponse.json({
                    message: "Error uploading image",
                    data: null,
                    error,
                    redirect: false,
                    redirectUrl: null
                }, { status: 500 });
            }
            profileImageUrl = url || "";
        }

        const checkRegisterUser = await RegisterUser.findOne({ email });

        let userRecord = checkRegisterUser;

        if (checkRegisterUser) {
            checkRegisterUser.full_name = full_name;
            checkRegisterUser.phone_number = phone_number;
            checkRegisterUser.city = city;
            checkRegisterUser.state = state;
            checkRegisterUser.institution = institution;
            checkRegisterUser.degree = degree;
            checkRegisterUser.year_of_study = year_of_study;
            if (profileImageUrl) {
                checkRegisterUser.profile_image = profileImageUrl;
            }
            checkRegisterUser.is_verified = true;
            await checkRegisterUser.save();
        } else {
            userRecord = await RegisterUser.create({
                full_name,
                email,
                phone_number,
                city,
                state,
                institution,
                degree,
                year_of_study,
                profile_image: profileImageUrl,
                is_verified: true,
            });
        }

        if (!userRecord) {
            return NextResponse.json({
                message: "Error creating user",
                data: null,
                error: "Error creating user",
                redirect: false,
                redirectUrl: null
            }, { status: 500 });
        }

        const cookieStore = await cookies();
        const token = signJWT(
            { user: { id: userRecord._id, name: userRecord.full_name, email: userRecord.email } },
            { expiresIn: "2h" }
        );
        cookieStore.set("nv-session", token, {
            httpOnly: true,
            path: "/",
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
            maxAge: 2 * 60 * 60,
        });

        return NextResponse.json({
            message: "User registered successfully",
            data: userRecord,
            error: null,
            redirect: true,
            redirectUrl: "/payment/success"
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