import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {

    try {

        const data = await req.json();

        const {
            bill_no,
            dc_no,
            purchase_date,
            vendor_id,
            vendor_name,
            payment_status,
            notes,
            items,
            summary
        } = data;

        // ================= HANDLE VENDOR =================
        let finalVendorId = vendor_id;

        // NEW VENDOR AUTO CREATE
        if (!vendor_id && vendor_name) {

            const existing =
                await db.query(
                    `
                    SELECT id
                    FROM vendors
                    WHERE name = $1
                    `,
                    [vendor_name]
                );

            if (
                existing.rows.length > 0
            ) {

                finalVendorId =
                    existing.rows[0].id;

            } else {

                const newVendor =
                    await db.query(
                        `
                        INSERT INTO vendors
                        (name)
                        VALUES ($1)
                        RETURNING id
                        `,
                        [vendor_name]
                    );

                finalVendorId =
                    newVendor.rows[0].id;
            }
        }

        // NO VENDOR
        if (!finalVendorId) {

            return NextResponse.json(
                {
                    error: "Vendor required"
                },
                {
                    status: 400
                }
            );
        }

        // ================= INSERT PURCHASE =================
        const purchaseResult =
            await db.query(
                `
                INSERT INTO purchases
                (
                    bill_no,
                    dc_no,
                    vendor_id,
                    purchase_date,
                    grand_total,
                    hamali,
                    payment_status,
                    notes
                )
                VALUES
                (
                    $1, $2, $3, $4,
                    $5, $6, $7, $8
                )
                RETURNING id
                `,
                [
                    bill_no || null,
                    dc_no || null,
                    finalVendorId,
                    purchase_date || null,
                    summary.grandTotal || 0,
                    summary.hamali || 0,
                    payment_status || "pending",
                    notes || null
                ]
            );

        const purchaseId =
            purchaseResult.rows[0].id;

        // ================= INSERT ITEMS =================
        for (const item of items) {

            // SKIP EMPTY ROW
            if (!item.product_id)
                continue;

            const qty =
                item.qty
                    ? Number(item.qty)
                    : 0;

            const rate =
                item.rate
                    ? Number(item.rate)
                    : 0;

            const tax =
                item.tax
                    ? Number(item.tax)
                    : 0;

            const base =
                qty * rate;

            const cgst =
                (base * tax) / 200;

            const sgst =
                (base * tax) / 200;

            const total =
                base + cgst + sgst;

            // INSERT ITEM
            await db.query(
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
    $1,
    $2,
    $3,
    $4,
    $5,
    $6,
    $7,
    $8,
    $9,
    $10,
    $11
)
                `,
                [
    purchaseId,
    item.product_id,
    Number(item.unit_value || 0),
    item.unit || null,
    item.batch_no || null,
    qty,
    rate,
    tax,
    cgst,
    sgst,
    total
]
            );

            // ================= UPDATE STOCK =================
            if (
                item.product_id &&
                qty > 0
            ) {

                await db.query(
                    `
                    UPDATE products
                    SET stock = stock + $1
                    WHERE id = $2
                    `,
                    [
                        qty,
                        item.product_id
                    ]
                );
            }
        }

        return NextResponse.json({
            success: true
        });

    } catch (err) {

        console.error(
            "PURCHASE ERROR:",
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