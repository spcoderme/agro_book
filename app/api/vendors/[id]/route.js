import db from "@/lib/db";
import { NextResponse } from "next/server";

// CREATE
export async function POST(req) {

    try {

        const data = await req.json();

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
            VALUES (?, ?, ?, ?)
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

        console.log(err);

        return NextResponse.json(
            { error: "Failed to create vendor" },
            { status: 500 }
        );
    }
}

// GET SINGLE
export async function GET(req, context) {

    try {

        const { id } = await context.params;

        const [rows] = await db.query(
            `
            SELECT *
            FROM vendors
            WHERE id = ?
            `,
            [id]
        );

        if (rows.length === 0) {

            return NextResponse.json(
                { error: "Vendor not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(rows[0]);

    } catch (err) {

        console.log(err);

        return NextResponse.json(
            { error: "Failed" },
            { status: 500 }
        );
    }
}

// UPDATE
export async function PUT(req, context) {

    try {

        const { id } = await context.params;

        const data = await req.json();

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
                name = ?,
                mobile = ?,
                address = ?,
                gst_no = ?
            WHERE id = ?
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

        console.log(err);

        return NextResponse.json(
            { error: "Update failed" },
            { status: 500 }
        );
    }
}

// DELETE
export async function DELETE(req, context) {

    try {

        const { id } = await context.params;

        await db.query(
            `
            DELETE FROM vendors
            WHERE id = ?
            `,
            [id]
        );

        return NextResponse.json({
            success: true
        });

    } catch (err) {

        console.log(err);

        return NextResponse.json(
            { error: "Delete failed" },
            { status: 500 }
        );
    }
}