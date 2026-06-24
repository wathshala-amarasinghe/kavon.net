"use client";
import { motion } from 'framer-motion';

export function ContactHero() {
    return (
        <section className="border-l-2 border-brand-volt pl-8">
            <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="font-mono text-[10px] tracking-[0.5em] text-brand-volt uppercase mb-2 block"
            >
                Communication_Protocol // v1.0
            </motion.span>
            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-6xl md:text-8xl font-heading italic uppercase tracking-tighter"
            >
                Get in <span className="text-white/20">Touch</span>
            </motion.h1>
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-6 text-white/40 font-body text-xs tracking-[0.2em] uppercase max-w-md"
            >
                We’re here to help. Reach out through the secure channels below.
            </motion.p>
        </section>
    );
}