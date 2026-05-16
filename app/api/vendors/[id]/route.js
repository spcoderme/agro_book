import db from "@/lib/db";
import { NextResponse } from "next/server";

// ================= CREATE =================
export async function POST(req) {

    try {

        const data =
            await req.json();

        const {
            name,
            mobile,
            address,
            gst_no
        } = data;

        await db.query(
            `
            INSERT INTO vendors
            (
                name,
                mobile,
                address,
                gst_no
            )
            VALUES ($1, $2, $3, $4)
            `,
            [
                name,
                mobile,
                address,
                gst_no
            ]
        );

        return NextResponse.json({
            success: true
        });

    } catch (err) {

        console.log(
            "CREATE VENDOR ERROR:",
            err
        );

        return NextResponse.json(
            {
                error:
                    "Failed to create vendor"
            },
            {
                status: 500
            }
        );
    }
}

// ================= GET SINGLE =================
export async function GET(req, { params }) {

    try {

        const { id } = params;

        const result =
            await db.query(
                `
                SELECT *
                FROM vendors
                WHERE id = $1
                `,
                [id]
            );

        if (
            result.rows.length === 0
        ) {

            return NextResponse.json(
                {
                    error:
                        "Vendor not found"
                },
                {
                    status: 404
                }
            );
        }

        return NextResponse.json(
            result.rows[0]
        );

    } catch (err) {

        console.log(
            "GET VENDOR ERROR:",
            err
        );

        return NextResponse.json(
            {
                error: "Failed"
            },
            {
                status: 500
            }
        );
    }
}

// ================= UPDATE =================
export async function PUT(req, { params }) {

    try {

        const { id } = params;

        const data =
            await req.json();

        const {
            name,
            mobile,
            address,
            gst_no
        } = data;

        await db.query(
            `
            UPDATE vendors
            SET
                name = $1,
                mobile = $2,
                address = $3,
                gst_no = $4
            WHERE id = $5
            `,
            [
                name,
                mobile,
                address,
                gst_no,
                id
            ]
        );

        return NextResponse.json({
            success: true
        });

    } catch (err) {

        console.log(
            "UPDATE VENDOR ERROR:",
            err
        );

        return NextResponse.json(
            {
                error:
                    "Update failed"
            },
            {
                status: 500
            }
        );
    }
}

// ================= DELETE =================
export async function DELETE(req, { params }) {

    try {

        const { id } = params;

        await db.query(
            `
            DELETE FROM vendors
            WHERE id = $1
            `,
            [id]
        );

        return NextResponse.json({
            success: true
        });

    } catch (err) {

        console.log(
            "DELETE VENDOR ERROR:",
            err
        );

        return NextResponse.json(
            {
                error:
                    "Delete failed"
            },
            {
                status: 500
            }
        );
    }
}