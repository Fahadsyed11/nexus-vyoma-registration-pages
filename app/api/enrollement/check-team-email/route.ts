import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import { connectToDatabase } from "@/database/db";
import EntryTicket from "@/database/schema/entry-ticket.schema";
import RegisterUser from "@/database/schema/register-user.schema";

import { TokenData } from "../enroll-event/route";
import { verifyJWT } from "@/utilities/jwt";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email } = body; // for now only individual events
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

        if (userData === null || tempData === null) {
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

        await connectToDatabase();

        // Fetch User Details
        const user = await RegisterUser.findById(userData.user.id);

        if (!user) {
            return NextResponse.json(
                {
                    message: "User not found",
                    data: null,
                    error: "User does not exist",
                    redirect: true,
                    redirectUrl: "/register/check-email",
                },
                { status: 404 });
        }

        const entryTicket = await EntryTicket.findOne({ userId: user._id, isPaid: true })

        if (!entryTicket) {
            return NextResponse.json(
                {
                    message: "Entry ticket not found for the user",
                    data: null,
                    error: "Entry ticket does not exist",
                    redirect: true,
                    redirectUrl: "/register/entry-ticket",
                },
                { status: 404 });
        }

        const teamUser = await RegisterUser.findOne({ email: email });

        if (!teamUser) {
            return NextResponse.json(
                {
                    message: "Team member has not registered yet. Please ask them to register first.",
                    data: null,
                    error: "User does not exist",
                    redirect: false,
                    redirectUrl: null,
                },
                { status: 404 });
        }

        const teamEntryTicket = await EntryTicket.findOne({
            userId: teamUser._id,
            isPaid: true
        })

        if (!teamEntryTicket) {
            return NextResponse.json(
                {
                    message: "Team member has not purchased the entry ticket yet. Please ask them to purchase the entry ticket first.",
                    data: null,
                    error: "Entry ticket does not exist",
                    redirect: false,
                    redirectUrl: null,
                },
                { status: 404 });
        }

        return NextResponse.json({
            message: "Team member has registered and purchased the entry ticket.",
            data: {
                name: teamUser.full_name,
                email: teamUser.email,
                phone: teamUser.phone_number,
            },
            error: null,
            redirect: false,
            redirectUrl: null
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({
            message: "Error creating enrolled events",
            data: null,
            error: error,
            redirect: false,
            redirectUrl: null
        }, { status: 500 })
    }

}