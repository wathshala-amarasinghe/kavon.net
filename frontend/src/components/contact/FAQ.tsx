"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const FAQS = [
    { q: "How long does delivery take?", a: "Delivery within Sri Lanka typically takes 2-4 business days after processing." },
    { q: "Do you offer returns?", a: "Eligible unworn items can be returned within 7 days of delivery with their original tags. Exclusions apply." },
    { q: "How to choose my size?", a: "Consult our size guide in the product description. Our fits are intentionally oversized." }
];

export function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <div className="space-y-6">
            <h2 className="text-[10px] font-mono text-white/30 uppercase tracking-[0.5em] mb-8">Intelligence_Database // FAQ</h2>
            {FAQS.map((faq, i) => (
                <div key={i} className="border border-white/5 bg-brand-surface overflow-hidden">
                    <button
                        onClick={() => setOpenIndex(openIndex === i ? null : i)}
                        className="w-full px-6 py-5 flex items-center justify-between text-left group"
                    >
                        <span className="text-[10px] font-black uppercase tracking-widest group-hover:text-brand-volt transition-colors">{faq.q}</span>
                        <ChevronDown className={`transition-transform duration-500 ${openIndex === i ? 'rotate-180 text-brand-volt' : 'text-white/20'}`} size={16} />
                    </button>
                    <AnimatePresence>
                        {openIndex === i && (
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: 'auto' }}
                                exit={{ height: 0 }}
                                className="overflow-hidden"
                            >
                                <p className="px-6 pb-6 text-white/40 text-[10px] uppercase leading-relaxed tracking-wider">
                                    {faq.a}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ))}
        </div>
    );
}
