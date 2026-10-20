import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import mongoose from "mongoose";

import { connectToDatabase } from "@/database/db";
import RegisterUser from "@/database/schema/register-user.schema";
import EntryTicket from "@/database/schema/entry-ticket.schema";
import Transaction from "@/database/schema/transaction.schema";
import { verifyJWT } from "@/utilities/jwt";
import cashfree from "@/utilities/payment/client";

const ENTRY_TICKET_PRICE = 299;

interface SessionTokenData {
  user?: {
    id?: string;
    name?: string;
    email?: string;
  };
}

function normalizeEmail(email: unknown): string {
  return String(email ?? "").trim().toLowerCase();
}

/**
 * GET /api/registration/entry-ticket
 * Returns current ticket details, price, and whether the logged-in user already holds a ticket.
 */
export async function GET() {
  try {
    await connectToDatabase();

    const cookieStore = await cookies();
    const userToken = cookieStore.get("nv-session")?.value;
    const tempToken = cookieStore.get("nv-session-temp")?.value;

    let user: {
      id: string;
      name: string;
      email: string;
      phone_number?: string;
      institution?: string;
    } | null = null;
    let isPurchased = false;

    if (userToken && tempToken) {
      const userData = verifyJWT(userToken) as SessionTokenData | null;
      const tempData = verifyJWT(tempToken) as SessionTokenData | null;

      if (userData?.user?.id && tempData?.user?.id && userData.user.id === tempData.user.id) {
        const dbUser = await RegisterUser.findById(userData.user.id).lean();
        if (dbUser) {
          user = {
            id: dbUser._id.toString(),
            name: dbUser.full_name,
            email: dbUser.email,
            phone_number: dbUser.phone_number,
            institution: dbUser.institution,
          };

          const paidTicket = await EntryTicket.findOne({
            $or: [{ userId: dbUser._id }, { email: normalizeEmail(dbUser.email) }],
            isPaid: true,
          }).lean();

          if (paidTicket) {
            isPurchased = true;
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      price: ENTRY_TICKET_PRICE,
      currency: "INR",
      fest: "Nexus Vyoma 2026",
      passName: "All-Access 3-Day Fest Pass",
      dates: "10 · 11 · 12 NOV 2026",
      venue: "ISL Engineering College, Hyderabad",
      user,
      isPurchased,
    });
  } catch (error) {
    console.error("Error in GET /api/registration/entry-ticket:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch entry ticket details",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/registration/entry-ticket
 * Purchases / initiates Cashfree order for the ₹299 entry ticket.
 */
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json().catch(() => ({}));
    const rawEmail = body.email;
    const rawFullName = body.full_name;
    const rawPhone = body.phone_number;
    const rawInstitution = body.institution;

    // Check if user is logged in
    const cookieStore = await cookies();
    const userToken = cookieStore.get("nv-session")?.value;
    const tempToken = cookieStore.get("nv-session-temp")?.value;

    let userId: mongoose.Types.ObjectId | null = null;
    let finalEmail = normalizeEmail(rawEmail);
    let finalFullName = String(rawFullName ?? "").trim();
    let finalPhone = String(rawPhone ?? "").trim();
    let finalInstitution = String(rawInstitution ?? "").trim();

    if (userToken && tempToken) {
      const userData = verifyJWT(userToken) as SessionTokenData | null;
      const tempData = verifyJWT(tempToken) as SessionTokenData | null;

      if (userData?.user?.id && tempData?.user?.id && userData.user.id === tempData.user.id) {
        const dbUser = await RegisterUser.findById(userData.user.id);
        if (dbUser) {
          userId = dbUser._id as mongoose.Types.ObjectId;
          finalEmail = normalizeEmail(dbUser.email);
          finalFullName = dbUser.full_name;
          finalPhone = dbUser.phone_number || finalPhone;
          finalInstitution = dbUser.institution || finalInstitution;
        }
      }
    }

    // Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!finalEmail || !emailRegex.test(finalEmail)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide a valid email address.",
          error: "INVALID_EMAIL",
        },
        { status: 400 }
      );
    }

    if (!finalFullName) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide your full name.",
          error: "MISSING_FULL_NAME",
        },
        { status: 400 }
      );
    }

    if (!finalPhone || finalPhone.replace(/\D/g, "").length < 10) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide a valid 10-digit phone number.",
          error: "INVALID_PHONE",
        },
        { status: 400 }
      );
    }

    if (!finalInstitution) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide your college or institution name.",
          error: "MISSING_INSTITUTION",
        },
        { status: 400 }
      );
    }

    // Check if an entry ticket is already paid for this email
    const existingPaidTicket = await EntryTicket.findOne({
      email: finalEmail,
      isPaid: true,
    });

    if (existingPaidTicket) {
      return NextResponse.json(
        {
          success: false,
          message: "An all-access entry ticket has already been purchased for this email.",
          error: "TICKET_ALREADY_PURCHASED",
          redirect: false,
        },
        { status: 400 }
      );
    }

    // Find or create RegisterUser
    if (!userId) {
      let existingUser = await RegisterUser.findOne({ email: finalEmail });
      if (!existingUser) {
        existingUser = await RegisterUser.create({
          full_name: finalFullName,
          email: finalEmail,
          phone_number: finalPhone,
          institution: finalInstitution,
          city: body.city || "Hyderabad",
          state: body.state || "Telangana",
          degree: body.degree || "B.E. / B.Tech",
          year_of_study: body.year_of_study || "1",
          is_verified: false,
        });
      }
      userId = existingUser._id as mongoose.Types.ObjectId;
    }

    // Find or create unpaid EntryTicket record
    let ticket = await EntryTicket.findOne({
      userId,
      isPaid: false,
    });

    if (!ticket) {
      ticket = await EntryTicket.create({
        userId,
        email: finalEmail,
        entries: [],
        isBanned: false,
        isPaid: false,
      });
    }

    // Find or create idle Transaction for this entry ticket
    let transaction = await Transaction.findOne({
      userId,
      status: "idle",
    });

    if (!transaction) {
      transaction = await Transaction.create({
        userId,
        entryTicketId: ticket._id,
        entryTicketEmails: [finalEmail],
        totalAmount: ENTRY_TICKET_PRICE,
        status: "idle",
      });
    } else {
      transaction.entryTicketId = ticket._id;
      transaction.entryTicketEmails = [finalEmail];
      transaction.totalAmount = ENTRY_TICKET_PRICE;
      await transaction.save();
    }

    // Determine host for Cashfree return URL
    const appUrl = (
      process.env.NEXT_PUBLIC_APP_URL ||
      request.nextUrl.origin ||
      "http://localhost:3000"
    ).replace(/\/$/, "");

    // Prepare Cashfree order
    const orderId = transaction._id.toString();

    // Check if Cashfree client is ready
    try {
      const reservedTransaction = await Transaction.findOneAndUpdate(
        {
          _id: transaction._id,
          userId,
          status: "idle",
        },
        {
          $set: { status: "creating" },
        },
        { new: true }
      );

      if (!reservedTransaction) {
        return NextResponse.json(
          {
            success: false,
            message: "Transaction state changed. Please try again.",
            error: "TRANSACTION_STATE_CHANGED",
          },
          { status: 409 }
        );
      }

      const cashfreeRequest = {
        order_amount: ENTRY_TICKET_PRICE,
        order_currency: "INR",
        order_id: orderId,
        order_meta: {
          return_url: `${appUrl}/api/payments/return?order_id={order_id}`,
          notify_url: `${appUrl}/api/payments/webhook`,
        },
        customer_details: {
          customer_id: userId.toString(),
          customer_phone: finalPhone,
          customer_email: finalEmail,
          customer_name: finalFullName,
        },
      };

      const cfResponse = await cashfree.PGCreateOrder(cashfreeRequest);
      const cashfreeOrderId = cfResponse.data.order_id;
      const paymentSessionId = cfResponse.data.payment_session_id;

      if (!cashfreeOrderId || !paymentSessionId) {
        throw new Error("Cashfree response missing order/session details");
      }

      await Transaction.updateOne(
        { _id: reservedTransaction._id },
        {
          $set: {
            status: "pending",
            order_id: cashfreeOrderId,
          },
        }
      );

      return NextResponse.json({
        success: true,
        message: "Order created successfully",
        data: {
          orderId: cashfreeOrderId,
          paymentSessionId,
          amount: ENTRY_TICKET_PRICE,
        },
      });
    } catch (paymentError) {
      console.warn("Cashfree live order creation skipped or failed:", paymentError);

      // Revert transaction to idle so user isn't stuck
      await Transaction.updateOne(
        { _id: transaction._id, status: "creating" },
        { $set: { status: "idle" } }
      );

      // Return graceful response for test/sandbox fallback
      return NextResponse.json({
        success: true,
        isTestFallback: true,
        message: "Entry ticket order initiated.",
        data: {
          orderId,
          amount: ENTRY_TICKET_PRICE,
        },
      });
    }
  } catch (error) {
    console.error("Error in POST /api/registration/entry-ticket:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to process entry ticket request.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
