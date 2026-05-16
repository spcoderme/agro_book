"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

export default function PurchaseEditPage() {

    const params = useParams();
    const router = useRouter();

    const [products, setProducts] = useState([]);
    const [vendors, setVendors] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        bill_no: "",
        dc_no: "",
        purchase_date: "",
        vendor_id: "",
        hamali: 0,
        payment_status: "pending",
        notes: ""
    });

    const [items, setItems] = useState([]);

    // ================= LOAD DATA =================
    useEffect(() => {

        if (!params?.id) return;

        loadPurchase();

        fetch("/api/products")
            .then(res => res.json())
            .then(data => setProducts(Array.isArray(data) ? data : []));

        fetch("/api/vendors")
            .then(res => res.json())
            .then(data => setVendors(Array.isArray(data) ? data : []));

    }, [params?.id]);

    // ================= LOAD PURCHASE =================
    const loadPurchase = async () => {

        try {

            const res =
                await fetch(`/api/purchases/${params.id}`);

            const data = await res.json();

            if (!data.purchase) {

                alert("Purchase not found");
                return;
            }

            setForm({
                bill_no: data.purchase.bill_no || "",
                dc_no: data.purchase.dc_no || "",
                purchase_date:
                    data.purchase.purchase_date?.split("T")[0] || "",
                vendor_id:
                    data.purchase.vendor_id || "",
                hamali:
                    data.purchase.hamali || 0,
                payment_status:
                    data.purchase.payment_status || "pending",
                notes:
                    data.purchase.notes || ""
            });

            // FIX CONTROLLED INPUT WARNING
            const formattedItems =
                (data.items || []).map(item => ({

                    ...item,

                    batch_no:
                        item.batch_no || "",

                    quantity:
                        item.quantity || 0,

                    rate:
                        item.rate || 0,

                    tax_percent:
                        item.tax_percent || 0,

                    unit:
                        item.unit || "",

                    unit_value:
                        item.unit_value || 0
                }));

            setItems(formattedItems);

            setLoading(false);

        } catch (err) {

            console.log(err);

            alert("Failed to load purchase");
        }
    };

    // ================= UPDATE ITEM =================
    const updateItem = (i, key, value) => {

        const updated = [...items];

        updated[i][key] = value;

        setItems(updated);
    };

    // ================= SUMMARY =================
    const calcSummary = () => {

        let taxable = 0;
        let cgst = 0;
        let sgst = 0;

        items.forEach(item => {

            const qty =
                Number(item.quantity) || 0;

            const rate =
                Number(item.rate) || 0;

            const tax =
                Number(item.tax_percent) || 0;

            const base = qty * rate;

            taxable += base;

            const half =
                (base * tax) / 200;

            cgst += half;
            sgst += half;
        });

        const hamali =
            Number(form.hamali) || 0;

        const total =
            taxable + cgst + sgst + hamali;

        return {
            taxable,
            cgst,
            sgst,
            total
        };
    };

    const summary = calcSummary();

    // ================= SUBMIT =================
    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setSaving(true);

            const res = await fetch(
                `/api/purchases/${params.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    body: JSON.stringify({
                        ...form,
                        items,
                        summary
                    })
                }
            );

            const data =
                await res.json();

            if (data.success) {

                alert(
                    "Purchase Updated Successfully ✅"
                );

                router.push("/purchases");

            } else {

                alert(
                    data.error ||
                    "Update failed"
                );
            }

        } catch (err) {

            console.log(err);

            alert("Update failed");

        } finally {

            setSaving(false);
        }
    };

    // ================= LOADING =================
    if (loading) {

        return (
            <div className="p-5 text-center">
                Loading...
            </div>
        );
    }

    // ================= UI =================
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
                md:flex-row
                md:items-center
                md:justify-between
                gap-3
                mb-6
            ">

                <div>

                    <h1 className="
                        text-2xl
                        sm:text-3xl
                        font-bold
                        text-gray-800
                    ">
                        Edit Purchase
                    </h1>

                    <p className="
                        text-sm
                        text-gray-500
                        mt-1
                    ">
                        Update purchase details
                    </p>

                </div>

                <button
                    type="button"
                    onClick={() =>
                        router.push("/purchases")
                    }
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
                    ← Back
                </button>

            </div>

            <form onSubmit={handleSubmit}>

                {/* HEADER FORM */}
                <div className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    xl:grid-cols-4
                    gap-4
                    bg-white
                    border
                    rounded-2xl
                    p-4
                    shadow-sm
                    mb-5
                ">

                    {/* BILL */}
                    <div>

                        <label className="
                            text-sm
                            font-medium
                            mb-1
                            block
                        ">
                            Bill No
                        </label>

                        <input
                            className="input w-full"
                            placeholder="Bill No"
                            value={form.bill_no || ""}
                            onChange={e =>
                                setForm({
                                    ...form,
                                    bill_no:
                                        e.target.value
                                })
                            }
                        />

                    </div>

                    {/* DC */}
                    <div>

                        <label className="
                            text-sm
                            font-medium
                            mb-1
                            block
                        ">
                            DC No
                        </label>

                        <input
                            className="input w-full"
                            placeholder="DC No"
                            value={form.dc_no || ""}
                            onChange={e =>
                                setForm({
                                    ...form,
                                    dc_no:
                                        e.target.value
                                })
                            }
                        />

                    </div>

                    {/* VENDOR */}
                    <div>

                        <label className="
                            text-sm
                            font-medium
                            mb-1
                            block
                        ">
                            Vendor
                        </label>

                        <select
                            className="input w-full"
                            value={form.vendor_id || ""}
                            onChange={e =>
                                setForm({
                                    ...form,
                                    vendor_id:
                                        e.target.value
                                })
                            }
                        >

                            <option value="">
                                Select Vendor
                            </option>

                            {
                                vendors.map(v => (

                                    <option
                                        key={v.id}
                                        value={v.id}
                                    >
                                        {v.name}
                                    </option>

                                ))
                            }

                        </select>

                    </div>

                    {/* DATE */}
                    <div>

                        <label className="
                            text-sm
                            font-medium
                            mb-1
                            block
                        ">
                            Purchase Date
                        </label>

                        <DatePicker
                            selected={
                                form.purchase_date
                                    ? new Date(
                                        form.purchase_date
                                    )
                                    : null
                            }

                            onChange={(date) => {

                                if (!date) return;

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

                                setForm({
                                    ...form,
                                    purchase_date:
                                        `${year}-${month}-${day}`
                                });
                            }}

                            dateFormat="dd/MM/yyyy"

                            placeholderText="Select Date"

                            className="input w-full"
                        />

                    </div>

                </div>

                {/* TABLE */}
                <div className="
                    overflow-x-auto
                    border
                    rounded-2xl
                    bg-white
                    shadow-sm
                ">

                    <table className="
                        min-w-[900px]
                        w-full
                        text-xs
                        sm:text-sm
                    ">

                        <thead className="bg-gray-100">

                            <tr>

                                <th className="border p-3">
                                    Product
                                </th>

                                <th className="border p-3">
                                    Batch
                                </th>

                                <th className="border p-3">
                                    Qty
                                </th>

                                <th className="border p-3">
                                    Rate
                                </th>

                                <th className="border p-3">
                                    Tax %
                                </th>

                                <th className="border p-3">
                                    CGST
                                </th>

                                <th className="border p-3">
                                    SGST
                                </th>

                                <th className="border p-3">
                                    Total
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {
                                items.map((item, i) => {

                                    const qty =
                                        Number(item.quantity) || 0;

                                    const rate =
                                        Number(item.rate) || 0;

                                    const tax =
                                        Number(item.tax_percent) || 0;

                                    const base =
                                        qty * rate;

                                    const cgst =
                                        (base * tax) / 200;

                                    const sgst =
                                        (base * tax) / 200;

                                    const total =
                                        base + cgst + sgst;

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
                                                p-2
                                            ">

                                                <div className="
                                                    font-semibold
                                                ">
                                                    {item.product_name}
                                                </div>

                                                <div className="
                                                    text-xs
                                                    text-gray-500
                                                ">
                                                    (
                                                    {parseFloat(
                                                        item.unit_value || 0
                                                    )}
                                                    {item.unit || ""}
                                                    )
                                                </div>

                                            </td>

                                            {/* BATCH */}
                                            <td className="border p-2">

                                                <input
                                                    className="input w-24"
                                                    value={item.batch_no || ""}
                                                    onChange={e =>
                                                        updateItem(
                                                            i,
                                                            "batch_no",
                                                            e.target.value
                                                        )
                                                    }
                                                />

                                            </td>

                                            {/* QTY */}
                                            <td className="border p-2">

                                                <input
                                                    type="number"
                                                    className="input w-24"
                                                    value={item.quantity || 0}
                                                    onChange={e =>
                                                        updateItem(
                                                            i,
                                                            "quantity",
                                                            e.target.value
                                                        )
                                                    }
                                                />

                                            </td>

                                            {/* RATE */}
                                            <td className="border p-2">

                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    className="input w-28"
                                                    value={item.rate || 0}
                                                    onChange={e =>
                                                        updateItem(
                                                            i,
                                                            "rate",
                                                            e.target.value
                                                        )
                                                    }
                                                />

                                            </td>

                                            {/* TAX */}
                                            <td className="border p-2">

                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    className="input w-24"
                                                    value={item.tax_percent || 0}
                                                    onChange={e =>
                                                        updateItem(
                                                            i,
                                                            "tax_percent",
                                                            e.target.value
                                                        )
                                                    }
                                                />

                                            </td>

                                            {/* CGST */}
                                            <td className="
                                                border
                                                p-2
                                                text-center
                                                whitespace-nowrap
                                            ">
                                                ₹ {cgst.toFixed(2)}
                                            </td>

                                            {/* SGST */}
                                            <td className="
                                                border
                                                p-2
                                                text-center
                                                whitespace-nowrap
                                            ">
                                                ₹ {sgst.toFixed(2)}
                                            </td>

                                            {/* TOTAL */}
                                            <td className="
                                                border
                                                p-2
                                                font-bold
                                                whitespace-nowrap
                                            ">
                                                ₹ {total.toFixed(2)}
                                            </td>

                                        </tr>

                                    );
                                })
                            }

                        </tbody>

                    </table>

                </div>

                {/* SUMMARY */}
                <div className="
                    mt-6
                    bg-white
                    border
                    rounded-2xl
                    p-4
                    shadow-sm
                ">

                    <div className="
                        grid
                        grid-cols-1
                        lg:grid-cols-2
                        gap-6
                    ">

                        {/* LEFT */}
                        <div>

                            {/* PAYMENT STATUS */}
                            <div className="mb-5">

                                <label className="
                                    block
                                    text-sm
                                    font-semibold
                                    mb-3
                                ">
                                    Payment Status
                                </label>

                                <div className="
                                    flex
                                    flex-wrap
                                    gap-3
                                ">

                                    <label className="
                                        flex
                                        items-center
                                        gap-2
                                        border
                                        rounded-xl
                                        px-4
                                        py-2
                                        cursor-pointer
                                    ">

                                        <input
                                            type="radio"
                                            value="paid"
                                            checked={
                                                form.payment_status === "paid"
                                            }
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    payment_status:
                                                        e.target.value
                                                })
                                            }
                                        />

                                        <span className="
                                            text-green-600
                                            font-semibold
                                        ">
                                            Paid
                                        </span>

                                    </label>

                                    <label className="
                                        flex
                                        items-center
                                        gap-2
                                        border
                                        rounded-xl
                                        px-4
                                        py-2
                                        cursor-pointer
                                    ">

                                        <input
                                            type="radio"
                                            value="pending"
                                            checked={
                                                form.payment_status === "pending"
                                            }
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    payment_status:
                                                        e.target.value
                                                })
                                            }
                                        />

                                        <span className="
                                            text-red-600
                                            font-semibold
                                        ">
                                            Pending
                                        </span>

                                    </label>

                                </div>

                            </div>

                            {/* NOTES */}
                            <div>

                                <label className="
                                    block
                                    text-sm
                                    font-semibold
                                    mb-2
                                ">
                                    Notes
                                </label>

                                <textarea
                                    className="
                                        input
                                        w-full
                                        min-h-[120px]
                                    "
                                    placeholder="
                                    Purchase notes...
                                    "
                                    value={form.notes || ""}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            notes:
                                                e.target.value
                                        })
                                    }
                                />

                            </div>

                        </div>

                        {/* RIGHT */}
                        <div className="
                            flex
                            flex-col
                            gap-4
                        ">

                            {/* HAMALI */}
                            <div className="
                                flex
                                flex-col
                                sm:flex-row
                                sm:items-center
                                justify-between
                                gap-3
                            ">

                                <span className="
                                    font-medium
                                ">
                                    Freight / Hamali
                                </span>

                                <input
                                    type="number"
                                    className="
                                        input
                                        w-full
                                        sm:w-40
                                    "
                                    value={form.hamali || 0}
                                    onChange={e =>
                                        setForm({
                                            ...form,
                                            hamali:
                                                e.target.value
                                        })
                                    }
                                />

                            </div>

                            {/* TOTALS */}
                            <div className="
                                border
                                rounded-2xl
                                p-4
                                bg-gray-50
                                space-y-3
                            ">

                                <div className="
                                    flex
                                    justify-between
                                ">
                                    <span>Taxable</span>

                                    <span>
                                        ₹ {summary.taxable.toFixed(2)}
                                    </span>
                                </div>

                                <div className="
                                    flex
                                    justify-between
                                ">
                                    <span>CGST</span>

                                    <span>
                                        ₹ {summary.cgst.toFixed(2)}
                                    </span>
                                </div>

                                <div className="
                                    flex
                                    justify-between
                                ">
                                    <span>SGST</span>

                                    <span>
                                        ₹ {summary.sgst.toFixed(2)}
                                    </span>
                                </div>

                                <div className="
                                    border-t
                                    pt-3
                                    flex
                                    justify-between
                                    text-xl
                                    font-bold
                                ">
                                    <span>
                                        Grand Total
                                    </span>

                                    <span>
                                        ₹ {summary.total.toFixed(2)}
                                    </span>
                                </div>

                            </div>

                        </div>

                    </div>

                </div>

                {/* BUTTON */}
                <div className="
                    mt-6
                    flex
                    flex-col
                    sm:flex-row
                    gap-3
                ">

                    <button
                        type="submit"
                        disabled={saving}
                        className="
                            bg-green-600
                            hover:bg-green-700
                            disabled:bg-gray-400
                            text-white
                            px-6
                            py-3
                            rounded-xl
                            font-semibold
                            transition
                        "
                    >

                        {
                            saving
                                ? "Updating..."
                                : "Update Purchase"
                        }

                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            router.push("/purchases")
                        }
                        className="
                            bg-gray-200
                            hover:bg-gray-300
                            px-6
                            py-3
                            rounded-xl
                            font-medium
                        "
                    >
                        Cancel
                    </button>

                </div>

            </form>

        </div>
    );
}