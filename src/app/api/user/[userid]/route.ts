import { db } from "@/db";
import { employeeRequest, UsersTable } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  userid: string;
};

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
        status: "pending"
      })
      .returning();

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
