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
      vendor_name, // for new vendor support
      payment_status,
      items,
      summary
    } = data;

    // ✅ 1. HANDLE VENDOR (existing OR new)
    let finalVendorId = vendor_id;

    if (!vendor_id && vendor_name) {
      const [existing] = await db.execute(
        "SELECT id FROM vendors WHERE name = ?",
        [vendor_name]
      );

      if (existing.length > 0) {
        finalVendorId = existing[0].id;
      } else {
        const [newVendor] = await db.execute(
          "INSERT INTO vendors (name) VALUES (?)",
          [vendor_name]
        );
        finalVendorId = newVendor.insertId;
      }
    }

    // ❌ if still no vendor → stop
    if (!finalVendorId) {
      return NextResponse.json({ error: "Vendor required" });
    }

    // ✅ 2. INSERT PURCHASE (use rounded total)
    const [res] = await db.execute(
      `INSERT INTO purchases 
      (bill_no, dc_no, vendor_id, purchase_date, grand_total, hamali, payment_status)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        bill_no || null,
        dc_no || null,
        finalVendorId,
        purchase_date || null,
        summary.grandTotal || 0,   // ✅ FIXED
        summary.hamali || 0,
        payment_status
      ]
    );

    const purchaseId = res.insertId;

    // ✅ 3. LOOP ITEMS SAFELY
    for (let item of items) {

      // skip empty rows
      if (!item.product_id) continue;

      const product_id = item.product_id ?? null;
      const batch_no = item.batch_no ?? null;
      const unit = item.unit ?? null;
     const qty = item.qty ? Number(item.qty) : 0;
const rate = item.rate ? Number(item.rate) : 0;
const tax = item.tax ? Number(item.tax) : 0;

const base = qty * rate;
const cgst = (base * tax) / 200;
const sgst = (base * tax) / 200;
const total = base + cgst + sgst;

await db.execute(
  `INSERT INTO purchase_items 
  (purchase_id, product_id, company_name, unit_value, unit, batch_no, quantity, rate, tax_percent, cgst, sgst, total)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  [
    purchaseId,
    item.product_id ?? null,
    item.company_name ?? null,
    item.unit_value ?? 0,
    item.unit ?? null,
    item.batch_no ?? null,
    qty,
    rate,
    tax,
    cgst,
    sgst,
    total
  ]
);

      // update stock only if valid
      if (product_id && qty > 0) {
        await db.execute(
          `UPDATE products SET stock = stock + ? WHERE id = ?`,
          [qty, product_id]
        );
      }
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("PURCHASE ERROR:", err);
    return NextResponse.json({ error: "Failed" });
  }
}