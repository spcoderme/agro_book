import db from "@/lib/db";
import { NextResponse } from "next/server";

// ================= GET SINGLE PURCHASE =================
export async function GET(req, { params }) {

    try {

        const { id } = params;

        // PURCHASE HEADER
        const purchaseResult = await db.query(
            `
            SELECT
                p.id,
                p.bill_no,
                p.dc_no,
                p.vendor_id,

                TO_CHAR(
                    p.purchase_date,
                    'YYYY-MM-DD'
                ) AS purchase_date,

                p.hamali,
                p.grand_total,
                p.payment_status,
                p.notes,
                p.created_at,

                v.name AS vendor_name

            FROM purchases p

            LEFT JOIN vendors v
                ON v.id = p.vendor_id

            WHERE p.id = $1
            `,
            [id]
        );

        const purchaseRows =
            purchaseResult.rows;

        if (purchaseRows.length === 0) {

            return NextResponse.json(
                { error: "Purchase not found" },
                { status: 404 }
            );
        }

        // PURCHASE ITEMS
        const itemResult = await db.query(
            `
            SELECT
                pi.*,
                pr.name AS product_name

            FROM purchase_items pi

            LEFT JOIN products pr
                ON pi.product_id = pr.id

            WHERE pi.purchase_id = $1
            `,
            [id]
        );

        return NextResponse.json({
            purchase: purchaseRows[0],
            items: itemResult.rows
        });

    } catch (err) {

        console.log(
            "GET PURCHASE ERROR:",
            err
        );

        return NextResponse.json(
            { error: "Failed to fetch purchase" },
            { status: 500 }
        );
    }
}


// ================= UPDATE PURCHASE =================
export async function PUT(req, { params }) {

    try {

        const { id } = params;

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

        // UPDATE PURCHASE
        await db.query(
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
                summary.total,
                payment_status,
                notes,
                id
            ]
        );

        // DELETE OLD ITEMS
        await db.query(
            `
            DELETE FROM purchase_items
            WHERE purchase_id = $1
            `,
            [id]
        );

        // INSERT NEW ITEMS
        for (let item of items) {

            const qty =
                Number(item.quantity) || 0;

            const rate =
                Number(item.rate) || 0;

            const tax =
                Number(item.tax_percent) || 0;

            const base = qty * rate;

            const cgst =
                (base * tax) / 200;

            const sgst =
                (base * tax) / 200;

            const total =
                base + cgst + sgst;

            await db.query(
                `
                INSERT INTO purchase_items
                (
                    purchase_id,
                    product_id,
                    company_name,
                    unit_value,
                    unit,
                    batch_no,
                    quantity,
                    rate,
                    tax_percent,
                    cgst,
                    sgst,
                    total
                )
                VALUES
                (
                    $1,$2,$3,$4,$5,$6,
                    $7,$8,$9,$10,$11,$12
                )
                `,
                [
                    id,
                    item.product_id,
                    item.company_name || null,
                    item.unit_value || 0,
                    item.unit || "",
                    item.batch_no || "",
                    qty,
                    rate,
                    tax,
                    cgst,
                    sgst,
                    total
                ]
            );
        }

        return NextResponse.json({
            success: true
        });

    } catch (err) {

        console.log(
            "UPDATE ERROR:",
            err
        );

        return NextResponse.json(
            { error: "Failed to update purchase" },
            { status: 500 }
        );
    }
}