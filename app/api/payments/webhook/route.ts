import EnrolledIndividualEvent from "@/database/schema/enrolled-individual-event.schema";
import EnrolledTeamEvent from "@/database/schema/enrolled-team-event.schema";
import EntryTicket from "@/database/schema/entry-ticket.schema";
import Transaction from "@/database/schema/transaction.schema";
import { sendEmailToPaymentFailed } from "@/utilities/emails/payment-failed.email";
import { sendQREmail } from "@/utilities/emails/ticket-qr-mail";
import { generateQRCode } from "@/utilities/generate-qr";
import { NextRequest, NextResponse } from "next/server";
import { sendEmailToPaymentSuccess } from "@/utilities/emails/payment-success.email";

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
        console.log("Webhook received:", JSON.stringify(body, null, 2));
        

        if (orderId && orderId.startsWith("NVET_")) {
            const entryTicket = await EntryTicket.findOne({ orderId: orderId })

            if (!entryTicket) {
                console.error(`Entry ticket not found for orderId: ${orderId}`);
                await sendEmailToPaymentFailed(customerEmail, customerName, orderId, orderAmount, "Entry ticket not found for the given orderId")
                return NextResponse.json({ message: "Entry ticket not found for the given orderId" }, { status: 404 });
            }

            if (paymentStatus === "SUCCESS") {
                if (entryTicket && entryTicket.isPaid) {
                    const qr_code = await generateQRCode({ userId: entryTicket.userId, userEmail: customerEmail })
                    await sendQREmail(customerEmail, customerName, qr_code)
                    await sendEmailToPaymentSuccess(customerEmail, customerName, orderId, orderAmount, body.data?.payment?.payment_id || null)

                    return NextResponse.json({ message: "Payment verified and entry ticket updated successfully" }, { status: 200 });
                }

                entryTicket.isPaid = true;
                entryTicket.paymentId = body.data?.payment?.payment_id || null;
                await entryTicket.save();

                return NextResponse.json({ message: "Payment verified and entry ticket updated successfully" }, { status: 200 });
            } else if (paymentStatus === "FAILED" || paymentStatus === "CANCELLED") {
                await sendEmailToPaymentFailed(customerEmail, customerName, orderId, orderAmount, "Payment failed or cancelled")
                return NextResponse.json(
                    { message: "Payment failed or cancelled" },
                    { status: 400 }
                );
            }
        }

        if (orderId && orderId.startsWith("NV_")) {
            const transaction_id = orderId.split("_")[1];
            const transaction = await Transaction.findById(transaction_id);

            if (!transaction) {
                await sendEmailToPaymentFailed(customerEmail, customerName, orderId, orderAmount, "Transaction not found for the given orderId")
                return NextResponse.json({ message: "Transaction not found for the given orderId" }, { status: 404 });
            }

            if (paymentStatus === "SUCCESS") {
                if (transaction.status === "completed") {
                    await sendEmailToPaymentSuccess(customerEmail, customerName, orderId, orderAmount, body.data?.payment?.payment_id || null)

                    return NextResponse.json({ message: "Payment already processed for this transaction" }, { status: 200 });
                }

                const enrolledIndividualEvents = transaction.enrolledIndividualEvents;
                const enrolledTeamEvents = transaction.enrolledTeamEvents;

                if (enrolledIndividualEvents && enrolledIndividualEvents.length > 0) {
                    for (const eventId of enrolledIndividualEvents) {
                        await EnrolledIndividualEvent.findByIdAndUpdate(eventId, { isPaid: true })
                    }
                }

                if (enrolledTeamEvents && enrolledTeamEvents.length > 0) {
                    for (const eventId of enrolledTeamEvents) {
                        await EnrolledTeamEvent.findByIdAndUpdate(eventId, { isPaid: true })
                    }
                }

                transaction.status = "completed";
                transaction.paymentId = body.data?.payment?.payment_id
                await transaction.save();

            } else if (paymentStatus === "FAILED" || paymentStatus === "CANCELLED") {
                await sendEmailToPaymentFailed(customerEmail, customerName, orderId, orderAmount, "Payment failed or cancelled")

                transaction.status = "failed";
                transaction.paymentId = body.data?.payment?.payment_id
                await transaction.save();

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