import { db } from "@/db";
import { employeeRequest } from "@/db/schema";
import { desc } from "drizzle-orm";
import {NextResponse } from "next/server";

export async function GET() {
  try {
    const requests = await db
      .select()
      .from(employeeRequest)
      .orderBy(desc(employeeRequest.startDate));

    return NextResponse.json(requests);
  } catch (error) {
    console.error("Error fetching holiday requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch requests" },
    );
  }
}

