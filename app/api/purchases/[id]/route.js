import db from "@/lib/db";
import { NextResponse } from "next/server";

// ================= GET SINGLE PURCHASE =================
export async function GET(req, { params }) {

    const { id } = await params;

    try {

        // ================= PURCHASE HEADER =================
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

        // ================= PURCHASE ITEMS =================
        const itemResult = await db.query(
            `
            SELECT
                pi.id,
                pi.purchase_id,
                pi.product_id,

                pr.name AS product_name,

                pi.unit_value,
                pi.unit,

                pi.batch_no,
                pi.quantity,
                pi.rate,

                pi.tax_percent,
                pi.cgst,
                pi.sgst,

                pi.total

            FROM purchase_items pi

            LEFT JOIN products pr
                ON pr.id = pi.product_id

            WHERE pi.purchase_id = $1

            ORDER BY pi.id ASC
            `,
            [id]
        );

        // ================= NOT FOUND =================
        if (purchaseResult.rows.length === 0) {

            return NextResponse.json(
                {
                    error: "Purchase not found"
                },
                {
                    status: 404
                }
            );
        }

        // ================= SUCCESS =================
        return NextResponse.json({
            purchase:
                purchaseResult.rows[0],

            items:
                itemResult.rows
        });

    } catch (err) {

        console.log(
            "GET PURCHASE ERROR:",
            err
        );

        return NextResponse.json(
            {
                error:
                    "Failed to fetch purchase",
                details:
                    err.message
            },
            {
                status: 500
            }
        );
    }
}


// ================= UPDATE PURCHASE =================
export async function PUT(req, { params }) {

    const { id } = await params;

    const client =
        await db.connect();

    try {

        await client.query("BEGIN");

        const data =
            await req.json();

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
                hamali || 0,
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

        // ================= INSERT NEW ITEMS =================
        for (const item of items) {

            const qty =
                Number(item.quantity) || 0;

            const rate =
                Number(item.rate) || 0;

            const tax =
                Number(item.tax_percent) || 0;

            const base =
                qty * rate;

            const cgst =
                (base * tax) / 200;

            const sgst =
                (base * tax) / 200;

            const total =
                base + cgst + sgst;

            await client.query(
                `
                INSERT INTO purchase_items
                (
                    purchase_id,
                    product_id,
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
                    $1,$2,$3,$4,$5,
                    $6,$7,$8,$9,$10,$11
                )
                `,
                [
                    id,
                    item.product_id,

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

        // ================= COMMIT =================
        await client.query("COMMIT");

        return NextResponse.json({
            success: true,
            message:
                "Purchase updated successfully"
        });

    } catch (err) {

        // ================= ROLLBACK =================
        await client.query("ROLLBACK");

        console.log(
            "UPDATE ERROR:",
            err
        );

        return NextResponse.json(
            {
                error:
                    "Failed to update purchase",
                details:
                    err.message
            },
            {
                status: 500
            }
        );

    } finally {

        client.release();
    }
}