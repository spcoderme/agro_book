"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

export default function PurchaseEditPage() {

    const params = useParams();
    const router = useRouter();

    const [products, setProducts] = useState([]);
    const [vendors, setVendors] = useState([]);

    const [loading, setLoading] = useState(true);

    const [form, setForm] = useState({
        bill_no: "",
        dc_no: "",
        purchase_date: "",
        vendor_id: "",
        hamali: 0,
        payment_status: "pending",
        notes: ""
    });

    const [items, setItems] = useState([]);

    // ================= LOAD DATA =================
    useEffect(() => {

        if (!params?.id) return;

        loadPurchase();

        fetch("/api/products")
            .then(res => res.json())
            .then(setProducts);

        fetch("/api/vendors")
            .then(res => res.json())
            .then(setVendors);

    }, [params?.id]);

    // ================= LOAD PURCHASE =================
    const loadPurchase = async () => {

        try {

            const res = await fetch(`/api/purchases/${params.id}`);

            const data = await res.json();

            if (!data.purchase) {

                alert("Purchase not found");

                return;
            }

            setForm({
                bill_no: data.purchase.bill_no || "",
                dc_no: data.purchase.dc_no || "",
                purchase_date:
                    data.purchase.purchase_date?.split("T")[0] || "",
                vendor_id: data.purchase.vendor_id || "",
                hamali: data.purchase.hamali || 0,
                payment_status:
                    data.purchase.payment_status || "pending",
                notes:
                    data.purchase.notes || ""
            });

            setItems(data.items || []);

            setLoading(false);

        } catch (err) {

            console.log(err);

            alert("Failed to load purchase");
        }
    };

    // ================= UPDATE ITEM =================
    const updateItem = (i, key, value) => {

        const updated = [...items];

        updated[i][key] = value;

        setItems(updated);
    };

    // ================= SUMMARY =================
    const calcSummary = () => {

        let taxable = 0;
        let cgst = 0;
        let sgst = 0;

        items.forEach(item => {

            const qty = Number(item.quantity) || 0;

            const rate = Number(item.rate) || 0;

            const tax = Number(item.tax_percent) || 0;

            const base = qty * rate;

            taxable += base;

            const half = (base * tax) / 200;

            cgst += half;

            sgst += half;
        });

        const hamali = Number(form.hamali) || 0;

        const total = taxable + cgst + sgst + hamali;

        return {
            taxable,
            cgst,
            sgst,
            total
        };
    };

    const summary = calcSummary();

    // ================= SUBMIT =================
    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const res = await fetch(
                `/api/purchases/${params.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        ...form,
                        items,
                        summary
                    })
                }
            );

            const data = await res.json();

            if (data.success) {

                alert("Purchase Updated ✅");

                router.push("/purchases");

            } else {

                alert(data.error || "Update failed");
            }

        } catch (err) {

            console.log(err);

            alert("Update failed");
        }
    };

    // ================= LOADING =================
    if (loading) {

        return (
            <div className="p-5">
                Loading...
            </div>
        );
    }

    // ================= UI =================
    return (
        <div className="p-5">

            <h1 className="text-2xl font-bold mb-5">
                Edit Purchase
            </h1>

            <form onSubmit={handleSubmit}>

                {/* HEADER */}
                <div className="grid grid-cols-4 gap-4 mb-5">

                    <input
                        className="input"
                        placeholder="Bill No"
                        value={form.bill_no}
                        onChange={e =>
                            setForm({
                                ...form,
                                bill_no: e.target.value
                            })
                        }
                    />

                    <input
                        className="input"
                        placeholder="DC No"
                        value={form.dc_no}
                        onChange={e =>
                            setForm({
                                ...form,
                                dc_no: e.target.value
                            })
                        }
                    />

                    <select
                        className="input"
                        value={form.vendor_id}
                        onChange={e =>
                            setForm({
                                ...form,
                                vendor_id: e.target.value
                            })
                        }
                    >
                        <option value="">
                            Select Vendor
                        </option>

                        {vendors.map(v => (
                            <option key={v.id} value={v.id}>
                                {v.name} - {v.mobile}
                            </option>
                        ))}
                    </select>

                    <DatePicker
                        selected={
                            form.purchase_date
                                ? new Date(
                                    form.purchase_date.split("-")[0],
                                    form.purchase_date.split("-")[1] - 1,
                                    form.purchase_date.split("-")[2]
                                )
                                : null
                        }
                        onChange={(date) => {

                            if (!date) return;

                            const year = date.getFullYear();

                            const month = String(
                                date.getMonth() + 1
                            ).padStart(2, "0");

                            const day = String(
                                date.getDate()
                            ).padStart(2, "0");

                            const formatted =
                                `${year}-${month}-${day}`;

                            setForm({
                                ...form,
                                purchase_date: formatted
                            });
                        }}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Select Date"
                        className="input w-full"
                    />

                    

                </div>

                {/* TABLE */}
                <div className="overflow-auto border rounded">

                    <table className="w-full border border-separate text-sm">

                        <thead className="bg-gray-200">

                            <tr>

                                <th className="border p-2">
                                    Product
                                </th>

                                <th className="border p-2">
                                    Batch
                                </th>

                                <th className="border p-2">
                                    Qty
                                </th>

                                <th className="border p-2">
                                    Rate
                                </th>

                                <th className="border p-2">
                                    Tax %
                                </th>

                                <th className="border p-2">
                                    CGST
                                </th>

                                <th className="border p-2">
                                    SGST
                                </th>

                                <th className="border p-2">
                                    Total
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {items.map((item, i) => {

                                const qty =
                                    Number(item.quantity) || 0;

                                const rate =
                                    Number(item.rate) || 0;

                                const tax =
                                    Number(item.tax_percent) || 0;

                                const base = qty * rate;

                                const cgst =
                                    (base * tax) / 200;

                                const sgst =
                                    (base * tax) / 200;

                                const total =
                                    base + cgst + sgst;

                                return (

                                    <tr
                                        key={i}
                                        className="hover:bg-gray-50"
                                    >

                                        {/* PRODUCT */}
                                        <td className="border p-2">

                                            <div className="font-medium">
                                                {item.product_name}
                                            </div>

                                            <div className="text-xs text-gray-500">
                                                {parseFloat(item.unit_value || 0)}
                                                {item.unit}
                                            </div>

                                        </td>

                                        {/* BATCH */}
                                        <td className="border p-2">

                                            <input
                                                className="input"
                                                value={item.batch_no || ""}
                                                onChange={e =>
                                                    updateItem(
                                                        i,
                                                        "batch_no",
                                                        e.target.value
                                                    )
                                                }
                                            />

                                        </td>

                                        {/* QTY */}
                                        <td className="border p-2">

                                            <input
                                                type="number"
                                                className="input"
                                                value={item.quantity}
                                                onChange={e =>
                                                    updateItem(
                                                        i,
                                                        "quantity",
                                                        e.target.value
                                                    )
                                                }
                                            />

                                        </td>

                                        {/* RATE */}
                                        <td className="border p-2">

                                            <input
                                                type="number"
                                                step="0.01"
                                                className="input"
                                                value={item.rate}
                                                onChange={e =>
                                                    updateItem(
                                                        i,
                                                        "rate",
                                                        e.target.value
                                                    )
                                                }
                                            />

                                        </td>

                                        {/* TAX */}
                                        <td className="border p-2">

                                            <input
                                                type="number"
                                                step="0.01"
                                                className="input"
                                                value={item.tax_percent}
                                                onChange={e =>
                                                    updateItem(
                                                        i,
                                                        "tax_percent",
                                                        e.target.value
                                                    )
                                                }
                                            />

                                        </td>

                                        {/* CGST */}
                                        <td className="border p-2 text-center">

                                            ₹ {cgst.toFixed(2)}

                                        </td>

                                        {/* SGST */}
                                        <td className="border p-2 text-center">

                                            ₹ {sgst.toFixed(2)}

                                        </td>

                                        {/* TOTAL */}
                                        <td className="border p-2 font-semibold">

                                            ₹ {total.toFixed(2)}

                                        </td>

                                    </tr>
                                );
                            })}

                        </tbody>

                    </table>

                </div>

                {/* SUMMARY */}
                <div className="mt-5 text-right space-y-2">

                    <div>
                        Taxable:
                        ₹ {summary.taxable.toFixed(2)}
                    </div>

                    <div>
                        CGST:
                        ₹ {summary.cgst.toFixed(2)}
                    </div>

                    <div>
                        SGST:
                        ₹ {summary.sgst.toFixed(2)}
                    </div>

                    <div className="flex justify-between items-start gap-5 mt-5">

                        {/* LEFT SIDE */}
                        <div className="space-y-4 w-full">

                            {/* PAYMENT STATUS */}
                            <div className="flex gap-5">

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

                            {/* NOTES */}
                            <div>

                                <textarea
                                    className="input w-full min-h-[100px]"
                                    placeholder="Purchase Notes..."
                                    value={form.notes || ""}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            notes: e.target.value
                                        })
                                    }
                                />

                            </div>

                        </div>

                        {/* RIGHT SIDE */}
                        <div className="flex items-center gap-3">

                            <span>Freight</span>

                            <input
                                type="number"
                                className="input w-40"
                                value={form.hamali}
                                onChange={e =>
                                    setForm({
                                        ...form,
                                        hamali: e.target.value
                                    })
                                }
                            />

                        </div>

                    </div>

                    <div className="text-2xl font-bold">

                        Grand Total:
                        ₹ {summary.total.toFixed(2)}

                    </div>

                </div>

                {/* BUTTON */}
                <button
                    type="submit"
                    className="mt-5 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded"
                >
                    Update Purchase
                </button>

            </form>

        </div>
    );
}