"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function VendorEditPage() {

    const params = useParams();

    const router = useRouter();

    const id = params.id;

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [form, setForm] = useState({
        name: "",
        mobile: "",
        address: "",
        gst_no: ""
    });

    // ================= LOAD VENDOR =================
    const loadVendor = async () => {

        try {

            setLoading(true);

            const res = await fetch(
                `/api/vendors/${id}`
            );

            const data = await res.json();

            setForm({
                name: data.name || "",
                mobile: data.mobile || "",
                address: data.address || "",
                gst_no: data.gst_no || ""
            });

        } catch (err) {

            console.log(err);

            alert("Failed to load vendor");

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {

        if (id) {
            loadVendor();
        }

    }, [id]);

    // ================= UPDATE =================
    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setSaving(true);

            const res = await fetch(
                `/api/vendors/${id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify(form)
                }
            );

            const data =
                await res.json();

            if (data.success) {

                alert(
                    "Vendor Updated Successfully ✅"
                );

                router.push("/vendors");

            } else {

                alert(
                    data.error || "Update failed"
                );
            }

        } catch (err) {

            console.log(err);

            alert("Something went wrong");

        } finally {

            setSaving(false);
        }
    };

    // ================= LOADING =================
    if (loading) {

        return (

            <div className="
                min-h-[50vh]
                flex
                items-center
                justify-center
                text-gray-500
            ">
                Loading vendor...
            </div>

        );
    }

    // ================= UI =================
    return (

        <div className="
            min-h-screen
            bg-gray-50
            px-3
            sm:px-5
            lg:px-8
            py-5
        ">

            <div className="
                max-w-4xl
                mx-auto
            ">

            {/* HEADER */}
            <div className="
                flex
                flex-col
                sm:flex-row
                sm:items-center
                sm:justify-between
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
                        Edit Vendor
                    </h1>

                    <p className="
                        text-sm
                        text-gray-500
                        mt-1
                    ">
                        Update vendor details
                    </p>

                </div>

                <Link
                    href="/vendors"
                    className="
                        bg-gray-700
                        hover:bg-black
                        text-white
                        px-5
                        py-3
                        rounded-xl
                        text-sm
                        font-medium
                        transition
                        w-full
                        sm:w-auto
                        text-center
                    "
                >
                    ← Back to Vendors
                </Link>

            </div>

            {/* FORM CARD */}
            <div className="
                bg-white
                border
                rounded-2xl
                shadow-sm
                p-4
                sm:p-6
                max-w-4xl
            ">

                <form
                    onSubmit={handleSubmit}
                    className="
                        space-y-5
                    "
                >

                    {/* VENDOR NAME */}
                    <div>

                        <label className="
                            block
                            text-sm
                            font-medium
                            text-gray-700
                            mb-2
                        ">
                            Vendor Name
                        </label>

                        <input
                            className="
                                input
                                w-full
                            "
                            placeholder="Enter vendor name"
                            value={form.name}
                            onChange={e =>
                                setForm({
                                    ...form,
                                    name: e.target.value
                                })
                            }
                            required
                        />

                    </div>

                    {/* MOBILE + GST */}
                    <div className="
                        grid
                        grid-cols-1
                        md:grid-cols-2
                        gap-5
                    ">

                        {/* MOBILE */}
                        <div>

                            <label className="
                                block
                                text-sm
                                font-medium
                                text-gray-700
                                mb-2
                            ">
                                Mobile Number
                            </label>

                            <input
                                className="
                                    input
                                    w-full
                                "
                                placeholder="Enter mobile number"
                                value={form.mobile}
                                onChange={e =>
                                    setForm({
                                        ...form,
                                        mobile: e.target.value
                                    })
                                }
                            />

                        </div>

                        {/* GST */}
                        <div>

                            <label className="
                                block
                                text-sm
                                font-medium
                                text-gray-700
                                mb-2
                            ">
                                GST Number
                            </label>

                            <input
                                className="
                                    input
                                    w-full
                                "
                                placeholder="Enter GST number"
                                value={form.gst_no}
                                onChange={e =>
                                    setForm({
                                        ...form,
                                        gst_no: e.target.value
                                    })
                                }
                            />

                        </div>

                    </div>

                    {/* ADDRESS */}
                    <div>

                        <label className="
                            block
                            text-sm
                            font-medium
                            text-gray-700
                            mb-2
                        ">
                            Address
                        </label>

                        <textarea
                            className="
                                input
                                w-full
                                min-h-[140px]
                                resize-none
                            "
                            placeholder="Enter vendor address..."
                            value={form.address}
                            onChange={e =>
                                setForm({
                                    ...form,
                                    address: e.target.value
                                })
                            }
                        />

                    </div>

                    {/* ACTIONS */}
                    <div className="
                        flex
                        flex-col
                        sm:flex-row
                        gap-3
                        pt-2
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
                                w-full
                                sm:w-auto
                            "
                        >

                            {
                                saving
                                    ? "Updating..."
                                    : "Update Vendor"
                            }

                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                router.push("/vendors")
                            }
                            className="
                                bg-gray-200
                                hover:bg-gray-300
                                text-gray-800
                                px-6
                                py-3
                                rounded-xl
                                font-medium
                                transition
                                w-full
                                sm:w-auto
                            "
                        >
                            Cancel
                        </button>

                    </div>

                </form>

            </div>
            </div>
        </div>
    );
}