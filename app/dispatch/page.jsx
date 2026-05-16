"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import "react-datepicker/dist/react-datepicker.css";
import Link from "next/link";

const Select = dynamic(
    () => import("react-select"),
    { ssr: false }
);

const DatePicker = dynamic(
    () => import("react-datepicker"),
    { ssr: false }
);

export default function DispatchPage() {

    // ================= HYDRATION SAFE =================
    const [mounted, setMounted] =
        useState(false);

    // ================= PRODUCTS =================
    const [products, setProducts] =
        useState([]);

    // ================= FORM =================
    const [form, setForm] =
        useState({
            sell_bill_no: "",
            dispatch_date: "",
            driver_name: "",
            bill_photo: null
        });

    // ================= ITEMS =================
    const [items, setItems] =
        useState([
            {
                product_id: "",
                product_name: "",
                stock: 0,
                quantity: "",
                unit_value: "",
                unit_name: ""
            }
        ]);

    // ================= MOUNT =================
    useEffect(() => {

        setMounted(true);

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

    // ================= HYDRATION FIX =================
    if (!mounted) {
        return null;
    }

    // ================= UPDATE ITEM =================
    const updateItem = (
        index,
        key,
        value
    ) => {

        const updated =
            [...items];

        updated[index][key] =
            value;

        setItems(updated);
    };

    // ================= ADD ROW =================
    const addRow = () => {

        setItems([
            ...items,
            {
                product_id: "",
                product_name: "",
                stock: 0,
                quantity: "",
                unit_value: "",
                unit_name: ""
            }
        ]);
    };

    // ================= REMOVE ROW =================
    const removeRow = (index) => {

        const updated =
            items.filter(
                (_, i) => i !== index
            );

        setItems(updated);
    };

    // ================= SUBMIT =================
    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const formData =
                new FormData();

            formData.append(
                "sell_bill_no",
                form.sell_bill_no
            );

            formData.append(
                "dispatch_date",
                form.dispatch_date
            );

            formData.append(
                "driver_name",
                form.driver_name
            );

            formData.append(
                "items",
                JSON.stringify(items)
            );

            if (form.bill_photo) {

                formData.append(
                    "bill_photo",
                    form.bill_photo
                );
            }

            const res =
                await fetch(
                    "/api/dispatch",
                    {
                        method: "POST",
                        body: formData
                    }
                );

            const data =
                await res.json();

            if (data.success) {

                alert(
                    "Dispatch Saved ✅"
                );

                setForm({
                    sell_bill_no: "",
                    dispatch_date: "",
                    driver_name: "",
                    bill_photo: null
                });

                setItems([
                    {
                        product_id: "",
                        product_name: "",
                        stock: 0,
                        quantity: "",
                        unit_value: "",
                        unit_name: ""
                    }
                ]);

            } else {

                alert(
                    data.error || "Failed"
                );
            }

        } catch (err) {

            console.log(err);

            alert(
                "Something went wrong"
            );
        }
    };

    return (

        <div className="w-full max-w-7xl mx-auto px-3 py-4 md:px-6">

            

            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-5">

                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                    Dispatch Product
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                    Manage outgoing stock dispatch
                </p>

                {/* DASHBOARD BUTTON */}
                <Link href="/dashboard" className="bg-gray-700 hover:bg-black text-white px-4 py-2 rounded-xl text-sm w-fit"
                >
                    ← Dashboard
                </Link>

            </div>

            <form onSubmit={handleSubmit}>

                {/* TOP FORM */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">

                    {/* BILL */}
                    <input
                        className="input w-full"
                        placeholder="Sell Bill No"
                        value={form.sell_bill_no}
                        onChange={e =>
                            setForm({
                                ...form,
                                sell_bill_no:
                                    e.target.value
                            })
                        }
                    />

                    {/* DATE */}
                    <div className="relative z-[9999]">

    <DatePicker
        selected={
            form.dispatch_date
                ? new Date(
                    form.dispatch_date.split("-")[0],
                    form.dispatch_date.split("-")[1] - 1,
                    form.dispatch_date.split("-")[2]
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

            setForm({
                ...form,
                dispatch_date:
                    `${year}-${month}-${day}`
            });
        }}

        dateFormat="dd/MM/yyyy"

        placeholderText="Dispatch Date"

        className="input w-full"

        popperClassName="datepicker-zindex"

        portalId="root-portal"
    />

</div>

                    {/* DRIVER */}
                    <input
                        className="input w-full"
                        placeholder="Driver Name"
                        value={form.driver_name}
                        onChange={e =>
                            setForm({
                                ...form,
                                driver_name:
                                    e.target.value
                            })
                        }
                    />

                    {/* FILE */}
                    <input
                        type="file"
                        className="input w-full"
                        accept="image/*"
                        onChange={e =>
                            setForm({
                                ...form,
                                bill_photo:
                                    e.target.files[0]
                            })
                        }
                    />

                </div>

                {/* TABLE */}
                <div className="overflow-x-auto border rounded-xl bg-white shadow-sm">

                    <table className="min-w-[900px] w-full text-sm">

                        <thead className="bg-gray-100 sticky top-0 z-10">

                            <tr>

                                <th className="border p-3 text-left">
                                    Product
                                </th>

                                <th className="border p-3 text-center">
                                    Current Stock
                                </th>

                                <th className="border p-3 text-center">
                                    Dispatch Qty
                                </th>

                                <th className="border p-3 text-center">
                                    Remaining
                                </th>

                                <th className="border p-3 text-center">
                                    Action
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {items.map((item, i) => {

                                const stock =
                                    Number(
                                        item.stock
                                    ) || 0;

                                const qty =
                                    Number(
                                        item.quantity
                                    ) || 0;

                                const remaining =
                                    stock - qty;

                                return (

                                    <tr
                                        key={i}
                                        className="hover:bg-gray-50"
                                    >

                                        {/* PRODUCT */}
                                        <td className="border p-2 min-w-[320px]">

                                            <Select
                                                placeholder="Search Product..."

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

                                                options={products.map(p => ({
                                                    value: p.id,

                                                    label:
                                                        `${p.name} (${parseFloat(p.unit_value || 0)}${p.unit_name || ""}) [Stock: ${parseFloat(p.stock || 0)}]`,

                                                    product: p
                                                }))}

                                                value={
                                                    item.product_id
                                                        ? {
                                                            value:
                                                                item.product_id,

                                                            label:
                                                                `${item.product_name} (${parseFloat(item.unit_value || 0)}${item.unit_name || ""}) [Stock: ${parseFloat(item.stock || 0)}]`
                                                        }
                                                        : null
                                                }

                                                onChange={(selectedOption) => {

                                                    if (!selectedOption) return;

                                                    const selected =
                                                        selectedOption.product;

                                                    const updated =
                                                        [...items];

                                                    updated[i] = {
                                                        ...updated[i],

                                                        product_id:
                                                            selected.id,

                                                        product_name:
                                                            selected.name,

                                                        stock:
                                                            selected.stock,

                                                        unit_value:
                                                            selected.unit_value,

                                                        unit_name:
                                                            selected.unit_name
                                                    };

                                                    setItems(updated);
                                                }}
                                            />

                                        </td>

                                        {/* STOCK */}
                                        <td className="border p-2 text-center font-semibold">

                                            {
                                                parseFloat(
                                                    item.stock || 0
                                                )
                                            }

                                        </td>

                                        {/* QTY */}
                                        <td className="border p-2">

                                            <input
                                                type="number"

                                                min="0"

                                                max={item.stock}

                                                className="input w-full"

                                                value={item.quantity}

                                                onChange={e =>
                                                    updateItem(
                                                        i,
                                                        "quantity",
                                                        e.target.value
                                                    )
                                                }
                                            />

                                        </td>

                                        {/* REMAINING */}
                                        <td className="border p-2 text-center">

                                            <span
                                                className={
                                                    remaining < 0
                                                        ? "text-red-600 font-bold"
                                                        : "text-green-700 font-bold"
                                                }
                                            >
                                                {remaining}
                                            </span>

                                        </td>

                                        {/* REMOVE */}
                                        <td className="border p-2 text-center">

                                            <button
                                                type="button"

                                                onClick={() =>
                                                    removeRow(i)
                                                }

                                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-xs"
                                            >
                                                Remove
                                            </button>

                                        </td>

                                    </tr>
                                );
                            })}

                        </tbody>

                    </table>

                </div>

                {/* BUTTONS */}
                <div className="mt-5 flex flex-col sm:flex-row gap-3">

                    <button
                        type="button"

                        onClick={addRow}

                        className="bg-gray-300 hover:bg-gray-400 px-4 py-3 rounded-xl font-medium"
                    >
                        + Add Row
                    </button>

                    <button
                        type="submit"

                        className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl font-medium"
                    >
                        Save Dispatch
                    </button>

                </div>

            </form>

        </div>
    );
}