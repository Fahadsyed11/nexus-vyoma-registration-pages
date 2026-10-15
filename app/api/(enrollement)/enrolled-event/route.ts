import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import { connectToDatabase } from "@/database/db";
import RegisterUser from "@/database/schema/register-user.schema";
import EnrolledIndividualEvent from "@/database/schema/enrolled-individual-event.schema";
import EnrolledTeamEvent from "@/database/schema/enrolled-team-event.schema";

import { verifyJWT } from "@/utilities/jwt";

export interface TokenData {
    user: {
        id: string;
        name: string;
        email: string;
    };
}

// When /enroll-event page is loaded, after verification of the user token, we will fetch the user data and enrolled events data and also fetch the events excluding the ones the user is already enrolled in. We will also extend the reservation time for the events that are not paid yet and are not extended yet. The reservation time will be extended by 5 minutes from the current time.
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

        // Fetch Paid Events for the User
        const paidIndividualEvents = await EnrolledIndividualEvent.find({
            register_user_id: user._id,
            isPaid: true
        }).select("-transaction_id -__v");

        const paidTeamEvents = await EnrolledTeamEvent.find({
            $or: [
                { team_leader_register_user_id: user._id },
                { team_emails: user.email }
            ],
            isPaid: true
        }).select("-transaction_id -__v");

        const paidEvents = {
            individualEvents: paidIndividualEvents || [],
            teamEvents: paidTeamEvents || []
        }

        return NextResponse.json({
            message: "User and enrolled events fetched successfully",
            data: {
                user: {
                    id: user._id,
                    name: user.full_name,
                    email: user.email,
                },
                paidEvents,
            },
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
