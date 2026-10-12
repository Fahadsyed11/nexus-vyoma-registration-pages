import { NextRequest, NextResponse } from "next/server";
import path from "path";

import { connectToDatabase } from "@/database/db";
import Event from "@/database/schema/event.schema"
import { uploadImageToS3 } from "@/utilities/aws/helper.aws";

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

export async function POST(request: NextRequest) {
    try {
        const body = await request.formData();

        const name = body.get("title") as string;
        const short_description = body.get("short_description") as string;
        const long_description = body.get("long_description") as string;
        const venue = body.get("venue") as string;
        const date_time = body.get("date_time") as string;
        const category = body.get("category") as string;
        const participant_limit = Number(body.get("participant_limit") as string);
        const prize = body.get("prize") as string;
        const entry_fee = Number(body.get("entry_fee") as string);
        const participants_type = body.get("participants_type") as string;
        const team_size = Number(body.get("team_size") as string);
        const requirements = body.get("requirements") as string;
        const min_team_size = Number(body.get("min_team_size") as string);
        const max_team_size = Number(body.get("max_team_size") as string);
        const isFlatship = body.get("isFlatship") === "true" ? true : false;

        if (participants_type !== 'team' && participants_type !== 'individual') {
            return NextResponse.json({
                message: "Invalid participants type",
                data: null,
                error: "Invalid participants type",
                redirect: false,
                redirect_url: null
            }, { status: 400 })
        }

        let requirementsArray
        if (requirements) {
            requirementsArray = requirements.split(",").map(req => req.trim());
        }

        const image = body.get("event_banner") as File;
        if (!(image instanceof File) || image.size === 0) {
            return NextResponse.json(
                { message: "A valid image is required" },
                { status: 400 }
            );
        }

        const maxSize = 20 * 1024 * 1024; // 20 MB
        if (image.size > maxSize) {
            return NextResponse.json(
                { message: "Image must be 20 MB or smaller" },
                { status: 400 }
            );
        }

        const extension = path.extname(image.name).toLowerCase().replace(".", "");

        const buffer = Buffer.from(await image.arrayBuffer());

        await connectToDatabase();

        const { success, url, error } = await uploadImageToS3(buffer, extension, image.type, `event-banners`)

        if (!success) {
            return NextResponse.json({
                message: "Error uploading image",
                data: null,
                error,
                redirect: false,
                redirectUrl: null
            }, { status: 500 })
        }

        const newEvent = await Event.create({
            title: name,
            short_description,
            long_description,
            venue,
            date_time,
            image_url: url,
            isFlatship,
            category,
            participant_limit,
            prize,
            entry_fee,
            participants_type,
            team_size,
            requirements: requirementsArray || [],
            min_team_size,
            max_team_size
        });

        if (!newEvent) {
            return NextResponse.json({
                message: "Error creating event",
                data: null,
                error: "Failed to create event",
                redirect: false,
                redirect_url: null
            }, { status: 500 })
        }

        return NextResponse.json({
            message: "Event created successfully",
            data: newEvent,
            error: null,
            redirect: false,
            redirect_url: null
        }, { status: 201 })
    } catch (error) {
        return NextResponse.json({
            message: "Error creating event",
            data: null,
            error: error instanceof Error ? error.message : "Unknown error",
            redirect: false,
            redirect_url: null
        }, { status: 500 })
    }
}
