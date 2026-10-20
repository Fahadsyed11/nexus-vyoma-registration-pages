import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import mongoose from "mongoose";

import { TokenData } from "../../enrollement/enroll-event/route";
import { verifyJWT } from "@/utilities/jwt";
import { connectToDatabase } from "@/database/db";

import RegisterUser from "@/database/schema/register-user.schema";
import EntryTicket from "@/database/schema/entry-ticket.schema";
import EnrolledTeamEvent from "@/database/schema/enrolled-team-event.schema";
import EnrolledIndividualEvent from "@/database/schema/enrolled-individual-event.schema";
import Transaction from "@/database/schema/transaction.schema";

export async function POST(_request: NextRequest) {
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
            )
        }

        const userData = verifyJWT(userToken) as TokenData | null;
        const tempData = verifyJWT(tempToken) as TokenData | null;

        if (!userData || !tempData) {
            return NextResponse.json(
                {
                    message: "Invalid or expired tokens",
                    data: null,
                    error: "Invalid session token",
                    redirect: true,
                    redirectUrl: "/register/check-email"
                },
                { status: 401 }
            );
        }

        await connectToDatabase();

        const currentUser = await RegisterUser.findById(userData.user.id).lean();

        if (!currentUser) {
            return NextResponse.json(
                {
                    message: "User not found",
                    data: null,
                    error: "User does not exist",
                    redirect: true,
                    redirectUrl: "/register/check-email"
                },
                { status: 404 }
            );
        }

        const entryTicket = await EntryTicket.findOne({ userId: currentUser._id, isPaid: true })

        if (!entryTicket) {
            return NextResponse.json(
                {
                    message: "User has not purchased the entry ticket yet.",
                    data: null,
                    error: "Entry ticket not found",
                    redirect: true,
                    redirectUrl: "/register/entry-ticket"
                },
                { status: 404 }
            );
        }

        const pendingTransactions = await Transaction.find({
            $or: [
                { status: "creating" },
                { status: "pending" }
            ],
            userId: currentUser._id,
            reservation_time: { $gt: new Date() },
        })

        if (pendingTransactions.length > 0) {
            return NextResponse.json(
                {
                    message: "You have pending transactions. Please wait for them to complete.",
                    data: null,
                    error: "Pending transactions exist",
                    redirect: false,
                    redirectUrl: null,
                },
                { status: 400 }
            );
        }

        const enrolledTeamEvents = await EnrolledTeamEvent.find({
            team_leader_register_user_id: currentUser._id,
            isPaid: false,
            reservation_time: { $gt: new Date() },
        }).populate("event_id").lean();

        const enrolledIndividualEvents = await EnrolledIndividualEvent.find({
            register_user_id: currentUser._id,
            isPaid: false,
            reservation_time: { $gt: new Date() },
        }).populate("event_id").lean();

        if (enrolledTeamEvents.length === 0 && enrolledIndividualEvents.length === 0) {
            return NextResponse.json(
                {
                    message: "No active enrolled events found",
                    data: null,
                    error: "User has no active event reservations",
                    redirect: true,
                    redirectUrl: "/register/enroll-event"
                },
                { status: 404 }
            );
        }

        let transaction;
        transaction = await Transaction.findOne({
            userId: currentUser._id,
            status: "idle",
        })

        if (!transaction) {
            transaction = await Transaction.create({
                userId: currentUser._id,
                status: "idle",
            })
        }

        let teamEventsAmount = 0;
        for (const event of enrolledTeamEvents) {
            event.event_id.entry_fee = Number(event.event_id.entry_fee as number);
            teamEventsAmount += event.event_id.entry_fee * event.team_length;
        }

        let individualEventsAmount = 0;
        for (const event of enrolledIndividualEvents) {
            event.event_id.entry_fee = Number(event.event_id.entry_fee as number);
            individualEventsAmount += event.event_id.entry_fee;
        }

        transaction.enrolledTeamEvents = enrolledTeamEvents.map(event => event._id);
        transaction.enrolledIndividualEvents = enrolledIndividualEvents.map(event => event._id);
        transaction.teamEventsAmount = teamEventsAmount;
        transaction.individualEventsAmount = individualEventsAmount;
        transaction.status = "creating";
        transaction.reservation_time = new Date(Date.now() + 30 * 60 * 1000); // Set reservation time to 30 minutes from now
        await transaction.save();

        return NextResponse.json(
            {
                message: "Checkout summary prepared successfully",
                data: {
                    user: {
                        id: currentUser._id,
                        name: currentUser.full_name,
                        email: currentUser.email,
                    },
                    enrolledTeamEvents,
                    enrolledIndividualEvents,
                    teamEventsAmount,
                    individualEventsAmount,
                },
                error: null,
                redirect: false,
                redirectUrl: null,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Checkout transaction error:", error);

        return NextResponse.json(
            {
                message: "An unexpected error occurred while preparing the checkout summary",
                data: null,
                error: "Internal server error",
                redirect: false,
                redirectUrl: null,
            },
            { status: 500 }
        )
    }
}
