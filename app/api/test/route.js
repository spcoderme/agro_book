import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {

    try {

        const result = await db.query(
            "SELECT NOW()"
        );

        return NextResponse.json({
            success: true,
            time: result.rows[0]
        });

    } catch (err) {

        console.log(err);

        return NextResponse.json({
            success: false,
            error: err.message
        });
    }
}