"use client";

import React from 'react';
import { X, Ruler } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SizeGuideProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SizeGuide({ isOpen, onClose }: SizeGuideProps) {
    const measurements = [
        { size: 'S', chest: '36-38', waist: '30-32', length: '27' },
        { size: 'M', chest: '38-40', waist: '32-34', length: '28' },
        { size: 'L', chest: '40-42', waist: '34-36', length: '29' },
        { size: 'XL', chest: '42-44', waist: '36-38', length: '30' },
        { size: 'XXL', chest: '44-46', waist: '38-40', length: '31' },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[500] flex items-center justify-center p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="bg-brand-black border border-white/10 w-full max-w-2xl relative z-[501] overflow-hidden"
                    >
                        <div className="p-8 space-y-8">
                            <div className="flex justify-between items-center">
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-black italic uppercase tracking-tight">Size Guide</h3>
                                    <p className="text-[12px] font-mono text-white/40 uppercase tracking-[0.3em]">Size Conversion Chart</p>
                                </div>
                                <button onClick={onClose} className="text-white/20 hover:text-brand-volt transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left font-mono text-[12px] uppercase tracking-widest">
                                    <thead>
                                        <tr className="border-b border-white/10 text-white/40">
                                            <th className="py-4">Size</th>
                                            <th className="py-4">Chest (In)</th>
                                            <th className="py-4">Waist (In)</th>
                                            <th className="py-4">Length (In)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-white/80">
                                        {measurements.map((m) => (
                                            <tr key={m.size} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                <td className="py-4 font-black text-brand-volt">{m.size}</td>
                                                <td className="py-4">{m.chest}</td>
                                                <td className="py-4">{m.waist}</td>
                                                <td className="py-4">{m.length}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="p-4 bg-brand-volt/5 border border-brand-volt/20 flex gap-4 items-center">
                                <Ruler size={20} className="text-brand-volt" />
                                <p className="text-[12px] text-white/60 leading-relaxed">
                                    <span className="text-brand-volt font-bold">TIP:</span> For an oversized fit, we recommend selecting one size above your standard measurement. All measurements are in inches.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
