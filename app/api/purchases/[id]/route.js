import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {

    const { id } = await params;

    try {

        const purchaseResult = await db.query(
            `
            SELECT
                p.id,
                p.bill_no,
                p.dc_no,
                p.vendor_id,
                TO_CHAR(p.purchase_date, 'YYYY-MM-DD') AS purchase_date,
                p.hamali,
                p.grand_total,
                p.payment_status,
                p.notes,
                p.created_at,
                v.name AS vendor_name
            FROM purchases p
            LEFT JOIN vendors v ON v.id = p.vendor_id
            WHERE p.id = $1
            `,
            [id]
        );

        const itemResult = await db.query(
            `
            SELECT
                pi.id,
                pi.purchase_id,
                pi.product_id,
                pr.name AS product_name,
                pr.unit_value,
                pi.batch_no,
                pi.quantity,
                pi.rate,
                pi.total
            FROM purchase_items pi
            LEFT JOIN products pr ON pr.id = pi.product_id
            WHERE pi.purchase_id = $1
            `,
            [id]
        );

        if (purchaseResult.rows.length === 0) {
            return Response.json(
                { error: "Purchase not found" },
                { status: 404 }
            );
        }

        return Response.json({
            purchase: purchaseResult.rows[0],
            items: itemResult.rows
        });

    } catch (err) {

        console.log("GET PURCHASE ERROR:", err);

        return Response.json(
            { error: "Failed to fetch purchase" },
            { status: 500 }
        );
    }
}

export async function PUT(req, { params }) {

    const { id } = await params;

    const client = await db.connect();

    try {
        await client.query("BEGIN");

        const data = await req.json();

        const {
            bill_no,
            dc_no,
            purchase_date,
            vendor_id,
            hamali,
            payment_status,
            notes,
            items,
            summary
        } = data;

        // ================= UPDATE PURCHASE =================
        await client.query(
            `
            UPDATE purchases
            SET
                bill_no = $1,
                dc_no = $2,
                vendor_id = $3,
                purchase_date = $4,
                hamali = $5,
                grand_total = $6,
                payment_status = $7,
                notes = $8
            WHERE id = $9
            `,
            [
                bill_no,
                dc_no,
                vendor_id,
                purchase_date,
                hamali,
                summary?.total || 0,
                payment_status,
                notes,
                id
            ]
        );

        // ================= DELETE OLD ITEMS =================
        await client.query(
            `
            DELETE FROM purchase_items
            WHERE purchase_id = $1
            `,
            [id]
        );

        // ================= INSERT ITEMS =================
        for (let item of items) {

            const qty = Number(item.quantity) || 0;
            const rate = Number(item.rate) || 0;
            const total = qty * rate;

            await client.query(
                `
                INSERT INTO purchase_items
                (
                    purchase_id,
                    product_id,
                    batch_no,
                    quantity,
                    rate,
                    total
                )
                VALUES ($1,$2,$3,$4,$5,$6)
                `,
                [
                    id,
                    item.product_id,
                    item.batch_no || "",
                    qty,
                    rate,
                    total
                ]
            );
        }

        await client.query("COMMIT");

        return Response.json({
            success: true,
            message: "Purchase updated successfully"
        });

    } catch (err) {

        await client.query("ROLLBACK");

        console.log("UPDATE ERROR:", err);

        return Response.json(
            { error: "Failed to update purchase" },
            { status: 500 }
        );

    } finally {
        client.release();
    }
}