import { connectToDatabase } from "@/database/db";
import EnrolledIndividualEvent from "@/database/schema/enrolled-individual-event.schema";
import EnrolledTeamEvent from "@/database/schema/enrolled-team-event.schema";
import Event from "@/database/schema/event.schema";
import RegisterUser from "@/database/schema/register-user.schema";
import { verifyJWT } from "@/utilities/jwt";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export interface TokenData {
    user: {
        id: string;
        name: string;
        email: string;
    };
}

// When /enroll-event page is loaded, after verification of the user token, we will fetch the user data and enrolled events data and also fetch the events excluding the ones the user is already enrolled in. We will also extend the reservation time for the events that are not paid yet and are not extended yet. The reservation time will be extended by 5 minutes from the current time.
export async function GET(request: NextRequest) {
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

        // Fetch User Details
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

        // Fetch All events.
        const events = await Event.find();

        const allIndividualEvents = events.filter(event => event.participants_type === "individual");
        const allTeamEvents = events.filter(event => event.participants_type === "team");

        // Fetch All Enrolled Events (conditions are isPaid: false and reservation_time > currentTime)
        const currentTime = new Date();

        const enrolledIndividualEvents = await EnrolledIndividualEvent.find({
            $or: [
                { isPaid: true },
                {
                    isPaid: false,
                    reservation_time: { $gt: currentTime }
                }
            ]
        });

        const enrolledTeamEvents = await EnrolledTeamEvent.find({
            $or: [
                { isPaid: true },
                {
                    isPaid: false,
                    reservation_time: { $gt: currentTime }
                }
            ]
        })

        // Now we will filter the events to get the available individual events based on the participant limit and the number of enrolled events for that event.
        let availableIndividualEvents: any[] = [];
        for (let i = 0; i < allIndividualEvents.length; i++) {
            const event = allIndividualEvents[i];

            // Here we get all the enrollment docs for the current iterated event.
            const temp = enrolledIndividualEvents.filter(enrolledEvent => enrolledEvent.event_id.toString() === event._id.toString())

            // Here we are checking the iterate event's participant limit with the number of enrolled events for that event. If the participant limit is greater than or equal to the number of enrolled events, we will add that event to the availableIndividualEvents array.
            if (temp.length < event.participant_limit) {
                const alreadyEnrolled = temp.some(
                    enrolledEvent =>
                        enrolledEvent.register_user_id.toString() ===
                        user._id.toString()
                );

                if (!alreadyEnrolled) {
                    availableIndividualEvents.push(event);
                }
            }
        }

        // Now we will filter the events to get the available team events based on the participant limit and the number of enrolled events for that event.
        let availableTeamEvents: any[] = [];

        for (let i = 0; i < allTeamEvents.length; i++) {
            const event = allTeamEvents[i];

            // Get all enrollments for this event
            const temp = enrolledTeamEvents.filter(
                enrolledEvent =>
                    enrolledEvent.event_id.toString() === event._id.toString()
            );

            // Check whether capacity remains
            if (event.participant_limit > temp.length) {

                // Check whether the user is already a leader or team member
                const alreadyEnrolled = temp.some(enrolledEvent =>
                    enrolledEvent.team_leader_register_user_id.toString() === user._id.toString() ||
                    enrolledEvent.team_emails.includes(user.email)
                );

                // Add the event only if the user is not already enrolled
                if (!alreadyEnrolled) {
                    availableTeamEvents.push(event);
                }
            }
        }

        const availableEvents = {
            individualEvents: availableIndividualEvents || [],
            teamEvents: availableTeamEvents || []
        }

        // Here we have to show the user's enrolled events and also updates the reservation time for all the enrolled events that are not paid yet. And the reservation time will be extended by 5 minutes from the current time.
        const extendedReservationTime = new Date(Date.now() + 5 * 60 * 1000);

        await EnrolledIndividualEvent.updateMany(
            {
                register_user_id: user._id,
                isPaid: false,
                reservation_time: { $gt: currentTime },
                isExtended: false
            },
            {
                $set: {
                    reservation_time: extendedReservationTime,
                    isExtended: true
                }
            }
        )

        const enrolledUserIndividualEvents = await EnrolledIndividualEvent.find({
            $and: [
                {
                    register_user_id: user._id
                },
                {
                    isPaid: false,
                    reservation_time: { $gt: currentTime }
                }
            ]
        }).select("-transaction_id -__v")


        await EnrolledTeamEvent.updateMany(
            {
                $or: [
                    { team_leader_register_user_id: user._id },
                    { team_emails: user.email }
                ],
                isPaid: false,
                reservation_time: { $gt: currentTime },
                isExtended: false
            },
            {
                $set: {
                    reservation_time: extendedReservationTime,
                    isExtended: true
                }
            }
        )

        const enrolledUserTeamEvents = await EnrolledTeamEvent.find({
            $and: [
                {
                    $or: [
                        { team_leader_register_user_id: user._id },
                        { team_emails: user.email }
                    ]
                },
                {
                    isPaid: false,
                    reservation_time: { $gt: currentTime }
                }
            ]
        })

        const enrollUserEvents = {
            individualEvents: enrolledUserIndividualEvents || [],
            teamEvents: enrolledUserTeamEvents || []
        }

        return NextResponse.json({
            message: "User and enrolled events fetched successfully",
            data: {
                user: {
                    id: user._id,
                    name: user.full_name,
                    email: user.email,
                },
                availableEvents,
                enrollUserEvents
            },
            error: null,
            redirect: false,
            redirectUrl: null
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({
            message: "Error fetching token",
            data: null,
            error: error,
            redirect: false,
            redirectUrl: null
        }, { status: 500 })
    }
}

export async function POST(request: NextRequest) { }

export async function DELETE(request: NextRequest) {
    try {
        const body = await request.json();
        const { enrolledEventId, eventId } = body;
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

        const event = await Event.findById(eventId);

        if (!event) {
            return NextResponse.json(
                {
                    message: "Event not found",
                    data: null,
                    error: "Event does not exist",
                    redirect: false,
                    redirectUrl: null,
                },
                { status: 404 });
        }

        // Fetch User Details
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

        if (event.participants_type === "individual") {
            const deletedEvent = await EnrolledIndividualEvent.findOneAndDelete({
                _id: enrolledEventId,
                register_user_id: userData.user.id,
                event_id: eventId
            });

            if (!deletedEvent) {
                return NextResponse.json({
                    message: "Enrolled individual event not found or already deleted",
                    data: null,
                    error: "Enrolled individual event does not exist",
                    redirect: false,
                    redirectUrl: null
                }, { status: 404 });
            }
        } else if (event.participants_type === "team" && event.team_leader_register_user_id.toString() === user._id.toString()) {
            const deletedEvent = await EnrolledTeamEvent.findOneAndDelete({
                _id: enrolledEventId,
                team_leader_register_user_id: userData.user.id,
                event_id: eventId
            });

            if (!deletedEvent) {
                return NextResponse.json({
                    message: "Enrolled team event not found or already deleted",
                    data: null,
                    error: "Enrolled team event does not exist",
                    redirect: false,
                    redirectUrl: null
                }, { status: 404 });
            }
        }

        return NextResponse.json({
            message: "Enrolled event deleted successfully",
            data: null,
            error: null,
            redirect: false,
            redirectUrl: null
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({
            message: "Error deleting enrolled events",
            data: null,
            error: error,
            redirect: false,
            redirectUrl: null
        }, { status: 500 })
    }
}
