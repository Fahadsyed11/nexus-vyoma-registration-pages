import { connectToDatabase } from "@/database/db";
import Transaction from "@/database/schema/transaction.schema";
import cashfree from "@/utilities/payment/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");

    if (!appUrl) {
        return NextResponse.json(
            { message: "Application URL is not configured" },
            { status: 500 }
        );
    }

    try {
        const orderId = request.nextUrl.searchParams.get("order_id");

        if (!orderId) {
            return NextResponse.json({
                message: "Missing order_id in query parameters",
                status: 400,
                data: null,
                error: "Missing order_id in query parameters",
                redirect: true,
                redirectUrl: "/payment/failure?reason=missing_order_id"
            }, { status: 400 })
        }

        await connectToDatabase();

        // Find the transaction associated with this Cashfree order.
        const transaction = await Transaction.findOne({
            order_id: orderId,
        });

        if (!transaction) {
            return NextResponse.json({
                message: "Order not found",
                status: 404,
                data: null,
                error: "Order not found",
                redirect: true,
                redirectUrl: "/payment/failure?reason=order_not_found"
            }, { status: 404 })
        }

        // Verify the order directly with Cashfree.
        const response = await cashfree.PGFetchOrder(orderId);
        const orderStatus = response.data.order_status;

        if (orderStatus === "PAID") {
            // Record the verified status. Your webhook/fulfillment logic
            // should also handle success idempotently.
            await Transaction.updateOne(
                {
                    _id: transaction._id,
                    status: { $in: ["pending", "creating"] },
                },
                {
                    $set: { status: "completed" },
                }
            );

            return NextResponse.json({
                message: "Payment successful",
                status: 200,
                data: null,
                error: null,
                redirect: true,
                redirectUrl: "/payment/success"
            }, { status: 200 })
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

            return NextResponse.json({
                message: "Payment failed",
                status: 400,
                data: null,
                error: "Payment failed",
                redirect: true,
                redirectUrl: "/payment/failure"
            }, { status: 400 });
        }

        // The payment is not confirmed as successful or definitively failed.
        return NextResponse.json({
            message: "Payment pending",
            status: 200,
            data: null,
            error: null,
            redirect: true,
            redirectUrl: "/payment/pending"
        }, { status: 200 });
    } catch (error) {
        console.error("Payment return verification failed:", error);

        // A verification error does not mean the payment failed.
        return NextResponse.json({
            message: "Payment verification error",
            status: 500,
            data: null,
            error: "Payment verification error",
            redirect: true,
            redirectUrl: "/payment/failure?reason=verification_error"
        }, { status: 500 })
    }
}