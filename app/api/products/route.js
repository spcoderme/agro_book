import db from "../../../lib/db";
import { NextResponse } from "next/server";

// ✅ GET products
export async function GET() {
  try {
    const [rows] = await db.query(`
      SELECT 
        p.id,
        p.name,
        p.category_id,
        p.unit_id,
        p.unit_value,
        p.stock,
        c.name AS category,
        u.short_name AS unit_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN units u ON p.unit_id = u.id
      ORDER BY p.id DESC
    `);

    return NextResponse.json(rows);

  } catch (err) {
    console.error("GET PRODUCTS ERROR:", err);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// ✅ ADD product
export async function POST(req) {
  try {
    const { name, category_id, unit_id, unit_value, stock } = await req.json();

    await db.query(
      `INSERT INTO products 
       (name, category_id, unit_id, unit_value, stock)
       VALUES (?, ?, ?, ?, ?)`,
      [
        name,
        category_id,
        unit_id,
        parseFloat(unit_value || 0),  // ✅ fix decimal
        parseFloat(stock || 0)        // ✅ fix stock
      ]
    );

    return NextResponse.json({ message: "Product added" });

  } catch (err) {
    console.error("ADD PRODUCT ERROR:", err);
    return NextResponse.json({ error: "Failed to add product" }, { status: 500 });
  }
}