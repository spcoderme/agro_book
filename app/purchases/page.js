"use client";

import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import dynamic from "next/dynamic";

const Select = dynamic(
    () => import("react-select"),
    { ssr: false }
);

export default function PurchasesPage() {

    const [rows, setRows] = useState([]);
    const [products, setProducts] = useState([]);
    const [vendors, setVendors] = useState([]);

    const [filters, setFilters] = useState({
        bill_no: "",
        vendor: "",
        product: "",
        date: null
    });

    // ✅ FORMAT DATE FOR MYSQL
    const formatDate = (date) => {
        if (!date) return "";

        return `${date.getFullYear()}-${String(
            date.getMonth() + 1
        ).padStart(2, "0")}-${String(
            date.getDate()
        ).padStart(2, "0")}`;
    };

    // ✅ LOAD DATA
    const loadData = async () => {

        const query = new URLSearchParams({
            bill_no: filters.bill_no,
            vendor: filters.vendor,
            product: filters.product,
            date: filters.date
                ? formatDate(filters.date)
                : ""
        }).toString();

        console.log(query);

        const res = await fetch(`/api/purchases?${query}`);

        const data = await res.json();

        setRows(data);
    };

    useEffect(() => {

        loadData();

        fetch("/api/products")
            .then(res => res.json())
            .then(setProducts);

            fetch("/api/vendors")
    .then(res => res.json())
    .then(setVendors);

    }, []);

    return (
        <div className="p-5">

            <h1 className="text-2xl font-bold mb-4">
                Purchase History
            </h1>

            {/* FILTERS */}
            <div className="grid grid-cols-4 gap-4 mb-5">

                {/* BILL NO */}
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
                <div className="relative">

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

            <div className="absolute z-50 bg-white border w-full max-h-52 overflow-y-auto rounded shadow">

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
                                className="p-2 hover:bg-gray-100 cursor-pointer border-b"
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

                {/* PRODUCT */}
                <Select
                    placeholder="Search Product..."
                    isClearable
                    options={products.map(p => ({
                        value: p.name,
                        label: `${p.name} (${parseFloat(
                            p.unit_value || 0
                        )}${p.unit_name || ""})[${p.stock || ""}]`
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
                            product: selected?.value || ""
                        })
                    }
                    className="min-w-[250px]"
                />

                {/* DATE PICKER */}
                <DatePicker
                    selected={filters.date}
                    onChange={(date) =>
                        setFilters({
                            ...filters,
                            date
                        })
                    }
                    dateFormat="dd/MM/yyyy"
                    className="input w-full"
                    placeholderText="Select Date"
                />

            </div>

            {/* SEARCH BUTTON */}
            <button
                onClick={loadData}
                className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
            >
                Search
            </button>

            {/* TABLE */}
            <div className="overflow-auto border rounded">

                <table className="w-full text-sm border border-separate">

                    <thead className="bg-gray-200">

                        <tr>
                            <th className="border p-2">Bill No</th>
                            <th className="border p-2">Payment</th>
                            <th className="border p-2">Date</th>
                            <th className="border p-2">Vendor</th>
                            <th className="border p-2">Product</th>
                            <th className="border p-2">Batch</th>
                            <th className="border p-2">Qty</th>
                            <th className="border p-2">Rate</th>
                            <th className="border p-2">Tax %</th>
                            <th className="border p-2">Total</th>
                            <th className="border p-2">Actions</th>
                        </tr>

                    </thead>

                    <tbody>

                        {rows.map((r, i) => (

                            <tr
                                key={i}
                                className="hover:bg-gray-50"
                            >

                                {/* BILL */}
                                <td className="border p-2">
                                    {r.bill_no}
                                </td>

                                <td className="border p-2">

                                    {
                                        r.payment_status === "paid"
                                            ? (
                                                <span className="text-green-600 font-semibold">
                                                    Paid
                                                </span>
                                            )
                                            : (
                                                <span className="text-red-600 font-semibold">
                                                    Pending
                                                </span>
                                            )
                                    }

                                </td>

                                {/* DATE */}
                                <td className="border p-2">
                                    {r.purchase_date
                                        ? new Date(r.purchase_date)
                                            .toLocaleDateString("en-GB")
                                        : "-"
                                    }
                                </td>

                                {/* VENDOR */}
                                <td className="border p-2">
                                    {r.vendor_name}
                                </td>

                                {/* PRODUCT */}
                                <td className="border p-2">

                                    {r.product_name}

                                    <div className="text-xs text-gray-500">
                                        ({parseFloat(r.unit_value || 0)}
                                        {r.unit || ""})
                                    </div>

                                </td>

                                {/* BATCH */}
                                <td className="border p-2">
                                    {r.batch_no}
                                </td>

                                {/* QTY */}
                                <td className="border p-2">
                                    {r.quantity}
                                </td>

                                {/* RATE */}
                                <td className="border p-2">
                                    ₹ {parseFloat(r.rate).toFixed(2)}
                                </td>

                                {/* TAX */}
                                <td className="border p-2">
                                    {r.tax_percent}%
                                </td>



                                {/* TOTAL */}
                                <td className="border p-2 font-semibold">
                                    ₹ {parseFloat(r.total).toFixed(2)}
                                </td>

                                <td className="border p-2">

                                    <div className="flex gap-2">

                                        {/* VIEW */}
                                        <a
                                            href={`/purchase-view/${r.purchase_id}`}
                                            className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                                        >
                                            View
                                        </a>

                                        {/* EDIT */}
                                        <a
                                            href={`/purchase-edit/${r.purchase_id}`}
                                            className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
                                        >
                                            Edit
                                        </a>

                                    </div>

                                </td>


                            </tr>
                        ))}

                    </tbody>

                </table>

            </div>

        </div>
    );
}