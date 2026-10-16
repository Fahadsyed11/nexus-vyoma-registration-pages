import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import mongoose from "mongoose";
import { connectToDatabase } from "@/database/db";
import Event from "@/database/schema/event.schema";
import RegisterUser from "@/database/schema/register-user.schema";
import enrolledEventModel from "@/database/schema/enrolled-event.schema";
import { verifyJWT } from "@/utilities/jwt";

interface TeamSelectionPayload {
  eventId: string;
  teamName: string;
  teamLeaderEmail?: string;
  teamMembers?: string[];
}

interface EnrolmentRequestPayload {
  selectedIndividualEventIds?: string[];
  selectedTeamEvents?: TeamSelectionPayload[];
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const cookieStore = await cookies();
    const sessionToken =
      cookieStore.get("nv-session")?.value ||
      cookieStore.get("nv-session-temp")?.value;

    let userEmail: string | undefined;

    if (sessionToken) {
      const payload = verifyJWT(sessionToken) as {
        user?: { email?: string; id?: string; name?: string };
        email?: string;
      } | null;
      userEmail = payload?.user?.email || payload?.email;
    }

    // Dev fallback if accessing during local dev without an active cookie
    if (!userEmail && process.env.NODE_ENV === "development") {
      userEmail = "syedaliquadri100@gmail.com";
    }

    if (!userEmail) {
      return NextResponse.json(
        {
          message: "Unauthorized: Please log in or complete email verification first.",
          data: null,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const user = await RegisterUser.findOne({ email: userEmail });

    const body: EnrolmentRequestPayload = await request.json().catch(() => ({}));
    const individualIds = Array.isArray(body.selectedIndividualEventIds)
      ? body.selectedIndividualEventIds
      : [];
    const teamSelections = Array.isArray(body.selectedTeamEvents)
      ? body.selectedTeamEvents
      : [];

    if (individualIds.length === 0 && teamSelections.length === 0) {
      return NextResponse.json(
        {
          message: "Please select at least one event to enroll.",
          data: null,
          error: "No events selected",
        },
        { status: 400 }
      );
    }

    // Fetch all referenced events
    const allEventIds = [
      ...individualIds,
      ...teamSelections.map((t) => t.eventId),
    ].filter((id) => mongoose.Types.ObjectId.isValid(id));

    const eventsInDb = await Event.find({ _id: { $in: allEventIds } });
    const eventMap = new Map(eventsInDb.map((e) => [String(e._id), e]));

    let calculatedTotal = 0;
    const recordsToInsert: Array<Record<string, unknown>> = [];

    // Process individual events
    for (const eventId of individualIds) {
      const eventDoc = eventMap.get(eventId);
      if (!eventDoc) {
        return NextResponse.json(
          {
            message: `Event not found: ${eventId}`,
            data: null,
            error: "Event not found",
          },
          { status: 404 }
        );
      }

      // Check participant limit
      const currentCount = await enrolledEventModel.countDocuments({
        event_id: eventDoc._id,
      });
      if (currentCount >= eventDoc.participant_limit) {
        return NextResponse.json(
          {
            message: `Event "${eventDoc.title}" is already sold out.`,
            data: null,
            error: "Capacity reached",
          },
          { status: 400 }
        );
      }

      calculatedTotal += Number(eventDoc.entry_fee) || 0;

      recordsToInsert.push({
        event_title: eventDoc.title,
        event_id: eventDoc._id,
        register_user_id: user?._id || new mongoose.Types.ObjectId(),
        user_email: userEmail,
        participation_type: "individual",
      });
    }

    // Process team events
    for (const teamSel of teamSelections) {
      const eventDoc = eventMap.get(teamSel.eventId);
      if (!eventDoc) {
        return NextResponse.json(
          {
            message: `Team event not found: ${teamSel.eventId}`,
            data: null,
            error: "Event not found",
          },
          { status: 404 }
        );
      }

      if (!teamSel.teamName || !teamSel.teamName.trim()) {
        return NextResponse.json(
          {
            message: `Please specify a team name for "${eventDoc.title}".`,
            data: null,
            error: "Missing team name",
          },
          { status: 400 }
        );
      }

      const currentCount = await enrolledEventModel.countDocuments({
        event_id: eventDoc._id,
      });
      if (currentCount >= eventDoc.participant_limit) {
        return NextResponse.json(
          {
            message: `Team event "${eventDoc.title}" is already sold out.`,
            data: null,
            error: "Capacity reached",
          },
          { status: 400 }
        );
      }

      calculatedTotal += Number(eventDoc.entry_fee) || 0;

      const teamMembers = Array.isArray(teamSel.teamMembers)
        ? teamSel.teamMembers.filter((m) => typeof m === "string" && m.trim().length > 0)
        : [];

      recordsToInsert.push({
        event_title: eventDoc.title,
        event_id: eventDoc._id,
        register_user_id: user?._id || new mongoose.Types.ObjectId(),
        user_email: userEmail,
        participation_type: "team",
        team_name: teamSel.teamName.trim(),
        team_leader_email: userEmail,
        team_size: teamMembers.length + 1,
        team_members: teamMembers,
      });
    }

    // Save enrolments
    if (recordsToInsert.length > 0) {
      await enrolledEventModel.insertMany(recordsToInsert);
    }

    return NextResponse.json(
      {
        message: "Enrolment recorded successfully",
        data: {
          enrolledCount: recordsToInsert.length,
          totalAmount: calculatedTotal,
          userEmail,
        },
        error: null,
        redirect: true,
        redirect_url: "/payment/success",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Enrolment error:", error);
    return NextResponse.json(
      {
        message: "Failed to process event enrolment",
        data: null,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
