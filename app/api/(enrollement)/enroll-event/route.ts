import { connectToDatabase } from "@/database/db";
import enrolledIndividualEventModel from "@/database/schema/enrolled-individual-event.schema";
import enrolledTeamEventModel from "@/database/schema/enrolled-team-event.schema";
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

        const reservationExpiry = new Date(Date.now() - 5 * 60 * 1000);

        const extendedReservationTime = new Date(Date.now() + 5 * 60 * 1000);

        await enrolledIndividualEventModel.updateMany(
            {
                register_user_id: user._id,
                isPaid: false,
                isExtended: false,
                reservation_time: { $gt: reservationExpiry }
            },
            {
                $set: {
                    reservation_time: extendedReservationTime,
                    isExtended: true
                }
            }
        );

        await enrolledTeamEventModel.updateMany(
            {
                $or: [
                    { team_leader_register_user_id: user._id },
                    { team_emails: user.email }
                ],
                isPaid: false,
                isExtended: false,
                reservation_time: { $gt: reservationExpiry }
            },
            {
                $set: {
                    reservation_time: extendedReservationTime,
                    isExtended: true
                }
            }
        );

        const enrolledIndividualEvents = await enrolledIndividualEventModel.find({
            register_user_id: user._id,
            $or: [
                { isPaid: true },
                {
                    isPaid: false,
                    reservation_time: { $gt: reservationExpiry }
                }
            ]
        }).select("-transaction_id -__v")
            .populate("event_id", "title short_description long_description date_time venue image_url");

        const enrolledTeamEvents = await enrolledTeamEventModel.find({
            $and: [
                {
                    $or: [
                        { team_leader_register_user_id: user._id },
                        { team_emails: user.email }
                    ]
                },
                {
                    $or: [
                        { isPaid: true },
                        {
                            isPaid: false,
                            reservation_time: { $gt: reservationExpiry }
                        }
                    ]
                }
            ]
        }).select("-transaction_id -__v")
            .populate("event_id", "title short_description long_description date_time venue image_url");

        // Now we are fetching events excluding the ones the user is already enrolled in
        let events = await Event.find({
            $nor: [
                {
                    _id: {
                        $in: enrolledIndividualEvents.map(event => event.event_id?._id)
                    }
                },
                {
                    _id: {
                        $in: enrolledTeamEvents.map(event => event.event_id?._id)
                    }
                }
            ]
        });

        if (events.length === 0) {
            return NextResponse.json(
                {
                    message: "No events found",
                    data: [],
                    error: "No events available for enrollment",
                    redirect: false,
                    redirectUrl: null,
                },
                { status: 200 }
            );
        }

        let eventsData = await Promise.all(
            events.map(async (event) => {
                if (event.participants_type === "individual") {
                    const enrolledIndividualCount = await enrolledIndividualEventModel.countDocuments({
                        event_id: event._id,
                        $or: [
                            { isPaid: true },
                            {
                                isPaid: false,
                                reservation_time: { $gt: new Date() }
                            }
                        ]

                    });
                    if (enrolledIndividualCount >= event.participant_limit) {
                        return null; // Exclude this event from the list
                    }
                    return event; // Include this event in the list
                } else if (event.participants_type === "team") {
                    // if(event.re)
                    const enrolledTeamCount = await enrolledTeamEventModel.countDocuments({
                        event_id: event._id,
                        $or: [
                            { isPaid: true },
                            {
                                isPaid: false,
                                reservation_time: { $gt: new Date() }
                            }
                        ]

                    });
                    if (enrolledTeamCount >= event.participant_limit) {
                        return null; // Exclude this event from the list
                    }
                    return event; // Include this event in the list
                }
            })
        )

        eventsData = eventsData.filter(event => event !== null); // Remove null values

        return NextResponse.json({
            message: "User and enrolled events fetched successfully",
            data: {
                user: {
                    id: user._id,
                    name: user.full_name,
                    email: user.email,
                },
                enrolledEvents: {
                    individual: enrolledIndividualEvents,
                    team: enrolledTeamEvents
                },
                events: eventsData,
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
