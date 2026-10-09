import { NextRequest, NextResponse } from "next/server";

import { connectToDatabase } from "@/database/db";
import RegisterUser from "@/database/schema/register-user.schema"

export async function POST(request: NextRequest) {
    try {
        // Add DTO validation Here
        const body = await request.json();
        const { email } = body;

        await connectToDatabase();
        const user = await RegisterUser.findOne({
            email
        });

        if (!user) {
            return NextResponse.json({
                message: "Email not found",
                data: {
                    checkEmail: false,
                    userData: null,
                },
                error: null,
                redirect: true,
                redirect_url: "/register"
            }, { status: 404 });
        }

        // If user found, send him the OTP on email
        // TODO: Implement email sending logic here


        return NextResponse.json({
            message: "Email found",
            data: {
                checkEmail: true,
                userData: user,
            },
            error: null,
            redirect: true,
            redirect_url: "/checkout"
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