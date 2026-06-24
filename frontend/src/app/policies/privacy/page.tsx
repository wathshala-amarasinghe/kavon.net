"use client";

import React from 'react';
import { Navbar } from "@/components/layout/Navbar";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PrivacyPolicy() {
    return (
        <div className="bg-brand-black min-h-screen text-white">
            <Navbar />
            <main className="pt-44 pb-20 px-6 max-w-4xl mx-auto">
                <Link href="/shop" className="flex items-center gap-2 text-brand-volt font-mono text-[10px] mb-12 uppercase tracking-widest">
                    <ArrowLeft size={14} /> Back_To_Archive
                </Link>

                <h1 className="text-4xl font-black italic uppercase mb-8">Security & Privacy Encryption</h1>
                <div className="space-y-6 text-white/60 font-mono text-sm leading-relaxed">
                    <p>&gt; We implement 256-bit SSL encryption for all transaction data.</p>
                    <p>&gt; User footprints are used exclusively for order fulfillment and internal security audits.</p>
                    <p>&gt; We do not sell or trade your data to third-party entities. Your privacy is a priority of the VYRON division.</p>
                </div>
            </main>

        </div>
    );
}