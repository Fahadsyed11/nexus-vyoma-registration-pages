import { connectToDatabase } from "@/database/db";
import EntryTicket from "@/database/schema/entry-ticket.schema";
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

        const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

        // Check if the user has paid for entry ticket or not
        const entryTicket = await EntryTicket.findOne({ userId: user._id });

        if (entryTicket && entryTicket.isPaid) {
            // If the user has already paid for the entry ticket, Then now you can check for enrolled event payments.

            // Check if the user has any transaction with status "creating" latest one. If yes, then return that transaction details to the user. If not, then create a new transaction with status "creating" and return that transaction details to the user.
            const latestCreatingTransaction = await Transaction.findOne({
                userId: user._id,
                status: "creating",
            }).sort({ createdAt: -1 });

            console.log({ latestCreatingTransaction })

            // If the latest creating transaction exists and its reservation time is still valid, return that transaction details to the user.
            if (latestCreatingTransaction) {
                console.log("Hello World!")
                const teamEventsAmount = latestCreatingTransaction.teamEventsAmount as number;
                const individualEventsAmount = latestCreatingTransaction.individualEventsAmount as number;

                let totalAmount = teamEventsAmount + individualEventsAmount;
                const serviceFee = 30

                totalAmount += serviceFee;

                const eventOrderId = `NV_${latestCreatingTransaction._id}_${Date.now()}`;

                const cashfreeRequest = {
                    order_amount: totalAmount,
                    order_currency: "INR",
                    order_id: eventOrderId,
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
                }

                const cashfreeResponse = await cashfree.PGCreateOrder(cashfreeRequest);

                const cashfreeData = cashfreeResponse.data;

                return NextResponse.json({
                    message: "Payment initiation successful",
                    data: {
                        order_id: cashfreeData.order_id,
                        order_status: cashfreeData.order_status,
                        payment_session_id: cashfreeData.payment_session_id,
                        order_amount: cashfreeData.order_amount,
                        order_currency: cashfreeData.order_currency,
                    },
                    error: null,
                    redirect: false,
                    redirectUrl: null
                }, { status: 200 })

            } else {
                return NextResponse.json(
                    {
                        message: "No valid transaction found. Please initiate a new transaction.",
                        data: null,
                        error: "NO_VALID_TRANSACTION",
                        redirect: true,
                        redirectUrl: "/register/enroll-event",
                    },
                    { status: 404 }
                );
            }
        }

        let userEntryTicket;
        if (!entryTicket) {
            userEntryTicket = await EntryTicket.create({
                userId: user._id,
            })
        } else if (entryTicket && !entryTicket.isPaid) {
            userEntryTicket = entryTicket;
        }

        const orderId = `NVET_${user._id}_${Date.now()}`;
        const entryTicketAmount = process.env.ENTRY_TICKET_PRICE

        const entryTicketAmountNum = parseInt(entryTicketAmount || "299");

        userEntryTicket.orderId = orderId;
        await userEntryTicket.save();

        const cashfreeRequest = {
            order_amount: entryTicketAmountNum,
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
        }

        const cashfreeResponse = await cashfree.PGCreateOrder(cashfreeRequest);

        const cashfreeData = cashfreeResponse.data;

        return NextResponse.json({
            message: "Payment initiation successful",
            data: {
                order_id: cashfreeData.order_id,
                order_status: cashfreeData.order_status,
                payment_session_id: cashfreeData.payment_session_id,
                order_amount: cashfreeData.order_amount,
                order_currency: cashfreeData.order_currency,
            },
            error: null,
            redirect: false,
            redirectUrl: null
        }, { status: 200 })
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