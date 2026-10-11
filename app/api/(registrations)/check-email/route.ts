import { NextRequest, NextResponse } from "next/server";

import { connectToDatabase } from "@/database/db";
import RegisterUser from "@/database/schema/register-user.schema"
import OtpVerification from "@/database/schema/otp-verification.schema"
import { generateOtp } from "@/utilities/generate-otp";
import { sendOTPEmail } from "@/utilities/emails/otp-qr";
import { validateDto } from "@/dto/validate.dto-helper";
import { checkUserEmailDto } from "@/dto/(register)/check-email.dto";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const { success, data, issues } = validateDto(checkUserEmailDto, body);

        if (!success || !data) {
            return NextResponse.json({
                message: "Invalid request body",
                data: null,
                error: issues,
                redirect: false,
                redirect_url: null
            }, { status: 400 });
        }

        const { email } = data;

        await connectToDatabase();
        const user = await RegisterUser.findOne({
            email
        });

        if (!user) {
            return NextResponse.json({
                message: "Email not found",
                data: null,
                error: null,
                redirect: true,
                redirect_url: "/register"
            }, { status: 404 });
        }

        const checkOtp = await OtpVerification.findOne({
            user_id: user._id
        }).sort({ time: -1 });

        const currentTime = new Date();

        // Check if the OTP was sent within the last 5 minutes then do not send the OTP again
        if (checkOtp && currentTime.getTime() - checkOtp.time < 300000) {
            return NextResponse.json({
                message: "OTP already sent. Please check your email or wait for 5 minutes before requesting a new OTP.",
                data: null,
                error: null,
                redirect: true,
                redirect_url: "/verify-email"
            }, { status: 429 });
        }

        const otp = generateOtp();

        await sendOTPEmail(user.email, user.full_name, otp);

        await OtpVerification.create({
            user_id: user._id,
            email: user.email,
            otp: String(otp),
            time: currentTime.getTime(),
        });


        return NextResponse.json({
            message: "OTP sent successfully",
            data: null,
            error: null,
            redirect: true,
            redirect_url: "/verify-email"
        }, { status: 200 });


    } catch (error) {
        return NextResponse.json({
            message: "Error checking email",
            data: null,
            error: error instanceof Error ? error.message : "Unknown error",
            redirect: false,
            redirect_url: null
        }, { status: 500 })
    }
}