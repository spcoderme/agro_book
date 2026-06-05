"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

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
            

                <div
    className="
        flex
        flex-col
        md:flex-row
        print:flex-row
        print:items-center
        gap-4
        border-b
        pb-4
        mb-4
    "
>

    {/* LOGO */}
    <div
    className="
        flex
        justify-center
        md:justify-start
        print:justify-start
        flex-shrink-0
    "
>
        <Image
            src="/SINGHPHANA_LOGO.png"
            alt="Sindhphana Agro Agency Logo"
            width={120}
            height={120}
            priority
            className="
                object-contain
                md:w-[150px]
                md:h-[150px]
                print:w-[150px]
                print:h-[150px]
            "
        />
    </div>

    {/* COMPANY DETAILS */}
    <div
    className="
        flex-1
        text-center
        md:text-left
        print:text-left
    "
>

        <h1
            className="
                text-xl
                sm:text-2xl
                md:text-3xl
                font-extrabold
                tracking-wide
                leading-tight
            "
        >
            सिंधफणा ॲग्रो एजन्सी, माजलगाव
        </h1>

        <p
            className="
                text-xs
                sm:text-sm
                md:text-base
                text-gray-600
                mt-1
            "
        >
            Agricultural Inputs • Seeds • Fertilizers • Pesticides
        </p>

        <h5
            className="
                text-sm
                md:text-base
                font-bold
                mt-2
                text-gray-800
            "
        >
            PURCHASE INVOICE
        </h5>

        <p
            className="
                text-sm
                text-gray-600
                mt-1
            "
        >
            Bill No :
            <span className="font-semibold ml-1">
                {data.purchase?.bill_no}
            </span>
        </p>

    </div>

    {/* ACTION BUTTONS */}
    <div
        className="
            flex
            flex-row
            md:flex-col
            lg:flex-row
            gap-2
            justify-center
            print:hidden
        "
    >

        <Link
            href={`/purchase-edit/${id}`}
            className="
                bg-green-600
                hover:bg-green-700
                text-white
                px-4
                py-2
                rounded-lg
                text-sm
                text-center
            "
        >
            Edit
        </Link>

        <button
            onClick={() => window.print()}
            className="
                bg-blue-600
                hover:bg-blue-700
                text-white
                px-4
                py-2
                rounded-lg
                text-sm
            "
        >
            Print
        </button>

    </div>

</div>

                             

           

            {/* PURCHASE INFO */}
            <div className="grid grid-cols-2 gap-5 mb-6 bg-white border p-5 rounded">

                <div>
                    <p>
                        <b>Vendor: {data.purchase?.vendor_name}</b>
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
                                    {parseFloat(item.quantity)}
                                </td>

                                <td className="border p-2">
                                    ₹ {parseFloat(item.rate || 0).toFixed(2)}
                                </td>

                                <td className="border p-2">
                                    {parseFloat(item.tax_percent || 0)}%
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

            {/* ================= SUMMARY ================= */}
{(() => {

    const taxable =
        data.items.reduce(
            (a, b) =>
                a +
                (
                    Number(b.quantity || 0) *
                    Number(b.rate || 0)
                ),
            0
        );

    const cgst =
        data.items.reduce(
            (a, b) =>
                a + Number(b.cgst || 0),
            0
        );

    const sgst =
        data.items.reduce(
            (a, b) =>
                a + Number(b.sgst || 0),
            0
        );

    const taxTotal =
        cgst + sgst;

    const hamali =
        Number(
            data.purchase?.hamali || 0
        );

    const actualTotal =
        taxable +
        taxTotal +
        hamali;

        const grandTotal =
        Number(
            data.purchase?.grand_total || 0
        );

        const roundedTotal =
    Math.round(actualTotal);
        const roundOff =
            roundedTotal - actualTotal;


    return (

        <div className="
            mt-8
            grid
            grid-cols-1
            xl:grid-cols-2
            gap-6
        ">

            {/* TAX SUMMARY */}
            <div className="
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
                                border
                                p-3
                                text-left
                            ">
                                Taxable
                            </th>

                            <th className="
                                border
                                p-3
                                text-left
                            ">
                                CGST
                            </th>

                            <th className="
                                border
                                p-3
                                text-left
                            ">
                                SGST
                            </th>

                            <th className="
                                border
                                p-3
                                text-left
                            ">
                                Total Tax
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        <tr>

                            <td className="
                                border
                                p-3
                                text-right
                                font-medium
                            ">
                                ₹ {taxable.toFixed(2)}
                            </td>

                            <td className="
                                border
                                p-3
                                text-right
                            ">
                                ₹ {cgst.toFixed(2)}
                            </td>

                            <td className="
                                border
                                p-3
                                text-right
                            ">
                                ₹ {sgst.toFixed(2)}
                            </td>

                            <td className="
                                border
                                p-3
                                text-right
                                font-bold
                                text-blue-700
                            ">
                                ₹ {taxTotal.toFixed(2)}
                            </td>

                        </tr>

                    </tbody>

                </table>

            </div>

            {/* FINAL TOTAL CARD */}
            <div className="
                border
                rounded-2xl
                bg-white
                shadow-sm
                p-5
                w-full
            ">

                <h3 className="
                    text-lg
                    font-bold
                    mb-5
                    text-gray-800
                ">
                    Invoice Summary
                </h3>

                <div className="
                    space-y-3
                    text-sm
                ">

                    {/* TAXABLE */}
                    <div className="
                        flex
                        justify-between
                    ">

                        <span className="text-gray-600">
                            Taxable Amount
                        </span>

                        <span className="font-medium">
                            ₹ {taxable.toFixed(2)}
                        </span>

                    </div>

                    {/* CGST */}
                    <div className="
                        flex
                        justify-between
                    ">

                        <span className="text-gray-600">
                            CGST
                        </span>

                        <span>
                            ₹ {cgst.toFixed(2)}
                        </span>

                    </div>

                    {/* SGST */}
                    <div className="
                        flex
                        justify-between
                    ">

                        <span className="text-gray-600">
                            SGST
                        </span>

                        <span>
                            ₹ {sgst.toFixed(2)}
                        </span>

                    </div>

                    {/* HAMALI */}
                    <div className="
                        flex
                        justify-between
                    ">

                        <span className="text-gray-600">
                            Freight / Hamali
                        </span>

                        <span>
                            ₹ {hamali.toFixed(2)}
                        </span>

                    </div>

                    {/* ROUND OFF */}
                    <div className="
                        flex
                        justify-between
                    ">

                        <span className="text-gray-600">
                            Round Off
                        </span>

                        <span
                            className={
                                roundOff >= 0
                                    ? "text-green-700"
                                    : "text-red-700"
                            }
                        >
                            ₹ {roundOff.toFixed(2)}
                        </span>

                    </div>

                    {/* TOTAL */}
                    <div className="
                        border-t
                        pt-4
                        mt-4
                        flex
                        justify-between
                        items-center
                    ">

                        <span className="
                            text-xl
                            font-bold
                            text-gray-800
                        ">
                            Grand Total
                        </span>

                        <span className="
                            text-2xl
                            font-extrabold
                            text-green-700
                        ">
                            ₹ {roundedTotal.toFixed(2)}
                        </span>

                    </div>

                </div>

            </div>

        </div>
    );

})()}
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