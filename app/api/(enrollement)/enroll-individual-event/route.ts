import { verifyJWT } from "@/utilities/jwt";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { TokenData } from "../enroll-event/route";
import { connectToDatabase } from "@/database/db";
import RegisterUser from "@/database/schema/register-user.schema";
import Event from "@/database/schema/event.schema";
import enrolledIndividualEventModel from "@/database/schema/enrolled-individual-event.schema";

type EventListBody = {
    _id: string;
    participants_type: string;
    team_size: number | null;
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const { eventList }: { eventList: EventListBody[] } = body;

        if (eventList.length === 0) {
            return NextResponse.json({
                message: "No event IDs provided",
                data: null,
                error: "Empty event list",
                redirect: false,
                redirectUrl: null
            }, { status: 400 });
        } else if (eventList.filter(event => event.participants_type !== "individual").length > 0) {
            return NextResponse.json({
                message: "Only individual events are allowed in this route",
                data: null,
                error: "Invalid event type",
                redirect: false,
                redirectUrl: null
            }, { status: 400 });
        }

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

        //  Fetch ALL events before creating any enrollments.
        const eventDataList = await Promise.all(
            eventList.map(event => Event.findById(event._id))
        );

        // Find a missing event and return from POST itself.
        const missingEventIndex = eventDataList.findIndex(
            event => event === null
        );

        if (missingEventIndex !== -1) {
            return NextResponse.json({
                message: `Event with ID ${eventList[missingEventIndex]._id} not found`,
                data: null,
                error: "Event does not exist",
                redirect: false,
                redirectUrl: null
            }, { status: 404 });
        }

        // Verify the actual database event types, not just client data.
        if (eventDataList.some(event => event!.participants_type !== "individual")) {
            return NextResponse.json({
                message: "Only individual events are allowed in this route",
                data: null,
                error: "Invalid event type",
                redirect: false,
                redirectUrl: null
            }, { status: 400 });
        }

        // Create enrollments only after every event passes validation.
        // This avoids partial enrollment caused by a missing or invalid event.
        await enrolledIndividualEventModel.insertMany(
            eventDataList.map(event => ({
                register_user_id: user._id,
                event_id: event!._id,
                transaction_id: null,
                isPaid: false,
                reservation_time: new Date(),
                isExtended: false
            }))
        );

        return NextResponse.json({
            message: "Enrolled in individual events successfully",
            data: null,
            error: null,
            redirect: false,
            redirectUrl: null
        }, { status: 201 });
    } catch (error) {
        return NextResponse.json({
            message: "Error adding enrolled event",
            data: null,
            error: error,
            redirect: false,
            redirectUrl: null
        }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const body = await request.json();

        const { eventList }: { eventList: EventListBody } = body;

        if (!eventList) {
            return NextResponse.json({
                message: "No event ID provided",
                data: null,
                error: "Empty event list",
                redirect: false,
                redirectUrl: null
            }, { status: 400 });
        } else if (eventList.participants_type !== "individual") {
            return NextResponse.json({
                message: "Only individual events are allowed in this route",
                data: null,
                error: "Invalid event type",
                redirect: false,
                redirectUrl: null
            }, { status: 400 });
        }

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

        const deletedEnrollment = await enrolledIndividualEventModel.findOneAndDelete({
            register_user_id: user._id,
            event_id: eventList._id
        });

        if (!deletedEnrollment) {
            return NextResponse.json({
                message: "Enrollment not found for the specified event",
                data: null,
                error: "Enrollment does not exist",
                redirect: false,
                redirectUrl: null
            }, { status: 404 });
        }

        return NextResponse.json({
            message: "Enrolled in individual events successfully",
            data: null,
            error: null,
            redirect: false,
            redirectUrl: null
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({
            message: "Error deleting enrolled event",
            data: null,
            error: error,
            redirect: false,
            redirectUrl: null
        }, { status: 500 })
    }
}
