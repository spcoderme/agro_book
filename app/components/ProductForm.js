"use client";

import { useEffect, useState } from "react";

export default function ProductForm({ onSuccess }) {

    // ================= HYDRATION SAFE =================
    const [mounted, setMounted] =
        useState(false);

    // ================= STATES =================
    const [name, setName] =
        useState("");

    const [categories, setCategories] =
        useState([]);

    const [units, setUnits] =
        useState([]);

    const [category_id, setCategory] =
        useState("");

    const [unit_id, setUnit] =
        useState("");

    const [unit_value, setUnitValue] =
        useState("");

    const [stock, setStock] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    // ================= LOAD DATA =================
    useEffect(() => {

        setMounted(true);

        // LOAD CATEGORIES
        fetch("/api/categories")
            .then(res => res.json())
            .then(setCategories)
            .catch(err =>
                console.log("CATEGORY ERROR:", err)
            );

        // LOAD UNITS
        fetch("/api/units")
            .then(res => res.json())
            .then(setUnits)
            .catch(err =>
                console.log("UNIT ERROR:", err)
            );

    }, []);

    // ================= HYDRATION FIX =================
    if (!mounted) {
        return null;
    }

    // ================= SUBMIT =================
    const submit = async () => {

        // VALIDATION
        if (
            !name ||
            !category_id ||
            !unit_id
        ) {

            alert(
                "Please fill all required fields"
            );

            return;
        }

        try {

            setLoading(true);

            const res = await fetch(
                "/api/products",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        name,
                        category_id,
                        unit_id,
                        unit_value,
                        stock
                    })
                }
            );

            const data =
                await res.json();

            if (!res.ok) {

                alert(
                    data.error ||
                    "Failed to add product"
                );

                return;
            }

            alert("Product Added ✅");

            // ================= RESET =================
            setName("");
            setCategory("");
            setUnit("");
            setUnitValue("");
            setStock("");

            // ================= RELOAD =================
            onSuccess?.();

        } catch (err) {

            console.log(
                "PRODUCT SAVE ERROR:",
                err
            );

            alert(
                "Something went wrong"
            );

        } finally {

            setLoading(false);
        }
    };

    return (

        <div className="bg-white rounded-2xl w-full">

            {/* ================= HEADER ================= */}

            <div className="mb-5">

    <h2
        className="
            text-xl
            sm:text-2xl
            font-bold
            text-gray-800
        "
    >
        Add Product
    </h2>

    <p
        className="
            text-xs
            sm:text-sm
            text-gray-500
            mt-1
        "
    >
        Create new inventory product
    </p>

</div>

            {/* ================= FORM ================= */}

            <div
    className="
        grid
        grid-cols-1
        sm:grid-cols-2
        xl:grid-cols-5
        gap-4
    "
>

                {/* PRODUCT NAME */}
                <div className="lg:col-span-2">

                    <label className="
                        text-sm
                        font-medium
                        text-gray-700
                        block
                        mb-1
                    ">
                        Product Name
                    </label>

                    <input
                        type="text"

                        value={name}

                        onChange={e =>
                            setName(
                                e.target.value
                            )
                        }

                        placeholder="Enter Product Name"

                        className="
                            w-full
                            border
                            rounded-xl
                            px-3
sm:px-4
py-2.5
sm:py-3
text-sm
                            outline-none
                            focus:ring-2
                            focus:ring-green-500
                        "
                    />

                </div>

                {/* CATEGORY */}
                <div>

                    <label className="
                        text-sm
                        font-medium
                        text-gray-700
                        block
                        mb-1
                    ">
                        Category
                    </label>

                    <select
                        value={category_id}

                        onChange={e =>
                            setCategory(
                                e.target.value
                            )
                        }

                        className="
                            w-full
                            border
                            rounded-xl
                            px-3
sm:px-4
py-2.5
sm:py-3
text-sm
                            outline-none
                            focus:ring-2
                            focus:ring-green-500
                        "
                    >

                        <option value="" disabled>
                            Select Category
                        </option>

                        {
                            categories.map(c => (

                                <option
                                    key={c.id}
                                    value={c.id}
                                >

                                    {c.name}
                                    {" "}
                                    ({c.name_marathi})

                                </option>
                            ))
                        }

                    </select>

                </div>

                {/* UNIT */}
                <div>

                    <label className="
                        text-sm
                        font-medium
                        text-gray-700
                        block
                        mb-1
                    ">
                        Unit
                    </label>

                    <select
                        value={unit_id}

                        onChange={e =>
                            setUnit(
                                e.target.value
                            )
                        }

                        className="
                            w-full
                            border
                            rounded-xl
                            px-3
sm:px-4
py-2.5
sm:py-3
text-sm
                            outline-none
                            focus:ring-2
                            focus:ring-green-500
                        "
                    >

                        <option value="" disabled>
                            Select Unit
                        </option>

                        {
                            units.map(u => (

                                <option
                                    key={u.id}
                                    value={u.id}
                                >

                                    {u.name}
                                    {" "}
                                    ({u.short_name})

                                </option>
                            ))
                        }

                    </select>

                </div>

                {/* PACK SIZE */}
                <div>

                    <label className="
                        text-sm
                        font-medium
                        text-gray-700
                        block
                        mb-1
                    ">
                        Pack Size
                    </label>

                    <input
                        type="number"

                        value={unit_value}

                        onChange={e =>
                            setUnitValue(
                                e.target.value
                            )
                        }

                        placeholder="0"

                        className="
                            w-full
                            border
                            rounded-xl
                            px-3
sm:px-4
py-2.5
sm:py-3
text-sm
                            outline-none
                            focus:ring-2
                            focus:ring-green-500
                        "
                    />

                </div>

                {/* STOCK */}
                <div>

                    <label className="
                        text-sm
                        font-medium
                        text-gray-700
                        block
                        mb-1
                    ">
                        Stock Qty
                    </label>

                    <input
                        type="number"

                        value={stock}

                        onChange={e =>
                            setStock(
                                e.target.value
                            )
                        }

                        placeholder="0"

                        className="
                            w-full
                            border
                            rounded-xl
                            px-3
sm:px-4
py-2.5
sm:py-3
text-sm
                            outline-none
                            focus:ring-2
                            focus:ring-green-500
                        "
                    />

                </div>

            </div>

            {/* ================= BUTTON ================= */}

            <div className="mt-6 flex justify-end">

                <button
                    onClick={submit}

                    disabled={loading}

                    className="
    w-full
    sm:w-auto
    bg-green-600
    hover:bg-green-700
    text-white
    px-6
    py-3
    rounded-xl
    font-medium
    text-sm
    transition
    disabled:opacity-50"
                >

                    {
                        loading
                            ? "Saving..."
                            : "Add Product"
                    }

                </button>

            </div>

        </div>
    );
}