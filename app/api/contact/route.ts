import { NextRequest, NextResponse } from "next/server";

import { connectToDatabase } from "@/database/db";
import Contact from "@/database/schema/contact.schema"
import { validateDto } from "@/dto/validate.dto-helper";
import { contactDto } from "@/dto/(public)/contact.dto";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const { success, data, issues } = validateDto(contactDto, body);

        if (!success || !data) {
            return NextResponse.json({
                message: "Error validating contact data",
                data: null,
                error: issues,
                redirect: false,
                redirect_url: null
            }, { status: 400 });
        }
        await connectToDatabase();

        const createContact = await Contact.create(data);

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