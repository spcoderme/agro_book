"use client";
import { useState, useEffect } from "react";

export default function PurchaseForm() {
    const [products, setProducts] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [units, setUnits] = useState([]);

    const [form, setForm] = useState({
        bill_no: "",
        dc_no: "",
        purchase_date: "",
        vendor_id: "",
        hamali: 0
    });

    const [items, setItems] = useState([
        {
            product_id: "",
            batch_no: "",
            unit_id: "",
            unit_value: "",
            qty: "",
            rate: "",
            tax: 5
        }
    ]);

    useEffect(() => {
        fetch("/api/products").then(res => res.json()).then(setProducts);
        fetch("/api/vendors").then(res => res.json()).then(setVendors);
        fetch("/api/units").then(res => res.json()).then(setUnits); // 👈 NEW
    }, []);

    const updateItem = (i, key, value) => {
        const updated = [...items];
        updated[i][key] = value;
        setItems(updated);
    };

    const addRow = () => {
        setItems([...items, {
            product_id: "",
            batch_no: "",
            unit: "",
            qty: "",
            rate: "",
            tax: 5
        }]);
    };

    // GST Calculation
    const calcSummary = () => {
        let taxable = 0, cgst = 0, sgst = 0;

        items.forEach(item => {
            const base = item.qty * item.rate || 0;
            const tax = item.tax || 0;

            taxable += base;

            const half = (base * tax) / 200;
            cgst += half;
            sgst += half;
        });

        const total = taxable + cgst + sgst;

        const roundedTotal = Math.round(total);
        const roundOff = roundedTotal - total;

        return {
            taxable,
            cgst,
            sgst,
            total,
            roundOff,
            grandTotal: roundedTotal
        };
    };

    const summary = calcSummary();

    const handleSubmit = async (e) => {
        e.preventDefault();

        await fetch("/api/purchase", {
            method: "POST",
            body: JSON.stringify({
                ...form,
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
                <input type="date" className="input"
                    onChange={e => setForm({ ...form, purchase_date: e.target.value })}
                />
                <div className="relative">
                    <input
                        className="input"
                        placeholder="Search or Enter Vendor"
                        value={form.vendor_name || ""}
                        onChange={(e) => {
                            setForm({ ...form, vendor_name: e.target.value });
                        }}
                    />

                    {/* Suggestions */}
                    {form.vendor_name && (
                        <div className="absolute bg-white border w-full z-10 max-h-40 overflow-y-auto">
                            {vendors
                                .filter(v =>
                                    v.name.toLowerCase().includes(form.vendor_name.toLowerCase())
                                )
                                .map(v => (
                                    <div
                                        key={v.id}
                                        className="p-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() =>
                                            setForm({
                                                ...form,
                                                vendor_id: v.id,
                                                vendor_name: v.name
                                            })
                                        }
                                    >
                                        {v.name}
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
            </div>

            {/* ITEMS */}
            <table className="w-auto border border-separate text-sm">
                <thead className="bg-gray-200 text-dark">
                    <tr>
                        <th>Product</th>
                        <th>Unit Value</th>
                        <th>Unit</th>
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
                                    <select className="input"
                                        onChange={e => updateItem(i, "product_id", e.target.value)}
                                    >
                                        <option>Select</option>
                                        {products.map(p => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                    </select>
                                </td>

                                {/* UNIT VALUE */}
                                <td>
                                    <input className="input"
                                        placeholder="e.g. 50 (for 50kg)"
                                        onChange={e => updateItem(i, "unit_value", e.target.value)}
                                    />
                                </td>

                                {/* UNIT SELECT */}
                                <td>
                                    <select className="input"
                                        onChange={e => updateItem(i, "unit_id", e.target.value)}
                                    >
                                        <option>Select Unit</option>
                                        {units.map(u => (
                                            <option key={u.id} value={u.id}>
                                                {u.name} ({u.short_name})
                                            </option>
                                        ))}
                                    </select>
                                </td>



                                <td>
                                    <input className="input"
                                        placeholder="Batch"
                                        onChange={e => updateItem(i, "batch_no", e.target.value)}
                                    />
                                </td>





                                <td>
                                    <input type="number" className="input"
                                        onChange={e => updateItem(i, "qty", e.target.value)}
                                    />
                                </td>

                                <td>
                                    <input type="number" className="input"
                                        onChange={e => updateItem(i, "rate", e.target.value)}
                                    />
                                </td>

                                <td>
                                    <input type="number" className="input"
                                        value={item.tax}
                                        onChange={e => updateItem(i, "tax", e.target.value)}
                                    />
                                </td>

                                <td className="font-semibold">
                                    <span className="font-light">{(base).toFixed(2)} + {(tax).toFixed(2)}</span> = ({(base + tax).toFixed(2)})
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

                        {/* Round Off */}
                        <div className="text-gray-700">
                            <b>Total: ₹ {summary.total.toFixed(2)}</b>
                        </div>
                        <div className="text-gray-700">
                            Round off Amount: ₹ {summary.roundOff.toFixed(2)}
                        </div>

                        {/* Grand Total */}
                        <div className="text-2xl font-bold text-black-600">
                            Grand Total: ₹ {summary.grandTotal.toFixed(2)}
                        </div>

                    </div>

                </div>

            </div>

            <button className="mt-4 bg-gray-200 hover:bg-gray-700 text-dark hover:text-white px-5 py-2 rounded">
                Save Purchase
            </button>

        </form>
    );
}