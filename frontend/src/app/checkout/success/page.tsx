"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function SuccessPage() {
    const [manifestId, setManifestId] = React.useState<string>("");
    const [arrivalDate, setArrivalDate] = React.useState<string>("");

    React.useEffect(() => {
        setTimeout(() => {
            setManifestId(`#VYR-${Math.floor(Math.random() * 90000) + 10000}`);
            setArrivalDate(new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase());
        }, 0);
    }, []);

    return (
        <div className="bg-brand-black min-h-screen text-white flex items-center justify-center px-6">
            <div className="max-w-md w-full text-center space-y-8">
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="w-24 h-24 border-2 border-brand-volt mx-auto flex items-center justify-center text-brand-volt"
                >
                    <CheckCircle size={48} />
                </motion.div>

                <div className="space-y-2">
                    <h1 className="text-4xl font-black italic uppercase tracking-tighter">Order_Confirmed</h1>
                    <p className="font-mono text-[10px] text-white/40 uppercase tracking-[0.3em]">Manifest_ID: {manifestId || "GENERATING..."}</p>
                </div>

                <div className="space-y-4">
                    <div className="p-6 bg-white/[0.02] border border-white/5 space-y-4 text-left">
                        <div className="flex items-center gap-4 text-white/60">
                            <Package size={18} className="text-brand-volt" />
                            <span className="text-[10px] font-mono uppercase tracking-widest">Status: Preparing_Deployment</span>
                        </div>
                        
                        {/* ITEM SUMMARY MOCK */}
                        <div className="pt-4 border-t border-white/5 space-y-3">
                            <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest">Secured_Assets:</p>
                            <div className="space-y-2">
                                <div className="flex justify-between text-[11px] font-bold uppercase tracking-tight italic">
                                    <span className="text-white/60">1x TACTICAL OVERSIZED HOODIE</span>
                                    <span>LKR 12,500</span>
                                </div>
                                <div className="flex justify-between text-[11px] font-bold uppercase tracking-tight italic">
                                    <span className="text-white/60">2x URBAN NOMAD CARGO</span>
                                    <span>LKR 24,000</span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                            <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest">Est_Deployment_Arrival:</span>
                            <span className="text-xs font-black italic text-brand-volt">
                                {arrivalDate || "CALCULATING..."}
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <Link
                            href="/shop"
                            className="flex-1 flex items-center justify-center gap-4 py-5 border border-white/10 text-white font-black uppercase text-[10px] tracking-[0.3em] hover:bg-white hover:text-black transition-all"
                        >
                            Shop_Archive
                        </Link>
                        <Link
                            href="/order-track"
                            className="flex-1 flex items-center justify-center gap-4 py-5 bg-white text-black font-black uppercase text-[10px] tracking-[0.3em] hover:bg-brand-volt transition-all group"
                        >
                            Track_Order
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}