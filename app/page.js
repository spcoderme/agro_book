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
            px-4
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
                p-8
                sm:p-12
                text-center
            ">

                {/* LOGO / TITLE */}
                <div className="mb-8">

                    <div
    className="
        w-100
        h-100
        mx-auto
        rounded-2xl
        bg-white
        flex
        items-center
        justify-center
        shadow-lg
        mb-5
        overflow-hidden
        border
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
        "
    />

</div>

                    <h1 className="
                        text-xl
                        sm:text-xl
                        font-extrabold
                        text-gray-800
                        tracking-tight
                    ">
                        सिंधफणा ॲग्रो एजन्सी, माजलगाव । मो.९७६६६४४४३० 
                    </h1>

                    <p className="
                        mt-3
                        text-sm
                        sm:text-base
                        text-gray-500
                        leading-relaxed
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
                        px-8
                        py-4
                        rounded-2xl
                        shadow-lg
                        text-base
                        sm:text-lg
                        w-full
                        sm:w-auto
                    "
                >
                    Go to Dashboard →
                </Link>

                {/* FOOTER */}
                <div className="
                    mt-8
                    text-xs
                    text-gray-400
                ">
                    © 2026 सिंधफणा ॲग्रो एजन्सी, माजलगाव । मो.९७६६६४४४३० . All rights reserved.
                </div>

            </div>

        </main>
    );
}