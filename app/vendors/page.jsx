"use client";

import { useEffect, useState } from "react";

export default function VendorsPage() {

    const [vendors, setVendors] = useState([]);

    const [search, setSearch] = useState("");

    // LOAD VENDORS
    const loadVendors = async () => {

        const res = await fetch(
            `/api/vendors?search=${search}`
        );

        const data = await res.json();

        setVendors(data);
    };

    useEffect(() => {
        loadVendors();
    }, []);

    // DELETE
    const deleteVendor = async (id) => {

        const confirmDelete =
            confirm("Delete Vendor ?");

        if (!confirmDelete) return;

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

            alert(data.error || "Failed");
        }
    };

    return (

        <div className="p-5">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-5">

                <h1 className="text-2xl font-bold">
                    Vendors
                </h1>

                <a
                    href="/vendor-create"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                    + Add Vendor
                </a>

            </div>

            {/* SEARCH */}
            <div className="flex gap-3 mb-5">

                <input
                    className="input w-full"
                    placeholder="Search Vendor..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />

                <button
                    onClick={loadVendors}
                    className="bg-gray-700 text-white px-5 rounded"
                >
                    Search
                </button>

            </div>

            {/* TABLE */}
            <div className="overflow-auto border rounded">

                <table className="w-full text-sm border border-separate">

                    <thead className="bg-gray-200">

                        <tr>

                            <th className="border p-2">
                                ID
                            </th>

                            <th className="border p-2">
                                Vendor Name
                            </th>

                            <th className="border p-2">
                                Mobile
                            </th>

                            <th className="border p-2">
                                GST No
                            </th>

                            <th className="border p-2">
                                Address
                            </th>

                            <th className="border p-2">
                                Actions
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {
                            vendors.length === 0 && (

                                <tr>

                                    <td
                                        colSpan="6"
                                        className="text-center p-5 text-gray-500"
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
                                    className="hover:bg-gray-50"
                                >

                                    <td className="border p-2">
                                        {v.id}
                                    </td>

                                    <td className="border p-2 font-medium">
                                        {v.name}
                                    </td>

                                    <td className="border p-2">
                                        {v.mobile || "-"}
                                    </td>

                                    <td className="border p-2">
                                        {v.gst_no || "-"}
                                    </td>

                                    <td className="border p-2">
                                        {v.address || "-"}
                                    </td>

                                    <td className="border p-2">

                                        <div className="flex gap-2">

                                            {/* EDIT */}
                                            <a
                                                href={`/vendor-edit/${v.id}`}
                                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs"
                                            >
                                                Edit
                                            </a>

                                            {/* DELETE */}
                                            <button
                                                onClick={() =>
                                                    deleteVendor(v.id)
                                                }
                                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs"
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