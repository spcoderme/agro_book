"use client";

import Link from "next/link";

import {
    ShoppingCart,
    Truck,
    History,
    Package,
    FileText,
    Users,
    LayoutDashboard,
    ArrowUpRight
} from "lucide-react";

const cards = [
    {
        title: "Purchase Entry",
        description: "Create and manage purchase invoices.",
        href: "/purchase",
        icon: ShoppingCart,
        color: "from-blue-500 to-gray-600"
    },
    {
        title: "Purchase History",
        description: "View all purchase transactions.",
        href: "/purchases",
        icon: History,
        color: "from-green-500 to-purple-700"
    },
    {
        title: "Dispatch Entry",
        description: "Manage outgoing stock dispatch.",
        href: "/dispatch",
        icon: Truck,
        color: "from-gray-500 to-red-600"
    },
    {
        title: "Dispatch History",
        description: "Track all dispatch records.",
        href: "/dispatches",
        icon: FileText,
        color: "from-purple-500 to-green-600"
    },
    {
        title: "Products",
        description: "Manage product inventory & stock.",
        href: "/products",
        icon: Package,
        color: "from-orange-500 to-purple-600"
    },
    {
        title: "Vendors",
        description: "Manage vendor information.",
        href: "/vendors",
        icon: Users,
        color: "from-green-500 to-orange-600"
    }
];

export default function DashboardPage() {

    return (

        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

                {/* HEADER */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

                    <div className="flex items-start sm:items-center gap-4">

                        <div className="bg-black text-white p-3 sm:p-4 rounded-2xl shadow-lg">
                            <LayoutDashboard size={30} />
                        </div>

                        <div>

    <h1 className="text-md sm:text-3xl font-extrabold tracking-tight text-gray-800">
        Sindhphana Agro Agency
    </h1>

    <p className="text-sm sm:text-base text-gray-500 mt-1">
        Inventory & dispatch management dashboard
    </p>

</div>

                    </div>

                    <div className="bg-white border rounded-2xl px-5 py-4 shadow-sm w-full sm:w-auto">

                        <div className="text-sm text-gray-500">
                            Total Modules
                        </div>

                        <div className="text-3xl font-extrabold text-gray-800">
                            {cards.length}
                        </div>

                    </div>

                </div>

                {/* GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">

                    {cards.map((card, index) => {

                        const Icon = card.icon;

                        return (

                            <Link
                                key={index}
                                href={card.href}
                                className="group relative overflow-hidden bg-white border border-gray-200 rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                            >

                                {/* TOP */}
                                <div className="flex items-start justify-between gap-4 mb-5">

                                    <div>

                                        <div className={`bg-gradient-to-br ${card.color} text-white p-4 rounded-2xl shadow-md w-fit`}>
                                            <Icon size={28} />
                                        </div>

                                    </div>

                                    <div className="flex items-center gap-1 text-sm font-medium text-gray-400 group-hover:text-black transition">

                                        Open

                                        <ArrowUpRight
                                            size={16}
                                            className="group-hover:translate-x-1 group-hover:-translate-y-1 transition"
                                        />

                                    </div>

                                </div>

                                {/* TITLE */}
                                <h2 className="text-xl font-bold text-gray-800 mb-2">
                                    {card.title}
                                </h2>

                                {/* DESC */}
                                <p className="text-sm leading-relaxed text-gray-500">
                                    {card.description}
                                </p>

                                {/* BOTTOM BORDER */}
                                <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${card.color}`} />

                            </Link>
                        );
                    })}

                </div>

            </div>

        </div>
    );
}