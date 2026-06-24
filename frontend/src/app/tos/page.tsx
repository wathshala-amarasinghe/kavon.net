"use client";

import React from 'react';
import { Navbar } from "@/components/layout/Navbar";
import { FileText, AlertCircle, Gavel, FileCheck } from 'lucide-react';

export default function TOSPage() {
    return (
        <main className="bg-black min-h-screen text-white">
            <Navbar />

            <div className="pt-44 pb-32 px-6 max-w-4xl mx-auto">
                <header className="mb-20">
                    <div className="flex items-center gap-3 text-brand-volt mb-4">
                        <FileText size={18} />
                        <span className="font-mono text-[12px] uppercase tracking-[0.6em]">Legal</span>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-[0.05em] leading-none mb-8">
                        TERMS_OF_<span className="text-white/10">SERVICE</span>
                    </h1>
                    <p className="text-white/40 font-mono text-[12px] uppercase tracking-[0.15em] leading-relaxed max-w-2xl">
                        By accessing the KAVON website, you agree to abide by the guidelines and requirements outlined below.
                    </p>
                </header>

                <div className="space-y-24">
                    <section className="space-y-6">
                        <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                            <Gavel size={20} className="text-brand-volt" />
                            <h2 className="font-black italic uppercase tracking-[0.3em] text-lg">01. ELIGIBILITY</h2>
                        </div>
                        <p className="text-white/50 font-mono text-xs md:text-sm leading-loose uppercase tracking-[0.15em]">
                            &gt; YOU MUST BE AT LEAST 18 YEARS OF AGE TO MAKE A PURCHASE. <br />
                            &gt; ACCOUNTS FOUND PROVIDING FALSE INFORMATION WILL BE SUSPENDED.
                        </p>
                    </section>

                    <section className="space-y-6">
                        <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                            <AlertCircle size={20} className="text-brand-volt" />
                            <h2 className="font-black italic uppercase tracking-[0.3em] text-lg">02. INTELLECTUAL PROPERTY</h2>
                        </div>
                        <p className="text-white/50 font-mono text-xs md:text-sm leading-loose uppercase tracking-[0.15em]">
                            &gt; ALL DESIGNS, MEDIA, AND CODE ARE THE EXCLUSIVE PROPERTY OF KAVON. <br />
                            &gt; UNAUTHORIZED REPRODUCTION WILL FACE LEGAL ACTION.
                        </p>
                    </section>

                    <section className="space-y-6">
                        <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                            <FileCheck size={20} className="text-brand-volt" />
                            <h2 className="font-black italic uppercase tracking-[0.3em] text-lg">03. LIMITATION OF LIABILITY</h2>
                        </div>
                        <p className="text-white/50 font-mono text-xs md:text-sm leading-loose uppercase tracking-[0.15em]">
                            &gt; KAVON IS NOT LIABLE FOR ISSUES CAUSED BY INCORRECT INFORMATION PROVIDED DURING CHECKOUT. <br />
                            &gt; WE DO NOT GUARANTEE WEBSITE UPTIME DURING MAINTENANCE PERIODS.
                        </p>
                    </section>
                </div>
            </div>

        </main>
    );
}