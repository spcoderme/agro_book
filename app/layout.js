import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata = {

    metadataBase: new URL(
        "https://sindhaphana-agro-agency.vercel.app"
    ),

    title: {
        default:
            "सिंधफणा ॲग्रो एजन्सी, माजलगाव",
        template:
            "%s | सिंधफणा ॲग्रो एजन्सी"
    },

    description:
        "सिंधफणा ॲग्रो एजन्सी, माजलगाव — शेतीसाठी खत, बियाणे, कीटकनाशके आणि कृषी सेवा उपलब्ध. संपर्क: ९७६६६४४४३०",

    keywords: [
        "सिंधफणा ॲग्रो एजन्सी",
        "Majalgaon Agro Agency",
        "Fertilizer Shop Majalgaon",
        "Seeds Shop Majalgaon",
        "Pesticides Shop Majalgaon",
        "Agriculture Store Maharashtra",
        "Agro Agency Beed",
        "Majalgaon Agriculture Shop",
        "खत दुकान माजलगाव",
        "बियाणे दुकान",
        "कृषी सेवा"
    ],

    authors: [
        {
            name:
                "सिंधफणा ॲग्रो एजन्सी"
        }
    ],

    creator:
        "spcoderme",

    publisher:
        "spcoderme",

    category:
        "Agriculture",

    applicationName:
        "Sindhfana Agro Agency",

    openGraph: {

        title:
            "सिंधफणा ॲग्रो एजन्सी, माजलगाव",

        description:
            "खत, बियाणे, कीटकनाशके आणि कृषी सेवा उपलब्ध. संपर्क: ९७६६६४४४३०",

        url:
            "https://sindhaphana-agro-agency.vercel.app",

        siteName:
            "सिंधफणा ॲग्रो एजन्सी",

        locale:
            "mr_IN",

        type:
            "website",

        images: [
            {
                url: "/og-image.jpg",
                width: 1200,
                height: 630,
                alt:
                    "सिंधफणा ॲग्रो एजन्सी"
            }
        ]
    },

    twitter: {

        card:
            "summary_large_image",

        title:
            "सिंधफणा ॲग्रो एजन्सी, माजलगाव",

        description:
            "खत, बियाणे, कीटकनाशके आणि कृषी सेवा उपलब्ध.",

        images: [
            "/og-image.jpg","/favicon_io/android-chrome-512x512.png", "/favicon_io/android-chrome-192x192.png", "/favicon_io/favicon-16x16.png", "/favicon_io/favicon-32x32.png"
        ]
    },

    robots: {

        index: true,
        follow: true,

        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1
        }
    },

    alternates: {
        canonical:
            "https://sindhaphana-agro-agency.vercel.app"
    },

    icons: {

        icon:
            "/favicon_io/favicon.ico",

        shortcut:
            "/favicon_io/favicon.ico",

        apple:
            "/favicon_io/apple-touch-icon.png"
    }
};

export default function RootLayout({
    children
}) {

    return (

        <html
            lang="mr"
            className={`
                ${geistSans.variable}
                ${geistMono.variable}
                h-full
                antialiased
            `}
        >

            <body className="
                min-h-full
                flex
                flex-col
                bg-white
                text-gray-900
            ">

                {children}

            </body>

        </html>
    );
}