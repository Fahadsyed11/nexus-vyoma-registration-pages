import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import { connectToDatabase } from "@/database/db";
import RegisterUser from "@/database/schema/register-user.schema"
import OtpVerification from "@/database/schema/otp-verification.schema"
import { sendWelcomeEmail } from "@/utilities/emails/welcome-qr";
import { signJWT, verifyJWT } from "@/utilities/jwt";
import { validateDto } from "@/dto/validate.dto-helper";
import { verifyUserEmailDto } from "@/dto/(register)/verify-email.dto";

export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const userToken = verifyJWT(cookieStore.get("nv-session")?.value as string);
        const tempToken = verifyJWT(cookieStore.get("nv-session-temp")?.value as string);

        if (userToken && tempToken) {
            return NextResponse.json({
                message: "User already verified",
                data: null,
                error: null,
                redirect: true,
                redirect_url: "/enrollment-event"
            }, { status: 400 });
        } else if (userToken && !tempToken) {
            cookieStore.delete("nv-session");
        }

        // Add DTO validation Here
        const body = await request.json();

        const { success, data, issues } = validateDto(verifyUserEmailDto, body);

        if (!success || !data) {
            return NextResponse.json({
                message: "Invalid request body",
                data: null,
                error: issues,
                redirect: false,
                redirect_url: null
            }, { status: 400 });
        }

        const { otp, email } = data;

        await connectToDatabase();

        const otpRecord = await OtpVerification.findOne({ email, code: otp });
        const currentTime = new Date();

        if (!otpRecord || otpRecord.is_verified || otpRecord.code !== otp) {

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

        console.log("User found:", user, "for email:", email, "with otpRecord:", otpRecord)

        if (!user) {
            return NextResponse.json({
                message: "User not found",
                data: null,
                error: null,
                redirect: true,
                redirect_url: "/register"
            }, { status: 404 });
        }

        otpRecord.is_verified = true;
        await otpRecord.save();

        // If user verifies for first time, send him the welcome email
        if (user && user.is_verified === false) {
            user.is_verified = true;
            await user.save();

            await sendWelcomeEmail(user._id, user.email, user.full_name);
        }


        // set the cookie for the user session for 2 hours
        const token = signJWT({ user: { id: user._id, name: user.full_name, email: user.email } }, { expiresIn: "2h" });
        const createTempToken = signJWT({ user: { id: user._id, name: user.full_name, email: user.email } }, { expiresIn: 6900 });

        // Main session: 2 hours
        cookieStore.set("nv-session", token, {
            httpOnly: true,
            path: "/",
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
            maxAge: 2 * 60 * 60,
        });

        // Temporary session: 1 hour 55 minutes
        cookieStore.set("nv-session-temp", createTempToken, {
            httpOnly: true,
            path: "/",
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
            maxAge: 6900,
        });

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
