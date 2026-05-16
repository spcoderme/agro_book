"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

export default function DispatchesPage() {

    const [rows, setRows] = useState([]);

    const [filters, setFilters] = useState({
        sell_bill_no: "",
        driver_name: "",
        product: "",
        dispatch_date: ""
    });

    // ================= LOAD DATA =================
    const loadData = async () => {

        try {

            const query =
                new URLSearchParams(filters).toString();

            const res = await fetch(
                `/api/dispatch?${query}`
            );

            const data = await res.json();

            setRows(Array.isArray(data) ? data : []);

        } catch (err) {

            console.log(err);

            alert("Failed to load dispatches");
        }
    };

    useEffect(() => {

        loadData();

    }, []);

    return (

        <div className="w-full max-w-7xl mx-auto px-3 py-4 md:px-6">

            {/* ================= HEADER ================= */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">

                <div>

                    <h1 className="text-2xl font-bold text-gray-800">
                        Dispatch Entries
                    </h1>

                    <p className="text-sm text-gray-500">
                        View all dispatch transactions
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

            {/* ================= FILTERS ================= */}
            <div
                className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    lg:grid-cols-4
                    gap-4
                    mb-5
                    relative
                    z-20
                "
            >

                {/* BILL NO */}
                <input
                    className="
                        w-full
                        border
                        rounded-xl
                        px-4
                        py-3
                        outline-none
                        focus:ring-2
                        focus:ring-blue-500
                    "
                    placeholder="Sell Bill No"
                    value={filters.sell_bill_no}
                    onChange={e =>
                        setFilters({
                            ...filters,
                            sell_bill_no: e.target.value
                        })
                    }
                />

                {/* DRIVER */}
                <input
                    className="
                        w-full
                        border
                        rounded-xl
                        px-4
                        py-3
                        outline-none
                        focus:ring-2
                        focus:ring-blue-500
                    "
                    placeholder="Driver Name"
                    value={filters.driver_name}
                    onChange={e =>
                        setFilters({
                            ...filters,
                            driver_name: e.target.value
                        })
                    }
                />

                {/* PRODUCT */}
                <input
                    className="
                        w-full
                        border
                        rounded-xl
                        px-4
                        py-3
                        outline-none
                        focus:ring-2
                        focus:ring-blue-500
                    "
                    placeholder="Product"
                    value={filters.product}
                    onChange={e =>
                        setFilters({
                            ...filters,
                            product: e.target.value
                        })
                    }
                />

                {/* DATE */}
                <div className="relative z-[9999]">

                    <DatePicker
                        selected={
                            filters.dispatch_date
                                ? new Date(
                                      filters.dispatch_date.split("-")[0],
                                      filters.dispatch_date.split("-")[1] - 1,
                                      filters.dispatch_date.split("-")[2]
                                  )
                                : null
                        }

                        onChange={(date) => {

                            if (!date) {

                                setFilters({
                                    ...filters,
                                    dispatch_date: ""
                                });

                                return;
                            }

                            const year =
                                date.getFullYear();

                            const month = String(
                                date.getMonth() + 1
                            ).padStart(2, "0");

                            const day = String(
                                date.getDate()
                            ).padStart(2, "0");

                            setFilters({
                                ...filters,
                                dispatch_date:
                                    `${year}-${month}-${day}`
                            });
                        }}

                        dateFormat="dd/MM/yyyy"

                        placeholderText="Dispatch Date"

                        className="
                            w-full
                            border
                            rounded-xl
                            px-4
                            py-3
                            outline-none
                            focus:ring-2
                            focus:ring-blue-500
                        "

                        popperClassName="z-[99999]"

                        portalId="root-portal"
                    />

                </div>

            </div>

            {/* ================= SEARCH BUTTON ================= */}
            <div className="mb-5">

                <button
                    onClick={loadData}
                    className="
                        bg-blue-600
                        hover:bg-blue-700
                        text-white
                        px-5
                        py-3
                        rounded-xl
                        font-medium
                        transition
                        w-full
                        sm:w-auto
                    "
                >
                    Search
                </button>

            </div>

            {/* ================= TABLE ================= */}
            <div
                className="
                    overflow-x-auto
                    border
                    rounded-xl
                    bg-white
                    shadow-sm
                "
            >

                <table
                    className="
                        min-w-[900px]
                        w-full
                        text-sm
                    "
                >

                    <thead
                        className="
                            bg-gray-100
                            sticky
                            top-0
                            z-10
                        "
                    >

                        <tr>

                            <th className="border p-3 text-left">
                                Bill No
                            </th>

                            <th className="border p-3 text-left">
                                Date
                            </th>

                            <th className="border p-3 text-left">
                                Driver
                            </th>

                            <th className="border p-3 text-left">
                                Product
                            </th>

                            <th className="border p-3 text-center">
                                Dispatch Qty
                            </th>

                            <th className="border p-3 text-center">
                                Bill Photo
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {
                            rows.length > 0 ? (

                                rows.map((r, i) => (

                                    <tr
                                        key={i}
                                        className="
                                            hover:bg-gray-50
                                            transition
                                        "
                                    >

                                        {/* BILL */}
                                        <td className="border p-3">

                                            {r.sell_bill_no || "-"}

                                        </td>

                                        {/* DATE */}
                                        <td className="border p-3">

                                            {
                                                r.dispatch_date
                                                    ? new Date(
                                                          r.dispatch_date
                                                      ).toLocaleDateString(
                                                          "en-GB"
                                                      )
                                                    : "-"
                                            }

                                        </td>

                                        {/* DRIVER */}
                                        <td className="border p-3">

                                            {r.driver_name || "-"}

                                        </td>

                                        {/* PRODUCT */}
                                        <td className="border p-3">

                                            <div className="font-medium">

                                                {r.product_name}

                                            </div>

                                            <div className="text-xs text-gray-500 mt-1">

                                                {parseFloat(
                                                    r.unit_value || 0
                                                )}
                                                {r.unit_name}

                                            </div>

                                        </td>

                                        {/* QTY */}
                                        <td className="border p-3 text-center font-semibold">

                                            {
                                                parseFloat(
                                                    r.quantity || 0
                                                )
                                            }

                                        </td>

                                        {/* PHOTO */}
                                        <td className="border p-3 text-center">

                                            {
                                                r.bill_photo ? (

                                                    <a
                                                        href={r.bill_photo}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >

                                                        <img
                                                            src={r.bill_photo}
                                                            alt="Bill"
                                                            className="
                                                                w-16
                                                                h-16
                                                                md:w-20
                                                                md:h-20
                                                                object-cover
                                                                rounded-lg
                                                                border
                                                                mx-auto
                                                                hover:scale-105
                                                                transition
                                                            "
                                                        />

                                                    </a>

                                                ) : (

                                                    <span className="text-gray-400 text-xs">
                                                        No Image
                                                    </span>

                                                )
                                            }

                                        </td>

                                    </tr>
                                ))

                            ) : (

                                <tr>

                                    <td
                                        colSpan={6}
                                        className="
                                            text-center
                                            py-10
                                            text-gray-500
                                            bg-gray-200
                                        "
                                    >
                                        No Dispatch Entries Found
                                    </td>

                                </tr>
                            )
                        }

                    </tbody>

                </table>

            </div>

        </div>
    );
}