"use client";

import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import dynamic from "next/dynamic";
import Link from "next/link";

import "react-datepicker/dist/react-datepicker.css";

const Select = dynamic(
    () => import("react-select"),
    { ssr: false }
);

export default function PurchaseForm() {

    const [mounted, setMounted] =
        useState(false);

    const [products, setProducts] =
        useState([]);

    const [vendors, setVendors] =
        useState([]);

    const [units, setUnits] =
        useState([]);

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
            product_name: "",
            batch_no: "",
            unit_id: "",
            unit: "",
            unit_value: "",
            stock: 0,
            qty: "",
            rate: "",
            tax: 5
        }
    ]);

    // ================= HYDRATION FIX =================
    useEffect(() => {

        setMounted(true);

        fetch("/api/products")
            .then(res => res.json())
            .then(data => setProducts(Array.isArray(data) ? data : []));

        fetch("/api/vendors")
            .then(res => res.json())
            .then(data => setVendors(Array.isArray(data) ? data : []));

        fetch("/api/units")
            .then(res => res.json())
            .then(data => setUnits(Array.isArray(data) ? data : []));

    }, []);

    if (!mounted) return null;

    // ================= UPDATE ITEM =================
    const updateItem = (i, key, value) => {

        const updated = [...items];

        updated[i][key] = value;

        setItems(updated);
    };

    // ================= ADD ROW =================
    const addRow = () => {

        setItems([
            ...items,
            {
                product_id: "",
                product_name: "",
                batch_no: "",
                unit_id: "",
                unit: "",
                unit_value: "",
                stock: 0,
                qty: "",
                rate: "",
                tax: 5
            }
        ]);
    };

    // ================= REMOVE ROW =================
    const removeRow = (index) => {

        const updated =
            items.filter((_, i) => i !== index);

        setItems(updated);
    };

    // ================= GST CALC =================
    const calcSummary = () => {

        let taxable = 0;
        let cgst = 0;
        let sgst = 0;

        items.forEach(item => {

            const qty =
                Number(item.qty) || 0;

            const rate =
                Number(item.rate) || 0;

            const tax =
                Number(item.tax) || 0;

            const base =
                qty * rate;

            taxable += base;

            const half =
                (base * tax) / 200;

            cgst += half;
            sgst += half;
        });

        const hamali =
            Number(form.hamali) || 0;

        const subTotal =
            taxable + cgst + sgst;

        const total =
            subTotal + hamali;

        const roundedTotal =
            Math.round(total);

        const roundOff =
            roundedTotal - total;

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

    const summary =
        calcSummary();

    // ================= SUBMIT =================
    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const res = await fetch(
                "/api/purchase",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
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
                }
            );

            const data =
                await res.json();

            if (!res.ok) {

                alert(
                    data.error || "Failed"
                );

                return;
            }

            alert("Purchase Saved ✅");

        } catch (err) {

            console.log(err);

            alert("Something went wrong");
        }
    };

    return (

        <div className="w-full px-2 sm:px-4 md:px-6 py-4 max-w-[100vw] overflow-x-hidden">

            {/* HEADER */}
            <div className="
    flex
    flex-col
    lg:flex-row
    lg:items-center
    lg:justify-between
    gap-4
    mb-5
">

                <div>

                    <h1 className="
                        text-2xl
                        font-bold
                        text-gray-800
                    ">
                        🧾 Purchase Entry
                    </h1>

                    <p className="
                        text-sm
                        text-gray-500
                    ">
                        Create purchase invoice
                    </p>

                </div>

                <Link
                    href="/dashboard"
                    className="
                        bg-gray-700
                        hover:bg-black
                        text-white
                        px-4
                        py-2
                        rounded-xl
                        text-sm
                        w-fit
                    "
                >
                    ← Dashboard
                </Link>

            </div>

            <form onSubmit={handleSubmit}>

                {/* HEADER FORM */}
                <div className="
    grid
    grid-cols-1
    sm:grid-cols-2
    xl:grid-cols-4
    gap-3
    mb-5
">

                    {/* BILL */}
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

                    {/* DC */}
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

                    

                    {/* DATE */}
                    <div className="relative z-30">

                        <DatePicker
    selected={form.purchase_date}
    onChange={(date) =>
        setForm({
            ...form,
            purchase_date: date
        })
    }
    dateFormat="dd/MM/yyyy"
    placeholderText="Select Date"
    popperPlacement="bottom-start"
    portalId="root"
    popperClassName="z-[99999]"
    className="input w-full"
/>

                    </div>

                    {/* VENDOR */}
                    <div className="relative z-20">

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

                                <div className="
                                    absolute
                                    top-full
                                    left-0
                                    z-50
                                    bg-white
                                    border
                                    w-full
                                    max-h-52
                                    overflow-y-auto
                                    rounded-xl
                                    shadow-lg
                                ">

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
                                                    className="
                                                        p-3
                                                        hover:bg-gray-100
                                                        cursor-pointer
                                                        border-b
                                                    "
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

                                                    <div className="
                                                        text-xs
                                                        text-gray-500
                                                    ">
                                                        {v.mobile}
                                                    </div>

                                                </div>

                                            ))
                                    }

                                </div>
                            )
                        }

                    </div>

                </div>

                {/* TABLE */}
                <div className="
    w-full
    overflow-x-auto
    rounded-2xl
    border
    bg-white
    shadow-sm
