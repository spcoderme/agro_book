"use client";

import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

export default function DispatchPage() {

    const [products, setProducts] = useState([]);

    const [form, setForm] = useState({
        sell_bill_no: "",
        dispatch_date: "",
        driver_name: "",
        bill_photo: null
    });

    const [items, setItems] = useState([
        {
            product_id: "",
            product_name: "",
            stock: 0,
            quantity: ""
        }
    ]);

    // ================= LOAD PRODUCTS =================
    useEffect(() => {

        fetch("/api/products")
            .then(res => res.json())
            .then(setProducts);

    }, []);

    // ================= UPDATE ITEM =================
    const updateItem = (i, key, value) => {

        const updated = [...items];

        updated[i][key] = value;

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
                quantity: ""
            }
        ]);
    };

    // ================= REMOVE ROW =================
    const removeRow = (index) => {

        const updated = items.filter((_, i) => i !== index);

        setItems(updated);
    };

    // ================= SUBMIT =================
    const handleSubmit = async (e) => {

        e.preventDefault();

        const formData = new FormData();

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

        const res = await fetch(
            "/api/dispatch",
            {
                method: "POST",
                body: formData
            }
        );

        const data = await res.json();

        if (data.success) {

            alert("Dispatch Saved ✅");

            // RESET FORM
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
                    quantity: ""
                }
            ]);

        } else {

            alert(data.error || "Failed");
        }
    };

    return (

        <div className="p-5">

            <h1 className="text-2xl font-bold mb-5">
                Dispatch Product
            </h1>

            <form onSubmit={handleSubmit}>

                {/* HEADER */}
                <div className="grid grid-cols-4 gap-4 mb-5">

                    {/* SELL BILL */}
                    <input
                        className="input"
                        placeholder="Sell Bill No"
                        value={form.sell_bill_no}
                        onChange={e =>
                            setForm({
                                ...form,
                                sell_bill_no: e.target.value
                            })
                        }
                    />

                    {/* DATE */}
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
                    />

                    {/* DRIVER */}
                    <input
                        className="input"
                        placeholder="Driver Name"
                        value={form.driver_name}
                        onChange={e =>
                            setForm({
                                ...form,
                                driver_name: e.target.value
                            })
                        }
                    />

                    {/* BILL PHOTO */}
                    <input
                        type="file"
                        className="input"
                        accept="image/*"
                        onChange={e =>
                            setForm({
                                ...form,
                                bill_photo: e.target.files[0]
                            })
                        }
                    />

                </div>

                {/* TABLE */}
                <div className="overflow-auto border rounded">

                    <table className="w-full border border-separate text-sm">

                        <thead className="bg-gray-200">

                            <tr>

                                <th className="border p-2">
                                    Product
                                </th>

                                <th className="border p-2">
                                    Current Stock
                                </th>

                                <th className="border p-2">
                                    Dispatch Qty
                                </th>

                                <th className="border p-2">
                                    Remaining Stock
                                </th>

                                <th className="border p-2">
                                    Action
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {items.map((item, i) => {

                                const stock =
                                    Number(item.stock) || 0;

                                const qty =
                                    Number(item.quantity) || 0;

                                const remaining =
                                    stock - qty;

                                return (

                                    <tr key={i}>

                                        {/* PRODUCT */}
                                        <td className="border p-2">

                                            <select
                                                className="input"
                                                value={item.product_id}
                                                onChange={(e) => {

                                                    const selected =
                                                        products.find(
                                                            p =>
                                                                p.id ===
                                                                Number(e.target.value)
                                                        );

                                                    if (!selected) return;

                                                    const updated = [...items];

                                                    updated[i] = {
                                                        ...updated[i],
                                                        product_id: selected.id,
                                                        product_name: selected.name,
                                                        stock: selected.stock,
                                                        unit_value: selected.unit_value,
                                                        unit_name: selected.unit_name
                                                    };

                                                    setItems(updated);
                                                }}
                                            >

                                                <option value="">
                                                    Select Product
                                                </option>

                                                {products.map(p => (

                                                    <option
                                                        key={p.id}
                                                        value={p.id}
                                                    >
                                                        {p.name}
                                                        {" "}
                                                        ({parseFloat(p.unit_value)}
                                                        {p.unit_name})
                                                        {" "}
                                                        [Stock:
                                                        {parseFloat(p.stock)}]
                                                    </option>
                                                ))}

                                            </select>

                                        </td>

                                        {/* STOCK */}
                                        <td className="border p-2 text-center font-medium">

                                            {parseFloat(item.stock || 0)}

                                        </td>

                                        {/* QTY */}
                                        <td className="border p-2">

                                            <input
                                                type="number"
                                                min="0"
                                                className="input"
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
                                                        : "text-green-700 font-semibold"
                                                }
                                            >
                                                {remaining}
                                            </span>

                                        </td>

                                        {/* ACTION */}
                                        <td className="border p-2 text-center">

                                            <button
                                                type="button"
                                                onClick={() => removeRow(i)}
                                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
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

                {/* ADD ROW */}
                <button
                    type="button"
                    onClick={addRow}
                    className="mt-3 bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded"
                >
                    + Add Row
                </button>

                {/* SUBMIT */}
                <button
                    type="submit"
                    className="mt-5 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded"
                >
                    Save Dispatch
                </button>

            </form>

        </div>
    );
}