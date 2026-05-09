"use client";

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

        const query = new URLSearchParams(filters).toString();

        const res = await fetch(
            `/api/dispatch?${query}`
        );

        const data = await res.json();

        setRows(data);
    };

    useEffect(() => {

        loadData();

    }, []);

    return (

        <div className="p-5">

            <h1 className="text-2xl font-bold mb-5">
                Dispatch Entries
            </h1>

            {/* FILTERS */}
            <div className="grid grid-cols-4 gap-4 mb-5">

                {/* BILL NO */}
                <input
                    className="input"
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
                    className="input"
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
                    className="input"
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

                        if (!date) return;

                        const year = date.getFullYear();

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
                    className="input w-full"
                />

            </div>

            {/* SEARCH BUTTON */}
            <button
                onClick={loadData}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mb-5"
            >
                Search
            </button>

            {/* TABLE */}
            <div className="overflow-auto border rounded">

                <table className="w-full border border-separate text-sm">

                    <thead className="bg-gray-200">

                        <tr>

                            <th className="border p-2">
                                Bill No
                            </th>

                            <th className="border p-2">
                                Date
                            </th>

                            <th className="border p-2">
                                Driver
                            </th>

                            <th className="border p-2">
                                Product
                            </th>

                            <th className="border p-2">
                                Dispatch Qty
                            </th>

                            <th className="border p-2">
                                Bill Photo
                            </th>

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
                                    {r.sell_bill_no}
                                </td>

                                {/* DATE */}
                                <td className="border p-2">

                                    {new Date(
                                        r.dispatch_date
                                    ).toLocaleDateString(
                                        "en-GB"
                                    )}

                                </td>

                                {/* DRIVER */}
                                <td className="border p-2">
                                    {r.driver_name}
                                </td>

                                {/* PRODUCT */}
                                <td className="border p-2">

                                    {r.product_name}
                                    {" "}
                                    ({parseFloat(r.unit_value)}
                                    {r.unit_name})

                                </td>

                                {/* QTY */}
                                <td className="border p-2 text-center">

                                    {parseFloat(r.quantity)}

                                </td>

                                {/* PHOTO */}
                                <td className="border p-2 text-center">

                                    {r.bill_photo ? (

                                        <a
                                            href={r.bill_photo}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >

                                            <img
                                                src={r.bill_photo}
                                                alt="Bill"
                                                className="w-20 h-20 object-cover rounded border hover:scale-105 transition"
                                            />

                                        </a>

                                    ) : (

                                        <span className="text-gray-400">
                                            No Image
                                        </span>

                                    )}

                                </td>

                            </tr>
                        ))}

                    </tbody>

                </table>

            </div>

        </div>
    );
}