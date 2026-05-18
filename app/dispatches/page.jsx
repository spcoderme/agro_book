"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

const Select = dynamic(
    () => import("react-select"),
    { ssr: false }
);

export default function DispatchesPage() {

    // ================= STATES =================
    const [rows, setRows] = useState([]);

    const [loading, setLoading] =
        useState(false);

    const [products, setProducts] =
        useState([]);

    const [filters, setFilters] =
        useState({
            sell_bill_no: "",
            driver_name: "",
            product: "",
            dispatch_date: ""
        });

    // ================= LOAD PRODUCTS =================
    useEffect(() => {

        fetch("/api/products")
            .then(res => res.json())
            .then(data => {

                if (Array.isArray(data)) {

                    setProducts(data);

                } else {

                    setProducts([]);
                }
            })
            .catch(err => {

                console.log(err);

                setProducts([]);
            });

    }, []);

    // ================= PRODUCT OPTIONS =================
    const productOptions =
        useMemo(() => {

            return products.map(p => ({
                value: p.name,
                label:
                    `${p.name} ` +
                    `(${parseFloat(
                        p.unit_value || 0
                    )}${p.unit_name || ""}) ` +
                    `[Stock: ${parseFloat(
                        p.stock || 0
                    )}]`
            }));

        }, [products]);

    // ================= LOAD DATA =================
    const loadData = async () => {

        try {

            setLoading(true);

            const query =
                new URLSearchParams({
                    sell_bill_no:
                        filters.sell_bill_no,

                    driver_name:
                        filters.driver_name,

                    product:
                        filters.product,

                    dispatch_date:
                        filters.dispatch_date
                }).toString();

            const res =
                await fetch(
                    `/api/dispatch?${query}`
                );

            const data =
                await res.json();

            setRows(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (err) {

            console.log(err);

            alert(
                "Failed to load dispatches"
            );

        } finally {

            setLoading(false);
        }
    };

    // ================= INITIAL LOAD =================
    useEffect(() => {

        loadData();

    }, []);

    return (

        <div className="
            w-full
            max-w-7xl
            mx-auto
            px-3
            sm:px-4
            md:px-6
            py-4
        ">

            {/* ================= HEADER ================= */}
            <div className="
                flex
                flex-col
                lg:flex-row
                lg:items-center
                lg:justify-between
                gap-4
                mb-6
            ">

                <div>

                    <h1 className="
                        text-2xl
                        md:text-3xl
                        font-bold
                        text-gray-800
                    ">
                        🚚 Dispatch Entries
                    </h1>

                    <p className="
                        text-sm
                        text-gray-500
                        mt-1
                    ">
                        View and manage dispatch transactions
                    </p>

                </div>

                <Link
                    href="/dashboard"
                    className="
                        bg-gray-800
                        hover:bg-black
                        text-white
                        px-5
                        py-3
                        rounded-xl
                        text-sm
                        font-medium
                        transition
                        w-fit
                    "
                >
                    ← Dashboard
                </Link>

            </div>

            {/* ================= FILTER CARD ================= */}
            <div className="
                bg-white
                border
                rounded-2xl
                shadow-sm
                p-4
                sm:p-5
                mb-6
            ">

                <div className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    xl:grid-cols-4
                    gap-4
                ">

                    {/* BILL */}
                    <div>

                        <label className="
                            block
                            text-sm
                            font-medium
                            mb-2
                            text-gray-700
                        ">
                            Sell Bill No
                        </label>

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
                                transition
                            "
                            placeholder="Enter bill no"

                            value={
                                filters.sell_bill_no
                            }

                            onChange={e =>
                                setFilters({
                                    ...filters,
                                    sell_bill_no:
                                        e.target.value
                                })
                            }
                        />

                    </div>

                    {/* DRIVER */}
                    <div>

                        <label className="
                            block
                            text-sm
                            font-medium
                            mb-2
                            text-gray-700
                        ">
                            Driver Name
                        </label>

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
                                transition
                            "
                            placeholder="Driver name"

                            value={
                                filters.driver_name
                            }

                            onChange={e =>
                                setFilters({
                                    ...filters,
                                    driver_name:
                                        e.target.value
                                })
                            }
                        />

                    </div>

                    {/* PRODUCT SEARCHABLE */}
                    <div className="relative z-30">

                        <label className="
                            block
                            text-sm
                            font-medium
                            mb-2
                            text-gray-700
                        ">
                            Product
                        </label>

                        <Select

                            placeholder="Search Product..."

                            isClearable

                            options={
                                productOptions
                            }

                            value={
                                filters.product
                                    ? {
                                        value:
                                            filters.product,

                                        label:
                                            filters.product
                                    }
                                    : null
                            }

                            onChange={(selected) => {

                                setFilters({
                                    ...filters,

                                    product:
                                        selected
                                            ?.value || ""
                                });

                            }}

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

                    </div>

                    {/* DATE */}
                    <div className="relative z-20">

                        <label className="
                            block
                            text-sm
                            font-medium
                            mb-2
                            text-gray-700
                        ">
                            Dispatch Date
                        </label>

                        <DatePicker

                            selected={
                                filters.dispatch_date
                                    ? new Date(
                                        filters.dispatch_date
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

                                const month =
                                    String(
                                        date.getMonth() + 1
                                    ).padStart(2, "0");

                                const day =
                                    String(
                                        date.getDate()
                                    ).padStart(2, "0");

                                setFilters({
                                    ...filters,

                                    dispatch_date:
                                        `${year}-${month}-${day}`
                                });

                            }}

                            dateFormat="dd/MM/yyyy"

                            placeholderText="Select date"

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

                {/* ACTION BUTTONS */}
                <div className="
                    flex
                    flex-col
                    sm:flex-row
                    gap-3
                    mt-5
                ">

                    <button
                        onClick={loadData}

                        disabled={loading}

                        className="
                            bg-blue-600
                            hover:bg-blue-700
                            disabled:opacity-60
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
                        {
                            loading
                                ? "Loading..."
                                : "Search"
                        }
                    </button>

                    <button
                        onClick={() => {

                            setFilters({
                                sell_bill_no: "",
                                driver_name: "",
                                product: "",
                                dispatch_date: ""
                            });

                            setTimeout(() => {
                                loadData();
                            }, 100);
                        }}

                        className="
                            bg-gray-200
                            hover:bg-gray-300
                            text-gray-800
                            px-5
                            py-3
                            rounded-xl
                            font-medium
                            transition
                            w-full
                            sm:w-auto
                        "
                    >
                        Reset Filters
                    </button>

                </div>

            </div>

            {/* ================= TABLE ================= */}
            <div className="
                overflow-x-auto
                border
                rounded-2xl
                bg-white
                shadow-sm
            ">

                <table className="
                    min-w-[1000px]
                    w-full
                    text-sm
                ">

                    <thead className="
                        bg-gray-100
                        sticky
                        top-0
                        z-10
                    ">

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
                                Qty
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
                                        <td className="
                                            border
                                            p-3
                                            font-medium
                                        ">

                                            {
                                                r.sell_bill_no
                                                    || "-"
                                            }

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

                                            {
                                                r.driver_name
                                                    || "-"
                                            }

                                        </td>

                                        {/* PRODUCT */}
                                        <td className="border p-3">

                                            <div className="
                                                font-semibold
                                                text-gray-800
                                            ">
                                                {
                                                    r.product_name
                                                }
                                            </div>

                                            <div className="
                                                text-xs
                                                text-gray-500
                                                mt-1
                                            ">

                                                {
                                                    parseFloat(
                                                        r.unit_value || 0
                                                    )
                                                }

                                                {
                                                    r.unit_name
                                                }

                                            </div>

                                        </td>

                                        {/* QTY */}
                                        <td className="
                                            border
                                            p-3
                                            text-center
                                        ">

                                            <span className="
                                                inline-flex
                                                items-center
                                                justify-center
                                                px-3
                                                py-1
                                                rounded-full
                                                bg-green-100
                                                text-green-700
                                                font-bold
                                            ">

                                                {
                                                    parseFloat(
                                                        r.quantity || 0
                                                    )
                                                }

                                            </span>

                                        </td>

                                        {/* PHOTO */}
                                        <td className="
                                            border
                                            p-3
                                            text-center
                                        ">

                                            {
                                                r.bill_photo ? (

                                                    <a
                                                        href={
                                                            r.bill_photo
                                                        }

                                                        target="_blank"

                                                        rel="
                                                            noreferrer
                                                            noopener
                                                        "
                                                    >

                                                        <img
                                                            src={
                                                                r.bill_photo
                                                            }

                                                            alt="Bill"

                                                            className="
                                                                w-16
                                                                h-16
                                                                md:w-20
                                                                md:h-20
                                                                object-cover
                                                                rounded-xl
                                                                border
                                                                mx-auto
                                                                hover:scale-105
                                                                transition
                                                            "
                                                        />

                                                    </a>

                                                ) : (

                                                    <span className="
                                                        text-xs
                                                        text-gray-400
                                                    ">
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
                                            py-14
                                            text-gray-500
                                        "
                                    >

                                        {
                                            loading
                                                ? "Loading dispatches..."
                                                : "No Dispatch Entries Found"
                                        }

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