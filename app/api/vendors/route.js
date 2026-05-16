import db from "@/lib/db";
import { NextResponse } from "next/server";

// ================= GET VENDORS =================
export async function GET(req) {

    try {

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

        // ================= SEARCH =================
        if (search) {

            params.push(
                `%${search}%`,
                `%${search}%`,
                `%${search}%`
            );

            sql += `
                AND (
                    name ILIKE $1
                    OR mobile ILIKE $2
                    OR gst_no ILIKE $3
                )
            `;
        }

        sql += `
            ORDER BY id DESC
        `;

        const result =
            await db.query(sql, params);

        return NextResponse.json(
            result.rows
        );

    } catch (err) {

        console.log(
            "GET VENDORS ERROR:",
            err
        );

        return NextResponse.json(
            {
                error:
                    "Failed to fetch vendors"
            },
            {
                status: 500
            }
        );
    }
}