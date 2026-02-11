import { db } from "@/db";
import { employeeRequest, UsersTable } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

type Params = {
  userid: string;
};

// Email sending function using Nodemailer
async function sendRequestEmail(requestData: {
  name: string;
  email: string;
  type: string;
  reason: string;
  startDate: string;
  endDate: string;
  status: string;
}) {
  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT || "587"),
    secure: process.env.MAIL_PORT === "465", // true for 465, false for other ports
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD, // Changed from MAIL_PASS to MAIL_PASSWORD
    },
  });

  // Email content
  const emailBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #555; }
        .value { color: #000; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>New Employee Request Submitted</h2>
        </div>
        <div class="content">
          <div class="field">
            <span class="label">Name:</span>
            <span class="value">${requestData.name}</span>
          </div>
          <div class="field">
            <span class="label">Email:</span>
            <span class="value">${requestData.email}</span>
          </div>
          <div class="field">
            <span class="label">Request Type:</span>
            <span class="value">${requestData.type}</span>
          </div>
          <div class="field">
            <span class="label">Reason:</span>
            <span class="value">${requestData.reason}</span>
          </div>
          <div class="field">
            <span class="label">Start Date:</span>
            <span class="value">${new Date(requestData.startDate).toLocaleDateString()}</span>
          </div>
          <div class="field">
            <span class="label">End Date:</span>
            <span class="value">${new Date(requestData.endDate).toLocaleDateString()}</span>
          </div>
          <div class="field">
            <span class="label">Status:</span>
            <span class="value">${requestData.status}</span>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  // Send email
  const info = await transporter.sendMail({
    from: `"Employee Portal" <${process.env.MAIL_USERNAME}>`, // Use MAIL_USERNAME as sender
    to: process.env.NEXT_MAIL_RECIPIENTS,
    subject: `New ${requestData.type} Request Submitted`,
    html: emailBody,
  });

  console.log("Email sent: %s", info.messageId);
  return info;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const { userid } = await params;
    const body = await request.json();
    const { name, email, type, reason, startDate, endDate } = body;

    if (!name || !email || !reason || !startDate || !endDate || !type) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      return NextResponse.json(
        { error: "End date must be after start date" },
        { status: 400 }
      );
    }

    const userExists = await db
      .select({ id: UsersTable.id })
      .from(UsersTable)
      .where(eq(UsersTable.id, userid))
      .limit(1);

    if (!userExists.length) {
      return NextResponse.json(
        { error: "User does not exist" },
        { status: 400 }
      );
    }

    const newRequest = await db
      .insert(employeeRequest)
      .values({
        userid,
        name,
        email,
        type,
        reason,
        startDate,
        endDate,
        status: "pending",
      })
      .returning();

    // Send email notification
    try {
      await sendRequestEmail({
        name,
        email,
        type,
        reason,
        startDate,
        endDate,
        status: "pending",
      });
      console.log("Email notification sent successfully");
    } catch (emailError) {
      console.error("Error sending email notification:", emailError);
      // Request is still created even if email fails
    }

    return NextResponse.json(newRequest[0], { status: 201 });
  } catch (error) {
    console.error("Error creating holiday request:", error);
    return NextResponse.json(
      { error: "Failed to create request" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const { userid } = await params;

    const requests = await db
      .select()
      .from(employeeRequest)
      .where(eq(employeeRequest.userid, userid))
      .orderBy(desc(employeeRequest.startDate));

    return NextResponse.json(requests);
  } catch (error) {
    console.error("Error fetching holiday requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch requests" },
      { status: 500 }
    );
  }
}