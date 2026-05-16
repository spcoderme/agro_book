import db from "@/lib/db";
import { NextResponse } from "next/server";

// ================= GET STOCK TRANSACTIONS =================
export async function GET() {

    try {

        const result =
            await db.query(`
                SELECT
                    st.*,
                    p.name AS product_name
                FROM stock_transactions st
                JOIN products p
                    ON st.product_id = p.id
                ORDER BY st.id DESC
            `);

        return NextResponse.json(
            result.rows
        );

    } catch (err) {

        console.log(
            "STOCK TRANSACTION ERROR:",
            err
        );

        return NextResponse.json(
            {
                error:
                    "Failed to fetch stock transactions"
            },
            {
                status: 500
            }
        );
    }
}