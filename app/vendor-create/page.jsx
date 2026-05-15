"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function VendorCreatePage() {

    const router = useRouter();

    const [form, setForm] = useState({
        name: "",
        mobile: "",
        address: "",
        gst_no: ""
    });

    // SAVE
    const handleSubmit = async (e) => {

        e.preventDefault();

        const res = await fetch(
            "/api/vendors",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(form)
            }
        );

        const data = await res.json();

        if (data.success) {

            alert("Vendor Added ✅");

            router.push("/vendors");

        } else {

            alert(data.error || "Failed");
        }
    };

    return (

        <div className="p-5 max-w-3xl">

            <h1 className="text-2xl font-bold mb-5">
                Add Vendor
            </h1>

            <form
                onSubmit={handleSubmit}
                className="space-y-4"
            >

                {/* NAME */}
                <div>

                    <label className="block mb-1 font-medium">
                        Vendor Name
                    </label>

                    <input
                        className="input w-full"
                        placeholder="Enter Vendor Name"
                        value={form.name}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                name: e.target.value
                            })
                        }
                        required
                    />

                </div>

                {/* MOBILE */}
                <div>

                    <label className="block mb-1 font-medium">
                        Mobile
                    </label>

                    <input
                        className="input w-full"
                        placeholder="Enter Mobile"
                        value={form.mobile}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                mobile: e.target.value
                            })
                        }
                    />

                </div>

                {/* GST */}
                <div>

                    <label className="block mb-1 font-medium">
                        GST No
                    </label>

                    <input
                        className="input w-full"
                        placeholder="Enter GST Number"
                        value={form.gst_no}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                gst_no: e.target.value
                            })
                        }
                    />

                </div>

                {/* ADDRESS */}
                <div>

                    <label className="block mb-1 font-medium">
                        Address
                    </label>

                    <textarea
                        className="input w-full min-h-[120px]"
                        placeholder="Enter Address"
                        value={form.address}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                address: e.target.value
                            })
                        }
                    />

                </div>

                {/* BUTTON */}
                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded"
                >
                    Save Vendor
                </button>

            </form>

        </div>
    );
}