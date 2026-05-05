import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const [rows] = await db.execute(`
    SELECT st.*, p.name as product_name 
    FROM stock_transactions st
    JOIN products p ON st.product_id = p.id
    ORDER BY st.id DESC
  `);

  return NextResponse.json(rows);
}
