
import EnrolledIndividualEvent from "@/database/schema/enrolled-individual-event.schema";
import EnrolledTeamEvent from "@/database/schema/enrolled-team-event.schema";
import EntryTicket from "@/database/schema/entry-ticket.schema";
import RegisterUser from "@/database/schema/register-user.schema";
import Transaction from "@/database/schema/transaction.schema";
import { sendEmailToNotRegisteredTeamMember } from "@/utilities/emails/new-team-member.email";
import { sendEmailToPaymentFailed } from "@/utilities/emails/payment-failed.email";
import { sendQREmail } from "@/utilities/emails/ticket-qr-mail";
import { generateQRCode } from "@/utilities/generate-qr";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const orderId = body.data?.order?.order_id;
        const customerId = body.data?.customer_details?.customer_id;
        const customerEmail = body.data?.customer_details?.customer_email;
        const customerName = body.data?.customer_details?.customer_name;
        const paymentStatus = body.data?.payment?.payment_status;
        const paymentAmount = body.data?.payment?.payment_amount;
        const orderAmount = body.data?.order?.order_amount;

        if (!orderId || !customerId || !customerEmail) {
            return NextResponse.json(
                { message: "Missing required webhook data" },
                { status: 400 }
            );
        }

        const transaction = await Transaction.findOne({
            orderId,
            userId: customerId,
            totalAmount: orderAmount,
        });

        if (!transaction) {
            await sendEmailToPaymentFailed(
                customerEmail,
                customerName || "",
                "",
                orderId,
                paymentAmount
            );

            return NextResponse.json({
                message: "Transaction not found",
            });
        }

        if (paymentStatus === "PENDING") {
            return NextResponse.json({
                message: "Payment is pending",
            });
        }

        if (paymentStatus === "FAILED") {
            transaction.status = "failed";
            await transaction.save();

            await sendEmailToPaymentFailed(
                customerEmail,
                customerName || "",
                "",
                orderId,
                paymentAmount
            );

            if (transaction.entryTicketId) {
                await EntryTicket.findByIdAndDelete(
                    transaction.entryTicketId
                );
            }

            return NextResponse.json({
                message: "Payment failed",
            });
        }

        if (paymentStatus !== "SUCCESS") {
            return NextResponse.json({
                message: "Webhook received; payment status ignored",
            });
        }

        // Mark individual enrollments as paid.
        for (const enrollmentId of transaction.enrolledIndividualEvents || []) {
            await EnrolledIndividualEvent.findByIdAndUpdate(
                enrollmentId,
                {
                    $set: {
                        isPaid: true,
                        transaction_id: transaction._id,
                    },
                }
            );
        }

        // Mark team enrollments as paid and collect all team members.
        const teamMemberEmails = new Set<string>();

        for (const enrollmentId of transaction.enrolledTeamEvents || []) {
            const enrolledTeamEvent =
                await EnrolledTeamEvent.findByIdAndUpdate(
                    enrollmentId,
                    {
                        $set: {
                            isPaid: true,
                            transaction_id: transaction._id,
                        },
                    },
                    { new: true }
                );

            if (!enrolledTeamEvent) continue;

            const leaderUser = await RegisterUser.findById(
                enrolledTeamEvent.team_leader_register_user_id
            );

            for (const rawEmail of enrolledTeamEvent.team_emails || []) {
                const email = rawEmail.trim().toLowerCase();

                if (!email) continue;

                // Avoid duplicate tickets/emails if a person appears
                // in multiple team enrollments in this transaction.
                teamMemberEmails.add(email);

                const user = await RegisterUser.findOne({ email });

                if (!user) {
                    await sendEmailToNotRegisteredTeamMember(email, {
                        team_leader_name:
                            leaderUser?.full_name || "Team Leader",
                        team_name: enrolledTeamEvent.team_name,
                        team_leader_email: leaderUser?.email,
                    });
                }
            }
        }

        transaction.status = "success";
        await transaction.save();

        // The payer receives a ticket too. Each registered teammate
        // receives their own ticket and QR code.
        const payer = await RegisterUser.findById(customerId);

        const recipients = new Map<
            string,
            { userId: string; email: string; name: string }
        >();

        if (payer) {
            recipients.set(customerEmail.toLowerCase(), {
                userId: payer._id.toString(),
                email: customerEmail.toLowerCase(),
                name: customerName || payer.full_name || "Participant",
            });
        }

        for (const email of teamMemberEmails) {
            const user = await RegisterUser.findOne({ email });

            if (!user) continue;

            recipients.set(email, {
                userId: user._id.toString(),
                email,
                name: user.full_name || "Participant",
            });
        }

        for (const recipient of recipients.values()) {
            // Upsert one ticket per participant per transaction.
            // The schema's unique userId + transactionId index
            // protects against duplicate ticket records.
            const ticket = await EntryTicket.findOneAndUpdate(
                {
                    userId: recipient.userId,
                    transactionId: transaction._id,
                },
                {
                    $setOnInsert: {
                        userId: recipient.userId,
                        email: recipient.email,
                        transactionId: transaction._id,
                        entries: [],
                        isBanned: false,
                        isEmailSent: false,
                    },
                    $set: {
                        isPaid: true,
                        email: recipient.email,
                    },
                },
                {
                    new: true,
                    upsert: true,
                    setDefaultsOnInsert: true,
                }
            );

            if (!ticket.isEmailSent) {
                const qrCodeBuffer = await generateQRCode(
                    JSON.stringify({
                        userId: recipient.userId,
                        email: recipient.email,
                    })
                );

                await sendQREmail(
                    recipient.email,
                    recipient.name,
                    qrCodeBuffer
                );

                // Set this only after the email succeeds.
                await EntryTicket.findByIdAndUpdate(ticket._id, {
                    $set: { isEmailSent: true },
                });
            }
        }

        return NextResponse.json({
            message: "Payment verified and tickets processed",
        });
    } catch (error) {
        console.error("Cashfree webhook error:", error);

        return NextResponse.json(
            { message: "Webhook processing failed" },
            { status: 500 }
        );
    }
}
