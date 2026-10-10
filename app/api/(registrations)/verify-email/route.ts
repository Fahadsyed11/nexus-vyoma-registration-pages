import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import { connectToDatabase } from "@/database/db";
import RegisterUser from "@/database/schema/register-user.schema"
import OtpVerification from "@/database/schema/otp-verification.schema"
import { sendWelcomeEmail } from "@/utilities/emails/welcome-qr";
import { signJWT } from "@/utilities/jwt";

export async function POST(request: NextRequest) {
    try {
        // Add DTO validation Here
        const body = await request.json();
        const { otp, email } = body;

        await connectToDatabase();

        const otpRecord = await OtpVerification.findOne({ email, otp });
        const currentTime = new Date();

        if (!otpRecord) {
            return NextResponse.json({
                message: "Invalid OTP",
                data: null,
                error: null,
                redirect: false,
                redirect_url: null
            }, { status: 400 });
        }

        if (currentTime.getTime() - otpRecord.time > 300000) {
            return NextResponse.json({
                message: "OTP expired. Please request a new OTP.",
                data: null,
                error: null,
                redirect: true,
                redirect_url: "/check-email"
            }, { status: 400 });
        }

        const user = await RegisterUser.findOne({ email });

        if (!user) {
            return NextResponse.json({
                message: "User not found",
                data: null,
                error: null,
                redirect: true,
                redirect_url: "/register"
            }, { status: 404 });
        }

        // If user verifies for first time, send him the welcome email
        if (user && user.isverified === false) {
            user.isverified = true;
            await user.save();

            await sendWelcomeEmail(user.email, user.full_name);
        }

        await OtpVerification.deleteOne({ email, otp });

        // set the cookie for the user session for 2 hours
        const cookieStore = await cookies();
        const token = signJWT({ user: { id: user._id, name: user.full_name, email: user.email } }, { expiresIn: "2h" });
        const tempToken = signJWT({ user: { id: user._id, name: user.full_name, email: user.email } }, { expiresIn: "690000000Ms" });

        cookieStore.set("nv-session", token, { httpOnly: true, path: "/", sameSite: "strict", secure: process.env.NODE_ENV === "production", expires: 2 * 60 * 60 * 1000 })

        // set temporary cookie for 1 hour 55 mins so if this expires then user will be redirected to check-email page to verify his email again
        cookieStore.set("nv-session-temp", tempToken, { httpOnly: true, path: "/", sameSite: "strict", secure: process.env.NODE_ENV === "production", expires: 1 * 60 * 60 * 1000 + 55 * 60 * 1000 })

        return NextResponse.json({
            message: "OTP verified successfully",

            data: {
                user: {
                    id: user._id,
                    name: user.full_name,
                    email: user.email,
                },
            },
            error: null,
            redirect: true,
            redirect_url: "/checkout"
        }, { status: 200 });

    } catch (error) {
        console.log("Error fetching event data:", error)
        return NextResponse.json({
            message: "Error fetching event data",
            data: null,
            error: error instanceof Error ? error.message : "Unknown error",
        }, { status: 500 })
    }
}