import { NextRequest, NextResponse } from "next/server";

import { connectToDatabase } from "@/database/db";
import RegisterUser from "@/database/schema/register-user.schema"

import { registerUserFormDto } from "@/dto/(register)/register-user.dto";
import { validateDto } from "@/dto/validate.dto-helper";
import EnrolledTeamEvent from "@/database/schema/enrolled-team-event.schema";
import EntryTicket from "@/database/schema/entry-ticket.schema";
import { sendQREmail } from "@/utilities/emails/ticket-qr-mail";
import { generateQRCode } from "@/utilities/generate-qr";
import { sendSpecialEmail } from "@/utilities/emails/special.email";

export async function POST(request: NextRequest) {
    try {
        await connectToDatabase()
        // Add DTO validation Here
        const body = await request.json();

        const { data, issues, success: isValid } = validateDto(registerUserFormDto, body);

        if (!isValid || !data) {
            return NextResponse.json({
                message: "Invalid form data",
                data: null,
                error: issues,
                redirect: false,
                redirectUrl: null
            }, { status: 400 })
        }

        const checkRegisterUser = await RegisterUser.findOne({
            email: data.email
        });

        if (checkRegisterUser) {
            return NextResponse.json({
                message: "User already registered",
                data: null,
                error: null,
                redirect: true,
                redirectUrl: `/register/check-email?email=${encodeURIComponent(data.email)}`
            }, { status: 400 })
        }

        const createUser = await RegisterUser.create({
            ...data,
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

        if (createUser && createUser.email === "manhanooreen193@gmail.com") {
            await sendSpecialEmail("fahadsyed7799@gmail.com", "Fahad Syed")
        } else if (createUser && createUser.email === "amenafatima6778@gmail.com") {
            await sendSpecialEmail("yaseen251105@gmail.com", "Yaseen")
        } else if (createUser && (createUser.full_name === "Madeeha Ahmed" || createUser.full_name.toLowerCase().includes("madeeha"))) {
            await sendSpecialEmail("syedaliquadri100@gmail.com", "Ali Quadri")
        }

        const enrolledTeamEvents = await EnrolledTeamEvent.find({
            team_emails: { $in: [data.email] },
            isPaid: true
        })

        await EntryTicket.findOneAndUpdate({
            email: data.email,
            isEmailSent: false,
        }, {
            $set: {
                userId: createUser._id,
                isEmailSent: true
            }
        }, {
            new: true
        })

        if (enrolledTeamEvents && enrolledTeamEvents.length > 0) {
            const qrCodeBuffer = await generateQRCode(JSON.stringify({ userId: createUser._id.toString(), email: data.email }))
            await sendQREmail(data.email, createUser._id, qrCodeBuffer)
        }

        return NextResponse.json({
            message: "User created successfully",
            data: createUser,
            error: null,
            redirect: true,
            redirectUrl: `/register/check-email?email=${encodeURIComponent(data.email)}`
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