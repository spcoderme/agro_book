import db from "@/lib/db";
import { NextResponse } from "next/server";



// ================= GET SINGLE =================
export async function GET(req, context) {

    try {

        const { id } = await context.params;

        if (!id) {

            return NextResponse.json(
                {
                    error: "Vendor ID required"
                },
                {
                    status: 400
                }
            );
        }

        const result = await db.query(
            `
            SELECT
                id,
                name,
                mobile,
                address,
                gst_no
            FROM vendors
            WHERE id = $1
            `,
            [id]
        );

        if (result.rows.length === 0) {

            return NextResponse.json(
                {
                    error: "Vendor not found"
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
                error: "Failed to fetch vendor"
            },
            {
                status: 500
            }
        );
    }
}

// ================= UPDATE =================
export async function PUT(req, context) {

    try {

        const { id } = await context.params;

        const body = await req.json();

        const {
            name,
            mobile,
            address,
            gst_no
        } = body;

        // VALIDATION
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
            UPDATE vendors
            SET
                name = $1,
                mobile = $2,
                address = $3,
                gst_no = $4
            WHERE id = $5
            RETURNING *
            `,
            [
                name.trim(),
                mobile || "",
                address || "",
                gst_no || "",
                id
            ]
        );

        if (result.rowCount === 0) {

            return NextResponse.json(
                {
                    error: "Vendor not found"
                },
                {
                    status: 404
                }
            );
        }

        return NextResponse.json({
            success: true,
            vendor: result.rows[0]
        });

    } catch (err) {

        console.log(
            "UPDATE VENDOR ERROR:",
            err
        );

        return NextResponse.json(
            {
                error: "Failed to update vendor"
            },
            {
                status: 500
            }
        );
    }
}

// ================= DELETE =================
export async function DELETE(req, context) {

    try {

        const { id } = await context.params;

        const result = await db.query(
            `
            DELETE FROM vendors
            WHERE id = $1
            RETURNING id
            `,
            [id]
        );

        if (result.rowCount === 0) {

            return NextResponse.json(
                {
                    error: "Vendor not found"
                },
                {
                    status: 404
                }
            );
        }

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
                error: "Failed to delete vendor"
            },
            {
                status: 500
            }
        );
    }
}