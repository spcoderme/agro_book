"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function PurchaseDetails() {

    const params = useParams();

    const id = params.id;

    const [data, setData] = useState(null);

    // LOAD DATA
    const loadData = async () => {

        if (!id) return;

        const res = await fetch(`/api/purchases/${id}`);

        const json = await res.json();

        setData(json);
    };

    useEffect(() => {
        loadData();
    }, [id]);

    // LOADING
    if (!data) {
        return (
            <div className="p-10 text-center">
                Loading...
            </div>
        );
    }

    return (
        <div className="p-6">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">

                <div>
                    <h1 className="text-3xl font-bold">
                        Sindhaphana Agro Agency, Majalgaon
                    </h1>
                    <h4 className="text-xl font-bold">
                        Purchase Invoice
                    </h4>

                    <p className="text-gray-500">
                        Bill No: {data.purchase?.bill_no}
                    </p>
                </div>

                <div className="flex gap-3 print:hidden">

                    <Link
                        href={`/purchase-edit/${id}`}
                        className="bg-green-600 text-white px-4 py-2 rounded"
                    >
                        Edit
                    </Link>

                    <button
                        onClick={() => window.print()}
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Print
                    </button>

                </div>              

            </div>

            {/* PURCHASE INFO */}
            <div className="grid grid-cols-2 gap-5 mb-6 bg-white border p-5 rounded">

                <div>
                    <p>
                        <b>Vendor:</b> {data.purchase?.vendor_name}
                    </p>

                    <p>
                        <b>DC No:</b> {data.purchase?.dc_no}
                    </p>
                </div>

                <div>

                    <p>
                        <b>Date:</b>{" "}
                        <b>
                            {data.purchase?.purchase_date
                                ? new Date(data.purchase.purchase_date)
                                    .toLocaleDateString("en-GB")
                                : "-"
                            }</b>
                    </p>

                    <p>

                        <b>Payment:</b>{" "}

                        <span
                            className={
                                data.purchase?.payment_status === "paid"
                                    ? "bg-green-100 text-green-700 px-2 py-1 rounded text-xs"
                                    : "bg-red-100 text-red-700 px-2 py-1 rounded text-xs"
                            }
                        >
                            {
                                data.purchase?.payment_status === "paid"
                                    ? "PAID ✔"
                                    : "PENDING ✖"
                            }
                        </span>

                    </p>

                </div>

            </div>

            {/* PRODUCTS TABLE */}
            <div className="overflow-auto border rounded">

                <table className="w-full border border-separate text-sm">

                    <thead className="bg-gray-200">

                        <tr>
                            <th className="border p-2">Product</th>
                            <th className="border p-2">Batch</th>
                            <th className="border p-2">Qty</th>
                            <th className="border p-2">Rate</th>
                            <th className="border p-2">Tax %</th>
                            <th className="border p-2">CGST Amt</th>
                            <th className="border p-2">SGST Amt</th>
                            <th className="border p-2">Total</th>
                        </tr>

                    </thead>

                    <tbody>

                        {data.items?.map((item, i) => (

                            <tr key={i}>

                                <td className="border p-2">

                                    <div className="font-medium">
                                        {item.product_name}
                                    </div>

                                    <div className="text-xs text-gray-500">
                                        ({parseFloat(item.unit_value || 0)} {item.unit})
                                    </div>

                                </td>

                                <td className="border p-2">
                                    {item.batch_no}
                                </td>

                                <td className="border p-2">
                                    {item.quantity}
                                </td>

                                <td className="border p-2">
                                    ₹ {parseFloat(item.rate || 0).toFixed(2)}
                                </td>

                                <td className="border p-2">
                                    {item.tax_percent}%
                                </td>

                                <td className="border p-2 text-center">

                                    <div>
                                        ₹ {parseFloat(item.cgst || 0).toFixed(2)}
                                    </div>

                                    <div className="text-xs text-gray-500">
                                        ({parseFloat(item.tax_percent || 0) / 2}%)
                                    </div>

                                </td>

                                <td className="border p-2 text-center">

                                    <div>
                                        ₹ {parseFloat(item.sgst || 0).toFixed(2)}
                                    </div>

                                    <div className="text-xs text-gray-500">
                                        ({parseFloat(item.tax_percent || 0) / 2}%)
                                    </div>

                                </td>

                                <td className="border p-2 font-semibold text-right">

                                    <div>
                                        ₹ {parseFloat(item.total || 0).toFixed(2)}
                                    </div>

                                    <div className="text-xs text-gray-500">
                                        Base: ₹ {
                                            (
                                                parseFloat(item.quantity || 0) *
                                                parseFloat(item.rate || 0)
                                            ).toFixed(2)
                                        }
                                    </div>

                                </td>

                            </tr>
                        ))}

                    </tbody>

                </table>

            </div>

            {/* SUMMARY */}

            <div className="mt-6 flex justify-between">
                <div className="mt-5">

                    <table className="w-[400px] ml-auto border text-sm">

                        <thead className="bg-gray-200">

                            <tr>
                                <th className="border p-2">Taxable</th>
                                <th className="border p-2">CGST</th>
                                <th className="border p-2">SGST</th>
                                <th className="border p-2">Tax Total</th>
                            </tr>

                        </thead>

                        <tbody>

                            <tr>

                                <td className="border p-2 text-right">
                                    ₹ {(
                                        parseFloat(data.purchase.grand_total || 0)
                                        -
                                        parseFloat(data.purchase.hamali || 0)
                                    ).toFixed(2)}
                                </td>

                                <td className="border p-2 text-right">
                                    ₹ {data.items
                                        .reduce((a, b) => a + Number(b.cgst || 0), 0)
                                        .toFixed(2)}
                                </td>

                                <td className="border p-2 text-right">
                                    ₹ {data.items
                                        .reduce((a, b) => a + Number(b.sgst || 0), 0)
                                        .toFixed(2)}
                                </td>

                                <td className="border p-2 text-right font-semibold">
                                    ₹ {data.items
                                        .reduce(
                                            (a, b) =>
                                                a +
                                                Number(b.cgst || 0) +
                                                Number(b.sgst || 0),
                                            0
                                        )
                                        .toFixed(2)}
                                </td>

                            </tr>

                        </tbody>

                    </table>

                </div>

                <div className="w-[350px] border rounded p-4 bg-white">

                    <p>
                        <b>Freight:</b> ₹ {data.purchase?.hamali}
                    </p>
                    <div className="flex justify-between mb-2">
                        <span>Grand Total</span>

                        <span className="font-bold text-xl">
                            ₹ {parseFloat(data.purchase?.grand_total || 0).toFixed(2)}
                        </span>

                    </div>

                </div>

            </div>
            {/* NOTES */}
            {
                data.purchase?.notes && (
                    <div className="mt-6 border rounded bg-yellow-50 p-4">

                        <h3 className="font-bold mb-2">
                            Notes
                        </h3>

                        <p className="whitespace-pre-line text-gray-700">
                            {data.purchase.notes}
                        </p>

                    </div>
                )
            }

        </div>
    );
}