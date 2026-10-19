import { connectToDatabase } from "@/database/db";
import RegisterUser from "@/database/schema/register-user.schema";
import Transaction from "@/database/schema/transaction.schema";
import { verifyJWT } from "@/utilities/jwt";
import cashfree from "@/utilities/payment/client";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export interface TokenData {
    user: {
        id: string;
        name: string;
        email: string;
    };
}

export async function POST() {
    try {
        const cookieStore = await cookies();
        const userToken = cookieStore.get("nv-session")?.value;
        const tempToken = cookieStore.get("nv-session-temp")?.value;

        if (!userToken || !tempToken) {
            return NextResponse.json(
                {
                    message: "Required tokens are missing",
                    data: null,
                    error: "Missing session token",
                    redirect: true,
                    redirectUrl: "/register/check-email",
                },
                { status: 401 }
            );
        }

        const userData = verifyJWT(userToken) as TokenData | null;
        const tempData = verifyJWT(tempToken) as TokenData | null;

        if (!userData?.user?.id || !tempData?.user?.id) {
            return NextResponse.json(
                {
                    message: "Invalid or expired tokens",
                    data: null,
                    error: "Invalid session token",
                    redirect: true,
                    redirectUrl: "/register/check-email",
                },
                { status: 401 }
            );
        }

        // Ensure both tokens belong to the same user.
        if (userData.user.id !== tempData.user.id) {
            return NextResponse.json(
                {
                    message: "Session tokens do not match",
                    data: null,
                    error: "INVALID_SESSION",
                    redirect: true,
                    redirectUrl: "/register/check-email",
                },
                { status: 401 }
            );
        }

        await connectToDatabase();

        const user = await RegisterUser.findById(userData.user.id);

        if (!user) {
            return NextResponse.json(
                {
                    message: "User not found",
                    data: null,
                    error: "USER_NOT_FOUND",
                    redirect: true,
                    redirectUrl: "/register/check-email",
                },
                { status: 404 }
            );
        }

        // Reuse/reconcile existing pending transactions; don't create
        // another Cashfree order blindly.
        const pendingTransaction = await Transaction.findOne({
            userId: user._id,
            status: "pending",
        }).sort({ createdAt: -1 });

        if (pendingTransaction) {
            if (pendingTransaction.order_id) {
                try {
                    const existingOrder = await cashfree.PGFetchOrder(
                        pendingTransaction.order_id
                    );

                    const orderStatus = existingOrder.data.order_status;

                    if (orderStatus === "PAID") {
                        await Transaction.updateOne(
                            {
                                _id: pendingTransaction._id,
                                status: "pending",
                            },
                            {
                                $set: { status: "completed" },
                            }
                        );

                        return NextResponse.json(
                            {
                                message: "Payment has already been completed",
                                data: {
                                    orderId: pendingTransaction.order_id,
                                    status: "completed",
                                },
                                error: null,
                            },
                            { status: 200 }
                        );
                    }

                    return NextResponse.json(
                        {
                            message: "A payment is already in progress",
                            data: {
                                orderId: pendingTransaction.order_id,
                                status: orderStatus,
                            },
                            error: "PAYMENT_ALREADY_PENDING",
                        },
                        { status: 409 }
                    );
                } catch (error) {
                    console.error("Cashfree order status lookup failed:", error);

                    return NextResponse.json(
                        {
                            message:
                                "Unable to verify the existing payment. Please try again later.",
                            data: null,
                            error: "PAYMENT_STATUS_CHECK_FAILED",
                        },
                        { status: 503 }
                    );
                }
            }

            return NextResponse.json(
                {
                    message:
                        "A pending transaction has no Cashfree order ID and requires reconciliation.",
                    data: null,
                    error: "PENDING_TRANSACTION_REQUIRES_RECONCILIATION",
                },
                { status: 409 }
            );
        }

        // Find the latest transaction prepared by the checkout route.
        const transaction = await Transaction.findOne({
            userId: user._id,
            status: "idle",
        }).sort({ createdAt: -1 });

        if (!transaction) {
            return NextResponse.json(
                {
                    message: "No idle transaction found for the user",
                    data: null,
                    error: "NO_IDLE_TRANSACTION",
                    redirect: true,
                    redirectUrl: "/register/check-email",
                },
                { status: 404 }
            );
        }

        if (
            typeof transaction.totalAmount !== "number" ||
            !Number.isFinite(transaction.totalAmount) ||
            transaction.totalAmount <= 0
        ) {
            return NextResponse.json(
                {
                    message: "Invalid transaction amount",
                    data: null,
                    error: "INVALID_TRANSACTION_AMOUNT",
                },
                { status: 400 }
            );
        }

        if (
            !user.phone_number ||
            !user.email ||
            !user.full_name
        ) {
            return NextResponse.json(
                {
                    message: "Required customer details are missing",
                    data: null,
                    error: "MISSING_CUSTOMER_DETAILS",
                },
                { status: 400 }
            );
        }

        const appUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");

        if (!appUrl) {
            console.error("NEXT_PUBLIC_APP_URL is not configured");

            return NextResponse.json(
                {
                    message: "Payment configuration is unavailable",
                    data: null,
                    error: "PAYMENT_CONFIGURATION_ERROR",
                },
                { status: 500 }
            );
        }

        /*
         * Atomically reserve this transaction before contacting Cashfree.
         * This prevents concurrent requests from both starting order creation.
         *
         * Make sure "creating" is an allowed status in your Transaction schema.
         */
        const reservedTransaction = await Transaction.findOneAndUpdate(
            {
                _id: transaction._id,
                userId: user._id,
                status: "idle",
            },
            {
                $set: { status: "creating" },
            },
            { new: true }
        );

        if (!reservedTransaction) {
            return NextResponse.json(
                {
                    message: "Transaction state changed. Please refresh and try again.",
                    data: null,
                    error: "TRANSACTION_STATE_CHANGED",
                },
                { status: 409 }
            );
        }

        const orderId = reservedTransaction._id.toString();

        try {
            const cashfreeRequest = {
                order_amount: reservedTransaction.totalAmount,
                order_currency: "INR",
                order_id: orderId,
                order_meta: {
                    return_url: `${appUrl}/api/payments/return?order_id={order_id}`,
                    notify_url: `${appUrl}/api/payments/webhook`,
                },
                customer_details: {
                    customer_id: user._id.toString(),
                    customer_phone: user.phone_number,
                    customer_email: user.email,
                    customer_name: user.full_name,
                },
            };

            const response = await cashfree.PGCreateOrder(cashfreeRequest);

            const cashfreeOrderId = response.data.order_id;
            const paymentSessionId = response.data.payment_session_id;

            if (!cashfreeOrderId || !paymentSessionId) {
                throw new Error("Cashfree response is missing order/session details");
            }

            const updatedTransaction = await Transaction.findOneAndUpdate(
                {
                    _id: reservedTransaction._id,
                    userId: user._id,
                    status: "creating",
                },
                {
                    $set: {
                        status: "pending",
                        order_id: cashfreeOrderId,
                    },
                },
                { new: true }
            );

            if (!updatedTransaction) {
                // Cashfree may already have created the order. Do not blindly retry.
                console.error(
                    "Cashfree order created, but transaction state update failed:",
                    cashfreeOrderId
                );

                return NextResponse.json(
                    {
                        message:
                            "Order creation needs reconciliation. Please check payment status before retrying.",
                        data: {
                            orderId: cashfreeOrderId,
                        },
                        error: "TRANSACTION_UPDATE_FAILED",
                    },
                    { status: 503 }
                );
            }

            return NextResponse.json(
                {
                    message: "Order created successfully",
                    data: {
                        orderId: cashfreeOrderId,
                        payment_session_id: paymentSessionId,
                        order_amount: response.data.order_amount,
                    },
                    error: null,
                    redirect: false,
                    redirectUrl: null,
                },
                { status: 200 }
            );
        } catch (error) {
            console.error("Cashfree order creation failed:", error);

            /*
             * Do not automatically reset the transaction to idle here.
             * A network timeout may happen after Cashfree created the order.
             * Reconcile with Cashfree before allowing another order attempt.
             */
            return NextResponse.json(
                {
                    message:
                        "Unable to confirm order creation. Payment status must be checked before retrying.",
                    data: null,
                    error: "PAYMENT_INITIATION_UNCONFIRMED",
                },
                { status: 503 }
            );
        }
    } catch (error) {
        console.error("Payment initiation route failed:", error);

        return NextResponse.json(
            {
                message: "Unable to initiate payment",
                data: null,
                error: "PAYMENT_INITIATION_FAILED",
            },
            { status: 500 }
        );
    }
}