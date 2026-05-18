import db from "../../../lib/db";
import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

// ================= GET DISPATCHES =================
export async function GET(req) {

    try {

        const { searchParams } =
            new URL(req.url);

        const sell_bill_no =
            searchParams.get("sell_bill_no") || "";

        const driver_name =
            searchParams.get("driver_name") || "";

        const product =
            searchParams.get("product") || "";

        const dispatch_date =
            searchParams.get("dispatch_date") || "";

        let query = `
            SELECT
                d.id,
                d.sell_bill_no,
                d.dispatch_date,
                d.driver_name,
                d.bill_photo,
                d.created_at,

                di.quantity,

                p.name AS product_name,
                p.unit_value,

                u.short_name AS unit_name

            FROM dispatches d

            LEFT JOIN dispatch_items di
                ON d.id = di.dispatch_id

            LEFT JOIN products p
                ON di.product_id = p.id

            LEFT JOIN units u
                ON p.unit_id = u.id

            WHERE 1=1
        `;

        const values = [];

        // ================= BILL FILTER =================
        if (sell_bill_no) {

            query += `
                AND d.sell_bill_no ILIKE $${values.length + 1}
            `;

            values.push(`%${sell_bill_no}%`);
        }

        // ================= DRIVER FILTER =================
        if (driver_name) {

            query += `
                AND d.driver_name ILIKE $${values.length + 1}
            `;

            values.push(`%${driver_name}%`);
        }

        // ================= PRODUCT FILTER =================
        if (product) {

            query += `
                AND p.name ILIKE $${values.length + 1}
            `;

            values.push(`%${product}%`);
        }

        // ================= DATE FILTER =================
        if (dispatch_date) {

            query += `
                AND DATE(d.dispatch_date) = $${values.length + 1}
            `;

            values.push(dispatch_date);
        }

        query += `
            ORDER BY d.id DESC
        `;

        const result =
            await db.query(query, values);

        return NextResponse.json(
            result.rows
        );

    } catch (err) {

        console.log(
            "GET DISPATCH ERROR:",
            err
        );

        return NextResponse.json(
            {
                success: false,
                error: err.message
            },
            {
                status: 500
            }
        );
    }
}

// ================= SAVE DISPATCH =================
export async function POST(req) {

    try {

        const formData =
            await req.formData();

        const sell_bill_no =
            formData.get("sell_bill_no");

        const dispatch_date =
            formData.get("dispatch_date");

        const driver_name =
            formData.get("driver_name");

        const bill_photo =
            formData.get("bill_photo");

        const items =
            JSON.parse(
                formData.get("items")
            );

        // ================= VALIDATION =================
        if (!dispatch_date) {

            return NextResponse.json(
                {
                    success: false,
                    error:
                        "Dispatch date required"
                },
                {
                    status: 400
                }
            );
        }

        if (
            !items ||
            !Array.isArray(items) ||
            items.length === 0
        ) {

            return NextResponse.json(
                {
                    success: false,
                    error:
                        "Add minimum 1 product"
                },
                {
                    status: 400
                }
            );
        }

        // ================= CLOUDINARY UPLOAD =================
        let uploadedImage = "";

        if (
            bill_photo &&
            typeof bill_photo === "object"
        ) {

            const bytes =
                await bill_photo.arrayBuffer();

            const buffer =
                Buffer.from(bytes);

            const base64 =
                `data:${bill_photo.type};base64,${buffer.toString("base64")}`;

            const uploadRes =
                await cloudinary.uploader.upload(
                    base64,
                    {
                        folder:
                            "agro_dispatch_bills"
                    }
                );

            uploadedImage =
                uploadRes.secure_url;
        }

        // ================= INSERT DISPATCH =================
        const dispatchResult =
            await db.query(
                `
                INSERT INTO dispatches
                (
                    sell_bill_no,
                    dispatch_date,
                    driver_name,
                    bill_photo
                )
                VALUES
                (
                    $1,
                    $2,
                    $3,
                    $4
                )
                RETURNING id
                `,
                [
                    sell_bill_no || null,
                    dispatch_date,
                    driver_name || null,
                    uploadedImage
                ]
            );

        const dispatch_id =
            dispatchResult.rows[0].id;

        // ================= INSERT ITEMS =================
        for (const item of items) {

            const quantity =
                Number(item.quantity) || 0;

            // SKIP EMPTY
            if (
                !item.product_id ||
                quantity <= 0
            ) {
                continue;
            }

            // ================= CHECK STOCK =================
            const stockResult =
                await db.query(
                    `
                    SELECT stock
                    FROM products
                    WHERE id = $1
                    `,
                    [item.product_id]
                );

            if (
                stockResult.rows.length === 0
            ) {

                return NextResponse.json(
                    {
                        success: false,
                        error:
                            "Product not found"
                    },
                    {
                        status: 404
                    }
                );
            }

            const currentStock =
                Number(
                    stockResult.rows[0].stock
                ) || 0;

            if (
                quantity > currentStock
            ) {

                return NextResponse.json(
                    {
                        success: false,
                        error:
                            `${item.product_name} stock exceeded`
                    },
                    {
                        status: 400
                    }
                );
            }

            // ================= SAVE ITEM =================
            await db.query(
                `
                INSERT INTO dispatch_items
                (
                    dispatch_id,
                    product_id,
                    quantity
                )
                VALUES
                (
                    $1,
                    $2,
                    $3
                )
                `,
                [
                    dispatch_id,
                    item.product_id,
                    quantity
                ]
            );

            // ================= UPDATE STOCK =================
            await db.query(
                `
                UPDATE products
                SET stock = stock - $1
                WHERE id = $2
                `,
                [
                    quantity,
                    item.product_id
                ]
            );
        }

        return NextResponse.json({
            success: true,
            message:
                "Dispatch saved successfully"
        });

    } catch (err) {

        console.log(
            "SAVE DISPATCH ERROR:",
            err
        );

        return NextResponse.json(
            {
                success: false,
                error:
                    err.message ||
                    "Dispatch failed"
            },
            {
                status: 500
            }
        );
    }
}