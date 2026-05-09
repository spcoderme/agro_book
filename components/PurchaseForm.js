"use client";

import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import dynamic from "next/dynamic";

import "react-datepicker/dist/react-datepicker.css";

const Select = dynamic(
    () => import("react-select"),
    { ssr: false }
);

export default function PurchaseForm() {
    const [products, setProducts] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [units, setUnits] = useState([]);

    const [form, setForm] = useState({
        bill_no: "",
        dc_no: "",
        purchase_date: new Date(),
        vendor_id: "",
        vendor_name: "",
        hamali: 0,
        payment_status: "pending"
    });

    const [items, setItems] = useState([
        {
            product_id: "",
            batch_no: "",
            unit_id: "",
            unit: "",
            unit_value: "",
            qty: "",
            rate: "",
            tax: 5
        }
    ]);

    useEffect(() => {
        fetch("/api/products").then(res => res.json()).then(setProducts);
        fetch("/api/vendors").then(res => res.json()).then(setVendors);
        fetch("/api/units").then(res => res.json()).then(setUnits);
    }, []);

    const updateItem = (i, key, value) => {
        const updated = [...items];
        updated[i][key] = value;
        setItems(updated);
    };

    const addRow = () => {
        setItems([
            ...items,
            {
                product_id: "",
                batch_no: "",
                unit_id: "",
                unit: "",
                unit_value: "",
                qty: "",
                rate: "",
                tax: 5
            }
        ]);
    };

    // ================= GST CALC =================
    const calcSummary = () => {
        let taxable = 0, cgst = 0, sgst = 0;

        items.forEach(item => {
            const qty = Number(item.qty) || 0;
            const rate = Number(item.rate) || 0;
            const tax = Number(item.tax) || 0;

            const base = qty * rate;

            taxable += base;

            const half = (base * tax) / 200;
            cgst += half;
            sgst += half;
        });

        const hamali = Number(form.hamali) || 0;

        const subTotal = taxable + cgst + sgst;
        const total = subTotal + hamali;

        const roundedTotal = Math.round(total);
        const roundOff = roundedTotal - total;

        return {
            taxable,
            cgst,
            sgst,
            hamali,
            subTotal,
            total,
            roundOff,
            grandTotal: roundedTotal
        };
    };

    const summary = calcSummary();

    // ================= SUBMIT =================
    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("Submitting Items:", items); // 🔥 DEBUG

        await fetch("/api/purchase", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ...form,

                purchase_date:
                    form.purchase_date
                        ?.toISOString()
                        ?.split("T")[0],

                items,
                summary
            })
        });

        alert("Purchase Saved ✅");
    };

    return (
        <form onSubmit={handleSubmit}>

            {/* HEADER */}
            <div className="grid grid-cols-4 gap-4 mb-4">
                <input className="input" placeholder="Bill No"
                    onChange={e => setForm({ ...form, bill_no: e.target.value })}
                />
                <input className="input" placeholder="DC No"
                    onChange={e => setForm({ ...form, dc_no: e.target.value })}
                />


                <div className="relative">

                    <input
                        className="input w-full"
                        placeholder="Search Vendor"
                        value={form.vendor_name}
                        onChange={(e) => {

                            setForm({
                                ...form,
                                vendor_name: e.target.value,
                                vendor_id: ""
                            });

                        }}
                    />

                    {
                        form.vendor_name &&
                        vendors.filter(v =>
                            v.name
                                .toLowerCase()
                                .includes(
                                    form.vendor_name.toLowerCase()
                                )
                        ).length > 0 && (

                            <div className="absolute z-50 bg-white border w-full max-h-52 overflow-y-auto rounded shadow">

                                {
                                    vendors
                                        .filter(v =>
                                            v.name
                                                .toLowerCase()
                                                .includes(
                                                    form.vendor_name.toLowerCase()
                                                )
                                        )
                                        .map(v => (

                                            <div
                                                key={v.id}
                                                className="p-2 hover:bg-gray-100 cursor-pointer border-b"
                                                onClick={() => {

                                                    setForm({
                                                        ...form,
                                                        vendor_id: v.id,
                                                        vendor_name: v.name
                                                    });

                                                }}
                                            >

                                                <div className="font-medium">
                                                    {v.name}
                                                </div>

                                                <div className="text-xs text-gray-500">
                                                    {v.mobile}
                                                </div>

                                            </div>

                                        ))
                                }

                            </div>
                        )
                    }



                </div>
                <DatePicker
  selected={form.purchase_date}
  onChange={(date) =>
    setForm({
      ...form,
      purchase_date: date
    })
  }
  dateFormat="dd/MM/yyyy"
  className="input w-full"
  placeholderText="Select Date"
/>

            </div>

            {/* ITEMS */}
            <table className="w-auto border border-separate text-sm">
                <thead className="bg-gray-200 text-dark">
                    <tr>
                        <th>Product</th>
                        <th>Stocks</th>

                        <th>Batch</th>
                        <th>Qty</th>
                        <th>Rate</th>
                        <th>Tax %</th>
                        <th>Total</th>
                    </tr>
                </thead>

                <tbody>
                    {items.map((item, i) => {
                        const base = item.qty * item.rate || 0;
                        const tax = (base * item.tax) / 100;

                        return (
                            <tr key={i} className="border-b hover:bg-gray-100 transition-colors duration-200">

                                <td>

    <Select
        placeholder="Search Product..."
        value={
            item.product_id
                ? {
                    value: item.product_id,
                    label: `${item.product_name} (${parseFloat(item.unit_value || 0)}${item.unit || ""})`
                }
                : null
        }
        options={products.map(p => ({
            value: p.id,
            label:
                `${p.name} ` +
                `(${parseFloat(p.unit_value)}${p.unit_name}) ` +
                `[Stock: ${parseFloat(p.stock || 0)}]`,
            product: p
        }))}
        onChange={(selectedOption) => {

            if (!selectedOption) return;

            const selected = selectedOption.product;

            setItems(prev => {

                const updated = [...prev];

                updated[i] = {
                    ...updated[i],
                    product_id: selected.id,
                    product_name: selected.name,
                    unit_value: selected.unit_value,
                    unit: selected.unit_name,
                    stock: selected.stock
                };

                return updated;
            });
        }}
        isSearchable
        className="min-w-[350px]"
    />

</td>

                                <td>
                                    <div className="text-xs text-gray-600">
                                        {item.product_name || "-"} {parseFloat(item.unit_value || 0)} {item.unit || ""} •
                                        Stock: <span className="text-red-600">{parseFloat(item.stock || 0)} qty</span>
                                    </div>
                                </td>





                                <td>
                                    <input className="input"
                                        placeholder="Batch"
                                        onChange={e => updateItem(i, "batch_no", e.target.value)}
                                    />
                                </td>





                                <td>
                                    <input type="number" className="input"

                                        min="0"
                                        onChange={e => updateItem(i, "qty", e.target.value)}
                                    />
                                </td>

                                <td>
                                    <input type="number" className="input"
                                        step="0.01"
                                        min="0"
                                        onChange={e => updateItem(i, "rate", e.target.value)}
                                    />
                                </td>

                                <td>
                                    <input type="number" className="input"
                                        step="0.01"
                                        min="0"
                                        value={item.tax}
                                        onChange={e => updateItem(i, "tax", e.target.value)}
                                    />
                                </td>

                                <td className="font-semibold text-sm">
                                    <span className="font-light">{(base).toFixed(2)} + {(tax).toFixed(2)}</span> = <span className="text-green-900">({(base + tax).toFixed(2)})</span>
                                </td>

                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <button type="button" onClick={addRow}
                className="mt-1 bg-gray-300 hover:bg-gray-700 text-dark hover:text-white px-3 py-1 rounded">
                + Add Product Row
            </button>

            {/* TAX SUMMARY */}
            <div className="mt-6 bg-white rounded shadow">

                <div className="grid grid-cols-2">

                    <table className="text-sm text-center border-separate border border-gray-400">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="border border-gray-400">Taxable</th>
                                <th className="border border-gray-400">CGST</th>
                                <th className="border border-gray-400">SGST</th>
                                <th className="border border-gray-400">Total Tax</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr className="hover:bg-gray-100 transition-colors duration-200">
                                <td className="border border-gray-400">{summary.taxable.toFixed(2)}</td>
                                <td className="border border-gray-400">{summary.cgst.toFixed(2)}</td>
                                <td className="border border-gray-400">{summary.sgst.toFixed(2)}</td>
                                <td className="border border-gray-400">{(summary.cgst + summary.sgst).toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>

                    <div className="text-right space-y-1">

                        <div>Sub Total: ₹ {summary.taxable.toFixed(2)}</div>
                        <div>CGST: ₹ {summary.cgst.toFixed(2)}</div>
                        <div>SGST: ₹ {summary.sgst.toFixed(2)}</div>

                        <div className="grid grid-cols-3 gap-4 text-gray-700">
                            <span className="col-start-2 pt-2">Freight (&#128666;)</span>
                            <input
                                type="number"
                                className="input col-start-3"
                                step="0.01"
                                min="0"
                                value={form.hamali}
                                onChange={e => setForm({ ...form, hamali: Number(e.target.value) })}
                            />
                        </div>

                        <div><b>Total: ₹ {summary.total.toFixed(2)}</b></div>

                        <div>Round off Amount: ₹ {summary.roundOff.toFixed(2)}</div>

                        <div className="text-2xl font-bold">
                            Grand Total: ₹ {summary.grandTotal.toFixed(2)}
                        </div>

                    </div>
                    <div className="flex items-center gap-5 mt-2">

                        <label className="flex items-center gap-2">

                            <input
                                type="radio"
                                value="paid"
                                checked={form.payment_status === "paid"}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        payment_status: e.target.value
                                    })
                                }
                            />

                            Paid

                        </label>

                        <label className="flex items-center gap-2">

                            <input
                                type="radio"
                                value="pending"
                                checked={form.payment_status === "pending"}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        payment_status: e.target.value
                                    })
                                }
                            />

                            Pending

                        </label>

                    </div>

                </div>

            </div>

            <button className="mt-4 bg-gray-200 hover:bg-gray-700 text-dark hover:text-white px-5 py-2 rounded">
                Save Purchase
            </button>

        </form>
    );
}