"use client";

import React from 'react';
import { Navbar } from "@/components/layout/Navbar";
import { Truck, RefreshCw, ShieldCheck, Globe, AlertTriangle } from 'lucide-react';
import { FormattedPrice } from "@/components/ui/FormattedPrice";

export default function ReturnsPage() {
    return (
        <main className="bg-black min-h-screen text-white selection:bg-brand-volt selection:text-black">
            <Navbar />

            <div className="pt-44 pb-32 px-6 max-w-5xl mx-auto">
                <header className="mb-24">
                    <div className="flex items-center gap-4 text-brand-volt mb-6">
                        <Truck size={20} />
                        <span className="font-mono text-[12px] uppercase tracking-[0.5em] font-bold">SHIPPING & FULFILLMENT</span>
                    </div>

                    <h1 className="text-5xl md:text-8xl lg:text-9xl font-black italic uppercase leading-[0.85] mb-10 tracking-[0.05em] md:tracking-[0.1em]">
                        SHIPPING & <span className="text-white/10">RETURNS</span>
                    </h1>

                    <p className="text-white/60 font-mono text-[14px] uppercase tracking-[0.15em] leading-loose max-w-3xl">
                        Comprehensive information on order delivery, customs clearance, and return procedures.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                    {/* SHIPPING SECTION */}
                    <section className="space-y-14">
                        <div className="flex items-center gap-4 border-b border-white/10 pb-6">
                            <Globe size={26} className="text-brand-volt" />
                            <h2 className="text-3xl font-black uppercase italic tracking-[0.1em]">SHIPPING INFORMATION</h2>
                        </div>

                        <div className="space-y-10">
                            <div className="p-10 bg-white/[0.02] border border-white/5 space-y-6">
                                <h4 className="font-black uppercase tracking-[0.3em] text-brand-volt text-sm">DOMESTIC (SRI LANKA)</h4>
                                <ul className="space-y-4 font-mono text-[13px] text-white/70 uppercase leading-relaxed tracking-[0.1em]">
                                    <li className="flex gap-3"><span className="text-brand-volt opacity-50">&gt;</span> Processing: 1-2 Business Days</li>
                                    <li className="flex gap-3"><span className="text-brand-volt opacity-50">&gt;</span> Delivery: 2-4 Business Days</li>
                                    <li className="flex gap-3"><span className="text-brand-volt opacity-50">&gt;</span> Carriers: Prompt Logistics, Grasshopper</li>
                                    <li className="flex gap-3"><span className="text-brand-volt font-bold opacity-100">&gt;</span> Cost: FREE on orders above <FormattedPrice amount={15000} /></li>
                                </ul>
                            </div>

                            <div className="p-10 bg-white/[0.02] border border-white/5 space-y-6">
                                <h4 className="font-black uppercase tracking-[0.4em] text-white text-sm">Global_Operations (International)</h4>
                                <ul className="space-y-4 font-mono text-[11px] text-white/60 uppercase leading-relaxed tracking-[0.15em]">
                                    <li className="flex gap-3"><span className="text-white/20">&gt;</span> Fulfillment: 2-3 standard cycles</li>
                                    <li className="flex gap-3"><span className="text-white/20">&gt;</span> Deployment: 7-14 business cycles</li>
                                    <li className="flex gap-3"><span className="text-white/20">&gt;</span> Carriers: DHL_Express, Fedex_Priority</li>
                                    <li className="flex gap-3"><span className="text-white/20">&gt;</span> Customs: Duties calculated at sector boundary</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* RETURNS SECTION */}
                    <section className="space-y-14">
                        <div className="flex items-center gap-4 border-b border-white/10 pb-6">
                            <RefreshCw size={26} className="text-brand-volt" />
                            <h2 className="text-3xl font-black uppercase italic tracking-[0.1em]">RETURN POLICY</h2>
                        </div>

                        <div className="space-y-10">
                            <div className="p-10 bg-white/[0.02] border border-white/5 space-y-6 border-l-4 border-l-brand-volt">
                                <h4 className="font-black uppercase tracking-[0.3em] text-sm">7-DAY INSPECTION WINDOW</h4>
                                <p className="font-mono text-[13px] text-white/70 uppercase leading-loose tracking-[0.1em]">
                                    All items are subject to a strict 168-hour inspection period. If the item does not meet your expectations, a return can be initiated within this timeframe.
                                </p>
                            </div>

                            <div className="space-y-8 px-2">
                                <div className="flex gap-6">
                                    <div className="w-10 h-10 bg-brand-volt text-black flex items-center justify-center font-black text-xs shrink-0 italic">01</div>
                                    <p className="font-mono text-[11px] text-white/60 uppercase pt-2 tracking-[0.15em] leading-relaxed">Initialize request via the [Customer_Dashboard] or support comms.</p>
                                </div>
                                <div className="flex gap-6">
                                    <div className="w-10 h-10 bg-brand-volt text-black flex items-center justify-center font-black text-xs shrink-0 italic">02</div>
                                    <p className="font-mono text-[11px] text-white/60 uppercase pt-2 tracking-[0.15em] leading-relaxed">Ensure asset is &apos;Pristine_Condition&apos; with all original tactical tags.</p>
                                </div>
                                <div className="flex gap-6">
                                    <div className="w-10 h-10 bg-brand-volt text-black flex items-center justify-center font-black text-xs shrink-0 italic">03</div>
                                    <p className="font-mono text-[11px] text-white/60 uppercase pt-2 tracking-[0.15em] leading-relaxed">Dispatch assets via an authorized courier node.</p>
                                </div>
                            </div>

                            <div className="p-8 bg-red-500/5 border border-red-500/20 flex gap-6">
                                <AlertTriangle className="text-red-500 shrink-0" size={24} />
                                <div className="space-y-2">
                                    <h5 className="text-[11px] font-black uppercase text-red-500 tracking-[0.4em]">Warning: Exclusion_Zone</h5>
                                    <p className="text-[10px] font-mono text-red-500/50 uppercase leading-relaxed tracking-[0.12em]">
                                        Limited Archive Drops and Tactical Under-Layers (Compression gear) are non-reversible for biological safety protocols.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* BOTTOM AUTH */}
                <div className="mt-40 p-16 bg-white text-black flex flex-col lg:flex-row items-center justify-between gap-12">
                    <div className="space-y-5">
                        <div className="flex items-center gap-4">
                            <ShieldCheck size={32} strokeWidth={2.5} />
                            <h3 className="text-3xl font-black uppercase italic tracking-[0.2em]">Secured_Logistics</h3>
                        </div>
                        <p className="font-mono text-[11px] uppercase tracking-[0.35em] font-bold opacity-70">
                            Every deployment is insured and monitored until successful hand-off.
                        </p>
                    </div>
                    <button className="w-full lg:w-auto px-14 py-6 bg-black text-white font-black uppercase text-xs tracking-[0.5em] hover:bg-brand-volt hover:text-black transition-all duration-500 active:scale-95">
                        Initiate_Return
                    </button>
                </div>
            </div>

        </main>
    );
}