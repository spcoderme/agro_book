import db from "../../../lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const [rows] = await db.query("SELECT 1 + 1 AS result");
  return NextResponse.json(rows);
}