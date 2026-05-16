import db from "../../../lib/db";
import { NextResponse } from "next/server";

export async function GET() {

    try {

        const result = await db.query(
            "SELECT * FROM categories"
        );

        return NextResponse.json(
            result.rows
        );

    } catch (err) {

        console.log(err);

        return NextResponse.json(
            {
                error: "Database Error"
            },
            {
                status: 500
            }
        );
    }
}