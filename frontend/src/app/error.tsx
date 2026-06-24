"use client";

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, RefreshCw } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('CRITICAL_CLIENT_CRASH:', error);
    }, [error]);

    return (
        <div className="min-h-screen bg-brand-black flex items-center justify-center p-6 font-mono relative overflow-hidden">
            {/* Emergency Strobe Layer */}
            <motion.div 
                animate={{ opacity: [0, 0.05, 0] }}
                transition={{ duration: 0.1, repeat: Infinity, repeatType: "mirror" }}
                className="absolute inset-0 bg-red-600 pointer-events-none z-0"
            />

            <div className="max-w-2xl w-full border border-red-500/20 bg-black p-12 relative overflow-hidden z-10 shadow-[0_0_50px_rgba(239,68,68,0.1)]">
                <div className="space-y-10 relative z-10">
                    <div className="flex items-center gap-4 text-red-500">
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                        >
                            <ShieldAlert size={32} />
                        </motion.div>
                        <span className="text-[12px] uppercase tracking-[0.5em] font-bold">CRITICAL_SYSTEM_MALFUNCTION</span>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-5xl md:text-7xl font-black italic uppercase text-white tracking-tighter">
                            KERNAL_CRASH
                        </h1>
                        <div className="p-6 bg-red-500/5 border-l-4 border-red-500 font-mono text-[11px] text-white/70 uppercase tracking-widest leading-loose">
                            <span className="text-red-500 font-bold block mb-2 underline">EXC_ERROR_REPORT:</span>
                            {error.message || "An unhandled exception occurred in the client deployment environment."}
                            <div className="mt-6 pt-4 border-t border-white/5 opacity-40 flex justify-between">
                                <span>DIGEST_HASH: {error.digest || "NULL_ARCHIVE"}</span>
                                <span className="animate-pulse">NODE: PRIMARY_FRONTEND</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-6">
                        <button
                            onClick={() => reset()}
                            className="flex items-center justify-center gap-4 bg-white text-black px-10 py-5 font-black uppercase text-xs tracking-[0.3em] hover:bg-brand-volt transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                        >
                            <RefreshCw size={16} className="animate-spin-slow" /> REINITIALIZE_CLIENT
                        </button>
                        <button
                            onClick={() => window.location.href = '/'}
                            className="flex items-center justify-center gap-4 border border-white/10 text-white/40 px-10 py-5 font-black uppercase text-xs tracking-[0.3em] hover:text-white transition-all"
                        >
                            ABORT_MISSION
                        </button>
                    </div>
                </div>

                {/* Grid Overlay */}
                <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
            </div>
        </div>
    );
}
