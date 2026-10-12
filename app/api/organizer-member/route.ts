import { connectToDatabase } from "@/database/db";
import OrganizerMember from "@/database/schema/organizer-member.schema";
import { uploadImageToS3 } from "@/utilities/aws/helper.aws";
import { NextRequest, NextResponse } from "next/server";
import path from "node:path";

export async function GET(request: NextRequest) {
    try {
        await connectToDatabase();

        const getOrganizerMember = await OrganizerMember.find({});

        if (!getOrganizerMember) {
            return NextResponse.json({
                message: "No organizer members found",
                data: null,
                error: null,
                redirect: false,
                redirectUrl: null
            }, { status: 404 })
        }

        return NextResponse.json({
            message: "Organizer members fetched successfully",
            data: getOrganizerMember,
            error: null,
            redirect: false,
            redirectUrl: null
        }, { status: 201 })
    } catch (error) {
        return NextResponse.json({
            message: "Error fetching organizer member",
            data: null,
            error: error,
            redirect: false,
            redirectUrl: null
        }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.formData();

        const name = body.get("name") as string;
        const role = body.get("role") as string;
        const linkedin = body.get("linkedin") as string;
        const instagram = body.get("instagram") as string;
        const title = body.get("title") as string;

        const image = body.get("profile_picture") as File;
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

        const { error, url, success } = await uploadImageToS3(buffer, extension, image.type, "organizer-member");

        if (!success) {
            return NextResponse.json({
                message: "Error uploading image",
                data: null,
                error,
                redirect: false,
                redirectUrl: null
            }, { status: 500 })
        }

        const addOrganizerMember = await OrganizerMember.create({
            name,
            role,
            linkedin,
            instagram,
            title,
            profile_image: url
        });

        return NextResponse.json({
            message: "Organizer member added successfully",
            data: addOrganizerMember,
            error: null,
            redirect: false,
            redirectUrl: null
        }, { status: 201 })
    } catch (error) {
        return NextResponse.json({
            message: "Error adding organizer member",
            data: null,
            error: error,
            redirect: false,
            redirectUrl: null
        }, { status: 500 })
    }
}
