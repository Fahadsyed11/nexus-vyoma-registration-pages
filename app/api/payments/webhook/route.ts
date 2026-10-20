
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

        console.log("Received Cashfree Webhook:", body);

        const orderId = body.data?.order?.order_id;
        const customerId = body.data?.customer_details?.customer_id;
        const customerEmail = body.data?.customer_details?.customer_email;
        const customerName = body.data?.customer_details?.customer_name;
        const paymentStatus = body.data?.payment?.payment_status;
        const paymentAmount = body.data?.payment?.payment_amount;
        const orderAmount = body.data?.order?.order_amount;

        if (orderId && orderId.startsWith("NVET_")) {
            const entryTicket = await EntryTicket.findOne({ orderId: orderId })

            if (!entryTicket) {
                console.error(`Entry ticket not found for orderId: ${orderId}`);
                // TODO: Email user about the issue 
                return NextResponse.json({ message: "Entry ticket not found for the given orderId" }, { status: 404 });
            }

            if (paymentStatus === "SUCCESS") {
                const qr_code = await generateQRCode({ userId: entryTicket.userId, userEmail: customerEmail })
                await sendQREmail(customerEmail, customerName, qr_code)
                entryTicket.isPaid = true;
                entryTicket.paymentId = body.data?.payment?.payment_id || null;
                await entryTicket.save();

                return NextResponse.json({ message: "Payment verified and entry ticket updated successfully" }, { status: 200 });
            } else if (paymentStatus === "FAILED" || paymentStatus === "CANCELLED") {
                // TODO: Email user about the failed payment
                return NextResponse.json(
                    { message: "Payment failed or cancelled" },
                    { status: 400 }
                );
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
