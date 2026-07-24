"use client";
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function CTASection() {
    return (
        <section className="py-40 px-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-brand-volt/5 pointer-events-none" />
            <div className="max-w-4xl mx-auto text-center relative z-10">
                <motion.h2
                    whileInView={{ opacity: 1 }}
                    initial={{ opacity: 0 }}
                    className="text-5xl md:text-8xl font-heading italic uppercase tracking-tighter mb-12"
                >
                    Join the <span className="text-brand-volt">Movement.</span>
                </motion.h2>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <Link href="/shop" className="group flex w-full items-center justify-center gap-4 bg-white px-12 py-6 text-xs font-black uppercase tracking-[0.4em] text-black transition-all hover:bg-brand-volt sm:w-auto">
                        Explore_Collections <ArrowRight size={16} className="transition-transform group-hover:translate-x-2" />
                    </Link>
                    <Link href="/collections" className="w-full border border-white/10 px-12 py-6 text-xs font-black uppercase tracking-[0.4em] text-white transition-all hover:bg-white hover:text-black sm:w-auto">
                        View_Lookbook
                    </Link>
                </div>
            </div>
        </section>
    );
}
