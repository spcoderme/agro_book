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

    const [loading, setLoading] =
        useState(false);

    const [products, setProducts] =
        useState([]);

    const [vendors, setVendors] =
        useState([]);

    const [units, setUnits] =
        useState([]);

    const [errors, setErrors] =
        useState({});

    const [form, setForm] = useState({
        bill_no: "",
        dc_no: "",
        purchase_date: new Date(),
        vendor_id: "",
        vendor_name: "",
        hamali: 0,
        payment_status: "pending",
        notes: ""
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

    // ================= LOAD =================
    useEffect(() => {

        setMounted(true);

        Promise.all([
            fetch("/api/products").then(res => res.json()),
            fetch("/api/vendors").then(res => res.json()),
            fetch("/api/units").then(res => res.json())
        ])
            .then(([productsData, vendorsData, unitsData]) => {

                setProducts(
                    Array.isArray(productsData)
                        ? productsData
                        : []
                );

                setVendors(
                    Array.isArray(vendorsData)
                        ? vendorsData
                        : []
                );

                setUnits(
                    Array.isArray(unitsData)
                        ? unitsData
                        : []
                );
            })
            .catch(err => {
                console.log(err);
                alert("Failed to load data");
            });

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

        if (items.length === 1) {

            alert("Minimum 1 item required");

            return;
        }

        const updated =
            items.filter((_, i) => i !== index);

        setItems(updated);
    };

    // ================= SUMMARY =================
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

    // ================= VALIDATION =================
    const validateForm = () => {

        const newErrors = {};

        // Vendor
        if (
            !form.vendor_id &&
            !form.vendor_name
        ) {

            newErrors.vendor =
                "Vendor required";
        }

        // Date
        if (!form.purchase_date) {

            newErrors.purchase_date =
                "Purchase date required";
        }

        // Items
        const validItems =
            items.filter(item =>
                item.product_id
            );

        if (validItems.length === 0) {

            newErrors.items =
                "At least 1 product required";
        }

        validItems.forEach((item, index) => {

            if (
                !item.qty ||
                Number(item.qty) <= 0
            ) {

                newErrors[`qty_${index}`] =
                    "Qty required";
            }

            if (
                !item.rate ||
                Number(item.rate) <= 0
            ) {

                newErrors[`rate_${index}`] =
                    "Rate required";
            }
        });

        setErrors(newErrors);

        return (
            Object.keys(newErrors).length === 0
        );
    };

    // ================= SUBMIT =================
    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!validateForm()) {

            return;
        }

        try {

            setLoading(true);

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

            alert(
                "Purchase Saved Successfully ✅"
            );

            // RESET
            setForm({
                bill_no: "",
                dc_no: "",
                purchase_date: new Date(),
                vendor_id: "",
                vendor_name: "",
                hamali: 0,
                payment_status: "pending",
                notes:""
            });

            setItems([
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

            setErrors({});

        } catch (err) {

            console.log(err);

            alert("Something went wrong");

        } finally {

            setLoading(false);
        }
    };

    return (

        <div className="
            w-full
            px-2
            sm:px-4
            md:px-6
            py-4
            max-w-[100vw]
            overflow-x-hidden
        ">

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
                        sm:text-3xl
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
                    <div>

                        <input
                            className="input w-full"
                            placeholder="Bill No"
                            value={form.bill_no}
                            onChange={e =>
                                setForm({
                                    ...form,
                                    bill_no: e.target.value
                                })
                            }
                        />

                    </div>

                    {/* DC */}
                    <div>

                        <input
                            className="input w-full"
                            placeholder="DC No"
                            value={form.dc_no}
                            onChange={e =>
                                setForm({
                                    ...form,
                                    dc_no: e.target.value
                                })
                            }
                        />

                    </div>

                    {/* DATE */}
                    <div>

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

                        {
                            errors.purchase_date && (

                                <p className="
                                    text-red-500
                                    text-xs
                                    mt-1
                                ">
                                    {errors.purchase_date}
                                </p>
                            )
                        }

                    </div>

                    {/* VENDOR */}
                    <div className="relative z-50">

                        <Select

                            placeholder="Search Vendor..."

                            value={
                                form.vendor_id
                                    ? {
                                        value: form.vendor_id,
                                        label: form.vendor_name
                                    }
                                    : null
                            }

                            options={
                                vendors.map(v => ({
                                    value: v.id,
                                    label:
                                        `${v.name} ${v.mobile ? `(${v.mobile})` : ""}`,
                                    vendor: v
                                }))
                            }

                            onChange={(selectedOption) => {

                                if (!selectedOption) {

                                    setForm({
                                        ...form,
                                        vendor_id: "",
                                        vendor_name: ""
                                    });

                                    return;
                                }

                                setForm({
                                    ...form,
                                    vendor_id:
                                        selectedOption.vendor.id,

                                    vendor_name:
                                        selectedOption.vendor.name
                                });
                            }}

                            isSearchable

                            isClearable

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
                        />

                        {
                            errors.vendor && (

                                <p className="
                                    text-red-500
                                    text-xs
                                    mt-1
                                ">
                                    {errors.vendor}
                                </p>
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
                        min-w-[1100px]
                        w-full
                        text-xs
                        sm:text-sm
                    ">

                        <thead className="bg-gray-100">

                            <tr>

                                <th className="border p-3">
                                    Product
                                </th>

                                <th className="border p-3">
                                    Unit
                                </th>

                                <th className="border p-3">
                                    Stock
                                </th>

                                <th className="border p-3">
                                    Batch
                                </th>

                                <th className="border p-3">
                                    Qty
                                </th>

                                <th className="border p-3">
                                    Rate
                                </th>

                                <th className="border p-3">
                                    Tax %
                                </th>

                                <th className="border p-3">
                                    Total
                                </th>

                                <th className="border p-3">
                                    Action
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {
                                items.map((item, i) => {

                                    const qty =
    Number(item.qty) || 0;

const rate =
    Number(item.rate) || 0;

const taxPercent =
    Number(item.tax) || 0;

const base =
    qty * rate;

const cgst =
    (base * taxPercent) / 200;

const sgst =
    (base * taxPercent) / 200;

const total =
    base + cgst + sgst;


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
                                                                    `${item.product_name} (${parseFloat(item.unit_value || 0)} ${item.unit || ""})`
                                                            }
                                                            : null
                                                    }

                                                    options={
                                                        products.map(p => ({
                                                            value: p.id,

                                                            label:
                                                                `${p.name} (${parseFloat(p.unit_value || 0)} ${p.unit_name || ""}) [Stock: ${parseFloat(p.stock || 0)}]`,

                                                            product: p
                                                        }))
                                                    }

                                                    onChange={(selectedOption) => {

                                                        if (!selectedOption)
                                                            return;

                                                        const selected =
                                                            selectedOption.product;

                                                        setItems(prev => {

                                                            const updated = [...prev];

                                                            updated[i] = {
                                                                ...updated[i],

                                                                product_id:
                                                                    selected.id,

                                                                product_name:
                                                                    selected.name,

                                                                unit_value:
                                                                    selected.unit_value,

                                                                unit:
                                                                    selected.unit_name,

                                                                stock:
                                                                    selected.stock
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

                                                    className="
                                                        min-w-[250px]
                                                    "
                                                />

                                            </td>

                                            {/* UNIT */}
                                            <td className="border p-2">

                                                <div className="
                                                    text-xs
                                                    font-medium
                                                    whitespace-nowrap
                                                ">
                                                    {parseFloat(item.unit_value || 0)}
                                                    {" "}
                                                    {item.unit || "-"}
                                                </div>

                                            </td>

                                            {/* STOCK */}
                                            <td className="border p-2">

                                                <div className="
                                                    text-red-600
                                                    font-semibold
                                                    whitespace-nowrap
                                                ">
                                                    {parseFloat(item.stock || 0)}
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

                                                {
                                                    errors[`qty_${i}`] && (

                                                        <p className="
                                                            text-red-500
                                                            text-xs
                                                            mt-1
                                                        ">
                                                            {
                                                                errors[`qty_${i}`]
                                                            }
                                                        </p>
                                                    )
                                                }

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

                                                {
                                                    errors[`rate_${i}`] && (

                                                        <p className="
                                                            text-red-500
                                                            text-xs
                                                            mt-1
                                                        ">
                                                            {
                                                                errors[`rate_${i}`]
                                                            }
                                                        </p>
                                                    )
                                                }

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
    whitespace-nowrap
    text-sm
">

    <div className="
        flex
        flex-col
        gap-1
    ">

        <span className="text-gray-500">
            {base.toFixed(2)}
            {" + "}
            {(cgst + sgst).toFixed(2)}
        </span>

        <span className="
            font-bold
            text-green-700
        ">
            ₹ {total.toFixed(2)}
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

                {
                    errors.items && (

                        <p className="
                            text-red-500
                            text-sm
                            mt-2
                        ">
                            {errors.items}
                        </p>
                    )
                }

                {/* ADD ROW */}
                <button
                    type="button"

                    onClick={addRow}

                    className="
                        mt-3
                        bg-gray-200
                        hover:bg-gray-800
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
    mt-6
    bg-white
    border
    rounded-2xl
    p-4
    sm:p-5
    shadow-sm
">

    <div className="
        grid
        grid-cols-1
        xl:grid-cols-2
        gap-6
    ">

        {/* LEFT SIDE */}
        <div className="
            flex
            flex-col
            gap-5
        ">

            {/* PAYMENT STATUS */}
            <div>

                <label className="
                    block
                    text-sm
                    font-semibold
                    mb-3
                    text-gray-700
                ">
                    Payment Status
                </label>

                <div className="
                    flex
                    flex-col
                    sm:flex-row
                    gap-3
                ">

                    {/* PAID */}
                    <label className="
                        flex
                        items-center
                        gap-3
                        border
                        rounded-2xl
                        px-4
                        py-3
                        cursor-pointer
                        bg-white
                        hover:border-green-500
                        transition
                        w-full
                        sm:w-auto
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
                                    payment_status:
                                        e.target.value
                                })
                            }
                        />

                        <span className="
                            text-green-600
                            font-semibold
                        ">
                            Paid
                        </span>

                    </label>

                    {/* PENDING */}
                    <label className="
                        flex
                        items-center
                        gap-3
                        border
                        rounded-2xl
                        px-4
                        py-3
                        cursor-pointer
                        bg-white
                        hover:border-red-500
                        transition
                        w-full
                        sm:w-auto
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
                                    payment_status:
                                        e.target.value
                                })
                            }
                        />

                        <span className="
                            text-red-600
                            font-semibold
                        ">
                            Pending
                        </span>

                    </label>

                </div>

            </div>

            {/* NOTES */}
            <div>

                <label className="
                    block
                    text-sm
                    font-semibold
                    mb-2
                    text-gray-700
                ">
                    Notes
                </label>

                <textarea
                    className="
                        input
                        w-full
                        min-h-[140px]
                        resize-none
                    "

                    placeholder="
                    Enter purchase notes...
                    "

                    value={form.notes || ""}

                    onChange={(e) =>
                        setForm({
                            ...form,
                            notes:
                                e.target.value
                        })
                    }
                />

            </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="
            flex
            flex-col
            gap-4
        ">

            {/* TOTALS CARD */}
            <div className="
                border
                rounded-2xl
                p-4
                bg-gray-50
                space-y-4
            ">

                {/* TAXABLE */}
                <div className="
                    flex
                    justify-between
                    items-center
                    gap-3
                    text-sm
                    sm:text-base
                ">
                    <span>Taxable</span>

                    <span className="font-medium">
                        ₹ {summary.taxable.toFixed(2)}
                    </span>
                </div>

                {/* CGST */}
                <div className="
                    flex
                    justify-between
                    items-center
                    gap-3
                    text-sm
                    sm:text-base
                ">
                    <span>CGST</span>

                    <span className="font-medium">
                        ₹ {summary.cgst.toFixed(2)}
                    </span>
                </div>

                {/* SGST */}
                <div className="
                    flex
                    justify-between
                    items-center
                    gap-3
                    text-sm
                    sm:text-base
                ">
                    <span>SGST</span>

                    <span className="font-medium">
                        ₹ {summary.sgst.toFixed(2)}
                    </span>
                </div>

                {/* TOTAL TAX */}
                <div className="
                    flex
                    justify-between
                    items-center
                    gap-3
                    text-sm
                    sm:text-base
                ">
                    <span>Total Tax</span>

                    <span className="
                        font-medium
                        text-orange-600
                    ">
                        ₹ {(summary.cgst + summary.sgst).toFixed(2)}
                    </span>
                </div>

                {/* HAMALI */}
                <div className="
                    flex
                    flex-col
                    sm:flex-row
                    sm:items-center
                    justify-between
                    gap-2
                    pt-2
                ">

                    <span className="
                        font-medium
                    ">
                        Freight / Hamali
                    </span>

                    <input
                        type="number"

                        className="
                            input
                            w-full
                            sm:w-32
                        "

                        min={0}

                        step="0.01"

                        value={form.hamali || 0}

                        onChange={e =>
                            setForm({
                                ...form,
                                hamali:
                                    e.target.value
                            })
                        }
                    />

                </div>

                {/* ROUND OFF */}
                <div className="
                    flex
                    justify-between
                    items-center
                    gap-3
                    text-sm
                    sm:text-base
                ">
                    <span>Round Off</span>

                    <span className="font-medium">
                        ₹ {summary.roundOff.toFixed(2)}
                    </span>
                </div>

                {/* GRAND TOTAL */}
                <div className="
                    border-t
                    pt-4
                    flex
                    justify-between
                    items-center
                    gap-3
                ">

                    <span className="
                        text-lg
                        sm:text-xl
                        font-bold
                    ">
                        Grand Total
                    </span>

                    <span className="
                        text-2xl
                        sm:text-3xl
                        font-bold
                        text-green-700
                        break-all
                    ">
                        ₹ {summary.grandTotal.toFixed(2)}
                    </span>

                </div>

            </div>

        </div>

    </div>

</div>

                {/* SUBMIT */}
                <button
                    type="submit"

                    disabled={loading}

                    className="
                        mt-5
                        bg-green-600
                        hover:bg-green-700
                        disabled:bg-gray-400
                        text-white
                        px-6
                        py-3
                        rounded-xl
                        font-semibold
                        transition
                    "
                >

                    {
                        loading
                            ? "Saving..."
                            : "Save Purchase"
                    }

                </button>

            </form>

        </div>
    );
}