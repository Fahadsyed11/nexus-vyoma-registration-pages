import type { Metadata } from "next";
import { Anton, Montserrat, Inter, JetBrains_Mono, Barlow_Condensed, Space_Grotesk, Aldrich } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import DualBackground from "@/components/ui/DualBackground";

const anton = Anton({
  weight: "400",
  variable: "--font-anton",
  subsets: ["latin"],
  display: "swap",
});

const montserrat = Montserrat({
  weight: ["500", "600"],
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  weight: ["400", "500", "600", "700"],
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  weight: ["500", "600", "700"],
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const aldrich = Aldrich({
  weight: "400",
  variable: "--font-aldrich",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nexus Vyoma ISL Engineering College, Hyderabad | Official Registration Portal",
  description:
    "Official registration portal for Nexus Vyoma (10–12 Nov 2026) organized by ISL Engineering College, Hyderabad. Featuring Cosplay Championship, Mega DJ Night, Automobile Expo, Sufi & Qawwali Night, Tech Battles, and Food Fest.",
  keywords: [
    "Nexus Vyoma",
    "ISL Engineering College",
    "College Fest Hyderabad",
    "Tech Battles",
    "Cosplay",
    "DJ Night",
    "Automobile Expo",
    "Registration",
  ],
  openGraph: {
    title: "Nexus Vyoma ISL Engineering College, Hyderabad | Official Registration Portal",
    description: "Ideas • People • Culture • Beyond | ISL Engineering College, Hyderabad",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: "/favicon.ico",
  },
};

import HorizontalStageTransition from "@/components/transitions/HorizontalStageTransition";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${montserrat.variable} ${inter.variable} ${jetbrainsMono.variable} ${barlowCondensed.variable} ${spaceGrotesk.variable} ${aldrich.variable} dark h-full antialiased bg-black text-white`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col font-sans bg-transparent text-[#FFFFFF] selection:bg-[#FF6A00] selection:text-white"
        suppressHydrationWarning
      >
        <Suspense fallback={null}>
          <HorizontalStageTransition />
        </Suspense>
        <DualBackground />
        {children}
      </body>
    </html>
  );
}
