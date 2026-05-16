"use client";

import { useEffect, useState } from "react";
import ProductForm from "../components/ProductForm";
import Link from "next/link";

export default function Products() {

    const [products, setProducts] = useState([]);

    const [loading, setLoading] =
        useState(true);

    const [search, setSearch] =
        useState("");

    // ================= LOAD PRODUCTS =================
    const load = async () => {

        try {

            setLoading(true);

            const res =
                await fetch("/api/products");

            const data =
                await res.json();

            setProducts(data);

        } catch (err) {

            console.log(err);

            alert("Failed to load products");

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    // ================= FILTER =================
    const filteredProducts =
        products.filter(p =>
            p.name
                ?.toLowerCase()
                .includes(search.toLowerCase())
        );

    return (

       <div
    className="
        p-3
        sm:p-4
        md:p-6
        max-w-7xl
        mx-auto
        w-full
    "
>

            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-5">

                <div>

                    <h1 className="text-2xl font-bold text-gray-800">
                        📦 Product Management
                    </h1>

                    <p className="text-sm text-gray-500">
                        Manage inventory products & stock
                    </p>

                </div>

                <Link
                    href="/dashboard"
                    className="
                        bg-gray-700
                        hover:bg-black
                        text-white
                        px-4 py-2
                        rounded-lg
                        text-sm
                        w-fit
                    "
                >
                    ← Dashboard
                </Link>

            </div>

            {/* PRODUCT FORM */}
            <div className="
                bg-white
                shadow-lg
                rounded-2xl
                p-5
                mb-6
            ">

                <ProductForm onSuccess={load} />

            </div>

            {/* SEARCH */}
            <div className="mb-4">

                <input
                    type="text"
                    placeholder="Search Product..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                    className="
                        w-full md:w-80
                        border
                        rounded-xl
                        px-4 py-3
                        outline-none
                        focus:ring-2
                        focus:ring-green-500
                    "
                />

            </div>

            {/* TABLE */}
            {/* TABLE */}
<div
    className="
        bg-white
        shadow-lg
        rounded-2xl
        border
        overflow-hidden
    "
>

    {/* MOBILE SCROLL */}
    <div className="overflow-x-auto">

        <div className="max-h-[650px] overflow-y-auto">

            <table className="min-w-[900px] w-full text-sm text-left">

                {/* HEAD */}
                <thead
                    className="
                        bg-green-600
                        text-white
                        sticky
                        top-0
                        z-10
                    "
                >

                    <tr>

                        <th className="p-3 border-r whitespace-nowrap">
                            ID
                        </th>

                        <th className="p-3 border-r whitespace-nowrap">
                            Product Name
                        </th>

                        <th className="p-3 border-r whitespace-nowrap">
                            Category
                        </th>

                        <th className="p-3 border-r whitespace-nowrap">
                            Pack Size
                        </th>

                        <th className="p-3 border-r whitespace-nowrap">
                            Current Stock
                        </th>

                        <th className="p-3 border-r text-center whitespace-nowrap">
                            Status
                        </th>

                        

                    </tr>

                </thead>

                {/* BODY */}
                <tbody>

                    {
                        loading ? (

                            <tr>

                                <td
                                    colSpan={7}
                                    className="
                                        text-center
                                        py-10
                                    "
                                >
                                    Loading...
                                </td>

                            </tr>

                        ) : filteredProducts.length > 0 ? (

                            filteredProducts.map((p) => (

                                <tr
                                    key={p.id}
                                    className="
                                        border-b
                                        hover:bg-gray-50
                                        transition
                                    "
                                >

                                    {/* ID */}
                                    <td className="p-3 text-gray-500 whitespace-nowrap">
                                        #{p.id}
                                    </td>

                                    {/* NAME */}
                                    <td className="p-3 min-w-[220px]">

                                        <div
                                            className="
                                                font-semibold
                                                text-gray-800
                                            "
                                        >
                                            {p.name}
                                        </div>

                                    </td>

                                    {/* CATEGORY */}
                                    <td className="p-3 text-gray-700 whitespace-nowrap">
                                        {p.category || "-"}
                                    </td>

                                    {/* PACK */}
                                    <td className="p-3 whitespace-nowrap">

                                        <div
                                            className="
                                                flex
                                                items-center
                                                gap-2
                                            "
                                        >

                                            <span className="font-medium">
                                                {
                                                    parseFloat(
                                                        p.unit_value || 0
                                                    )
                                                }
                                            </span>

                                            <span
                                                className="
                                                    bg-blue-100
                                                    text-blue-700
                                                    px-2 py-1
                                                    rounded-md
                                                    text-xs
                                                    font-semibold
                                                "
                                            >
                                                {p.unit_name}
                                            </span>

                                        </div>

                                    </td>

                                    {/* STOCK */}
                                    <td className="p-3 whitespace-nowrap">

                                        <span
                                            className={`
                                                px-3 py-1
                                                rounded-full
                                                text-xs
                                                font-bold
                                                ${
                                                    Number(p.stock) > 20
                                                        ? "bg-green-100 text-green-700"
                                                        : Number(p.stock) > 0
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : "bg-red-100 text-red-700"
                                                }
                                            `}
                                        >

                                            {
                                                parseFloat(
                                                    p.stock || 0
                                                )
                                            }

                                        </span>

                                    </td>

                                    {/* STATUS */}
                                    <td
                                        className="
                                            p-3
                                            text-center
                                            whitespace-nowrap
                                        "
                                    >

                                        {
                                            Number(p.stock) > 0
                                                ? (
                                                    <span
                                                        className="
                                                            text-green-600
                                                            font-semibold
                                                        "
                                                    >
                                                        In Stock
                                                    </span>
                                                )
                                                : (
                                                    <span
                                                        className="
                                                            text-red-600
                                                            font-semibold
                                                        "
                                                    >
                                                        Out of Stock
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
                                    No Products Found
                                </td>

                            </tr>
                        )
                    }

                </tbody>

            </table>

        </div>

    </div>

</div>

        </div>
    );
}