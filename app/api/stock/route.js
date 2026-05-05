import db from "../../../lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { product_id, type, quantity, note } = await req.json();

    // Insert transaction
    await db.execute(
      "INSERT INTO stock_transactions (product_id, type, quantity, note) VALUES (?, ?, ?, ?)",
      [product_id, type, quantity, note]
    );

    // Update product stock
    if (type === "IN") {
      await db.execute(
        "UPDATE products SET stock = stock + ? WHERE id = ?",
        [quantity, product_id]
      );
    } else {
      await db.execute(
        "UPDATE products SET stock = stock - ? WHERE id = ?",
        [quantity, product_id]
      );
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error processing stock" });
  }
}