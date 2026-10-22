import { NextRequest, NextResponse } from "next/server";

import { connectToDatabase } from "@/database/db";
import RegisterUser from "@/database/schema/register-user.schema";

import { validateDto } from "@/dto/validate.dto-helper";
import { registerUserFormDto } from "@/dto/(register)/register-user.dto";

import { sendSpecialEmail } from "@/utilities/emails/special.email";

export async function POST(request: NextRequest) {
    try {
        await connectToDatabase();

        const body = await request.json();

        const {
            data,
            issues,
            success: isValid,
        } = validateDto(registerUserFormDto, body);

        if (!isValid || !data) {
            return NextResponse.json(
                {
                    message: "Invalid form data",
                    data: null,
                    error: issues,
                    redirect: false,
                    redirectUrl: null,
                },
                { status: 400 }
            );
        }

        const email = data.email.trim().toLowerCase();

        const existingUser = await RegisterUser.findOne({ email });

        if (existingUser) {
            return NextResponse.json(
                {
                    message: "User already registered",
                    data: null,
                    error: null,
                    redirect: true,
                    redirectUrl: `/register/check-email?email=${encodeURIComponent(email)}`,
                },
                { status: 400 }
            );
        }

        const createUser = await RegisterUser.create({
            ...data,
            email,
        });

        if (!createUser) {
            return NextResponse.json(
                {
                    message: "Error creating user",
                    data: null,
                    error: "Error creating user",
                    redirect: false,
                    redirectUrl: null,
                },
                { status: 500 }
            );
        }

        // Existing special-email logic.
        if (email === "manhanooreen193@gmail.com") {
            await sendSpecialEmail("fahadsyed7799@gmail.com", "Syed Fahad Ali");
        } else if (email === "amenafatima6778@gmail.com") {
            await sendSpecialEmail("yaseen251105@gmail.com", "Yaseen");
        } else if (
            createUser.full_name === "Madeeha Ahmed" ||
            createUser.full_name.toLowerCase().includes("madeeha")
        ) {
            await sendSpecialEmail(
                "syedaliquadri100@gmail.com",
                "Ali Quadri"
            );
        }

        return NextResponse.json(
            {
                message: "User created successfully",
                data: {
                    id: createUser._id,
                    email: createUser.email,
                    full_name: createUser.full_name,
                },
                error: null,
                redirect: true,
                redirectUrl: `/register/check-email?email=${encodeURIComponent(email)}`,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Registration error:", error);

        return NextResponse.json(
            {
                message: "Error creating user or processing registration",
                data: null,
                error:
                    error instanceof Error
                        ? error.message
                        : "Unknown error",
                redirect: false,
                redirectUrl: null,
            },
            { status: 500 }
        );
    }
}
