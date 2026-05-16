"use client";

import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import dynamic from "next/dynamic";
import Link from "next/link";

import "react-datepicker/dist/react-datepicker.css";

const Select = dynamic(
    () => import("react-select"),
    { ssr: false }
);

export default function PurchasesPage() {

    const [mounted, setMounted] =
        useState(false);

    const [rows, setRows] =
        useState([]);

    const [products, setProducts] =
        useState([]);

    const [vendors, setVendors] =
        useState([]);

    const [filters, setFilters] = useState({
        bill_no: "",
        vendor: "",
        product: "",
        date: null
    });

    // ================= DATE FORMAT =================
    const formatDate = (date) => {

        if (!date) return "";

        return `${date.getFullYear()}-${String(
            date.getMonth() + 1
        ).padStart(2, "0")}-${String(
            date.getDate()
        ).padStart(2, "0")}`;
    };

    // ================= LOAD DATA =================
    const loadData = async () => {

        try {

            const query =
                new URLSearchParams({
                    bill_no: filters.bill_no,
                    vendor: filters.vendor,
                    product: filters.product,
                    date: filters.date
                        ? formatDate(filters.date)
                        : ""
                }).toString();

            const res =
                await fetch(`/api/purchases?${query}`);

            const data =
                await res.json();

            setRows(Array.isArray(data) ? data : []);

        } catch (err) {

            console.log(err);
        }
    };

    // ================= INITIAL LOAD =================
    useEffect(() => {

        setMounted(true);

        loadData();

        fetch("/api/products")
            .then(res => res.json())
            .then(data =>
                setProducts(Array.isArray(data) ? data : [])
            );

        fetch("/api/vendors")
            .then(res => res.json())
            .then(data =>
                setVendors(Array.isArray(data) ? data : [])
            );

    }, []);

    // ================= HYDRATION FIX =================
    if (!mounted) {

        return (
            <div className="p-5 text-center">
                Loading...
            </div>
        );
    }

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
                        font-bold
                        text-gray-800
                    ">
                        Purchase History
                    </h1>

                    <p className="
                        text-sm
                        text-gray-500
                    ">
                        View & manage purchases
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

            {/* FILTERS */}
            <div className="
                grid
                grid-cols-1
                sm:grid-cols-2
                xl:grid-cols-4
                gap-4
                mb-5
            ">

                {/* BILL */}
                <input
                    className="input"
                    placeholder="Bill No"
                    value={filters.bill_no}
                    onChange={e =>
                        setFilters({
                            ...filters,
                            bill_no: e.target.value
                        })
                    }
                />

                {/* VENDOR */}
                <div className="relative z-20">

                    <input
                        className="input w-full"
                        placeholder="Search Vendor"
                        value={filters.vendor}
                        onChange={(e) => {

                            setFilters({
                                ...filters,
                                vendor: e.target.value
                            });

                        }}
                    />

                    {
                        filters.vendor &&
                        vendors.filter(v =>
                            v.name
                                .toLowerCase()
                                .includes(
                                    filters.vendor.toLowerCase()
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
                                                    filters.vendor.toLowerCase()
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

                                                    setFilters({
                                                        ...filters,
                                                        vendor: v.name
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

                {/* PRODUCT */}
                <div className="z-10">

                    <Select
                        placeholder="Search Product..."
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

                        options={products.map(p => ({
                            value: p.name,
                            label:
                                `${p.name} ` +
                                `(${parseFloat(
                                    p.unit_value || 0
                                )}${p.unit_name || ""}) ` +
                                `[Stock: ${p.stock || 0}]`
                        }))}

                        value={
                            filters.product
                                ? {
                                    value: filters.product,
                                    label: filters.product
                                }
                                : null
                        }

                        onChange={(selected) =>
                            setFilters({
                                ...filters,
                                product:
                                    selected?.value || ""
                            })
                        }
                    />

                </div>

                {/* DATE */}
                <div className="relative z-30">

                    <DatePicker
                        selected={filters.date}

                        onChange={(date) =>
                            setFilters({
                                ...filters,
                                date
                            })
                        }

                        dateFormat="dd/MM/yyyy"

                        placeholderText="Select Date"

                        popperPlacement="bottom-start"

                        popperClassName="z-[99999]"

                        className="input w-full"
                    />

                </div>

            </div>

            {/* SEARCH BUTTON */}
            <button
                onClick={loadData}
                className="
                    w-full
                    sm:w-auto
                    bg-blue-600
                    hover:bg-blue-700
                    text-white
                    px-5
                    py-3
                    rounded-xl
                    font-medium
                    mb-5
                "
            >
                Search
            </button>

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
                                Bill No
                            </th>

                            <th className="border p-3">
                                Payment
                            </th>

                            <th className="border p-3">
                                Date
                            </th>

                            <th className="border p-3">
                                Vendor
                            </th>

                            <th className="border p-3">
                                Product
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
                                Actions
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {
                            rows.map((r, i) => (

                                <tr
                                    key={i}
                                    className="hover:bg-gray-50"
                                >

                                    {/* BILL */}
                                    <td className="border p-2">
                                        {r.bill_no}
                                    </td>

                                    {/* PAYMENT */}
                                    <td className="border p-2">

                                        {
                                            r.payment_status === "paid"
                                                ? (
                                                    <span className="
                                                        text-green-600
                                                        font-semibold
                                                    ">
                                                        Paid
                                                    </span>
                                                )
                                                : (
                                                    <span className="
                                                        text-red-600
                                                        font-semibold
                                                    ">
                                                        Pending
                                                    </span>
                                                )
                                        }

                                    </td>

                                    {/* DATE */}
                                    <td className="border p-2 whitespace-nowrap">

                                        {
                                            r.purchase_date
                                                ? new Date(
                                                    r.purchase_date
                                                ).toLocaleDateString("en-GB")
                                                : "-"
                                        }

                                    </td>

                                    {/* VENDOR */}
                                    <td className="border p-2">
                                        {r.vendor_name}
                                    </td>

                                    {/* PRODUCT */}
                                    <td className="border p-2">

                                        <div className="font-medium">
                                            {r.product_name}
                                        </div>

                                        <div className="
                                            text-xs
                                            text-gray-500
                                        ">
                                            (
                                            {parseFloat(
                                                r.unit_value || 0
                                            )}
                                            {r.unit || ""}
                                            )
                                        </div>

                                    </td>

                                    {/* BATCH */}
                                    <td className="border p-2">
                                        {r.batch_no}
                                    </td>

                                    {/* QTY */}
                                    <td className="border p-2 text-center">
                                        {r.quantity}
                                    </td>

                                    {/* RATE */}
                                    <td className="border p-2 whitespace-nowrap">

                                        ₹ {parseFloat(
                                            r.rate || 0
                                        ).toFixed(2)}

                                    </td>

                                    {/* TAX */}
                                    <td className="border p-2 text-center">
                                        {r.tax_percent}%
                                    </td>

                                    {/* TOTAL */}
                                    <td className="
                                        border
                                        p-2
                                        font-semibold
                                        whitespace-nowrap
                                    ">

                                        ₹ {parseFloat(
                                            r.total || 0
                                        ).toFixed(2)}

                                    </td>

                                    {/* ACTION */}
                                    <td className="border p-2">

                                        <div className="
                                            flex
                                            flex-col
                                            sm:flex-row
                                            gap-2
                                        ">

                                            <a
                                                href={`/purchase-view/${r.purchase_id}`}
                                                className="
                                                    bg-blue-600
                                                    hover:bg-blue-700
                                                    text-white
                                                    px-3
                                                    py-2
                                                    rounded-lg
                                                    text-xs
                                                    text-center
                                                "
                                            >
                                                View
                                            </a>

                                            <a
                                                href={`/purchase-edit/${r.purchase_id}`}
                                                className="
                                                    bg-green-600
                                                    hover:bg-green-700
                                                    text-white
                                                    px-3
                                                    py-2
                                                    rounded-lg
                                                    text-xs
                                                    text-center
                                                "
                                            >
                                                Edit
                                            </a>

                                        </div>

                                    </td>

                                </tr>

                            ))
                        }

                    </tbody>

                </table>

            </div>

        </div>
    );
}