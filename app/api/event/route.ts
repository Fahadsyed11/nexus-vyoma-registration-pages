import { NextRequest, NextResponse } from "next/server";

import { connectToDatabase } from "@/database/db";
import Event from "@/database/schema/event.schema"

export async function GET(request: NextRequest) {
    try {
        await connectToDatabase();

        const events = await Event.find({});

        return NextResponse.json({
            message: "Successfully fetched event data",
            data: events,
            error: null,
            redirect: false,
            redirect_url: null
        }, { status: 200 })

    } catch (error) {
        return NextResponse.json({
            message: "Error fetching event data",
            data: null,
            error: error instanceof Error ? error.message : "Unknown error",
            redirect: false,
            redirect_url: null
        }, { status: 500 })
    }
}