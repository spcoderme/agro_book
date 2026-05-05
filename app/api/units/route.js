import db from "../../../lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const [rows] = await db.query("SELECT * FROM units");
  return NextResponse.json(rows);
}