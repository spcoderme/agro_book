// app/page.js

import Link from "next/link";
import Image from "next/image";

export default function HomePage() {

    return (

        <main className="
            min-h-screen
            bg-gradient-to-br
            from-green-50
            via-white
            to-emerald-100
            flex
            items-center
            justify-center
            px-3
            sm:px-5
            py-6
        ">

            <div className="
                w-full
                max-w-xl
                bg-white/90
                backdrop-blur
                border
                border-gray-200
                shadow-2xl
                rounded-3xl
                p-5
                sm:p-8
                md:p-10
                text-center
            ">

                {/* LOGO / TITLE */}
                <div className="mb-6 sm:mb-8">

                    {/* LOGO */}
                    <div
                        className="
                            w-[180px]
                            h-[180px]
                            sm:w-[240px]
                            sm:h-[240px]
                            md:w-[300px]
                            md:h-[300px]
                            mx-auto
                            rounded-3xl
                            bg-white
                            flex
                            items-center
                            justify-center
                            shadow-lg
                            mb-5
                            overflow-hidden
                            border
                            p-3
                        "
                    >

                        <Image
                            src="/SINGHPHANA_LOGO.png"
                            alt="sindhaphana_agro_logo"
                            width={300}
                            height={300}
                            priority
                            className="
                                object-contain
                                w-full
                                h-full
                            "
                        />

                    </div>

                    {/* TITLE */}
                    <h1 className="
                        text-lg
                        sm:text-2xl
                        md:text-3xl
                        font-extrabold
                        text-gray-800
                        tracking-tight
                        leading-snug
                    ">
                        सिंधफणा ॲग्रो एजन्सी, माजलगाव
                    </h1>

                    {/* MOBILE */}
                    <div className="
                        mt-2
                        text-sm
                        sm:text-base
                        font-semibold
                        text-green-700
                    ">
                        मो. ९७६६६४४४३०
                    </div>

                    {/* DESCRIPTION */}
                    <p className="
                        mt-4
                        text-xs
                        sm:text-sm
                        md:text-base
                        text-gray-500
                        leading-relaxed
                        px-1
                        sm:px-4
                    ">
                        Smart inventory, purchase and vendor
                        management system for agro businesses.
                    </p>

                </div>

                {/* BUTTON */}
                <Link
                    href="/dashboard"
                    className="
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        bg-green-600
                        hover:bg-green-700
                        active:scale-[0.98]
                        transition-all
                        duration-200
                        text-white
                        font-semibold
                        px-6
                        sm:px-8
                        py-3
                        sm:py-4
                        rounded-2xl
                        shadow-lg
                        text-sm
                        sm:text-base
                        md:text-lg
                        w-full
                        sm:w-auto
                    "
                >
                    Go to Dashboard →
                </Link>

                {/* FOOTER */}
                <div className="
                    mt-8
                    text-[11px]
                    sm:text-xs
                    text-gray-400
                    leading-relaxed
                ">
                    © 2026 सिंधफणा ॲग्रो एजन्सी,
                    माजलगाव. All rights reserved.
                </div>

            </div>

        </main>
    );
}