"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Facebook, Twitter } from 'lucide-react';

// Custom SVG Icons for Google and Apple
const GoogleIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);

const AppleIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.05 20.28c-.98.95-2.05 1.61-3.22 1.61-1.15 0-1.54-.71-2.93-.71-1.39 0-1.85.69-2.93.71-1.11 0-2.31-.75-3.37-1.8C2.46 18.04 1 14.79 1 11.96c0-4.04 2.61-6.17 5.16-6.17 1.34 0 2.44.82 3.19.82.74 0 1.99-.89 3.51-.89 1.1 0 2.45.45 3.33 1.5-2.9 1.65-2.43 5.75.51 7.03-.78 1.95-1.81 3.9-3.65 6.03zM12.03 5.43c-.02-2.19 1.83-3.95 3.84-4.02.2 2.39-2.05 4.22-3.84 4.02z" />
    </svg>
);

export function SocialAuth() {
    const providers = [
        { name: 'Google', icon: GoogleIcon, color: 'hover:bg-white hover:text-black' },
        { name: 'Apple', icon: AppleIcon, color: 'hover:bg-white hover:text-black' },
        { name: 'Facebook', icon: Facebook, color: 'hover:bg-[#1877F2] hover:text-white' },
        { name: 'X', icon: Twitter, color: 'hover:bg-white hover:text-black' },
    ];

    return (
        <div className="space-y-4">
            <div className="relative flex items-center justify-center py-4">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/5"></div>
                </div>
                <span className="relative bg-brand-surface px-4 text-[8px] font-mono text-white/20 uppercase tracking-[0.4em]">
                    Quick_Sync_Protocols
                </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {providers.map((p, i) => {
                    const Icon = p.icon;
                    return (
                        <motion.button
                            key={i}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`flex items-center justify-center gap-3 py-4 border border-white/10 transition-all duration-300 ${p.color}`}
                        >
                            <Icon size={16} />
                            <span className="text-[9px] font-mono font-bold uppercase tracking-widest">{p.name}</span>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}