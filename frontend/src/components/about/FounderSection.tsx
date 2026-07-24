"use client";
import { motion } from 'framer-motion';
import Image from 'next/image';

export function FounderSection() {
    return (
        <section className="py-32 px-6 max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
                whileInView={{ opacity: 1, x: 0 }}
                initial={{ opacity: 0, x: -50 }}
                className="aspect-[4/5] bg-brand-surface border border-white/5 relative overflow-hidden"
            >
                <Image
                    src="/images/founder/profile.jpg"
                    alt="KAVON founder Wathshala Dulashan"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover grayscale"
                />
            </motion.div>

            <div className="space-y-8">
                <h2 className="text-5xl font-heading italic uppercase leading-none">The <span className="text-white/20">Genesis</span></h2>
                <div className="space-y-6 text-white/50 font-body text-sm leading-loose tracking-wide">
                    <p>KAVON began with a single observation: the loss of identity in mass-produced fashion. In 2026, we launched a division dedicated to restoring that identity.</p>
                    <p>Our founder, Wathshala Dulashan, envisioned a brand that doesn&apos;t just sell apparel, but engineers armor for the urban environment. A fusion of tactical utility and high-end streetwear aesthetics.</p>
                </div>
                <div className="pt-8">
                    <span className="font-heading italic text-3xl opacity-80 uppercase">Wathshala Dulashan</span>
                    <p className="font-mono text-[9px] tracking-[0.5em] text-brand-volt uppercase mt-1">Division_Lead // KAVON</p>
                </div>
            </div>
        </section>
    );
}
