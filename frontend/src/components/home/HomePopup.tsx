"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { X, ShieldCheck, ArrowRight } from 'lucide-react';
import { getSettings } from '@/lib/api';

export function HomePopup() {
    const [isOpen, setIsOpen] = useState(false);
    const [settings, setSettings] = useState<Record<string, unknown>>(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const data = await getSettings();
                if (data && data.popupBanner?.enabled) {
                    setSettings(data.popupBanner);
                    // Check if already shown in this session
                    const isShown = sessionStorage.getItem('kavon-popup-shown');
                    if (!isShown) {
                        setTimeout(() => {
                            setIsOpen(true);
                            sessionStorage.setItem('kavon-popup-shown', 'true');
                        }, 3000); // Show after 3 seconds
                    }
                }
            } catch (error) {
                // Silently handle popup sync failures to prevent console clutter
                // console.debug("POPUP_SYNC_SILENT_FAILURE");
            }
        };
        fetchSettings();
    }, []);

    if (!settings || !isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsOpen(false)}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                />
                
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="w-full max-w-lg bg-brand-black border border-white/10 relative z-10 overflow-hidden"
                >
                    {/* Header Line */}
                    <div className="h-1 w-full bg-brand-volt" />
                    
                    <button 
                        onClick={() => setIsOpen(false)}
                        className="absolute top-4 right-4 text-white/40 hover:text-white transition-all z-20"
                    >
                        <X size={20} />
                    </button>

                    <div className="p-10 space-y-8">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-volt/10 border border-brand-volt/20 rounded-full">
                                <ShieldCheck size={14} className="text-brand-volt" />
                                <span className="font-mono text-[12px] text-brand-volt uppercase tracking-widest font-bold">Offer Alert</span>
                            </div>
                            
                            <h2 className="text-4xl font-black italic uppercase tracking-tighter leading-none">
                                {settings.title.split(' ').map((word: string, i: number) => (
                                    <React.Fragment key={i}>
                                        {i === 1 ? <span className="text-brand-volt">{word} </span> : word + ' '}
                                    </React.Fragment>
                                ))}
                            </h2>
                            
                            <p className="text-white/60 text-sm font-mono leading-relaxed uppercase tracking-tight">
                                {settings.text}
                            </p>
                        </div>

                        <div className="pt-4">
                            <Link href={settings.buttonLink || '#'}>
                                <button 
                                    onClick={() => setIsOpen(false)}
                                    className="w-full bg-white text-black py-5 font-black uppercase text-[12px] tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-brand-volt transition-all"
                                >
                                    {settings.buttonText}
                                    <ArrowRight size={16} />
                                </button>
                            </Link>
                        </div>

                        <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                            <span className="font-mono text-[12px] text-white/20 uppercase tracking-[0.2em]">KAVON HQ</span>
                            <span className="font-mono text-[12px] text-white/20 uppercase tracking-[0.2em]">OFFICIAL RELEASE</span>
                        </div>
                    </div>

                    {/* Scanner Effect */}
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-brand-volt/20 shadow-[0_0_10px_rgba(223, 7, 21,0.5)] animate-scan pointer-events-none" />
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
