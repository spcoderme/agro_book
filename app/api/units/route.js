import db from "../../../lib/db";
import { NextResponse } from "next/server";

export async function GET() {

    try {

        const result = await db.query(
            "SELECT * FROM units ORDER BY id DESC"
        );

        return NextResponse.json(
            result.rows
        );

    } catch (err) {

        console.log("UNITS ERROR:", err);

        return NextResponse.json(
            {
                error: "Failed to fetch units"
            },
            {
                status: 500
            }
        );
    }
}