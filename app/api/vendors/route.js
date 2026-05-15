import db from "@/lib/db";
import { NextResponse } from "next/server";

// GET
export async function GET(req) {

    const { searchParams } =
        new URL(req.url);

    const search =
        searchParams.get("search") || "";

    let sql = `
        SELECT *
        FROM vendors
        WHERE 1=1
    `;

    const params = [];

    if (search) {

        sql += `
            AND (
                name LIKE ?
                OR mobile LIKE ?
                OR gst_no LIKE ?
            )
        `;

        params.push(
            `%${search}%`,
            `%${search}%`,
            `%${search}%`
        );
    }

    sql += `
        ORDER BY id DESC
    `;

    const [rows] =
        await db.query(sql, params);

    return NextResponse.json(rows);
}