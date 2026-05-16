import db from "../../../lib/db";
import { NextResponse } from "next/server";

// ================= STOCK ENTRY =================
export async function POST(req) {

    try {

        const {
            product_id,
            type,
            quantity,
            note
        } = await req.json();

        // ================= INSERT TRANSACTION =================
        await db.query(
            `
            INSERT INTO stock_transactions
            (
                product_id,
                type,
                quantity,
                note
            )
            VALUES ($1, $2, $3, $4)
            `,
            [
                product_id,
                type,
                quantity,
                note
            ]
        );

        // ================= UPDATE PRODUCT STOCK =================
        if (type === "IN") {

            await db.query(
                `
                UPDATE products
                SET stock = stock + $1
                WHERE id = $2
                `,
                [
                    quantity,
                    product_id
                ]
            );

        } else {

            await db.query(
                `
                UPDATE products
                SET stock = stock - $1
                WHERE id = $2
                `,
                [
                    quantity,
                    product_id
                ]
            );
        }

        return NextResponse.json({
            success: true
        });

    } catch (err) {

        console.error(
            "STOCK UPDATE ERROR:",
            err
        );

        return NextResponse.json(
            {
                error:
                    "Error processing stock"
            },
            {
                status: 500
            }
        );
    }
}