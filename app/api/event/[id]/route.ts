import { connectToDatabase } from "@/database/db";
import Event from "@/database/schema/event.schema";
import { NextRequest, NextResponse } from "next/server";
import enrolledIndividualEventModel from "@/database/schema/enrolled-individual-event.schema";
import enrolledTeamEventModel from "@/database/schema/enrolled-team-event.schema";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectToDatabase();
        const { id }: { id: string } = await params;

        const event = await Event.findById(id);

        if (!event) {
            return NextResponse.json({
                message: "Event not found",
                data: null,
                error: null,
                redirect: true,
                redirect_url: "/events"
            }, { status: 404 })
        }

        let enrolledEventsCount = 0;
        if (event && event.participants_type === "team") {
            enrolledEventsCount = await enrolledTeamEventModel.countDocuments({
                $and: [
                    { event_id: event._id }
                ]
            })
        } else {
            enrolledEventsCount = await enrolledIndividualEventModel.countDocuments({
                $and: [
                    { event_id: event._id }
                ]
            })
        }

        let isSoldOut = false;

        if (enrolledEventsCount >= event.participant_limit) {
            isSoldOut = true;
        }

        return NextResponse.json({
            message: "Event fetched successfully",
            data: {
                ...event.toObject(),
                isSoldOut
            },
            error: null,
            redirect: false,
            redirect_url: null
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({
            message: "Error fetching event data",
            data: null,
            error: error instanceof Error ? error.message : "Unknown error",
            redirect: true,
            redirect_url: "/events"
        }, { status: 500 })
    }
}