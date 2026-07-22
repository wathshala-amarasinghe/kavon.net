"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Target, ArrowUpRight, Clock, ShieldCheck, ChevronRight, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { getImageUrl } from '@/lib/utils';

interface Product {
    _id: string;
    name: string;
    price: number;
    images: string[];
    category: string;
}

export interface Campaign {
    _id: string;
    name: string;
    description: string;
    bannerImage: string;
    startDate: string;
    endDate: string;
    status: string;
    products: Product[];
}

export function ActiveCampaign({ campaign }: { campaign: Campaign }) {
    const [timeLeft, setTimeLeft] = useState<{ d: number; h: number; m: number; s: number } | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isAutoScrolling, setIsAutoScrolling] = useState(true);

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const end = new Date(campaign.endDate).getTime();
            const diff = end - now;

            if (diff <= 0) {
                setTimeLeft(null);
                clearInterval(timer);
                return;
            }

            setTimeLeft({
                d: Math.floor(diff / (1000 * 60 * 60 * 24)),
                h: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                m: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
                s: Math.floor((diff % (1000 * 60)) / 1000)
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [campaign.endDate]);

    // Auto-slide logic
    useEffect(() => {
        if (!isAutoScrolling) return;

        const interval = setInterval(() => {
            if (scrollRef.current) {
                const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
                if (scrollLeft + clientWidth >= scrollWidth - 10) {
                    scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    scrollRef.current.scrollTo({ left: scrollLeft + clientWidth / 2, behavior: 'smooth' });
                }
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [isAutoScrolling]);

    const scroll = (direction: 'left' | 'right') => {
        setIsAutoScrolling(false);
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollTo = direction === 'left' ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    if (!campaign || campaign.status !== 'Active') return null;

    return (
        <section className="py-24 px-6 max-w-[1400px] mx-auto overflow-hidden">
            <div className="flex flex-col lg:flex-row gap-12 bg-white/[0.02] border border-white/5 p-8 md:p-12 relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-volt/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                
                {/* 1. INFO_COLUMN */}
                <div className="w-full lg:w-1/3 space-y-10 relative z-10 flex flex-col justify-center">
                    <div className="flex items-center gap-4 text-brand-volt">
                        <Zap size={20} className="animate-pulse" />
                        <span className="font-mono text-[12px] uppercase tracking-[0.4em]">Active Campaign</span>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-[0.9]">
                            {campaign.name}
                        </h2>
                        <p className="text-[13px] font-mono text-white/40 uppercase tracking-tight leading-relaxed max-w-sm">
                            {campaign.description}
                        </p>
                    </div>

                    {/* Timer Interface */}
                    {timeLeft && (
                        <div className="p-6 border border-white/10 bg-black/40 backdrop-blur-xl tactical-glass space-y-4 max-w-xs">
                            <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                                <Clock size={14} className="text-brand-volt" />
                                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">Ends In:</span>
                            </div>

                            <div className="flex gap-4">
                                {[
                                    { label: 'D', value: timeLeft.d },
                                    { label: 'H', value: timeLeft.h },
                                    { label: 'M', value: timeLeft.m },
                                    { label: 'S', value: timeLeft.s }
                                ].map((item) => (
                                    <div key={item.label} className="flex flex-col items-center">
                                        <span className="text-2xl font-black italic tabular-nums">{String(item.value).padStart(2, '0')}</span>
                                        <span className="font-mono text-[11px] text-brand-volt mt-0.5">{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em] text-brand-volt/60">
                        <ShieldCheck size={12} /> Verified Campaign Offer
                    </div>
                </div>

                {/* 2. ASSETS_CAROUSEL */}
                <div className="w-full lg:w-2/3 relative group">
                    <div className="flex items-center justify-between mb-6">
                        <h4 className="font-mono text-[12px] uppercase tracking-[0.3em] text-white/20">Collection Items</h4>
                        <div className="flex gap-2">
                            <button onClick={() => scroll('left')} className="p-2 border border-white/10 hover:border-brand-volt hover:text-brand-volt transition-all">
                                <ChevronLeft size={16} />
                            </button>
                            <button onClick={() => scroll('right')} className="p-2 border border-white/10 hover:border-brand-volt hover:text-brand-volt transition-all">
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>

                    <div 
                        ref={scrollRef}
                        onMouseEnter={() => setIsAutoScrolling(false)}
                        onMouseLeave={() => setIsAutoScrolling(true)}
                        className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-4"
                    >
                        {campaign.products && campaign.products.length > 0 ? (
                            campaign.products.map((product) => (
                                <motion.div 
                                    key={product._id}
                                    whileHover={{ y: -10 }}
                                    className="min-w-[300px] md:min-w-[400px] bg-black/40 border border-white/5 relative group/item"
                                >
                                    <Link href={`/products/${product._id}`}>
                                        <div className="h-[450px] md:h-[550px] overflow-hidden relative">
                                            { }
<img 
                                                src={getImageUrl(product.images?.[0]) || "/images/new_drops/drop_1.jpeg"} 
                                                alt={product.name}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover/item:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                                            <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black to-transparent">
                                                <span className="font-mono text-[11px] text-brand-volt uppercase tracking-[0.2em]">{product.category}</span>
                                                <h3 className="text-xl font-black uppercase italic tracking-tighter truncate text-white">{product.name}</h3>
                                                <p className="text-brand-volt font-black italic text-lg">LKR {product.price.toLocaleString()}</p>
                                            </div>
                                            <div className="absolute top-4 right-4 bg-white text-black px-4 py-2 text-[12px] font-black uppercase tracking-widest opacity-0 group-hover/item:opacity-100 transition-all translate-y-4 group-hover/item:translate-y-0">
                                                SHOP
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))
                        ) : (
                            <div className="w-full h-[550px] flex flex-col items-center justify-center border border-dashed border-white/10 bg-white/[0.02]">
                                <span className="font-mono text-[12px] text-white/20 uppercase tracking-[0.2em]">No products found</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
