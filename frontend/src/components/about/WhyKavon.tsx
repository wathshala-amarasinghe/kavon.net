"use client";
import { motion } from 'framer-motion';
import { Layers, Zap, Shield, Fingerprint } from 'lucide-react';

const USPs = [
    { icon: Layers, title: 'Premium Fabric', desc: 'Sourced for durability and breathability in urban climates.' },
    { icon: Fingerprint, title: 'Unique Identity', desc: 'Typography-driven designs that make a bold statement.' },
    { icon: Zap, title: 'Limited Drops', desc: 'Small batch production to ensure exclusivity and quality.' },
    { icon: Shield, title: 'Built to Last', desc: 'Reinforced stitching and tactical-grade construction.' }
];

export function WhyKavon() {
    return (
        <section className="py-32 bg-white/[0.02] border-y border-white/5">
            <div className="max-w-[1400px] mx-auto px-6">
                <h3 className="font-mono text-[10px] tracking-[0.5em] text-white/30 uppercase mb-20 text-center">Core_Advantages</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                    {USPs.map((usp, i) => (
                        <motion.div
                            key={i}
                            whileInView={{ opacity: 1, y: 0 }}
                            initial={{ opacity: 0, y: 20 }}
                            transition={{ delay: i * 0.1 }}
                            className="text-center group"
                        >
                            <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center border border-white/10 group-hover:border-brand-volt group-hover:bg-brand-volt group-hover:text-black transition-all">
                                <usp.icon size={24} />
                            </div>
                            <h4 className="font-heading italic uppercase text-xl mb-3 tracking-tighter">{usp.title}</h4>
                            <p className="text-white/30 text-[10px] uppercase tracking-widest leading-relaxed">{usp.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}