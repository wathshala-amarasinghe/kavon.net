"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

export function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = useCallback(() => {
        if (window.scrollY > 400) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, [toggleVisibility]);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    whileHover={{ backgroundColor: "var(--color-brand-volt)", color: "#000000", borderColor: "var(--color-brand-volt)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 z-[990] w-12 h-12 flex items-center justify-center bg-brand-black text-white border border-white/20 shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-all duration-200 group"
                    aria-label="Scroll to top"
                >
                    <ArrowUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform duration-300" />

                    <div className="absolute top-0 left-0 w-1 h-1 border-t border-l border-white/50" />
                    <div className="absolute bottom-0 right-0 w-1 h-1 border-b border-r border-white/50" />

                    <span className="absolute -top-6 right-0 font-mono text-[8px] tracking-widest text-white/30 uppercase">
                        Top_
                    </span>
                </motion.button>
            )}
        </AnimatePresence>
    );
}