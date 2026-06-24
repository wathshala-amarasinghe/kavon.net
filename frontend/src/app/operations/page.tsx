"use client";

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Play, Shield, Radio, Target, ChevronDown } from 'lucide-react';
import Link from 'next/link';

import { getCampaigns } from '@/lib/api';

export default function OperationsPage() {
    const { scrollYProgress } = useScroll();
    const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
    const [operations, setOperations] = React.useState<Record<string, unknown>[]>([]);

    React.useEffect(() => {
        const fetchOps = async () => {
            const data = await getCampaigns();
            setOperations(data);
        };
        fetchOps();
    }, []);

    return (
        <main className="bg-black min-h-screen text-white overflow-hidden">
            {/* 1. CINEMATIC_HERO */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                <motion.div
                    style={{ opacity }}
                    className="absolute inset-0 z-0"
                >
                    <div className="absolute inset-0 z-0">
                        <video
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="h-full w-full object-cover opacity-40 mix-blend-screen scale-110"
                        >
                            <source src="/videos/operations_1.mp4" type="video/mp4" />
                        </video>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />

                    {/* Scanline Effect */}
                    <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%]" />
                </motion.div>

                <div className="relative z-20 text-center space-y-8 px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center gap-4 text-brand-volt"
                    >
                        <Shield size={24} />
                        <span className="font-mono text-xs uppercase tracking-[0.4em]">Operations_Briefing</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-7xl md:text-[12rem] font-black italic uppercase leading-none tracking-tight"
                    >
                        KAVON<span className="text-brand-volt">_FILM</span>
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="flex flex-col items-center gap-6"
                    >
                        <button className="group relative w-20 h-20 rounded-full border border-white/20 flex items-center justify-center hover:border-brand-volt transition-all">
                            <div className="absolute inset-0 rounded-full border border-brand-volt animate-ping opacity-20" />
                            <Play size={32} className="text-white group-hover:text-brand-volt transition-colors ml-1" />
                        </button>
                        <p className="font-mono text-[10px] text-white/40 uppercase tracking-[0.3em]">Initialize_Visual_Feed</p>
                    </motion.div>
                </div>

                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
                    <ChevronDown className="text-brand-volt" />
                </div>
            </section>

            {/* 2. MISSION_LOGS */}
            <section className="relative py-40 px-6 md:px-12">
                <div className="max-w-7xl mx-auto space-y-40">
                    {operations.map((op, i) => (
                        <div key={op._id} className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 md:gap-24 items-center`}>
                            <motion.div
                                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                className="flex-1 relative group overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-brand-volt/10 opacity-0 group-hover:opacity-100 transition-all duration-700 z-10" />
                                { }
<img src={op.bannerImage || "/images/new_drops/drop_1.jpeg"} alt={op.name} className="w-full aspect-[4/5] object-cover transition-all duration-1000 group-hover:scale-105" />

                                <div className="absolute top-0 left-0 p-4 z-20 border-r border-b border-white/10 bg-black/40 backdrop-blur-md">
                                    <span className="font-mono text-[10px] text-brand-volt tracking-tight uppercase">MISSION_{String(i + 1).padStart(3, '0')}</span>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="flex-1 space-y-8"
                            >
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-brand-volt/40">
                                        <Radio size={14} />
                                        <span className="font-mono text-[10px] uppercase tracking-[0.15em]">{op.status === 'Active' ? 'Deployment_Live' : 'Archive_Protocol'}</span>
                                    </div>
                                    <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tight leading-none">
                                        {op.name}
                                    </h2>
                                </div>

                                <div className="space-y-6">
                                    <p className="text-lg font-mono text-white/60 leading-relaxed uppercase tracking-tight">
                                        {op.description}
                                    </p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-white/5 border border-white/10">
                                            <span className="block text-[8px] font-mono text-white/20 uppercase mb-1 tracking-[0.1em]">Status</span>
                                            <span className="text-[10px] font-mono text-brand-volt uppercase tracking-widest">{op.status}_SERVICE</span>
                                        </div>
                                        <div className="p-4 bg-white/5 border border-white/10">
                                            <span className="block text-[8px] font-mono text-white/20 uppercase mb-1 tracking-[0.1em]">Authorization</span>
                                            <span className="text-[10px] font-mono text-white uppercase tracking-widest">{op.status === 'Active' ? 'LEVEL_4' : 'LEVEL_1'}</span>
                                        </div>
                                    </div>
                                    <Link href="/shop" className="inline-flex items-center gap-4 bg-brand-volt text-black px-10 py-5 font-black uppercase text-xs tracking-[0.25em] hover:brightness-110 transition-all group">
                                        Acquire_Asset <Target size={16} className="group-hover:rotate-45 transition-transform" />
                                    </Link>
                                </div>
                            </motion.div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 3. FINAL_MANIFESTO */}
            <section className="py-60 px-6 text-center relative overflow-hidden bg-white text-black">
                <div className="absolute inset-0 bg-[url('/images/new_drops/drop_1.jpeg')] opacity-20" />
                <div className="max-w-4xl mx-auto relative z-10 space-y-12">
                    <Shield className="mx-auto" size={48} />
                    <h2 className="text-5xl md:text-8xl font-black uppercase italic tracking-[0.15em] leading-tight">
                        Engineered_For<br />The_Shadows
                    </h2>
                    <p className="text-xl font-mono uppercase tracking-[0.1em] leading-relaxed">
                        KAVON is not just apparel. It is a tactical layer between you and the environment.
                        Join the division today and unlock your true potential.
                    </p>
                    <div className="pt-8">
                        <Link href="/shop" className="inline-block border-4 border-black px-16 py-6 text-xl font-black uppercase italic tracking-tighter hover:bg-black hover:text-white transition-all">
                            Initialize_Deployment
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}