import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJWT } from "@/utilities/jwt";
import { TokenData } from "../enrollement/enroll-event/route";
import { connectToDatabase } from "@/database/db";
import RegisterUser from "@/database/schema/register-user.schema";
import EntryTicket from "@/database/schema/entry-ticket.schema";

export async function GET(request: NextRequest) {
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

        const entryTicket = await EntryTicket.findOne({ userId: user._id, isPaid: true });

        if (entryTicket) {
            return NextResponse.json({
                message: "Entry ticket is paid and valid",
                data: null,
                error: null,
                redirect: true,
                redirectUrl: "/register/enroll-event",
            }, { status: 200 });
        }

        return NextResponse.json({
            message: "Entry ticket is not paid or does not exist",
            data: {},
            error: null,
            redirect: false,
            redirectUrl: null
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({
            message: "Error fetching token",
            data: null,
            error: error,
            redirect: false,
            redirectUrl: null
        }, { status: 500 })
    }
}