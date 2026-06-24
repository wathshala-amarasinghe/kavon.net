"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-brand-black flex items-center justify-center p-6 font-mono selection:bg-brand-volt">
            <div className="max-w-xl w-full border border-white/5 bg-white/[0.01] p-12 relative overflow-hidden group">
                {/* Tactical Scanline Effect */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(transparent_0%,_rgba(223, 7, 21,0.5)_50%,_transparent_100%)] bg-[length:100%_4px] animate-scanline" />

                <div className="space-y-8 relative z-10">
                    <div className="flex items-center gap-4 text-brand-volt">
                        <AlertTriangle size={32} />
                        <span className="text-[12px] uppercase tracking-[0.5em] font-bold">CRITICAL_EXCEPTION</span>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-6xl md:text-8xl font-black italic uppercase text-white tracking-tighter leading-none relative">
                            404 <span className="text-white/10">ERR</span>
                            <motion.div 
                                className="absolute -top-2 -left-2 text-[10px] text-brand-volt/20 font-mono tracking-widest opacity-0 group-hover:opacity-100"
                                animate={{ opacity: [0, 0.4, 0] }}
                                transition={{ duration: 0.1, repeat: Infinity }}
                            >
                                [ LOST_IN_TRANSIT ]
                            </motion.div>
                        </h1>
                        <p className="text-[14px] text-white/40 uppercase tracking-[0.2em] font-bold flex items-center gap-2">
                            <span className="w-2 h-2 bg-brand-volt/40 rounded-full animate-pulse" />
                            SECTOR_NOT_FOUND // PATH_TERMINATED
                        </p>
                    </div>

                    <div className="p-6 bg-white/[0.03] border-l-2 border-brand-volt space-y-4">
                        <p className="text-[12px] text-white/60 leading-relaxed uppercase tracking-widest">
                            The requested tactical asset or coordinate does not exist in the current deployment database. The path may have been archived or purged.
                        </p>
                        <div className="flex gap-4 text-[10px] text-white/20">
                            <span>REF_ID: KVN-VOID-000</span>
                            <span>NODE: GLOBAL_EDGE</span>
                        </div>
                    </div>

                    <Link 
                        href="/" 
                        className="inline-flex items-center gap-4 bg-brand-volt text-black px-10 py-5 font-black uppercase text-xs tracking-[0.3em] hover:brightness-110 active:scale-95 transition-all shadow-[0_0_30px_rgba(63,255,117,0.2)] group-hover:shadow-[0_0_50px_rgba(63,255,117,0.4)]"
                    >
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        >
                            <RotateCcw size={16} />
                        </motion.div>
                        REBOOT_SYSTEM
                    </Link>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 border-t border-r border-white/10" />
                <div className="absolute bottom-0 left-0 w-32 h-32 border-b border-l border-white/10" />
            </div>
        </div>
    );
}
