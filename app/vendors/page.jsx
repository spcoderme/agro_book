"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function VendorsPage() {

    const [vendors, setVendors] = useState([]);

    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);

    // ================= LOAD VENDORS =================
    const loadVendors = async () => {

        try {

            setLoading(true);

            const res = await fetch(
                `/api/vendors?search=${search}`
            );

            const data = await res.json();

            setVendors(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (err) {

            console.log(err);

            alert("Failed to load vendors");

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {
        loadVendors();
    }, []);

    // ================= DELETE =================
    const deleteVendor = async (id) => {

        const confirmDelete =
            confirm(
                "Are you sure you want to delete this vendor?"
            );

        if (!confirmDelete) return;

        try {

            const res = await fetch(
                `/api/vendors/${id}`,
                {
                    method: "DELETE"
                }
            );

            const data = await res.json();

            if (data.success) {

                alert("Vendor Deleted ✅");

                loadVendors();

            } else {

                alert(
                    data.error || "Delete failed"
                );
            }

        } catch (err) {

            console.log(err);

            alert("Something went wrong");
        }
    };

    return (

        <div className="
            w-full
            max-w-[100vw]
            overflow-x-hidden
            px-3
            sm:px-5
            py-4
        ">

            {/* HEADER */}
            <div className="
                flex
                flex-col
                sm:flex-row
                sm:items-center
                sm:justify-between
                gap-4
                mb-6
            ">

                <div>

                    <h1 className="
                        text-2xl
                        sm:text-3xl
                        font-bold
                        text-gray-800
                    ">
                        Vendors
                    </h1>

                    <p className="
                        text-sm
                        text-gray-500
                        mt-1
                    ">
                        Manage vendor records
                    </p>

                </div>

                <Link
                    href="/vendor-create"
                    className="
                        bg-blue-600
                        hover:bg-blue-700
                        text-white
                        px-5
                        py-3
                        rounded-xl
                        text-sm
                        font-medium
                        transition
                        w-full
                        sm:w-auto
                        text-center
                    "
                >
                    + Add Vendor
                </Link>
                <Link
                    href="/dashboard"
                    className="bg-gray-700 hover:bg-black text-white px-4 py-2 rounded-xl transition text-sm w-fit"
                >
                    ← Dashboard
                </Link>

            </div>

            {/* SEARCH */}
            <div className="
                bg-white
                border
                rounded-2xl
                shadow-sm
                p-4
                mb-5
            ">

                <div className="
                    flex
                    flex-col
                    md:flex-row
                    gap-3
                ">

                    <input
                        className="
                            input
                            w-full
                        "
                        placeholder="Search vendor by name, mobile, GST..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        onKeyDown={(e) => {

                            if (e.key === "Enter") {
                                loadVendors();
                            }
                        }}
                    />

                    <button
                        onClick={loadVendors}
                        className="
                            bg-gray-800
                            hover:bg-black
                            text-white
                            px-6
                            py-3
                            rounded-xl
                            font-medium
                            transition
                            w-full
                            md:w-auto
                        "
                    >

                        {
                            loading
                                ? "Searching..."
                                : "Search"
                        }

                    </button>

                </div>

            </div>

            {/* MOBILE CARDS */}
            <div className="
                grid
                grid-cols-1
                gap-4
                lg:hidden
            ">

                {
                    !loading &&
                    vendors.length === 0 && (

                        <div className="
                            bg-white
                            border
                            rounded-2xl
                            p-6
                            text-center
                            text-gray-500
                        ">
                            No Vendors Found
                        </div>
                    )
                }

                {
                    vendors.map(v => (

                        <div
                            key={v.id}
                            className="
                                bg-white
                                border
                                rounded-2xl
                                p-4
                                shadow-sm
                            "
                        >

                            <div className="
                                flex
                                items-start
                                justify-between
                                gap-3
                                mb-3
                            ">

                                <div>

                                    <h2 className="
                                        text-lg
                                        font-semibold
                                        text-gray-800
                                    ">
                                        {v.name}
                                    </h2>

                                    <p className="
                                        text-xs
                                        text-gray-500
                                    ">
                                        Vendor ID: {v.id}
                                    </p>

                                </div>

                            </div>

                            <div className="
                                space-y-2
                                text-sm
                            ">

                                <div>
                                    <span className="font-medium">
                                        Mobile:
                                    </span>
                                    {" "}
                                    {v.mobile || "-"}
                                </div>

                                <div>
                                    <span className="font-medium">
                                        GST No:
                                    </span>
                                    {" "}
                                    {v.gst_no || "-"}
                                </div>

                                <div>
                                    <span className="font-medium">
                                        Address:
                                    </span>
                                    {" "}
                                    {v.address || "-"}
                                </div>

                            </div>

                            <div className="
                                flex
                                gap-2
                                mt-5
                            ">

                                <Link
                                    href={`/vendor-edit/${v.id}`}
                                    className="
                                        flex-1
                                        bg-green-600
                                        hover:bg-green-700
                                        text-white
                                        text-center
                                        py-2
                                        rounded-xl
                                        text-sm
                                        font-medium
                                    "
                                >
                                    Edit
                                </Link>

                                <button
                                    onClick={() =>
                                        deleteVendor(v.id)
                                    }
                                    className="
                                        flex-1
                                        bg-red-600
                                        hover:bg-red-700
                                        text-white
                                        py-2
                                        rounded-xl
                                        text-sm
                                        font-medium
                                    "
                                >
                                    Delete
                                </button>

                            </div>

                        </div>

                    ))
                }

            </div>

            {/* DESKTOP TABLE */}
            <div className="
                hidden
                lg:block
                overflow-x-auto
                border
                rounded-2xl
                bg-white
                shadow-sm
            ">

                <table className="
                    w-full
                    text-sm
                ">

                    <thead className="
                        bg-gray-100
                    ">

                        <tr>

                            <th className="
                                border-b
                                p-4
                                text-left
                            ">
                                ID
                            </th>

                            <th className="
                                border-b
                                p-4
                                text-left
                            ">
                                Vendor Name
                            </th>

                            <th className="
                                border-b
                                p-4
                                text-left
                            ">
                                Mobile
                            </th>

                            <th className="
                                border-b
                                p-4
                                text-left
                            ">
                                GST No
                            </th>

                            <th className="
                                border-b
                                p-4
                                text-left
                            ">
                                Address
                            </th>

                            <th className="
                                border-b
                                p-4
                                text-center
                            ">
                                Actions
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {
                            loading && (

                                <tr>

                                    <td
                                        colSpan="6"
                                        className="
                                            p-6
                                            text-center
                                            text-gray-500
                                        "
                                    >
                                        Loading vendors...
                                    </td>

                                </tr>
                            )
                        }

                        {
                            !loading &&
                            vendors.length === 0 && (

                                <tr>

                                    <td
                                        colSpan="6"
                                        className="
                                            p-6
                                            text-center
                                            text-gray-500
                                        "
                                    >
                                        No Vendors Found
                                    </td>

                                </tr>
                            )
                        }

                        {
                            vendors.map(v => (

                                <tr
                                    key={v.id}
                                    className="
                                        hover:bg-gray-50
                                        transition
                                    "
                                >

                                    <td className="p-4 border-b">
                                        #{v.id}
                                    </td>

                                    <td className="
                                        p-4
                                        border-b
                                        font-semibold
                                    ">
                                        {v.name}
                                    </td>

                                    <td className="p-4 border-b">
                                        {v.mobile || "-"}
                                    </td>

                                    <td className="p-4 border-b">
                                        {v.gst_no || "-"}
                                    </td>

                                    <td className="
                                        p-4
                                        border-b
                                        max-w-[250px]
                                    ">
                                        <div className="
                                            truncate
                                        ">
                                            {v.address || "-"}
                                        </div>
                                    </td>

                                    <td className="
                                        p-4
                                        border-b
                                    ">

                                        <div className="
                                            flex
                                            justify-center
                                            gap-2
                                        ">

                                            <Link
                                                href={`/vendor-edit/${v.id}`}
                                                className="
                                                    bg-green-600
                                                    hover:bg-green-700
                                                    text-white
                                                    px-4
                                                    py-2
                                                    rounded-lg
                                                    text-xs
                                                    font-medium
                                                "
                                            >
                                                Edit
                                            </Link>

                                            <button
                                                onClick={() =>
                                                    deleteVendor(v.id)
                                                }
                                                className="
                                                    bg-red-600
                                                    hover:bg-red-700
                                                    text-white
                                                    px-4
                                                    py-2
                                                    rounded-lg
                                                    text-xs
                                                    font-medium
                                                "
                                            >
                                                Delete
                                            </button>

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