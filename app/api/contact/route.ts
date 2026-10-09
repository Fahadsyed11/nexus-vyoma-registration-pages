import { NextRequest, NextResponse } from "next/server";

import { connectToDatabase } from "@/database/db";
import Contact from "@/database/schema/contact.schema"

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        await connectToDatabase();

        // TODO: Add DTO Here

        const createContact = await Contact.create(body);

        if (!createContact) {
            return NextResponse.json({
                message: "Error creating contact",
                data: null,
                error: "Failed to create contact",
                redirect: false,
                redirect_url: null
            }, { status: 500 });
        }
        return NextResponse.json({
            message: "Contact created successfully",
            data: null,
            error: null,
            redirect: false,
            redirect_url: null
        }, { status: 201 });

    } catch (error) {
        console.log(error);
        return NextResponse.json({
            message: "Error saving contact data",
            data: null,
            error: error instanceof Error ? error.message : "Unknown error",
            redirect: false,
            redirect_url: null
        }, { status: 500 })
    }
}