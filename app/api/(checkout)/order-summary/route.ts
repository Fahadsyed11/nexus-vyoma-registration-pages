import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import mongoose from "mongoose";

import { TokenData } from "../../(enrollement)/enroll-event/route";
import { verifyJWT } from "@/utilities/jwt";
import { connectToDatabase } from "@/database/db";

import RegisterUser from "@/database/schema/register-user.schema";
import Event from "@/database/schema/event.schema";
import EntryTicket from "@/database/schema/entry-ticket.schema";
import EnrolledTeamEvent from "@/database/schema/enrolled-team-event.schema";
import EnrolledIndividualEvent from "@/database/schema/enrolled-individual-event.schema";
import Transaction from "@/database/schema/transaction.schema";

const ENTRY_TICKET_PRICE = 299;

type ObjectIdLike = mongoose.Types.ObjectId | string;

function normalizeEmail(email: unknown): string {
    return String(email ?? "").trim().toLowerCase();
}

function sameIds(
    existingIds: ObjectIdLike[] = [],
    currentIds: ObjectIdLike[] = []
): boolean {
    const normalize = (ids: ObjectIdLike[]) =>
        ids.map((id) => id.toString()).sort();

    return JSON.stringify(normalize(existingIds ?? [])) ===
        JSON.stringify(normalize(currentIds ?? []));
}

function sameStrings(existing: string[] = [], current: string[] = []): boolean {
    const normalize = (values: string[]) =>
        [...new Set((values ?? []).map(normalizeEmail).filter(Boolean))].sort();

    return JSON.stringify(normalize(existing)) === JSON.stringify(normalize(current));
}

function errorResponse(
    message: string,
    error: string,
    status: number,
    redirect = false,
    redirectUrl: string | null = null,
    data: unknown = null
) {
    return NextResponse.json(
        { message, data, error, redirect, redirectUrl },
        { status }
    );
}

function isDuplicateKeyError(error: unknown): boolean {
    return (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        (error as { code?: number }).code === 11000
    );
}

function validPrice(value: unknown, eventId: unknown): number {
    const price = Number(value);

    if (!Number.isFinite(price) || price < 0) {
        throw new Error(`Invalid entry_fee for event ${String(eventId)}`);
    }

    return price;
}

