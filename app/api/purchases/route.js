import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {

  const { searchParams } = new URL(req.url);

  const bill_no = searchParams.get("bill_no") || "";
  const vendor = searchParams.get("vendor") || "";
  const product = searchParams.get("product") || "";
  const date = searchParams.get("date") || "";

  let sql = `
    SELECT 

        p.id AS purchase_id,
        p.bill_no,
        p.purchase_date,
        p.grand_total,
        p.payment_status,
        p.notes,

        v.name AS vendor_name,

        pr.name AS product_name,
        pi.unit_value,
        pi.unit,
        pi.batch_no,
        pi.quantity,
        pi.rate,
        pi.tax_percent,
        pi.total

    FROM purchases p

    LEFT JOIN vendors v
        ON p.vendor_id = v.id

    LEFT JOIN purchase_items pi
        ON p.id = pi.purchase_id

    LEFT JOIN products pr
        ON pi.product_id = pr.id

    WHERE 1=1
`;

  const params = [];

  // BILL NO
  if (bill_no) {
    sql += ` AND p.bill_no LIKE ?`;
    params.push(`%${bill_no}%`);
  }

  // VENDOR
  if (vendor) {
    sql += ` AND v.name LIKE ?`;
    params.push(`%${vendor}%`);
  }

  // PRODUCT
  if (product) {
    sql += ` AND pr.name LIKE ?`;
    params.push(`%${product}%`);
  }

  // DATE
  if (date) {
    sql += ` AND DATE(p.purchase_date) = ?`;
    params.push(date);
  }

  sql += ` ORDER BY p.id DESC`;

  const [rows] = await db.query(sql, params);

  return NextResponse.json(rows);
}