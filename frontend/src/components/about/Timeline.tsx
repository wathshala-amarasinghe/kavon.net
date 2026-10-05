"use client";
import { motion } from 'framer-motion';

const EVENTS = [
    { year: '2024', title: 'Conceptualization', desc: 'The Urban Shadow protocol is developed.' },
    { year: '2025', title: 'Prototype Division', desc: 'First oversized silhouettes engineered in Tokyo.' },
    { year: '2026', title: 'Global Launch', desc: 'KAVON goes live for the modern nomad.' }
];

export function Timeline() {
    return (
        <section className="py-32 px-6 max-w-4xl mx-auto">
            <h3 className="font-mono text-[10px] tracking-[0.5em] text-white/30 uppercase mb-20 text-center">System_Progression</h3>
            <div className="relative border-l border-white/10 ml-4 space-y-20">
                {EVENTS.map((event, i) => (
                    <motion.div
                        key={i}
                        whileInView={{ opacity: 1, x: 0 }}
                        initial={{ opacity: 0, x: 20 }}
                        className="relative pl-12"
                    >
                        <div className="absolute left-[-5px] top-1 w-2.5 h-2.5 bg-brand-volt rounded-none" />
                        <span className="text-brand-volt font-mono text-xs font-bold mb-2 block tracking-widest">{event.year}</span>
                        <h4 className="text-xl font-heading italic uppercase mb-2">{event.title}</h4>
                        <p className="text-white/40 text-[11px] uppercase tracking-widest leading-relaxed">{event.desc}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}