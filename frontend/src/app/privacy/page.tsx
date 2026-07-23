"use client";

import React from 'react';
import { Truck, RefreshCw, ShieldCheck, Globe, AlertTriangle } from 'lucide-react';

export default function ReturnsPage() {
    return (
        <main className="bg-black min-h-screen text-white">

            <div className="pt-44 pb-32 px-6 max-w-5xl mx-auto">
                <header className="mb-20">
                    <div className="flex items-center gap-3 text-brand-volt mb-6">
                        <Truck size={18} />
                        <span className="font-mono text-[10px] uppercase tracking-[0.8em]">Logistics_&_Fulfillment</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black italic uppercase leading-none mb-8 tracking-[0.2em]">
                        SHIPPING_&_<span className="text-white/10">RETURNS</span>
                    </h1>
                    <p className="text-white/40 font-mono text-[11px] uppercase tracking-[0.3em] leading-relaxed max-w-2xl">
                        Comprehensive intelligence on asset deployment, customs clearance, and requisition reversal protocols.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* SHIPPING SECTION */}
                    <section className="space-y-12">
                        <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                            <Globe size={24} className="text-brand-volt" />
                            <h2 className="text-3xl font-black uppercase italic tracking-[0.25em]">Deployment</h2>
                        </div>

                        <div className="space-y-8">
                            <div className="p-8 bg-white/5 border border-white/5 space-y-4">
                                <h4 className="font-black uppercase tracking-[0.4em] text-brand-volt text-xs">Domestic_Sectors</h4>
                                <ul className="space-y-4 font-mono text-[10px] text-white/60 uppercase leading-loose tracking-[0.15em]">
                                    <li>&gt; Standard_Ground: 3-5 Cycles</li>
                                    <li>&gt; Tactical_Express: 1-2 Cycles</li>
                                    <li>&gt; Colombo_Sector: Same_Day_Available</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* RETURNS SECTION */}
                    <section className="space-y-12">
                        <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                            <RefreshCw size={24} className="text-brand-volt" />
                            <h2 className="text-3xl font-black uppercase italic tracking-[0.25em]">Requisition</h2>
                        </div>

                        <div className="space-y-8">
                            <div className="p-8 bg-white/5 border border-white/5 space-y-4">
                                <h4 className="font-black uppercase tracking-[0.4em] text-brand-volt text-xs">Return_Protocol</h4>
                                <p className="font-mono text-[10px] text-white/60 uppercase leading-loose tracking-[0.15em]">
                                    Assets must be returned in original condition with security seals intact within 14 cycles of deployment.
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

        </main>
    );
}
