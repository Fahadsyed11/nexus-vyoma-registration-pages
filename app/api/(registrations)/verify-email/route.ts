import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import mongoose from "mongoose";
import { connectToDatabase } from "@/database/db";
import RegisterUser from "@/database/schema/register-user.schema"
import OtpVerification from "@/database/schema/otp-verification.schema"
import { sendWelcomeEmail } from "@/utilities/emails/welcome-qr";
import { signJWT } from "@/utilities/jwt";
import { validateDto } from "@/dto/validate.dto-helper";
import { verifyUserEmailDto } from "@/dto/(register)/verify-email.dto";

export async function POST(request: NextRequest) {
    try {
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

        const isDevBypass = process.env.NODE_ENV === "development" && (otp === "123456" || otp === "000000");
        let otpRecord = await OtpVerification.findOne({ email, code: otp });
        const currentTime = new Date();

        if (isDevBypass) {
            if (!otpRecord) {
                otpRecord = await OtpVerification.create({
                    user_id: new mongoose.Types.ObjectId(),
                    email,
                    code: otp,
                    time: currentTime.getTime(),
                    is_verified: true,
                });
            } else {
                otpRecord.is_verified = true;
                await otpRecord.save();
            }
        } else {
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

            otpRecord.is_verified = true;
            await otpRecord.save();
        }

        const user = await RegisterUser.findOne({ email });

        // Check whether user has already completed registration
        const isRegistered = Boolean(user && user.full_name && user.institution);

        // If user verifies for first time and is registered, send welcome email
        if (user && user.is_verified === false && isRegistered) {
            user.is_verified = true;
            await user.save();
            await sendWelcomeEmail(user._id, user.email, user.full_name);
        }

        // set the cookie for the user session for 2 hours
        const cookieStore = await cookies();
        const sessionPayload = user
            ? { user: { id: user._id, name: user.full_name, email: user.email }, email: user.email }
            : { email, verified: true };

        const token = signJWT(sessionPayload, { expiresIn: "2h" });
        const tempToken = signJWT(sessionPayload, { expiresIn: "115m" });

        cookieStore.set("nv-session", token, {
            httpOnly: true,
            path: "/",
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
            maxAge: 2 * 60 * 60,
        });

        cookieStore.set("nv-session-temp", tempToken, {
            httpOnly: true,
            path: "/",
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
            maxAge: 1 * 60 * 60 + 55 * 60,
        });

        // Determine destination: existing completed registrants go to confirmation/success, new registrants go to /register
        const destination = isRegistered ? "/payment/success" : "/register";

        return NextResponse.json({
            message: "OTP verified successfully",
            data: {
                email,
                isRegistered,
                user: user
                    ? {
                          id: user._id,
                          name: user.full_name,
                          email: user.email,
                      }
                    : null,
            },
            error: null,
            redirect: true,
            redirect_url: destination,
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
