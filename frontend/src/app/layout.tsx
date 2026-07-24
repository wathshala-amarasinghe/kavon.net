import React from "react";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { PromoBanner } from "@/components/layout/PromoBanner";
import { Footer } from "@/components/layout/Footer";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { PageLoader } from "@/components/ui/PageLoader";
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { AuthProvider } from '@/context/AuthContext';
import { CheckoutProvider } from "@/context/CheckoutContext";
import { AssistantPanel } from '@/components/ai/AssistantPanel';
import { MaintenanceGuard } from "@/components/layout/MaintenanceGuard";

// NEW_LOGIC_IMPORTS
import { UserSettingsProvider } from "@/context/UserSettingsContext";
import { SystemSettingsProvider } from "@/context/SystemSettingsContext";
import { InventoryProvider } from "@/context/InventoryContext";
import { CurrencyProvider } from "@/context/CurrencyContext";

export const metadata: Metadata = {
  metadataBase: new URL('https://kavon.lk'),
  title: {
    default: "KAVON | wear power wear kavon",
    template: "%s | KAVON"
  },
  description: "wear power wear kavon. High-performance streetwear engineered for the modern nomad. Tactical construction, limited archival releases, and urban shadow aesthetics.",
  keywords: ["streetwear", "tactical clothing", "urban techwear", "KAVON", "limited fashion", "Sri Lanka streetwear"],
  authors: [{ name: "KAVON Division" }],
  creator: "KAVON Division",
  publisher: "KAVON Division",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://kavon.lk",
    siteName: "KAVON",
    title: "KAVON | wear power wear kavon",
    description: "wear power wear kavon. Engineered for the urban environment. Explore our latest tactical drops.",
    images: [
      {
        url: "/logo/logo-1.png",
        width: 1200,
        height: 630,
        alt: "KAVON TACTICAL"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "KAVON | wear power wear kavon",
    description: "wear power wear kavon. High-performance streetwear for the modern nomad.",
    images: ["/logo/logo-1.png"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  icons: {
    icon: [
      { url: "/logo/symbol-1.png", href: "/logo/symbol-1.png" },
    ],
    shortcut: "/logo/symbol-1.png",
    apple: "/logo/symbol-1.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth">
      <body
        className="
          min-h-screen 
          flex 
          flex-col 
          bg-black 
          text-white 
          font-sans 
          antialiased 
        "
      >
        <SystemSettingsProvider>
          <UserSettingsProvider>
            <CurrencyProvider>
              <InventoryProvider>
                <AuthProvider>
                  <WishlistProvider>
                    <CartProvider>
                      <CheckoutProvider>
                        <PageLoader />

                      <PromoBanner />
                      <Navbar />

                      <MaintenanceGuard>
                        <main className="flex-grow relative z-0">
                          {children}
                        </main>
                      </MaintenanceGuard>

                        <AssistantPanel />

                        <ScrollToTop />
                        <Footer />
                      </CheckoutProvider>
                    </CartProvider>
                  </WishlistProvider>
                </AuthProvider>
              </InventoryProvider>
            </CurrencyProvider>
          </UserSettingsProvider>
        </SystemSettingsProvider>
      </body>
    </html>
  );
}
