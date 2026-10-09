import type { Metadata } from "next";
import { Anton, Space_Grotesk, Barlow_Condensed } from "next/font/google";
import "./globals.css";
import DualBackground from "@/components/ui/DualBackground";

const anton = Anton({
  weight: "400",
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  weight: ["400", "500", "600", "700"],
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NEXUS VYOMA 2026 | A Three-Day Inter-College Fest | ISL Engineering College",
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
    title: "NEXUS VYOMA 2026 | A Three-Day Inter-College Fest",
    description: "Ideas • People • Culture • Beyond | ISL Engineering College, Hyderabad",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${spaceGrotesk.variable} ${barlowCondensed.variable} dark h-full antialiased bg-black text-white`}
    >
      <body className="min-h-full flex flex-col font-sans bg-transparent text-[#FFFFFF] selection:bg-[#FF6A00] selection:text-white">
        <DualBackground />
        {children}
      </body>
    </html>
  );
}
