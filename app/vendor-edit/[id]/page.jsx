"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function VendorEditPage() {

    const params = useParams();

    const router = useRouter();

    const id = params.id;

    const [form, setForm] = useState({
        name: "",
        mobile: "",
        address: "",
        gst_no: ""
    });

    // LOAD VENDOR
    const loadVendor = async () => {

        const res = await fetch(`/api/vendors/${id}`);

        const data = await res.json();

        setForm({
            name: data.name || "",
            mobile: data.mobile || "",
            address: data.address || "",
            gst_no: data.gst_no || ""
        });
    };

    useEffect(() => {

        if (id) {
            loadVendor();
        }

    }, [id]);

    // UPDATE
    const handleSubmit = async (e) => {

        e.preventDefault();

        const res = await fetch(
            `/api/vendors/${id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(form)
            }
        );

        const data = await res.json();

        if (data.success) {

            alert("Vendor Updated ✅");

            router.push("/vendors");

        } else {

            alert(data.error || "Failed");
        }
    };

    return (

        <div className="p-5 max-w-3xl">

            <h1 className="text-2xl font-bold mb-5">
                Edit Vendor
            </h1>

            <form
                onSubmit={handleSubmit}
                className="space-y-4"
            >

                <input
                    className="input w-full"
                    placeholder="Vendor Name"
                    value={form.name}
                    onChange={e =>
                        setForm({
                            ...form,
                            name: e.target.value
                        })
                    }
                />

                <input
                    className="input w-full"
                    placeholder="Mobile"
                    value={form.mobile}
                    onChange={e =>
                        setForm({
                            ...form,
                            mobile: e.target.value
                        })
                    }
                />

                <textarea
                    className="input w-full min-h-[120px]"
                    placeholder="Address"
                    value={form.address}
                    onChange={e =>
                        setForm({
                            ...form,
                            address: e.target.value
                        })
                    }
                />

                <input
                    className="input w-full"
                    placeholder="GST No"
                    value={form.gst_no}
                    onChange={e =>
                        setForm({
                            ...form,
                            gst_no: e.target.value
                        })
                    }
                />

                <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded"
                >
                    Update Vendor
                </button>

            </form>

        </div>
    );
}