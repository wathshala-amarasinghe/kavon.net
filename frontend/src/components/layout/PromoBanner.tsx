"use client";

import React, { useState } from 'react';
import { useSystemSettings } from '@/context/SystemSettingsContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export function PromoBanner() {
    const { settings } = useSystemSettings();
    const [isVisible, setIsVisible] = useState(true);

    if (!settings?.promoBanner?.enabled || !isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="bg-brand-volt text-black overflow-hidden relative z-[210]"
            >
                <div className="max-w-[1400px] mx-auto px-6 py-2 flex items-center justify-center relative">
                    <p className="font-black italic uppercase text-[10px] md:text-[11px] tracking-[0.2em] text-center">
                        {settings.promoBanner.text}
                    </p>
                    <button 
                        onClick={() => setIsVisible(false)}
                        className="absolute right-6 top-1/2 -translate-y-1/2 hover:rotate-90 transition-transform"
                    >
                        <X size={14} />
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
