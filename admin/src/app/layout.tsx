import type { Metadata } from "next";
import { Inter, Barlow_Condensed, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ToasterProvider } from "./ToasterProvider";

const barlowCondensed = Barlow_Condensed({ weight: ["600", "700", "800"], subsets: ["latin"], variable: "--font-heading" });
const inter = Inter({ subsets: ["latin"], variable: "--font-body" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "KAVON | Admin_Panel",
  description: "Tactical Administrative Interface",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
  },
  icons: {
    icon: [
      { url: "/logo/symbol-1.png", href: "/logo/symbol-1.png" },
    ],
    shortcut: "/logo/symbol-1.png",
    apple: "/logo/symbol-1.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${barlowCondensed.variable} ${inter.variable} ${mono.variable}`}>
      <body className="bg-black text-white selection:bg-brand-volt selection:text-black">
        <ToasterProvider />
        {children}
      </body>
    </html>
  );
}
