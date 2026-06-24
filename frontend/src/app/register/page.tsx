"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { SocialAuth } from '@/components/auth/SocialAuth';

export default function RegisterPage() {
    return (
        <div className="bg-brand-black min-h-screen text-white selection:bg-[#df0715ff] selection:text-black">
            <Navbar />
            <main className="min-h-screen flex items-center justify-center px-6 pt-32 pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md bg-brand-surface border border-white/10 p-8 md:p-12 relative overflow-hidden shadow-2xl"
                >
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-[#df0715ff]" />

                    <div className="mb-10">
                        <h2 className="text-4xl font-heading italic uppercase mb-2 text-white">
                            Create<span className="text-white/40">_Account</span>
                        </h2>
                        <p className="text-[13px] font-mono text-white/60 uppercase tracking-[0.1em] leading-relaxed">
                            Create your free KAVON account.
                        </p>
                    </div>

                    <form className="space-y-6 mb-10">
                        <div className="space-y-2">
                            <label className="text-[12px] font-mono uppercase text-white/80 font-bold tracking-[0.2em]">
                                Full Name
                            </label>
                            <input
                                type="text"
                                required
                                className="w-full bg-black/60 border border-white/20 px-4 py-4 text-[12px] font-mono text-white focus:border-[#df0715ff] focus:bg-black/80 outline-none transition-all placeholder:text-white/30"
                                placeholder="ENTER NAME"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[12px] font-mono uppercase text-white/80 font-bold tracking-[0.2em]">
                                Email Address
                            </label>
                            <input
                                type="email"
                                required
                                className="w-full bg-black/60 border border-white/20 px-4 py-4 text-[12px] font-mono text-white focus:border-[#df0715ff] focus:bg-black/80 outline-none transition-all placeholder:text-white/30"
                                placeholder="OPERATOR@KAVON.COM"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[12px] font-mono uppercase text-white/80 font-bold tracking-[0.2em]">
                                Password
                            </label>
                            <input
                                type="password"
                                required
                                className="w-full bg-black/60 border border-white/20 px-4 py-4 text-[12px] font-mono text-white focus:border-[#df0715ff] focus:bg-black/80 outline-none transition-all placeholder:text-white/30"
                                placeholder="••••••••"
                            />
                        </div>
                        <button className="w-full py-5 bg-[#f5f5f5] text-black font-black uppercase text-[13px] tracking-[0.3em] hover:bg-[#3fff75ff] transition-all duration-300 active:scale-[0.98]">
                            Create Account
                        </button>
                    </form>

                    <SocialAuth />

                    <div className="mt-8 pt-8 border-t border-white/10 text-center flex flex-col gap-4">
                        <p className="text-[12px] font-mono text-white/40 uppercase tracking-[0.2em]">
                            Already have an account?
                        </p>
                        <Link href="/login" className="group flex items-center justify-center gap-2 text-[12px] font-black text-[#df0715ff] uppercase tracking-[0.3em] hover:text-white transition-colors">
                            <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Login
                        </Link>
                    </div>
                </motion.div>
            </main>

        </div>
    );
}