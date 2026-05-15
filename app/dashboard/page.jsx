"use client";

import Link from "next/link";
import {
    ShoppingCart,
    Truck,
    History,
    Package,
    FileText,
    Users,
    LayoutDashboard
} from "lucide-react";

const cards = [
    {
        title: "Purchase Entry",
        href: "/purchase",
        icon: ShoppingCart,
        color: "bg-blue-500"
    },
    {
        title: "Purchase History",
        href: "/purchases",
        icon: History,
        color: "bg-gray-500"
    },
    {
        title: "Dispatch Entry",
        href: "/dispatch",
        icon: Truck,
        color: "bg-green-500"
    },
    {
        title: "Dispatch History",
        href: "/dispatches",
        icon: FileText,
        color: "bg-orange-500"
    },
    {
        title: "Products",
        href: "/products",
        icon: Package,
        color: "bg-purple-500"
    },
    {
        title: "Vendors",
        href: "/vendors",
        icon: Users,
        color: "bg-pink-500"
    }
];

export default function DashboardPage() {

    return (
        <div className="min-h-screen bg-gray-100 p-6">

            {/* HEADER */}
            <div className="flex items-center gap-3 mb-8">

                <div className="bg-black text-white p-3 rounded-2xl">
                    <LayoutDashboard size={28} />
                </div>

                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        Sindhphana Agro Agency Dashboard
                    </h1>

                    <p className="text-gray-500">
                        Manage Purchases, Dispatches, Products & Vendors
                    </p>
                </div>

            </div>

            {/* GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                {cards.map((card, index) => {

                    const Icon = card.icon;

                    return (
                        <Link
                            key={index}
                            href={card.href}
                            className="bg-white rounded-3xl shadow hover:shadow-xl transition-all duration-300 border border-gray-200 p-6 hover:-translate-y-1"
                        >

                            <div className="flex items-center justify-between mb-5">

                                <div className={`${card.color} text-white p-4 rounded-2xl`}>
                                    <Icon size={30} />
                                </div>

                                <span className="text-sm text-gray-400">
                                    Open
                                </span>

                            </div>

                            <h2 className="text-xl font-bold text-gray-800 mb-2">
                                {card.title}
                            </h2>

                            <p className="text-gray-500 text-sm">
                                Click to manage {card.title.toLowerCase()}.
                            </p>

                        </Link>
                    );
                })}

            </div>

        </div>
    );
}
