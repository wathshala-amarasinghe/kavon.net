"use client";

import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

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
                    Contact our support team for order updates or product questions. Inquiries are reviewed during published operating hours: Monday to Saturday, 9AM to 8PM.
                </p>

                <div className="inline-flex items-center gap-3 border border-white/10 px-4 py-3">
                    <ShieldCheck size={16} className="text-brand-volt" />
                    <span className="text-[9px] font-mono text-white/50 uppercase tracking-widest">
                        Support hours // Mon–Sat, 9AM–8PM
                    </span>
                </div>
            </div>
        </motion.div>
    );
}
