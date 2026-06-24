"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export function PageLoader() {
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setTimeout(() => setMounted(true), 0);
        const hasLoaded = sessionStorage.getItem('kavon_initialized');
        if (!hasLoaded) {
            setTimeout(() => setIsLoading(true), 0);
        }
    }, []);

    useEffect(() => {
        if (!mounted || !isLoading) return;

        document.body.style.overflow = 'hidden';

        const interval = setInterval(() => {
            setProgress((prev) => {
                const next = prev + (Math.floor(Math.random() * 15) + 5);
                if (next >= 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        setIsLoading(false);
                        sessionStorage.setItem('kavon_initialized', 'true');
                        document.body.style.overflow = 'unset';
                    }, 500);
                    return 100;
                }
                return next;
            });
        }, 300);

        return () => {
            clearInterval(interval);
            document.body.style.overflow = 'unset';
        };
    }, [mounted, isLoading]);

    if (!mounted) return null;


    return (
        <AnimatePresence mode="wait">
            {isLoading && (
                <motion.div
                    key="loader"
                    initial={{ opacity: 1 }}
                    exit={{
                        clipPath: "inset(0 0 100% 0)",
                        transition: { duration: 0.7, ease: [0.9, 0, 0.1, 1] }
                    }}
                    className="fixed inset-0 z-[9999] bg-brand-black flex flex-col items-center justify-center overflow-hidden"
                >
                    <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] select-none pointer-events-none p-10">
                        <Image
                            src="/logo/symbol.png"
                            alt="Shadow Logo"
                            width={1200}
                            height={600}
                            priority
                            className="h-[1000px] w-auto object-contain"
                        />
                    </div>

                    <div className="relative z-10 flex flex-col items-center w-full px-10">
                        <motion.div
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="flex flex-col items-center mb-16"
                        >
                            <div className="relative w-64 h-20 md:w-80 md:h-24">
                                <Image
                                    src="/logo/logo-1.png"
                                    alt="Brand Logo"
                                    fill
                                    sizes="(max-width: 768px) 256px, 320px"
                                    priority
                                    className="object-contain"
                                />
                            </div>

                            <div className="h-[2px] w-full bg-white mt-4" />
                            <div className="flex justify-between w-full mt-2 items-center">
                                <div className="flex items-center gap-2">
                                    <span className="text-white text-[9px] tracking-[0.4em] font-bold uppercase">
                                        Sri Lanka
                                    </span>

                                    { }
                                    <img
                                        src="/icons/sl_flag.png"
                                        alt="SL Flag"
                                        style={{ width: 16, height: 12 }}
                                        className="object-contain opacity-80 shrink-0"
                                    />
                                </div>
                                <span className="text-white text-[9px] tracking-[0.4em] font-bold uppercase">
                                    Est. 2026
                                </span>
                            </div>
                        </motion.div>

                        <div className="w-full max-w-sm">
                            <div className="flex justify-between items-end mb-3">
                                <div className="flex flex-col">
                                    <span className="text-white/40 font-mono text-[8px] uppercase tracking-widest">
                                        Initializing_Protocol
                                    </span>
                                    <span className="text-white font-mono text-[10px] tracking-widest uppercase">
                                        Status: <span className="animate-pulse">Loading_Assets</span>
                                    </span>
                                </div>
                                <span className="text-white font-mono text-2xl italic font-black leading-none">
                                    {progress}%
                                </span>
                            </div>

                            <div className="w-full h-[4px] bg-white/10 relative">
                                <motion.div
                                    className="h-full bg-white shadow-[0_0_10px_rgba(212,255,63,0.5)]"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ ease: "circOut" }}
                                />
                            </div>
                        </div>

                        <div className="mt-16 flex items-center gap-6">
                            <span className="text-white/30 text-[32px] font-bold leading-none tracking-tighter">カボン</span>
                            <div className="w-[1px] h-10 bg-white/20 rotate-[20deg]" />
                            <div className="flex flex-col">
                                <span className="text-white/50 text-[11px] font-black leading-none tracking-widest uppercase">
                                    Shadow_Unit
                                </span>
                                <span className="text-white/50 text-[11px] font-black leading-none tracking-widest uppercase">
                                    Batch_001
                                </span>
                            </div>
                        </div>
                    </div>

                    <motion.div
                        animate={{ top: ["-2px", "100vh"] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute left-0 right-0 h-[2px] bg-brand-volt/20 z-20 pointer-events-none"
                        style={{ top: -2 }}
                    />

                    <div className="absolute bottom-10 w-full flex justify-between px-10">
                        <div className="flex flex-col gap-1 opacity-30">
                            <div className="w-12 h-[2px] bg-white" />
                            <span className="font-mono text-[8px] text-white uppercase tracking-tighter">Ver_4.0.1</span>
                        </div>
                        <div className="flex flex-col items-end gap-1 opacity-30">
                            <div className="w-12 h-[2px] bg-white" />
                            <span className="font-mono text-[8px] text-white uppercase tracking-tighter text-right">Encrypted_Access</span>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}