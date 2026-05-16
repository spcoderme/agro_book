"use client";

import { useEffect, useState } from "react";
import PurchaseForm from "../../components/PurchaseForm";
import Link from "next/link";

export default function PurchasePage() {

    // ================= HYDRATION FIX =================
    const [mounted, setMounted] =
        useState(false);

    useEffect(() => {

        setMounted(true);

    }, []);

    // PREVENT SSR/CLIENT HTML MISMATCH
    if (!mounted) {

        return null;
    }

    return (

        <div className="w-full max-w-7xl mx-auto px-3 py-4 md:px-6">

           

            {/* FORM */}
            <div className="
                bg-white
                shadow-lg
                rounded-2xl
                p-3
                sm:p-5
                border
            ">

                <PurchaseForm />

            </div>

        </div>
    );
}