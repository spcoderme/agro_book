import db from "@/lib/db";
import { NextResponse } from "next/server";

// GET ALL VENDORS
export async function GET() {
  try {

    const [rows] = await db.query(`
      SELECT 
        id,
        name,
        mobile,
        address,
        created_at
      FROM vendors
      ORDER BY name ASC
    `);

    return NextResponse.json(rows);

  } catch (err) {

    console.log("VENDOR FETCH ERROR:", err);

    return NextResponse.json(
      { error: "Failed to fetch vendors" },
      { status: 500 }
    );
  }
}