export async function POST(_request: NextRequest) {
    try {
        const cookieStore = await cookies();

        const userToken = cookieStore.get("nv-session")?.value;
        const tempToken = cookieStore.get("nv-session-temp")?.value;

        if (!userToken || !tempToken) {
            return errorResponse(
                "Required tokens are missing",
                "Missing session token",
                401,
                true,
                "/register/check-email"
            );
        }

        const userData = verifyJWT(userToken) as TokenData | null;
        const tempData = verifyJWT(tempToken) as TokenData | null;

        if (!userData || !tempData) {
            return errorResponse(
                "Invalid or expired tokens",
                "Invalid session token",
                401,
                true,
                "/register/check-email"
            );
        }

        await connectToDatabase();

        const currentUser = await RegisterUser.findById(userData.user.id).lean();

        if (!currentUser) {
            return errorResponse(
                "User not found",
                "User does not exist",
                404,
                true,
                "/register/check-email"
            );
        }

        const currentUserId = currentUser._id as mongoose.Types.ObjectId;
        const currentUserEmail = normalizeEmail(currentUser.email);

        if (!currentUserEmail) {
            return errorResponse(
                "Your account does not have a valid email address",
                "Missing user email",
                400
            );
        }

        // // Never create another checkout while a previous Cashfree payment is unresolved.
        // // Resolve the existing order with Cashfree/webhook before allowing another attempt.
        // const pendingTransaction = await Transaction.findOne({
        //     userId: currentUserId,
        //     status: "pending",
        // }).lean();

        // if (pendingTransaction) {
        //     return errorResponse(
        //         "A payment is already pending. Verify its status before starting another payment.",
        //         "Pending payment exists",
        //         409,
        //         false,
        //         null,
        //         {
        //             transaction: {
        //                 id: pendingTransaction._id,
        //                 status: pendingTransaction.status,
        //                 orderId: pendingTransaction.orderId ?? null,
        //                 totalAmount: pendingTransaction.totalAmount,
        //             },
        //         }
        //     );
        // }

        const currentTime = new Date();

        const [teamEnrollments, individualEnrollments, paidOwnEntryTicket, ownEntryTicket] =
            await Promise.all([
                EnrolledTeamEvent.find({
                    team_leader_register_user_id: currentUserId,
                    isPaid: false,
                    reservation_time: { $gt: currentTime },
                }).lean(),

                EnrolledIndividualEvent.find({
                    register_user_id: currentUserId,
                    isPaid: false,
                    reservation_time: { $gt: currentTime },
                }).lean(),

                EntryTicket.findOne({
                    isPaid: true,
                    $or: [{ userId: currentUserId }, { email: currentUserEmail }],
                }).lean(),

                EntryTicket.findOne({
                    $or: [{ userId: currentUserId }, { email: currentUserEmail }],
                }).lean(),
            ]);

        if (teamEnrollments.length === 0 && individualEnrollments.length === 0) {
            return errorResponse(
                "No active enrolled events found",
                "User has no active event reservations",
                404,
                true,
                "/register/enroll-event"
            );
        }

        const eventIds = [
            ...teamEnrollments.map((enrollment) => enrollment.event_id),
            ...individualEnrollments.map((enrollment) => enrollment.event_id),
        ];

        const events = await Event.find({ _id: { $in: eventIds } }).lean();
        const eventsById = new Map(
            events.map((event) => [event._id.toString(), event])
        );

        const userByEmail = new Map<string, any>();
        const paidTicketByEmail = new Map<string, boolean>();

        paidTicketByEmail.set(currentUserEmail, Boolean(paidOwnEntryTicket));

        // Email is the stable identifier for a ticket beneficiary, including users
        // who have not registered yet. Deduplicate ticket fees by normalized email.
        const entryTicketChargeByEmail = new Map<string, number>();
        if (!paidOwnEntryTicket) {
            entryTicketChargeByEmail.set(currentUserEmail, ENTRY_TICKET_PRICE);
        }

        const teamEventDetails: any[] = [];
        const individualEventDetails: any[] = [];
        const unregisteredTeamMembers: any[] = [];

        for (const enrollment of teamEnrollments) {
            const event = eventsById.get(enrollment.event_id.toString());

            if (!event) {
                return errorResponse(
                    "An enrolled event could not be found",
                    `Missing event for enrollment ${enrollment._id}`,
                    409
                );
            }

            const eventPrice = validPrice(event.entry_fee, event._id);
            const teamMembers: any[] = [];

            for (const rawEmail of enrollment.team_emails ?? []) {
                const email = normalizeEmail(rawEmail);
                if (!email) continue;

                let member = userByEmail.get(email);

                if (member === undefined) {
                    member = await RegisterUser.findOne({ email }).lean();
                    userByEmail.set(email, member ?? null);
                }

                // Check paid tickets by email for both registered and unregistered attendees.
                let hasPaidTicket = paidTicketByEmail.get(email);

                if (hasPaidTicket === undefined) {
                    const ticketQuery: Record<string, unknown> = {
                        email,
                        isPaid: true,
                    };

                    // If registered, also allow an existing ticket linked by userId.
                    const ticketLookup = member
                        ? EntryTicket.findOne({
                            isPaid: true,
                            $or: [{ email }, { userId: member._id }],
                        }).lean()
                        : EntryTicket.findOne(ticketQuery).lean();

                    const paidTicket = await ticketLookup;
                    hasPaidTicket = Boolean(paidTicket);
                    paidTicketByEmail.set(email, hasPaidTicket);
                }

                if (!hasPaidTicket && !entryTicketChargeByEmail.has(email)) {
                    entryTicketChargeByEmail.set(email, ENTRY_TICKET_PRICE);
                }

                if (!member) {
                    teamMembers.push({
                        email,
                        isRegistered: false,
                        isEntryTicketPurchased: hasPaidTicket,
                        entryTicketPrice: hasPaidTicket ? 0 : ENTRY_TICKET_PRICE,
                        requiresRegistration: true,
                    });

                    unregisteredTeamMembers.push({
                        email,
                        teamEnrollmentId: enrollment._id,
                        teamName: enrollment.team_name,
                    });

                    continue;
                }

                teamMembers.push({
                    userId: member._id,
                    name: member.name,
                    email,
                    isRegistered: true,
                    isEntryTicketPurchased: hasPaidTicket,
                    entryTicketPrice: hasPaidTicket ? 0 : ENTRY_TICKET_PRICE,
                    requiresRegistration: false,
                });
            }

            teamEventDetails.push({
                enrollmentId: enrollment._id,
                teamName: enrollment.team_name,
                eventId: event._id,
                eventName: event.title,
                eventPrice,
                teamMembers,
            });
        }

        for (const enrollment of individualEnrollments) {
            const event = eventsById.get(enrollment.event_id.toString());

            if (!event) {
                return errorResponse(
                    "An enrolled event could not be found",
                    `Missing event for enrollment ${enrollment._id}`,
                    409
                );
            }

            individualEventDetails.push({
                enrollmentId: enrollment._id,
                eventId: event._id,
                eventName: event.title,
                eventPrice: validPrice(event.entry_fee, event._id),
            });
        }

        const totalTeamEventsPrice = teamEventDetails.reduce(
            (total, team) => total + team.eventPrice,
            0
        );

        const totalIndividualEventsPrice = individualEventDetails.reduce(
            (total, event) => total + event.eventPrice,
            0
        );

        const entryTicketEmails = [...entryTicketChargeByEmail.keys()].sort();
        const totalEntryTicketPrice = entryTicketChargeByEmail.size * ENTRY_TICKET_PRICE;

        const grandTotal =
            totalTeamEventsPrice +
            totalIndividualEventsPrice +
            totalEntryTicketPrice;

        if (
            !Number.isFinite(totalTeamEventsPrice) ||
            !Number.isFinite(totalIndividualEventsPrice) ||
            !Number.isFinite(totalEntryTicketPrice) ||
            !Number.isFinite(grandTotal) ||
            grandTotal < 0
        ) {
            return errorResponse(
                "Checkout contains an invalid amount",
                "Invalid checkout total",
                500
            );
        }

        const individualEnrollmentIds = individualEnrollments.map(
            (enrollment) => enrollment._id as mongoose.Types.ObjectId
        );
        const teamEnrollmentIds = teamEnrollments.map(
            (enrollment) => enrollment._id as mongoose.Types.ObjectId
        );
        const entryTicketId = ownEntryTicket?._id
            ? (ownEntryTicket._id as mongoose.Types.ObjectId)
            : undefined;

        const transactionFields = {
            enrolledIndividualEvents: individualEnrollmentIds,
            enrolledTeamEvents: teamEnrollmentIds,
            entryTicketId,
            entryTicketEmails,
            totalAmount: grandTotal,
        };

        let transaction = await Transaction.findOne({
            userId: currentUserId,
            status: "idle",
        });

        let transactionAction: "created" | "updated" | "unchanged";

        if (transaction) {
            const unchanged =
                sameIds(transaction.enrolledIndividualEvents, individualEnrollmentIds) &&
                sameIds(transaction.enrolledTeamEvents, teamEnrollmentIds) &&
                (transaction.entryTicketId?.toString() ?? null) ===
                (entryTicketId?.toString() ?? null) &&
                sameStrings(transaction.entryTicketEmails ?? [], entryTicketEmails) &&
                transaction.totalAmount === grandTotal;

            if (unchanged) {
                // Re-read status so we don't return a stale idle transaction if payment
                // initiation changed it while this request was running.
                const stillIdle = await Transaction.findOne({
                    _id: transaction._id,
                    userId: currentUserId,
                    status: "idle",
                }).lean();

                if (!stillIdle) {
                    return errorResponse(
                        "The transaction status changed. Refresh checkout and verify any payment in progress.",
                        "Transaction changed concurrently",
                        409
                    );
                }

                transaction = await Transaction.findById(stillIdle._id);
                transactionAction = "unchanged";
            } else {
                const setFields: Record<string, unknown> = {
                    enrolledIndividualEvents: individualEnrollmentIds,
                    enrolledTeamEvents: teamEnrollmentIds,
                    entryTicketEmails,
                    totalAmount: grandTotal,
                };

                const update: Record<string, unknown> = {
                    $set: setFields,
                    $unset: { orderId: "" },
                };

                if (entryTicketId) {
                    setFields.entryTicketId = entryTicketId;
                } else {
                    (update.$unset as Record<string, string>).entryTicketId = "";
                }

                const updated = await Transaction.findOneAndUpdate(
                    { _id: transaction._id, userId: currentUserId, status: "idle" },
                    update,
                    { new: true, runValidators: true }
                );

                if (!updated) {
                    return errorResponse(
                        "The transaction status changed. Refresh checkout and verify any payment in progress.",
                        "Transaction changed concurrently",
                        409
                    );
                }

                transaction = updated;
                transactionAction = "updated";
            }
        } else {
            try {
                transaction = await Transaction.create({
                    userId: currentUserId,
                    ...transactionFields,
                    status: "idle",
                });
                transactionAction = "created";
            } catch (error) {
                if (!isDuplicateKeyError(error)) throw error;

                // Another concurrent request created the user's idle transaction.
                const existingIdle = await Transaction.findOne({
                    userId: currentUserId,
                    status: "idle",
                });

                if (!existingIdle) {
                    return errorResponse(
                        "Checkout is being updated by another request. Please refresh.",
                        "Concurrent transaction creation",
                        409
                    );
                }

                const setFields: Record<string, unknown> = {
                    enrolledIndividualEvents: individualEnrollmentIds,
                    enrolledTeamEvents: teamEnrollmentIds,
                    entryTicketEmails,
                    totalAmount: grandTotal,
                };

                const update: Record<string, unknown> = {
                    $set: setFields,
                    $unset: { orderId: "" },
                };

                if (entryTicketId) {
                    setFields.entryTicketId = entryTicketId;
                } else {
                    (update.$unset as Record<string, string>).entryTicketId = "";
                }

                const updated = await Transaction.findOneAndUpdate(
                    {
                        _id: existingIdle._id,
                        userId: currentUserId,
                        status: "idle",
                    },
                    update,
                    { new: true, runValidators: true }
                );

                if (!updated) {
                    return errorResponse(
                        "Checkout is being updated by another request. Please refresh.",
                        "Concurrent transaction update",
                        409
                    );
                }

                transaction = updated;
                transactionAction = "updated";
            }
        }

        if (!transaction) {
            return errorResponse(
                "Unable to prepare checkout transaction",
                "Transaction unavailable",
                500
            );
        }

        return NextResponse.json(
            {
                message: "Checkout summary prepared successfully",
                data: {
                    user: {
                        id: currentUser._id,
                        name: currentUser.name,
                        email: currentUser.email,
                    },
                    teamEventDetails,
                    individualEventDetails,
                    unregisteredTeamMembers,
                    entryTicketDetails: {
                        isPurchased: Boolean(paidOwnEntryTicket),
                        price: paidOwnEntryTicket ? 0 : ENTRY_TICKET_PRICE,
                    },
                    pricing: {
                        totalTeamEventsPrice,
                        totalIndividualEventsPrice,
                        totalEntryTicketPrice,
                        grandTotal,
                        currency: "INR",
                    },
                    transaction: {
                        id: transaction._id,
                        status: transaction.status,
                        orderId: transaction.orderId ?? null,
                        totalAmount: transaction.totalAmount,
                        entryTicketEmails,
                        action: transactionAction,
                    },
                },
                error: null,
                redirect: false,
                redirectUrl: null,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Checkout transaction error:", error);

        return errorResponse(
            "Failed to prepare checkout",
            "Internal server error",
            500
        );
    }
}
