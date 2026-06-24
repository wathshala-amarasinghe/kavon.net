"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface PolicyModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    note: string;
    link: string;
}

export function PolicyModal({ isOpen, onClose, title, note, link }: PolicyModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-md bg-brand-surface border border-white/10 p-8 shadow-2xl"
                    >
                        <button onClick={onClose} className="absolute top-4 right-4 text-white/40 hover:text-brand-volt">
                            <X size={20} />
                        </button>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <span className="text-[10px] font-mono text-brand-volt uppercase tracking-[0.3em]">Protocol_Intelligence</span>
                                <h3 className="text-2xl font-black italic uppercase tracking-tight">{title}</h3>
                            </div>

                            <p className="text-sm text-white/60 font-mono leading-relaxed lowercase">
                                &gt; {note}
                            </p>

                            <Link
                                href={link}
                                className="flex items-center justify-between w-full p-4 border border-white/10 bg-white/5 text-[10px] font-mono uppercase tracking-widest hover:border-brand-volt group transition-all"
                            >
                                Learn More Detail
                                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}