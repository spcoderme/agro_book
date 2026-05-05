import db from "../../../lib/db";
import { NextResponse } from "next/server";

// GET products
export async function GET() {
  const [rows] = await db.query(`
    SELECT p.*, c.name AS category, u.short_name AS unit
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN units u ON p.unit_id = u.id
    ORDER BY p.id DESC
  `);

  return NextResponse.json(rows);
}

// ADD product
export async function POST(req) {
  const { name, category_id, unit_id, unit_value, stock } = await req.json();

  await db.query(
    `INSERT INTO products (name, category_id, unit_id, unit_value, stock)
     VALUES (?, ?, ?, ?, ?)`,
    [name, category_id, unit_id, unit_value, stock]
  );

  return NextResponse.json({ message: "Product added" });
}