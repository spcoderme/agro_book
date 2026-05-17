"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function VendorCreatePage() {

    const router = useRouter();

    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        name: "",
        mobile: "",
        address: "",
        gst_no: ""
    });

    // ================= HANDLE CHANGE =================
    const handleChange = (key, value) => {

        setForm(prev => ({
            ...prev,
            [key]: value
        }));
    };

    // ================= VALIDATION =================
    const validateForm = () => {

        if (!form.name.trim()) {

            alert("Vendor name is required");

            return false;
        }

        if (
            form.mobile &&
            !/^[0-9]{10}$/.test(form.mobile)
        ) {

            alert("Enter valid 10 digit mobile number");

            return false;
        }

        return true;
    };

    // ================= SAVE =================
    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!validateForm()) return;

        try {

            setSaving(true);

            const res = await fetch(
                "/api/vendors",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        ...form,
                        name: form.name.trim(),
                        mobile: form.mobile.trim(),
                        gst_no: form.gst_no.trim(),
                        address: form.address.trim()
                    })
                }
            );

            const data = await res.json();

            if (data.success) {

                alert("Vendor Added Successfully ✅");

                router.push("/vendors");

            } else {

                alert(
                    data.error || "Failed to save vendor"
                );
            }

        } catch (err) {

            console.log(err);

            alert("Something went wrong");

        } finally {

            setSaving(false);
        }
    };

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
                            Add Vendor
                        </h1>

                        <p className="
                            text-sm
                            text-gray-500
                            mt-1
                        ">
                            Create new vendor / supplier
                        </p>

                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            router.push("/vendors")
                        }
                        className="
                            bg-gray-700
                            hover:bg-black
                            text-white
                            px-4
                            py-2.5
                            rounded-xl
                            text-sm
                            transition
                            w-full
                            sm:w-auto
                        "
                    >
                        ← Back to Vendors
                    </button>

                </div>

                {/* FORM CARD */}
                <div className="
                    bg-white
                    border
                    border-gray-200
                    rounded-3xl
                    shadow-sm
                    overflow-hidden
                ">

                    {/* TOP BAR */}
                    <div className="
                        px-5
                        sm:px-6
                        py-4
                        border-b
                        bg-gray-50
                    ">

                        <h2 className="
                            text-lg
                            font-semibold
                            text-gray-800
                        ">
                            Vendor Information
                        </h2>

                    </div>

                    {/* FORM */}
                    <form
                        onSubmit={handleSubmit}
                        className="
                            p-5
                            sm:p-6
                            space-y-5
                        "
                    >

                        {/* GRID */}
                        <div className="
                            grid
                            grid-cols-1
                            md:grid-cols-2
                            gap-5
                        ">

                            {/* NAME */}
                            <div className="md:col-span-2">

                                <label className="
                                    block
                                    text-sm
                                    font-semibold
                                    text-gray-700
                                    mb-2
                                ">
                                    Vendor Name
                                    <span className="text-red-500">
                                        {" "}*
                                    </span>
                                </label>

                                <input
                                    type="text"

                                    className="
                                        w-full
                                        border
                                        border-gray-300
                                        rounded-xl
                                        px-4
                                        py-3
                                        outline-none
                                        focus:ring-2
                                        focus:ring-blue-500
                                        focus:border-blue-500
                                        transition
                                    "

                                    placeholder="Enter vendor name"

                                    value={form.name}

                                    onChange={(e) =>
                                        handleChange(
                                            "name",
                                            e.target.value
                                        )
                                    }

                                    required
                                />

                            </div>

                            {/* MOBILE */}
                            <div>

                                <label className="
                                    block
                                    text-sm
                                    font-semibold
                                    text-gray-700
                                    mb-2
                                ">
                                    Mobile Number
                                </label>

                                <input
                                    type="tel"

                                    inputMode="numeric"

                                    maxLength={10}

                                    className="
                                        w-full
                                        border
                                        border-gray-300
                                        rounded-xl
                                        px-4
                                        py-3
                                        outline-none
                                        focus:ring-2
                                        focus:ring-blue-500
                                        focus:border-blue-500
                                        transition
                                    "

                                    placeholder="9876543210"

                                    value={form.mobile}

                                    onChange={(e) =>
                                        handleChange(
                                            "mobile",
                                            e.target.value.replace(
                                                /[^0-9]/g,
                                                ""
                                            )
                                        )
                                    }
                                />

                            </div>

                            {/* GST */}
                            <div>

                                <label className="
                                    block
                                    text-sm
                                    font-semibold
                                    text-gray-700
                                    mb-2
                                ">
                                    GST Number
                                </label>

                                <input
                                    type="text"

                                    className="
                                        w-full
                                        border
                                        border-gray-300
                                        rounded-xl
                                        px-4
                                        py-3
                                        uppercase
                                        outline-none
                                        focus:ring-2
                                        focus:ring-blue-500
                                        focus:border-blue-500
                                        transition
                                    "

                                    placeholder="27ABCDE1234F1Z5"

                                    value={form.gst_no}

                                    onChange={(e) =>
                                        handleChange(
                                            "gst_no",
                                            e.target.value.toUpperCase()
                                        )
                                    }
                                />

                            </div>

                        </div>

                        {/* ADDRESS */}
                        <div>

                            <label className="
                                block
                                text-sm
                                font-semibold
                                text-gray-700
                                mb-2
                            ">
                                Address
                            </label>

                            <textarea
                                className="
                                    w-full
                                    min-h-[130px]
                                    border
                                    border-gray-300
                                    rounded-xl
                                    px-4
                                    py-3
                                    outline-none
                                    resize-y
                                    focus:ring-2
                                    focus:ring-blue-500
                                    focus:border-blue-500
                                    transition
                                "

                                placeholder="
Enter vendor address
                            "

                                value={form.address}

                                onChange={(e) =>
                                    handleChange(
                                        "address",
                                        e.target.value
                                    )
                                }
                            />

                        </div>

                        {/* ACTIONS */}
                        <div className="
                            flex
                            flex-col-reverse
                            sm:flex-row
                            sm:justify-end
                            gap-3
                            pt-2
                        ">

                            <button
                                type="button"

                                onClick={() =>
                                    router.push("/vendors")
                                }

                                className="
                                    w-full
                                    sm:w-auto
                                    px-5
                                    py-3
                                    rounded-xl
                                    border
                                    border-gray-300
                                    hover:bg-gray-100
                                    transition
                                    font-medium
                                "
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"

                                disabled={saving}

                                className="
                                    w-full
                                    sm:w-auto
                                    bg-blue-600
                                    hover:bg-blue-700
                                    disabled:bg-gray-400
                                    text-white
                                    px-6
                                    py-3
                                    rounded-xl
                                    font-semibold
                                    transition
                                    shadow-sm
                                "
                            >

                                {
                                    saving
                                        ? "Saving..."
                                        : "Save Vendor"
                                }

                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </div>
    );
}