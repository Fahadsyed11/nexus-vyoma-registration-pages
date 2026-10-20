import cashfree from "@/utilities/payment/client";
import { unstable_rethrow } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");

    if (!appUrl) {
        return NextResponse.json(
            { message: "Application URL is not configured" },
            { status: 500 }
        );
    }

    // Read request data OUTSIDE try/catch. Accessing searchParams is a "dynamic"
    // API, and Next.js signals it by throwing an internal error. If that throw
    // happens inside try/catch, our catch block swallows it.
    const orderId = request.nextUrl.searchParams.get("order_id");

    if (!orderId) {
        return NextResponse.json({
            message: "Missing order_id in query parameters",
            status: 400,
            data: null,
            error: "Missing order_id in query parameters",
            redirect: true,
            redirectUrl: "/payment/failure?reason=missing_order_id"
        }, { status: 400 });
    }

    try {
        // Verify the order directly with Cashfree.
        const response = await cashfree.PGFetchOrder(orderId);
        const orderStatus = response.data.order_status;

        if (orderStatus === "PAID") {
            return NextResponse.json({
                message: "Payment successful",
                status: 200,
                data: null,
                error: null,
                redirect: true,
                redirectUrl: "/payment/success"
            }, { status: 200 });
        }

        if (orderStatus === "EXPIRED" || orderStatus === "TERMINATED") {
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
        // Let Next.js internal signals (prerender bail-out, redirect, notFound)
        // pass through. Only real errors continue to the code below.
        unstable_rethrow(error);

        console.error("Payment return verification failed:", error);

        // A verification error does not mean the payment failed.
        return NextResponse.json({
            message: "Payment verification error",
            status: 500,
            data: null,
            error: "Payment verification error",
            redirect: true,
            redirectUrl: "/payment/failure?reason=verification_error"
        }, { status: 500 });
    }
}