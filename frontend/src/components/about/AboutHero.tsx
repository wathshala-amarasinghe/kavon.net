"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';
export function AboutHero() {
    return (
        <section className="min-h-screen flex items-center justify-center px-6 relative pt-32 md:pt-40 bg-black">
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-black via-black/40 to-black z-10" />
                <div className="absolute inset-0 opacity-40 z-0">
                    <Image
                        src="/images/products/product_5.jpeg"
                        alt="KAVON Cinematic Background"
                        fill
                        className="object-cover grayscale"
                        priority
                    />
                </div>

                <div className="absolute inset-0 bg-[url('/images/products/product_5.jpeg')] opacity-10 z-10 pointer-events-none" />
            </div>

            <div className="relative z-20 text-center max-w-5xl">
                <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-mono text-[10px] tracking-[0.6em] text-brand-volt uppercase mb-6 block"
                >
                    Identity_Verified // Batch_2026
                </motion.span>

                <motion.h1
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.5 }}
                    className="text-6xl md:text-9xl font-heading italic uppercase tracking-tighter leading-[0.9]"
                >
                    KAVON IS NOT JUST <br />
                    <span className="text-white/20">CLOTHING.</span> <br />
                    IT’S IDENTITY.
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-10 text-white/40 font-body text-xs tracking-[0.3em] uppercase max-w-xl mx-auto leading-relaxed"
                >
                    Built for those who refuse to blend in. Engineered for the modern nomad.
                </motion.p>
            </div>
        </section>
    );
}