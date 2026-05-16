import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {

    try {

        const { searchParams } =
            new URL(req.url);

        const bill_no =
            searchParams.get("bill_no") || "";

        const vendor =
            searchParams.get("vendor") || "";

        const product =
            searchParams.get("product") || "";

        const date =
            searchParams.get("date") || "";

       let sql = `
SELECT 
    p.id AS purchase_id,
    p.bill_no,
    TO_CHAR(p.purchase_date, 'YYYY-MM-DD') AS purchase_date,
    p.grand_total,
    p.payment_status,
    p.notes,
    v.name AS vendor_name,
    pr.name AS product_name,
    pr.unit_value,
    pi.batch_no,
    pi.quantity,
    pi.rate,
    pi.total
FROM purchases p
LEFT JOIN vendors v ON p.vendor_id = v.id
LEFT JOIN purchase_items pi ON p.id = pi.purchase_id
LEFT JOIN products pr ON pi.product_id = pr.id
WHERE 1=1
`;

        const params = [];

        // ================= BILL NO =================
        if (bill_no) {
    params.push(`%${bill_no}%`);
    sql += ` AND p.bill_no ILIKE $${params.length}`;
}

        // ================= VENDOR =================
        if (vendor) {
    params.push(`%${vendor}%`);
    sql += ` AND v.name ILIKE $${params.length}`;
}

        // ================= PRODUCT =================
        if (product) {
    params.push(`%${product}%`);
    sql += ` AND pr.name ILIKE $${params.length}`;
}

        // ================= DATE =================
        if (date) {
    params.push(date);
    sql += ` AND p.purchase_date = $${params.length}`;
}

        sql += ` ORDER BY p.id DESC`;

        const result =
            await db.query(sql, params);

        return NextResponse.json(
            result.rows
        );

    } catch (err) {

        console.log(
            "PURCHASE FETCH ERROR:",
            err
        );

        return NextResponse.json(
            {
                error:
                    "Failed to fetch purchases",
                details: err.message
            },
            {
                status: 500
            }
        );
    }
}