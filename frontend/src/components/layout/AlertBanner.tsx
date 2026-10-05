"use client";

import React, { useEffect, useState } from 'react';
import { AlertTriangle, Info, Tag, ShieldAlert, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const isDevelopment = process.env.NODE_ENV === 'development';
const API_URL = process.env.NEXT_PUBLIC_API_URL || (isDevelopment ? "http://localhost:5000/api" : "");

interface Banner {
    _id: string;
    title: string;
    message: string;
    type: 'offer' | 'maintenance' | 'delivery' | 'security';
}

const loadDismissedBanners = (): string[] => {
    if (typeof window === 'undefined') return [];

    try {
        const saved = localStorage.getItem('kavon-dismissed-banners');
        const parsed: unknown = saved ? JSON.parse(saved) : [];
        return Array.isArray(parsed) && parsed.every((id) => typeof id === 'string')
            ? parsed
            : [];
    } catch {
        return [];
    }
};

export function AlertBanner() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [dismissed, setDismissed] = useState<string[]>(loadDismissedBanners);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const res = await fetch(`${API_URL}/communications/active-banners`);
                if (res.ok) {
                    const data = await res.json();
                    setBanners(data);
                }
            } catch (e) {
                console.error('Failed to fetch banners', e);
            }
        };

        fetchBanners();
    }, []);

    const handleDismiss = (id: string) => {
        const newDismissed = [...dismissed, id];
        setDismissed(newDismissed);
        try {
            localStorage.setItem('kavon-dismissed-banners', JSON.stringify(newDismissed));
        } catch (e) {}
    };

    const activeBanners = banners.filter(b => !dismissed.includes(b._id));

    if (activeBanners.length === 0) return null;

    return (
        <div className="w-full relative z-50">
            <AnimatePresence>
                {activeBanners.map(banner => {
                    let Icon = Info;
                    let bgColor = 'bg-black/90';
                    let borderColor = 'border-white/20';
                    let iconColor = 'text-white';
                    let textColor = 'text-white/80';

                    if (banner.type === 'security') {
                        Icon = ShieldAlert;
                        bgColor = 'bg-red-950';
                        borderColor = 'border-red-500/50';
                        iconColor = 'text-red-500';
                        textColor = 'text-red-200';
                    } else if (banner.type === 'maintenance' || banner.type === 'delivery') {
                        Icon = AlertTriangle;
                        bgColor = 'bg-yellow-950';
                        borderColor = 'border-yellow-500/50';
                        iconColor = 'text-yellow-500';
                        textColor = 'text-yellow-200';
                    } else if (banner.type === 'offer') {
                        Icon = Tag;
                        bgColor = 'bg-brand-volt/10';
                        borderColor = 'border-brand-volt/30';
                        iconColor = 'text-brand-volt';
                        textColor = 'text-white/80';
                    }

                    return (
                        <motion.div 
                            key={banner._id}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className={`border-b ${borderColor} ${bgColor} backdrop-blur-md overflow-hidden`}
                        >
                            <div className="max-w-[2000px] mx-auto px-4 py-2 md:py-3 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <Icon size={16} className={`${iconColor} shrink-0`} />
                                    <div className="text-[11px] font-mono tracking-wide">
                                        <span className="font-bold text-white mr-2 uppercase">{banner.title}:</span>
                                        <span className={textColor}>{banner.message}</span>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => handleDismiss(banner._id)}
                                    aria-label={`Dismiss ${banner.title}`}
                                    className={`shrink-0 opacity-60 hover:opacity-100 transition-opacity ${iconColor}`}
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
}
