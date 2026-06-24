"use client";

import React from 'react';
import { Ruler, Info, User, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function SizeGuidePage() {
    const sizeData = {
        tops: [
            { size: "S", chest: "36-38\"", length: "27\"", shoulder: "17.5\"" },
            { size: "M", chest: "38-40\"", length: "28\"", shoulder: "18.5\"" },
            { size: "L", chest: "40-42\"", length: "29\"", shoulder: "19.5\"" },
            { size: "XL", chest: "42-44\"", length: "30\"", shoulder: "20.5\"" },
        ],
        bottoms: [
            { size: "S", waist: "28-30\"", length: "30\"", thigh: "22\"" },
            { size: "M", waist: "30-32\"", length: "31\"", thigh: "23\"" },
            { size: "L", waist: "32-34\"", length: "32\"", thigh: "24\"" },
            { size: "XL", waist: "34-36\"", length: "33\"", thigh: "25\"" },
        ]
    };

    return (
        <main className="bg-black min-h-screen text-white selection:bg-brand-volt selection:text-black">

            <div className="pt-44 pb-32 px-6 max-w-6xl mx-auto">
                <header className="mb-24 text-center">
                    <div className="flex items-center justify-center gap-3 text-brand-volt mb-6">
                        <Ruler size={18} />
                        <span className="font-mono text-[12px] uppercase tracking-[0.5em] font-bold">Measurements</span>
                    </div>
                    <h1 className="text-6xl md:text-9xl font-black italic uppercase tracking-[0.15em] leading-none mb-10">
                        SIZE GUIDE
                    </h1>
                    <p className="text-white/40 font-mono text-[13px] uppercase tracking-[0.2em] leading-relaxed max-w-3xl mx-auto">
                        Use our size charts to find your perfect fit. All measurements are in inches.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
                    {/* TOPS SECTION */}
                    <section className="space-y-12">
                        <div className="flex items-center gap-4 border-b border-white/10 pb-6">
                            <span className="text-brand-volt font-mono text-xs tracking-[0.3em] font-bold">{"//01"}</span>
                            <h2 className="text-2xl font-black uppercase italic tracking-[0.25em]">Tops_&_Outerwear</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="border-b border-white/5">
                                        <th className="text-left py-5 px-4 font-mono text-[12px] text-white/30 uppercase tracking-[0.3em]">Size</th>
                                        <th className="text-left py-5 px-4 font-mono text-[12px] text-white/30 uppercase tracking-[0.3em]">Chest</th>
                                        <th className="text-left py-5 px-4 font-mono text-[12px] text-white/30 uppercase tracking-[0.3em]">Length</th>
                                        <th className="text-left py-5 px-4 font-mono text-[12px] text-white/30 uppercase tracking-[0.3em]">Shoulder</th>
                                    </tr>
                                </thead>
                                <tbody className="font-mono text-xs tracking-[0.2em]">
                                    {sizeData.tops.map((row) => (
                                        <tr key={row.size} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors group">
                                            <td className="py-7 px-4 font-black text-brand-volt tracking-[0.3em]">{row.size}</td>
                                            <td className="py-7 px-4 text-white/80">{row.chest}</td>
                                            <td className="py-7 px-4 text-white/80">{row.length}</td>
                                            <td className="py-7 px-4 text-white/80">{row.shoulder}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* BOTTOMS SECTION */}
                    <section className="space-y-12">
                        <div className="flex items-center gap-4 border-b border-white/10 pb-6">
                            <span className="text-brand-volt font-mono text-xs tracking-[0.3em] font-bold">{"//02"}</span>
                            <h2 className="text-2xl font-black uppercase italic tracking-[0.25em]">Bottoms</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="border-b border-white/5">
                                        <th className="text-left py-5 px-4 font-mono text-[12px] text-white/30 uppercase tracking-[0.3em]">Size</th>
                                        <th className="text-left py-5 px-4 font-mono text-[12px] text-white/30 uppercase tracking-[0.3em]">Waist</th>
                                        <th className="text-left py-5 px-4 font-mono text-[12px] text-white/30 uppercase tracking-[0.3em]">Length</th>
                                        <th className="text-left py-5 px-4 font-mono text-[12px] text-white/30 uppercase tracking-[0.3em]">Thigh</th>
                                    </tr>
                                </thead>
                                <tbody className="font-mono text-xs tracking-[0.2em]">
                                    {sizeData.bottoms.map((row) => (
                                        <tr key={row.size} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors group">
                                            <td className="py-7 px-4 font-black text-brand-volt tracking-[0.3em]">{row.size}</td>
                                            <td className="py-7 px-4 text-white/80">{row.waist}</td>
                                            <td className="py-7 px-4 text-white/80">{row.length}</td>
                                            <td className="py-7 px-4 text-white/80">{row.thigh}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>

                {/* MEASUREMENT GUIDE */}
                <div className="mt-40 grid grid-cols-1 md:grid-cols-3 gap-10">
                    <div className="p-10 bg-white/[0.02] border border-white/10 space-y-6 hover:border-brand-volt/50 transition-colors">
                        <User className="text-brand-volt" size={24} />
                        <h4 className="font-black uppercase tracking-[0.4em] text-sm">01. Chest</h4>
                        <p className="text-[13px] font-mono text-white/40 leading-relaxed uppercase tracking-[0.1em]">Measure around the fullest part of your chest, keeping the tape horizontal.</p>
                    </div>
                    <div className="p-10 bg-white/[0.02] border border-white/10 space-y-6 hover:border-brand-volt/50 transition-colors">
                        <Info className="text-brand-volt" size={24} />
                        <h4 className="font-black uppercase tracking-[0.4em] text-sm">02. Waist</h4>
                        <p className="text-[13px] font-mono text-white/40 leading-relaxed uppercase tracking-[0.1em]">Measure around your natural waistline, keeping the tape slightly loose.</p>
                    </div>
                    <div className="p-10 bg-white/[0.02] border border-white/10 space-y-6 hover:border-brand-volt/50 transition-colors">
                        <CheckCircle className="text-brand-volt" size={24} />
                        <h4 className="font-black uppercase tracking-[0.4em] text-sm">03. Fit Preference</h4>
                        <p className="text-[13px] font-mono text-white/40 leading-relaxed uppercase tracking-[0.1em]">Our garments are designed for a regular fit. Size up for an oversized look.</p>
                    </div>
                </div>

                {/* FIT FINDER CTA */}
                <div className="mt-40 border-2 border-brand-volt p-16 text-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-brand-volt translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-out" />
                    <div className="relative z-10 transition-colors duration-500 group-hover:text-black">
                        <h3 className="text-5xl font-black italic uppercase mb-6 tracking-[0.2em]">FIND YOUR FIT</h3>
                        <p className="font-mono text-[13px] uppercase tracking-[0.3em] mb-12 max-w-xl mx-auto leading-loose">Not sure about your size? Browse our full collection and find what works for you.</p>
                        <Link href="/shop" className="inline-block px-16 py-6 border-2 border-current font-black uppercase text-[13px] tracking-[0.5em] hover:bg-black hover:text-brand-volt hover:border-black transition-all duration-300">
                            Shop Now
                        </Link>
                    </div>
                </div>
            </div>

        </main>
    );
}