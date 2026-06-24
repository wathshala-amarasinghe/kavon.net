"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Package, Truck, Navigation, CheckCircle2 } from 'lucide-react';

interface Stage {
    id: string;
    label: string;
    status: 'completed' | 'current' | 'pending';
    date: string;
    icon: React.ReactNode;
}

export function TrackingTimeline({ stages }: { stages: Stage[] }) {
    return (
        <div className="space-y-0 py-8">
            {stages.map((stage, idx) => (
                <div key={stage.id} className="relative flex gap-12 group">
                    {/* Line Connector */}
                    {idx !== stages.length - 1 && (
                        <div className="absolute left-[24px] top-12 w-px h-24 bg-white/5 overflow-hidden">
                            <motion.div 
                                initial={{ height: 0 }}
                                whileInView={{ height: '100%' }}
                                transition={{ duration: 1, delay: idx * 0.2 }}
                                className={`w-full ${
                                    stage.status === 'completed' ? 'bg-brand-volt shadow-[0_0_10px_#df0715]' : 'bg-transparent'
                                }`} 
                            />
                        </div>
                    )}

                    {/* Icon Node */}
                    <div className="relative flex flex-col items-center h-32">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            className={`w-12 h-12 border flex items-center justify-center shrink-0 z-10 transition-all duration-500 ${
                                stage.status === 'completed' 
                                    ? 'bg-brand-volt border-brand-volt text-black shadow-[0_0_20px_rgba(223, 7, 21,0.4)]' 
                                    : stage.status === 'current'
                                    ? 'border-brand-volt text-brand-volt bg-brand-volt/10 shadow-[0_0_25px_rgba(223, 7, 21,0.5)]'
                                    : 'border-white/10 text-white/10'
                            }`}
                        >
                            {stage.icon}
                            
                            {/* Scanning Animation for Current Stage */}
                            {stage.status === 'current' && (
                                <motion.div 
                                    animate={{ top: ['0%', '100%', '0%'] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    className="absolute left-0 right-0 h-px bg-brand-volt/50 z-20"
                                />
                            )}
                        </motion.div>
                    </div>

                    {/* Content */}
                    <motion.div 
                        initial={{ x: 20, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="space-y-2 pt-2"
                    >
                        <div className="flex items-center gap-4">
                            <h4 className={`text-[13px] font-black uppercase tracking-[0.25em] ${
                                stage.status === 'pending' ? 'text-white/20' : 'text-white'
                            }`}>
                                {stage.label}
                            </h4>
                            {stage.status === 'completed' && (
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                    <CheckCircle2 size={14} className="text-brand-volt" />
                                </motion.div>
                            )}
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className="text-[12px] font-mono text-white/40 uppercase tracking-widest">{stage.date}</p>
                            {stage.status === 'current' && (
                                <span className="text-[11px] font-mono text-brand-volt animate-pulse tracking-[0.2em] uppercase">
                                    [ In Progress ]
                                </span>
                            )}
                        </div>
                    </motion.div>
                </div>
            ))}
        </div>
    );
}
