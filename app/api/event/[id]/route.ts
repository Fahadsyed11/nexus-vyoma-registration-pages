import { connectToDatabase } from "@/database/db";
import Event from "@/database/schema/event.schema";
import { NextRequest, NextResponse } from "next/server";
import enrolledEventModel from "@/database/schema/enrolled_event.schema";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectToDatabase();
        const { id }: { id: string } = await params;

        const events = await Event.findById(id);

        if (!events) {
            return NextResponse.json({
                message: "Event not found",
                data: null,
                error: null,
            }, { status: 404 })
        }

        const countEnrolledEvents = await enrolledEventModel.countDocuments({
            $and: [
                { event_id: events._id }
            ]
        })

        let isSoldOut = false;

        if (countEnrolledEvents >= events.participant_limit) {
            isSoldOut = true;
        }

        return NextResponse.json({
            message: "Event fetched successfully",
            data: {
                ...events.toObject(),
                isSoldOut
            },
            error: null
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({
            message: "Error fetching event data",
            data: null,
            error: error instanceof Error ? error.message : "Unknown error",
        }, { status: 500 })
    }
}