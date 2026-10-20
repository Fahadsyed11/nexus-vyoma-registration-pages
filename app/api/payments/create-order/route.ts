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

        return NextResponse.json({
            message: "Payment initiation successful",
            data: cashfreeResponse,
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