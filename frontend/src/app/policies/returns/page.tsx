"use client";

import React from 'react';
import { Navbar } from "@/components/layout/Navbar";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ReturnsPolicy() {
    return (
        <div className="bg-brand-black min-h-screen text-white">
            <Navbar />
            <main className="pt-44 pb-20 px-6 max-w-4xl mx-auto">
                <Link href="/shop" className="flex items-center gap-2 text-brand-volt font-mono text-[10px] mb-12 uppercase tracking-widest">
                    <ArrowLeft size={14} /> Back_To_Archive
                </Link>

                <h1 className="text-4xl font-black italic uppercase mb-8">Return & Refund Protocol</h1>
                <div className="space-y-6 text-white/60 font-mono text-sm leading-relaxed">
                    <p>&gt; All VYRON assets are subject to a 7-day inspection window from the date of delivery fulfillment.</p>
                    <p>&gt; Items must be returned in original condition: unworn, unwashed, with all tactical tags attached.</p>
                    <p>&gt; Final sale items and limited archive drops are non-refundable unless a manufacturing defect is identified.</p>
                </div>
            </main>

        </div>
    );
}