">

                    <table className="
    min-w-[950px]
    w-full
    text-xs
    sm:text-sm
">

                        <thead className="bg-gray-100">

                            <tr>

                                <th className="border p-3 text-left">
                                    Product
                                </th>

                                <th className="border p-3 text-left">
                                    Stocks
                                </th>

                                <th className="border p-3 text-left">
                                    Batch
                                </th>

                                <th className="border p-3 text-center">
                                    Qty
                                </th>

                                <th className="border p-3 text-center">
                                    Rate
                                </th>

                                <th className="border p-3 text-center">
                                    Tax %
                                </th>

                                <th className="border p-3 text-center">
                                    Total
                                </th>

                                <th className="border p-3 text-center">
                                    Action
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {
                                items.map((item, i) => {

                                    const base =
                                        (item.qty * item.rate) || 0;

                                    const tax =
                                        (base * item.tax) / 100;

                                    return (

                                        <tr
                                            key={i}
                                            className="
                                                hover:bg-gray-50
                                            "
                                        >

                                            {/* PRODUCT */}
                                            <td className="border p-2">

                                                <Select

                                                    placeholder="Search Product..."

                                                    value={
                                                        item.product_id
                                                            ? {
                                                                value: item.product_id,
                                                                label:
                                                                    `${item.product_name} (${parseFloat(item.unit_value || 0)}${item.unit || ""})`
                                                            }
                                                            : null
                                                    }

                                                    options={
                                                        products.map(p => ({
                                                            value: p.id,

                                                            label:
                                                                `${p.name} ` +
                                                                `(${parseFloat(p.unit_value)}${p.unit_name}) ` +
                                                                `[Stock: ${parseFloat(p.stock || 0)}]`,

                                                            product: p
                                                        }))
                                                    }

                                                    onChange={(selectedOption) => {

                                                        if (!selectedOption) return;

                                                        const selected =
                                                            selectedOption.product;

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

                                                    menuPortalTarget={
                                                        typeof window !== "undefined"
                                                            ? document.body
                                                            : null
                                                    }

                                                    menuPosition="fixed"

                                                    styles={{
                                                        menuPortal: base => ({
                                                            ...base,
                                                            zIndex: 9999
                                                        })
                                                    }}

                                                    className="min-w-[220px] sm:min-w-[280px]"
                                                />

                                            </td>

                                            {/* STOCK */}
                                            <td className="border p-2">

                                                <div className="
                                                    text-xs
                                                    text-gray-700
                                                ">

                                                    <span className="font-medium">
                                                        {item.product_name || "-"}
                                                    </span>

                                                    <br />

                                                    {parseFloat(item.unit_value || 0)}
                                                    {" "}
                                                    {item.unit || ""}

                                                    <br />

                                                    <span className="
                                                        text-red-600
                                                        font-semibold
                                                    ">
                                                        Stock:
                                                        {" "}
                                                        {parseFloat(item.stock || 0)}
                                                    </span>

                                                </div>

                                            </td>

                                            {/* BATCH */}
                                            <td className="border p-2">

                                                <input
                                                    className="input"
                                                    placeholder="Batch"

                                                    value={item.batch_no}

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

                                                    min="0"

                                                    value={item.qty}

                                                    onChange={e =>
                                                        updateItem(
                                                            i,
                                                            "qty",
                                                            e.target.value
                                                        )
                                                    }
                                                />

                                            </td>

                                            {/* RATE */}
                                            <td className="border p-2">

                                                <input
                                                    type="number"
                                                    className="input"

                                                    step="0.01"
                                                    min="0"

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
                                                    className="input"

                                                    step="0.01"
                                                    min="0"

                                                    value={item.tax}

                                                    onChange={e =>
                                                        updateItem(
                                                            i,
                                                            "tax",
                                                            e.target.value
                                                        )
                                                    }
                                                />

                                            </td>

                                            {/* TOTAL */}
                                            <td className="
                                                border
                                                p-2
                                                font-semibold
                                                text-sm
                                            ">

                                                <div className="
                                                    whitespace-nowrap
                                                ">

                                                    <span className="font-light">
                                                        {base.toFixed(2)}
                                                        {" + "}
                                                        {tax.toFixed(2)}
                                                    </span>

                                                    {" = "}

                                                    <span className="
                                                        text-green-800
                                                        font-bold
                                                    ">
                                                        ₹ {(base + tax).toFixed(2)}
                                                    </span>

                                                </div>

                                            </td>

                                            {/* ACTION */}
                                            <td className="
                                                border
                                                p-2
                                                text-center
                                            ">

                                                <button
                                                    type="button"

                                                    onClick={() =>
                                                        removeRow(i)
                                                    }

                                                    className="
                                                        bg-red-500
                                                        hover:bg-red-600
                                                        text-white
                                                        px-3
                                                        py-2
                                                        rounded-lg
                                                        text-xs
                                                    "
                                                >
                                                    Remove
                                                </button>

                                            </td>

                                        </tr>
                                    );
                                })
                            }

                        </tbody>

                    </table>

                </div>

                {/* ADD ROW */}
                <button
                    type="button"

                    onClick={addRow}

                    className="
    mt-3
    w-full
    sm:w-auto
    bg-gray-300
    hover:bg-gray-700
    hover:text-white
    px-4
    py-3
    rounded-xl
    font-medium
    transition
"
                >
                    + Add Product Row
                </button>

                {/* SUMMARY */}
                <div className="
    flex
    flex-col
    xl:grid
    xl:grid-cols-1
    gap-6                                                                                                                   
    mt-4    
">

                    <div className="
                        grid
                        grid-cols-1
                        lg:grid-cols-2
                        gap-4                                                                                                                                                               
                    ">

                        {/* TAX TABLE */}
                        <div className="overflow-x-auto">

                            <table className="
                                w-full
                                text-sm
                                border
                            ">

                                <thead className="bg-gray-100">

                                    <tr>

                                        <th className="border p-2">
                                            Taxable
                                        </th>

                                        <th className="border p-2">
                                            CGST
                                        </th>

                                        <th className="border p-2">
                                            SGST
                                        </th>

                                        <th className="border p-2">
                                            Total Tax
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    <tr>

                                        <td className="border p-2 text-center">
                                            {summary.taxable.toFixed(2)}
                                        </td>

                                        <td className="border p-2 text-center">
                                            {summary.cgst.toFixed(2)}
                                        </td>

                                        <td className="border p-2 text-center">
                                            {summary.sgst.toFixed(2)}
                                        </td>

                                        <td className="border p-2 text-center">
                                            {(summary.cgst + summary.sgst).toFixed(2)}
                                        </td>

                                    </tr>

                                </tbody>

                            </table>

                        </div>

                        {/* TOTAL */}
                        <div className="
    text-right
    sm:text-right
    space-y-2           
">

                            <div>
                                Sub Total:
                                {" "}
                                ₹ {summary.taxable.toFixed(2)}
                            </div>

                            <div>
                                CGST:
                                {" "}
                                ₹ {summary.cgst.toFixed(2)}
                            </div>

                            <div>
                                SGST:
                                {" "}
                                ₹ {summary.sgst.toFixed(2)}
                            </div>

                            {/* FREIGHT */}
                            <div className="
                                flex
                                flex-col
                                sm:flex-row
                                justify-end
                                items-start
                                sm:items-center
                                gap-3
                            ">

                                <span>
                                    Freight (🚚)
                                </span>

                                <input
                                    type="number"

                                    className="
                                        input
                                        w-full
                                        sm:w-40
                                    "

                                    step="0.01"

                                    min="0"

                                    value={form.hamali}

                                    onChange={e =>
                                        setForm({
                                            ...form,
                                            hamali: Number(e.target.value)
                                        })
                                    }
                                />

                            </div>

                            <div className="font-semibold">
                                Total:
                                {" "}
                                ₹ {summary.total.toFixed(2)}
                            </div>

                            <div>
                                Round Off:
                                {" "}
                                ₹ {summary.roundOff.toFixed(2)}
                            </div>

                            <div className="
                                text-2xl
                                font-bold
                                text-green-700
                            ">
                                Grand Total:
                                {" "}
                                ₹ {summary.grandTotal.toFixed(2)}
                            </div>

                            {/* PAYMENT */}
                            <div className="
                                flex
                                flex-wrap
                                justify-end
                                gap-5
                                pt-3
                            ">

                                <label className="
                                    flex
                                    items-center
                                    gap-2
                                ">

                                    <input
                                        type="radio"

                                        value="paid"

                                        checked={
                                            form.payment_status === "paid"
                                        }

                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                payment_status: e.target.value
                                            })
                                        }
                                    />

                                    Paid

                                </label>

                                <label className="
                                    flex
                                    items-center
                                    gap-2
                                ">

                                    <input
                                        type="radio"

                                        value="pending"

                                        checked={
                                            form.payment_status === "pending"
                                        }

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

                </div>

                {/* SUBMIT */}
                <button
                    type="submit"

                    className="
                        mt-5
                        bg-green-600
                        hover:bg-green-700
                        text-white
                        px-5
                        py-3
                        rounded-xl
                        font-semibold
                        transition
                    "
                >
                    Save Purchase
                </button>

            </form>

        </div>
    );
}