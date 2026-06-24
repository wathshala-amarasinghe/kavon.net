"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export function CartEmpty() {
    return (
        <div className="bg-brand-black min-h-screen text-white">
            <Navbar />

            <main className="pt-64 pb-32 px-6 flex flex-col items-center justify-center text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="relative mb-12"
                >
                    <div className="absolute inset-0 bg-brand-volt opacity-20 blur-3xl rounded-full" />
                    <div className="relative bg-brand-surface border border-white/5 p-10 backdrop-blur-xl">
                        <ShoppingBag size={64} className="text-white/10" strokeWidth={1} />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                >
                    <h2 className="text-4xl md:text-6xl font-heading italic uppercase mb-4">
                        Archive_is_<span className="text-white/20">Empty</span>
                    </h2>
                    <p className="text-white/40 font-mono text-[10px] tracking-[0.4em] uppercase mb-12 max-w-xs mx-auto">
                        No tactical assets detected in your current session.
                    </p>

                    <Link href="/shop">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="group flex items-center gap-4 px-10 py-5 bg-white text-black font-black uppercase text-[10px] tracking-[0.4em] transition-all hover:bg-brand-volt"
                        >
                            <ArrowLeft size={14} strokeWidth={3} className="group-hover:-translate-x-2 transition-transform" />
                            Return_to_Shop
                        </motion.button>
                    </Link>
                </motion.div>
            </main>

            <Footer />
        </div>
    );
}