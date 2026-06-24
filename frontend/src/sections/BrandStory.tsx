"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export function BrandStory() {
    return (
        <section className="relative py-32 px-6 max-w-[1400px] mx-auto bg-brand-black">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="order-2 lg:order-1"
                >
                    <div className="mb-6 flex items-center gap-4">
                        <div className="w-12 h-[1px] bg-brand-volt" />
                        <span className="font-mono text-[12px] tracking-[0.4em] text-brand-volt uppercase font-bold">
                            Our Story
                        </span>
                    </div>

                    <h2 className="font-heading text-6xl md:text-8xl text-white leading-[0.85] mb-10 italic tracking-[0.02em]">
                        KAVON IS NOT <br />
                        <span className="text-outline tracking-[0.05em]">CLOTHING.</span>
                        <br />
                        <span className="text-white/40 tracking-[0.02em]">WEAR POWER. WEAR KAVON.</span>
                    </h2>

                    <div className="space-y-6 text-white/50 font-body text-base md:text-lg max-w-lg leading-relaxed uppercase tracking-[0.1em]">
                        <p>
                            Born from the concrete and shaped by the culture, KAVON represents
                            the intersection of luxury aesthetics and raw streetwear energy.
                        </p>
                        <p>
                            Every stitch, every silhouette, every drop is meticulously crafted
                            for those who refuse to blend in. We don&apos;t follow trends; we
                            engineer garments that command presence.
                        </p>
                        <div className="pt-4 flex items-center gap-3">
                            <p className="font-black text-white tracking-[0.4em] text-sm">
                                DESIGNED IN SRI LANKA
                            </p>

                            { }
<img
                                src="/icons/sl_flag.png"
                                alt="SL"
                                className="w-10 h-auto opacity-80"
                            />
                        </div>
                    </div>

                    <motion.button
                        whileTap={{ scale: 0.98 }}
                        className="group mt-12 relative overflow-hidden px-10 py-5 bg-white transition-all duration-500"
                    >
                        <div className="absolute inset-0 bg-brand-volt translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.9,0,0.1,1]" />
                        <div className="relative z-10 flex items-center gap-4 text-black">
                            <span className="font-black text-[12px] tracking-[0.4em] uppercase">
                                Read Our Story
                            </span>
                            <ArrowRight size={16} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                    </motion.button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="order-1 lg:order-2 relative h-[500px] lg:h-[800px] w-full bg-brand-surface overflow-hidden border border-white/5"
                >
                    <div className="absolute inset-0 bg-brand-black/40 z-10" />
                    <div className="absolute inset-0 opacity-20 z-20 pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

                    { }
<img
                        src="/logo/story-main.jpeg"
                        alt="KAVON Brand Story"
                        className="w-full h-full object-cover hover:grayscale-0 transition-all duration-1000 scale-105 hover:scale-100"
                    />

                    <div className="absolute bottom-6 right-6 z-30">
                        <span className="text-white/40 font-mono text-[12px] tracking-[0.5em] uppercase [writing-mode:vertical-rl] font-bold">
                            KAVON 2026
                        </span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}