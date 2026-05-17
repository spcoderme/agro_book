import db from "@/lib/db";
import { NextResponse } from "next/server";


// ================= CREATE =================
export async function POST(req) {

    try {

        const body = await req.json();

        const {
            name,
            mobile,
            address,
            gst_no
        } = body;

        if (!name?.trim()) {

            return NextResponse.json(
                {
                    error: "Vendor name is required"
                },
                {
                    status: 400
                }
            );
        }

        const result = await db.query(
            `
            INSERT INTO vendors
            (
                name,
                mobile,
                address,
                gst_no
            )
            VALUES ($1, $2, $3, $4)
            RETURNING *
            `,
            [
                name.trim(),
                mobile || "",
                address || "",
                gst_no || ""
            ]
        );

        return NextResponse.json({
            success: true,
            vendor: result.rows[0]
        });

    } catch (err) {

        console.log(
            "CREATE VENDOR ERROR:",
            err
        );

        return NextResponse.json(
            {
                error: "Failed to create vendor"
            },
            {
                status: 500
            }
        );
    }
}


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