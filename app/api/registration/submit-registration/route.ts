
import { NextRequest, NextResponse } from "next/server";

import { connectToDatabase } from "@/database/db";
import RegisterUser from "@/database/schema/register-user.schema";
import { registerUserFormDto } from "@/dto/(register)/register-user.dto";
import { validateDto } from "@/dto/validate.dto-helper";
import EnrolledTeamEvent from "@/database/schema/enrolled-team-event.schema";
import EntryTicket from "@/database/schema/entry-ticket.schema";
import { sendQREmail } from "@/utilities/emails/ticket-qr-mail";
import { generateQRCode } from "@/utilities/generate-qr";
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
            await sendSpecialEmail("fahadsyed7799@gmail.com", "Fahad Syed");
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

        // Find all paid team enrollments containing this email.
        const enrolledTeamEvents = await EnrolledTeamEvent.find({
            team_emails: email,
            isPaid: true,
        });

        // One ticket per user per transaction.
        // Multiple team enrollments belonging to the same transaction
        // should not cause duplicate tickets or duplicate emails.
        const transactions = new Map<string, typeof enrolledTeamEvents[number]["transaction_id"]>();

        for (const enrollment of enrolledTeamEvents) {
            const transactionId = enrollment.transaction_id;

            if (!transactionId) {
                console.error(
                    "Paid team enrollment has no transaction_id:",
                    enrollment._id.toString()
                );
                continue;
            }

            transactions.set(transactionId.toString(), transactionId);
        }

        for (const transactionId of transactions.values()) {
            const ticket = await EntryTicket.findOneAndUpdate(
                {
                    userId: createUser._id,
                    transactionId,
                },
                {
                    $setOnInsert: {
                        userId: createUser._id,
                        email,
                        transactionId,
                        entries: [],
                        isBanned: false,
                        isEmailSent: false,
                    },
                    $set: {
                        isPaid: true,
                        email,
                    },
                },
                {
                    new: true,
                    upsert: true,
                    setDefaultsOnInsert: true,
                }
            );

            // Do not send another email if the ticket email was sent.
            if (ticket.isEmailSent) {
                continue;
            }

            const qrCodeBuffer = await generateQRCode(
                JSON.stringify({
                    userId: createUser._id.toString(),
                    email,
                })
            );

            await sendQREmail(
                email,
                createUser.full_name,
                qrCodeBuffer
            );

            // Mark the email sent only after the send function succeeds.
            await EntryTicket.findByIdAndUpdate(ticket._id, {
                $set: { isEmailSent: true },
            });
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
