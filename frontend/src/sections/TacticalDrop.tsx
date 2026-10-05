"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Clock, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { getImageUrl } from '@/lib/utils';
import { CountdownTimer } from '@/components/home/CountdownTimer';
import { CatalogProduct } from '@/types/product';

interface TacticalDropProps {
    product: CatalogProduct;
}

export function TacticalDrop({ product }: TacticalDropProps) {
    const [targetDate, setTargetDate] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (product) {
            setTimeout(() => setTargetDate(product.tacticalDropDateEnd || new Date(Date.now() + 86400000).toISOString()), 0);
        }
    }, [product]);

    if (!product) return null;

    return (
        <section className="relative py-24 overflow-hidden bg-brand-black border-y border-white/5">
            {/* Background Accents */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-volt/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
            
            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Left: Product Visual */}
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative aspect-square md:aspect-[4/5] bg-white/5 border border-white/10 group overflow-hidden"
                    >
                        <Image 
                            src={getImageUrl(product.images?.[0])}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute top-6 left-6 z-20">
                            <div className="bg-brand-volt text-black px-4 py-2 font-black text-[12px] tracking-[0.2em] uppercase italic">
                                LIMITED EDITION
                            </div>
                        </div>
                    </motion.div>

                    {/* Details & Action */}
                    <div className="space-y-10">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-brand-volt">
                                <Zap size={20} className="animate-pulse" />
                                <span className="font-mono text-[12px] font-bold uppercase tracking-[0.4em]">Limited Drop</span>
                            </div>
                            <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-white leading-none">
                                {product.name}
                            </h2>
                            <p className="text-white/40 font-mono text-[12px] uppercase tracking-widest leading-relaxed max-w-lg">
                                {product.description}
                            </p>
                        </div>

                        {/* Pricing & Offer */}
                        <div className="flex items-center gap-8 py-6 border-y border-white/10">
                            <div className="space-y-1">
                                <p className="font-mono text-[12px] text-white/40 uppercase tracking-widest font-bold">Offer Price</p>
                                <p className="text-3xl font-black text-brand-volt italic">
                                    LKR {(product.price * (1 - (product.tacticalDropDiscount || 0) / 100)).toLocaleString()}
                                </p>
                            </div>
                            <div className="h-12 w-px bg-white/10" />
                            <div className="space-y-1">
                                <p className="font-mono text-[12px] text-white/40 uppercase tracking-widest font-bold">Regular Price</p>
                                <p className="text-xl font-bold text-white/20 line-through">
                                    LKR {product.price.toLocaleString()}
                                </p>
                            </div>
                        </div>

                        {/* Countdown */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-white/40">
                                <Clock size={14} />
                                <span className="font-mono text-[12px] uppercase tracking-widest font-bold">Ends In:</span>
                            </div>
                            <CountdownTimer targetDate={targetDate || new Date("2025-01-01T00:00:00Z").toISOString()} />
                        </div>

                        {/* Action */}
                        <Link 
                            href={`/products/${product._id || product.id || ""}`}
                            className="inline-flex items-center gap-6 bg-white text-black px-12 py-5 font-black uppercase text-[12px] tracking-[0.3em] hover:bg-brand-volt transition-all group shadow-[0_0_30px_rgba(255,255,255,0.05)] hover:shadow-[0_0_50px_rgba(223, 7, 21,0.2)]"
                        >
                            Shop Now
                            <ArrowRight size={18} className="transition-transform group-hover:translate-x-2" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Tactical Grid Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
        </section>
    );
}
