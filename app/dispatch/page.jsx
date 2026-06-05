"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

import "react-datepicker/dist/react-datepicker.css";

const Select = dynamic(
    () => import("react-select"),
    { ssr: false }
);

const DatePicker = dynamic(
    () => import("react-datepicker"),
    { ssr: false }
);

export default function DispatchPage() {

    // ======================================================
    // STATES
    // ======================================================

    const [mounted, setMounted] =
        useState(false);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [uploadProgress, setUploadProgress] =
        useState(0);

    const [preview, setPreview] =
        useState(null);

    const [products, setProducts] =
        useState([]);

    const [errors, setErrors] =
        useState({});

    const [form, setForm] =
        useState({
            sell_bill_no: "",
            dispatch_date: new Date(),
            driver_name: "",
            bill_photo: null
        });

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

    // ======================================================
    // LOAD PRODUCTS
    // ======================================================

    useEffect(() => {

        setMounted(true);

        loadProducts();

    }, []);

    const loadProducts = async () => {

        try {

            setLoading(true);

            const res =
                await fetch("/api/products");

            const data =
                await res.json();

            if (Array.isArray(data)) {

                setProducts(data);

            } else {

                setProducts([]);
            }

        } catch (err) {

            console.log(err);

            setProducts([]);

        } finally {

            setLoading(false);
        }
    };

    

    // ======================================================
    // PRODUCT OPTIONS
    // ======================================================

    const productOptions =
        useMemo(() => {

            return products.map(p => ({

                value: p.id,

                label:
                    `${p.name} ` +
                    `(${parseFloat(
                        p.unit_value || 0
                    )}${p.unit_name || ""}) ` +
                    `[Stock: ${parseFloat(
                        p.stock || 0
                    )}]`,

                product: p
            }));

        }, [products]);


        // ======================================================
    // HYDRATION FIX
    // ======================================================

    if (!mounted) return null;

    // ======================================================
    // UPDATE ITEM
    // ======================================================

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

    // ======================================================
    // SELECT PRODUCT
    // ======================================================

    const handleProductSelect = (
        selectedOption,
        index
    ) => {

        if (!selectedOption) return;

        const selected =
            selectedOption.product;

        const updated =
            [...items];

        updated[index] = {

            ...updated[index],

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
    };

    // ======================================================
    // ADD ROW
    // ======================================================

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

    // ======================================================
    // REMOVE ROW
    // ======================================================

    const removeRow = (index) => {

        if (items.length === 1) {

            return;
        }

        const updated =
            items.filter(
                (_, i) => i !== index
            );

        setItems(updated);
    };

    // ======================================================
    // VALIDATION
    // ======================================================

    const validateForm = () => {

        const newErrors = {};

        if (!form.sell_bill_no.trim()) {

            newErrors.sell_bill_no =
                "Sell bill number required";
        }

        if (!form.dispatch_date) {

            newErrors.dispatch_date =
                "Dispatch date required";
        }

        const validItems =
            items.filter(
                item =>
                    item.product_id &&
                    Number(item.quantity) > 0
            );

        if (validItems.length === 0) {

            newErrors.items =
                "Add at least one product";
        }

        validItems.forEach((item, i) => {

            if (
                Number(item.quantity) >
                Number(item.stock)
            ) {

                newErrors[
                    `qty_${i}`
                ] =
                    `${item.product_name} exceeds stock`;
            }
        });

        setErrors(newErrors);

        return (
            Object.keys(newErrors)
                .length === 0
        );
    };

    // ======================================================
    // FILE CHANGE
    // ======================================================

    const handleFileChange = (e) => {

        const file =
            e.target.files?.[0];

        if (!file) return;

        const allowedTypes = [

            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp"
        ];

        if (
            !allowedTypes.includes(
                file.type
            )
        ) {

            alert(
                "Only JPG, PNG and WEBP allowed"
            );

            return;
        }

        if (
            file.size >
            5 * 1024 * 1024
        ) {

            alert(
                "Max file size is 5MB"
            );

            return;
        }

        setForm({
            ...form,
            bill_photo: file
        });

        const reader =
            new FileReader();

        reader.onloadend = () => {

            setPreview(
                reader.result
            );
        };

        reader.readAsDataURL(file);
    };

    // ======================================================
    // SUBMIT
    // ======================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!validateForm()) {

            return;
        }

        try {

            setSaving(true);

            setUploadProgress(10);

            const formData =
                new FormData();

            formData.append(
                "sell_bill_no",
                form.sell_bill_no
            );

            formData.append(
                "driver_name",
                form.driver_name
            );

            formData.append(
                "dispatch_date",
                form.dispatch_date
                    ?.toISOString()
                    ?.split("T")[0]
            );

            formData.append(
                "items",
                JSON.stringify(items)
            );

            if (
                form.bill_photo
            ) {

                formData.append(
                    "bill_photo",
                    form.bill_photo
                );
            }

            setUploadProgress(40);

            const res =
                await fetch(
                    "/api/dispatch",
                    {
                        method: "POST",
                        body: formData
                    }
                );

            setUploadProgress(80);

            const data =
                await res.json();

            setUploadProgress(100);

            if (data.success) {

                alert(
                    "Dispatch Saved ✅"
                );

                setForm({
                    sell_bill_no: "",
                    dispatch_date:
                        new Date(),
                    driver_name: "",
                    bill_photo: null
                });

                setPreview(null);

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

                setErrors({});

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

        } finally {

            setSaving(false);

            setTimeout(() => {

                setUploadProgress(0);

            }, 1000);
        }
    };

    // ======================================================
    // UI
    // ======================================================

    return (

        <div className="
            min-h-screen
            bg-gray-50
        ">

            <div className="
                w-full
                max-w-7xl
                mx-auto
                px-3
                py-4
                sm:px-5
                lg:px-6
            ">

                {/* HEADER */}
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
                            sm:text-3xl
                            font-bold
                            text-gray-800
                        ">
                            🚚 Dispatch Product
                        </h1>

                        <p className="
                            text-sm
                            text-gray-500
                            mt-1
                        ">
                            Manage outgoing stock dispatch
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
                            w-fit
                            transition
                        "
                    >
                        ← Dashboard
                    </Link>

                </div>

                {/* FORM */}
                <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >

                    {/* TOP CARD */}
                    <div className="
                        bg-white
                        rounded-3xl
                        border
                        shadow-sm
                        p-4
                        sm:p-6
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
                                ">
                                    Sell Bill No
                                </label>

                                <input
                                    className="
                                        input
                                        w-full
                                    "
                                    placeholder="Enter bill no"

                                    value={
                                        form.sell_bill_no
                                    }

                                    onChange={e =>
                                        setForm({
                                            ...form,
                                            sell_bill_no:
                                                e.target.value
                                        })
                                    }
                                />

                                {
                                    errors.sell_bill_no && (

                                        <p className="
                                            text-xs
                                            text-red-600
                                            mt-1
                                        ">
                                            {
                                                errors.sell_bill_no
                                            }
                                        </p>
                                    )
                                }

                            </div>

                            {/* DATE */}
                            <div className="
                                relative
                                z-[999]
                            ">

                                <label className="
                                    block
                                    text-sm
                                    font-medium
                                    mb-2
                                ">
                                    Dispatch Date
                                </label>

                                <DatePicker
                                    selected={
                                        form.dispatch_date
                                    }

                                    onChange={(date) =>
                                        setForm({
                                            ...form,
                                            dispatch_date:
                                                date
                                        })
                                    }

                                    dateFormat="dd/MM/yyyy"

                                    className="
                                        input
                                        w-full
                                    "

                                    placeholderText="
                                        Select Date
                                    "

                                    popperPlacement="
                                        bottom-start
                                    "

                                    portalId="root"
                                />

                            </div>

                            {/* DRIVER */}
                            <div>

                                <label className="
                                    block
                                    text-sm
                                    font-medium
                                    mb-2
                                ">
                                    Driver Name
                                </label>

                                <input
                                    className="
                                        input
                                        w-full
                                    "
                                    placeholder="Driver Name"

                                    value={
                                        form.driver_name
                                    }

                                    onChange={e =>
                                        setForm({
                                            ...form,
                                            driver_name:
                                                e.target.value
                                        })
                                    }
                                />

                            </div>

                            {/* FILE */}
                            <div>

                                <label className="
                                    block
                                    text-sm
                                    font-medium
                                    mb-2
                                ">
                                    Bill Photo
                                </label>

                                <input
                                    type="file"

                                    accept="
                                        image/png,
                                        image/jpeg,
                                        image/jpg,
                                        image/webp
                                    "

                                    className="
                                        block
                                        w-full
                                        text-sm
                                        text-gray-600
                                        file:mr-4
                                        file:py-2
                                        file:px-4
                                        file:rounded-xl
                                        file:border-0
                                        file:bg-green-600
                                        file:text-white
                                        hover:file:bg-green-700
                                        cursor-pointer
                                    "

                                    onChange={
                                        handleFileChange
                                    }
                                />

                            </div>

                        </div>

                        {/* IMAGE PREVIEW */}
                        {
                            preview && (

                                <div className="
                                    mt-5
                                    relative
                                    max-w-sm
                                ">

                                    <img
                                        src={preview}
                                        alt="preview"
                                        className="
                                            rounded-2xl
                                            border
                                            shadow-sm
                                            w-full
                                            object-cover
                                            max-h-72
                                        "
                                    />

                                    <button
                                        type="button"

                                        onClick={() => {

                                            setPreview(null);

                                            setForm({
                                                ...form,
                                                bill_photo: null
                                            });
                                        }}

                                        className="
                                            absolute
                                            top-3
                                            right-3
                                            bg-red-600
                                            hover:bg-red-700
                                            text-white
                                            px-3
                                            py-1
                                            rounded-lg
                                            text-xs
                                        "
                                    >
                                        Remove
                                    </button>

                                </div>
                            )
                        }

                        {/* UPLOAD BAR */}
                        {
                            saving && (

                                <div className="
                                    mt-5
                                ">

                                    <div className="
                                        h-3
                                        bg-gray-200
                                        rounded-full
                                        overflow-hidden
                                    ">

                                        <div
                                            className="
                                                h-full
                                                bg-green-600
                                                transition-all
                                                duration-300
                                            "
                                            style={{
                                                width:
                                                    `${uploadProgress}%`
                                            }}
                                        />

                                    </div>

                                    <div className="
                                        text-xs
                                        text-gray-500
                                        mt-1
                                    ">
                                        Uploading...
                                        {" "}
                                        {uploadProgress}%
                                    </div>

                                </div>
                            )
                        }

                    </div>

                    {/* TABLE */}
                    <div className="
                        bg-white
                        rounded-3xl
                        border
                        shadow-sm
                        overflow-hidden
                    ">

                        <div className="
                            overflow-x-auto
                        ">

                            <table className="
                                min-w-[950px]
                                w-full
                                text-sm
                            ">

                                <thead className="
                                    bg-gray-100
                                ">

                                    <tr>

                                        <th className="
                                            border
                                            p-4
                                            text-left
                                        ">
                                            Product
                                        </th>

                                        <th className="
                                            border
                                            p-4
                                            text-center
                                        ">
                                            Stock
                                        </th>

                                        <th className="
                                            border
                                            p-4
                                            text-center
                                        ">
                                            Dispatch Qty
                                        </th>

                                        <th className="
                                            border
                                            p-4
                                            text-center
                                        ">
                                            Remaining
                                        </th>

                                        <th className="
                                            border
                                            p-4
                                            text-center
                                        ">
                                            Action
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {
                                        items.map((item, i) => {

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
                                                    className="
                                                        hover:bg-gray-50
                                                    "
                                                >

                                                    {/* PRODUCT */}
                                                    <td className="
                                                        border
                                                        p-3
                                                        min-w-[320px]
                                                    ">

                                                        <Select

                                                            placeholder="
                                                                Search Product...
                                                            "

                                                            options={
                                                                productOptions
                                                            }

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

                                                            onChange={(selectedOption) =>
                                                                handleProductSelect(
                                                                    selectedOption,
                                                                    i
                                                                )
                                                            }

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
                                                        />

                                                    </td>

                                                    {/* STOCK */}
                                                    <td className="
                                                        border
                                                        p-3
                                                        text-center
                                                        font-semibold
                                                    ">
                                                        {
                                                            parseFloat(
                                                                item.stock || 0
                                                            )
                                                        }
                                                    </td>

                                                    {/* QTY */}
                                                    <td className="
                                                        border
                                                        p-3
                                                    ">

                                                        <input
                                                            type="number"

                                                            min="0"

                                                            max={
                                                                item.stock
                                                            }

                                                            className="
                                                                input
                                                                w-full
                                                            "

                                                            value={
                                                                item.quantity
                                                            }

                                                            onChange={e =>
                                                                updateItem(
                                                                    i,
                                                                    "quantity",
                                                                    e.target.value
                                                                )
                                                            }
                                                        />

                                                        {
                                                            errors[
                                                            `qty_${i}`
                                                            ] && (

                                                                <p className="
                                                                    text-xs
                                                                    text-red-600
                                                                    mt-1
                                                                ">
                                                                    {
                                                                        errors[
                                                                        `qty_${i}`
                                                                        ]
                                                                    }
                                                                </p>
                                                            )
                                                        }

                                                    </td>

                                                    {/* REMAINING */}
                                                    <td className="
                                                        border
                                                        p-3
                                                        text-center
                                                    ">

                                                        <span
                                                            className={
                                                                remaining < 0
                                                                    ? "text-red-600 font-bold"
                                                                    : "text-green-700 font-bold"
                                                            }
                                                        >
                                                            {
                                                                remaining
                                                            }
                                                        </span>

                                                    </td>

                                                    {/* REMOVE */}
                                                    <td className="
                                                        border
                                                        p-3
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
                                                                px-4
                                                                py-2
                                                                rounded-xl
                                                                text-xs
                                                                font-medium
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

                    </div>

                    {/* BUTTONS */}
                    <div className="
                        flex
                        flex-col
                        sm:flex-row
                        gap-3
                    ">

                        <button
                            type="button"

                            onClick={addRow}

                            className="
                                bg-gray-200
                                hover:bg-gray-300
                                px-5
                                py-3
                                rounded-2xl
                                font-medium
                                transition
                            "
                        >
                            + Add Product Row
                        </button>

                        <button
                            type="submit"

                            disabled={saving}

                            className="
                                bg-green-600
                                hover:bg-green-700
                                disabled:opacity-60
                                text-white
                                px-6
                                py-3
                                rounded-2xl
                                font-semibold
                                transition
                            "
                        >
                            {
                                saving
                                    ? "Saving..."
                                    : "Save Dispatch"
                            }
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}