"use client";
import { motion } from 'framer-motion';
import { Target, Eye } from 'lucide-react';

export function MissionVision() {
    return (
        <section className="py-32 px-6 max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 30 }}
                className="bg-brand-surface border border-white/5 p-12 backdrop-blur-xl relative group overflow-hidden"
            >
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:text-brand-volt group-hover:opacity-100 transition-all">
                    <Target size={80} />
                </div>
                <h3 className="text-xs font-mono tracking-[0.5em] text-brand-volt uppercase mb-6">Our_Mission</h3>
                <p className="text-2xl font-heading italic uppercase leading-tight mb-6">
                    To engineer apparel that acts as armor for the <span className="text-white/20">modern nomad.</span>
                </p>
                <p className="text-white/40 text-xs tracking-widest leading-relaxed uppercase">
                    We bridge the gap between tactical utility and high-fashion aesthetics, ensuring you never have to choose between function and identity.
                </p>
            </motion.div>

            <motion.div
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 30 }}
                transition={{ delay: 0.2 }}
                className="bg-brand-surface border border-white/5 p-12 backdrop-blur-xl relative group overflow-hidden"
            >
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:text-brand-volt group-hover:opacity-100 transition-all">
                    <Eye size={80} />
                </div>
                <h3 className="text-xs font-mono tracking-[0.5em] text-brand-volt uppercase mb-6">Our_Vision</h3>
                <p className="text-2xl font-heading italic uppercase leading-tight mb-6">
                    To define the <span className="text-white/20">global standard</span> for urban shadow wear.
                </p>
                <p className="text-white/40 text-xs tracking-widest leading-relaxed uppercase">
                    KAVON aims to lead the 2026 streetwear movement by fostering a community of creators and leaders who value authenticity over trends.
                </p>
            </motion.div>
        </section>
    );
}