import { connectToDatabase } from "@/database/db";
import Transaction from "@/database/schema/transaction.schema";
import EntryTicket from "@/database/schema/entry-ticket.schema";
import cashfree from "@/utilities/payment/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const orderId = request.nextUrl.searchParams.get("order_id");

        if (!orderId) {
            return NextResponse.redirect(new URL("/payment/failed?reason=missing_order_id", request.url));
        }

        await connectToDatabase();

        // Find the transaction associated with this Cashfree order.
        const transaction = await Transaction.findOne({
            order_id: orderId,
        });

        if (!transaction) {
            return NextResponse.redirect(new URL(`/payment/failed?order_id=${orderId}&reason=order_not_found`, request.url));
        }

        // Verify the order directly with Cashfree.
        const response = await cashfree.PGFetchOrder(orderId);
        const orderStatus = response?.data?.order_status;

        if (orderStatus === "PAID") {
            // Record the verified status.
            await Transaction.updateOne(
                {
                    _id: transaction._id,
                    status: { $in: ["pending", "creating"] },
                },
                {
                    $set: { status: "completed" },
                }
            );

            // If an entry ticket was associated, mark it paid
            if (transaction.entryTicketId) {
                await EntryTicket.updateOne(
                    { _id: transaction.entryTicketId },
                    { $set: { isPaid: true } }
                );
            }

            return NextResponse.redirect(
                new URL(`/payment/success?order_id=${orderId}&txnid=${transaction._id}`, request.url)
            );
        }

        if (
            orderStatus === "EXPIRED" ||
            orderStatus === "TERMINATED"
        ) {
            await Transaction.updateOne(
                {
                    _id: transaction._id,
                    status: { $in: ["pending", "creating"] },
                },
                {
                    $set: { status: "failed" },
                }
            );

            return NextResponse.redirect(
                new URL(`/payment/failed?order_id=${orderId}&reason=${orderStatus.toLowerCase()}`, request.url)
            );
        }

        // The payment is not confirmed as successful or definitively failed (pending or user dropped).
        return NextResponse.redirect(
            new URL(`/payment/pending?order_id=${orderId}`, request.url)
        );
    } catch (error) {
        console.error("Payment return verification failed:", error);
        return NextResponse.redirect(
            new URL("/payment/failed?reason=verification_error", request.url)
        );
    }
}