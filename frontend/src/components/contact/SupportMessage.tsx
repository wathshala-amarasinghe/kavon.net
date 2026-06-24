"use client";

import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import Image from 'next/image';

export function SupportMessage() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-brand-volt/5 border border-brand-volt/10 p-8 md:p-12 relative overflow-hidden"
        >
            {/* Background Icon Decoration */}
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <ShieldCheck size={120} />
            </div>

            <div className="relative z-10">
                <h3 className="font-mono text-[10px] tracking-[0.4em] text-brand-volt uppercase mb-6">
                    Support_Protocol
                </h3>

                <p className="text-2xl font-heading italic uppercase leading-tight mb-6 text-white">
                    At KAVON, every <span className="text-white/20">transmission</span> matters.
                </p>

                <p className="text-white/40 text-[11px] tracking-widest leading-relaxed uppercase mb-8 max-w-lg">
                    Our specialized support unit monitors all inquiries 24/7. Whether it is an order update or a tactical product query, we aim for a response time under 12 hours. Your experience defines our evolution.
                </p>

                <div className="flex items-center gap-4">
                    {/* Avatar Group */}
                    <div className="flex -space-x-3">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="relative w-10 h-10 border border-brand-black bg-brand-surface overflow-hidden"
                            >
                                <Image
                                    // Ensure these files exist in /public/images/support/agent_x.jpg
                                    src={`/images/support/agent_${i}.jpg`}
                                    alt={`Support Agent ${i}`}
                                    fill
                                    className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
                                    sizes="40px"
                                />
                                {/* Fallback in case image fails to load */}
                                <div className="absolute inset-0 bg-brand-surface -z-10 flex items-center justify-center text-[8px] text-white/10">
                                    AV_{i}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col">
                        <span className="text-[9px] font-mono text-brand-volt uppercase tracking-tighter leading-none mb-1">
                            Active_Agents_Online
                        </span>
                        <span className="text-[8px] font-mono text-white/20 uppercase tracking-tighter">
                            System_Version // v4.0.2
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}