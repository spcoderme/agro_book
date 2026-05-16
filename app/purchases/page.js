"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import DatePicker from "react-datepicker";
import dynamic from "next/dynamic";
import Link from "next/link";

import "react-datepicker/dist/react-datepicker.css";

const Select = dynamic(() => import("react-select"), { ssr: false });

// ================= DEBOUNCE =================
const debounce = (fn, delay = 500) => {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
};

export default function PurchasesPage() {

    const [mounted, setMounted] = useState(false);
    const [rows, setRows] = useState([]);
    const [products, setProducts] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(false);

    const [filters, setFilters] = useState({
        bill_no: "",
        vendor: "",
        product: "",
        date: null
    });

    // ================= DATE FORMAT =================
    const formatDate = (date) => {
        if (!date) return "";
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    };

    // ================= LOAD DATA =================
    const loadData = useCallback(async (customFilters = filters) => {

        try {
            setLoading(true);

            const query = new URLSearchParams({
                bill_no: customFilters.bill_no,
                vendor: customFilters.vendor,
                product: customFilters.product,
                date: customFilters.date ? formatDate(customFilters.date) : ""
            }).toString();

            const res = await fetch(`/api/purchases?${query}`);
            const data = await res.json();

            setRows(Array.isArray(data) ? data : []);

        } catch (err) {
            console.error("LOAD ERROR:", err);
        } finally {
            setLoading(false);
        }

    }, [filters]);

    // ================= DEBOUNCED FETCH =================
    const debouncedFetch = useMemo(
        () => debounce(loadData, 500),
        [loadData]
    );

    // ================= INITIAL LOAD =================
    useEffect(() => {
        setMounted(true);
        loadData();

        fetch("/api/products")
            .then(res => res.json())
            .then(data => setProducts(Array.isArray(data) ? data : []));

        fetch("/api/vendors")
            .then(res => res.json())
            .then(data => setVendors(Array.isArray(data) ? data : []));

    }, []);

    // ================= AUTO FILTER =================
    useEffect(() => {
        if (!mounted) return;
        debouncedFetch(filters);
    }, [filters]);

    // ================= VENDOR FILTER (OPTIMIZED) =================
    const filteredVendors = useMemo(() => {
        if (!filters.vendor) return [];
        return vendors.filter(v =>
            v.name.toLowerCase().includes(filters.vendor.toLowerCase())
        );
    }, [vendors, filters.vendor]);

    if (!mounted) {
        return <div className="p-5 text-center">Loading...</div>;
    }

    return (
        <div className="w-full px-2 sm:px-4 md:px-6 py-4 max-w-[100vw] overflow-x-hidden">

            {/* HEADER */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">

                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Purchase History
                    </h1>
                    <p className="text-sm text-gray-500">
                        View & manage purchases
                    </p>
                </div>

                <Link
                    href="/dashboard"
                    className="bg-gray-700 hover:bg-black text-white px-4 py-2 rounded-xl text-sm w-fit"
                >
                    ← Dashboard
                </Link>

            </div>

            {/* FILTERS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-5">

                {/* BILL */}
                <input
                    className="input"
                    placeholder="Bill No"
                    value={filters.bill_no}
                    onChange={e =>
                        setFilters({ ...filters, bill_no: e.target.value })
                    }
                />

                {/* VENDOR */}
                <div className="relative z-20">
                    <input
                        className="input w-full"
                        placeholder="Search Vendor"
                        value={filters.vendor}
                        onChange={(e) =>
                            setFilters({ ...filters, vendor: e.target.value })
                        }
                    />

                    {filteredVendors.length > 0 && (
                        <div className="absolute top-full left-0 z-50 bg-white border w-full max-h-52 overflow-y-auto rounded-xl shadow-lg">

                            {filteredVendors.map(v => (
                                <div
                                    key={v.id}
                                    className="p-3 hover:bg-gray-100 cursor-pointer border-b"
                                    onClick={() =>
                                        setFilters({ ...filters, vendor: v.name })
                                    }
                                >
                                    <div className="font-medium">{v.name}</div>
                                    <div className="text-xs text-gray-500">{v.mobile}</div>
                                </div>
                            ))}

                        </div>
                    )}
                </div>

                {/* PRODUCT */}
                <div className="z-10">
                    <Select
                        placeholder="Search Product..."
                        isClearable
                        menuPortalTarget={typeof window !== "undefined" ? document.body : null}
                        menuPosition="fixed"
                        styles={{
                            menuPortal: base => ({ ...base, zIndex: 9999 })
                        }}
                        options={products.map(p => ({
                            value: p.name,
                            label: `${p.name} (${parseFloat(p.unit_value || 0)}) [Stock: ${p.stock || 0}]`
                        }))}
                        value={
                            filters.product
                                ? { value: filters.product, label: filters.product }
                                : null
                        }
                        onChange={(selected) =>
                            setFilters({ ...filters, product: selected?.value || "" })
                        }
                    />
                </div>

                {/* DATE */}
                <div className="relative z-30">
                    <DatePicker
                        selected={filters.date}
                        onChange={(date) =>
                            setFilters({ ...filters, date })
                        }
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Select Date"
                        popperPlacement="bottom-start"
                        className="input w-full"
                    />
                </div>

            </div>

            {/* TABLE */}
            <div className="w-full overflow-x-auto rounded-2xl border bg-white shadow-sm">

                <table className="min-w-[1100px] w-full text-xs sm:text-sm">

                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border p-3">Bill No</th>
                            <th className="border p-3">Payment</th>
                            <th className="border p-3">Date</th>
                            <th className="border p-3">Vendor</th>
                            <th className="border p-3">Product</th>
                            <th className="border p-3">Batch</th>
                            <th className="border p-3">Qty</th>
                            <th className="border p-3">Rate</th>
                            <th className="border p-3">Total</th>
                            <th className="border p-3">Actions</th>
                        </tr>
                    </thead>

                    <tbody>

                        {loading ? (
                            <tr>
                                <td colSpan={10} className="text-center p-6">
                                    Loading...
                                </td>
                            </tr>
                        ) : rows.length === 0 ? (
                            <tr>
                                <td colSpan={10} className="text-center p-6 text-gray-500">
                                    No purchases found
                                </td>
                            </tr>
                        ) : (
                            rows.map((r, i) => (
                                <tr key={i} className="hover:bg-gray-50">

                                    <td className="border p-2">{r.bill_no}</td>

                                    <td className="border p-2">
                                        {r.payment_status === "paid" ? (
                                            <span className="text-green-600 font-semibold">Paid</span>
                                        ) : (
                                            <span className="text-red-600 font-semibold">Pending</span>
                                        )}
                                    </td>

                                    <td className="border p-2">
                                        {r.purchase_date
                                            ? new Date(r.purchase_date).toLocaleDateString("en-GB")
                                            : "-"}
                                    </td>

                                    <td className="border p-2">{r.vendor_name}</td>

                                    <td className="border p-2">
                                        <div className="font-medium">{r.product_name}</div>
                                        <div className="text-xs text-gray-500">
                                            ({parseFloat(r.unit_value || 0)})
                                        </div>
                                    </td>

                                    <td className="border p-2">{r.batch_no}</td>
                                    <td className="border p-2 text-center">{r.quantity}</td>

                                    <td className="border p-2">
                                        ₹ {parseFloat(r.rate || 0).toFixed(2)}
                                    </td>

                                    <td className="border p-2 font-semibold">
                                        ₹ {parseFloat(r.total || 0).toFixed(2)}
                                    </td>

                                    <td className="border p-2">
                                        <div className="flex gap-2">
                                            <a
                                                href={`/purchase-view/${r.purchase_id}`}
                                                className="bg-blue-600 text-white px-3 py-2 rounded-lg text-xs"
                                            >
                                                View
                                            </a>
                                            <a
                                                href={`/purchase-edit/${r.purchase_id}`}
                                                className="bg-green-600 text-white px-3 py-2 rounded-lg text-xs"
                                            >
                                                Edit
                                            </a>
                                        </div>
                                    </td>

                                </tr>
                            ))
                        )}

                    </tbody>

                </table>

            </div>

        </div>
    );
}