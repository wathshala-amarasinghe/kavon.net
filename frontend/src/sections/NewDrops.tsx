"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { FormattedPrice } from '@/components/ui/FormattedPrice';
import Image from 'next/image';
import { getImageUrl } from '@/lib/utils';
import { CatalogProduct } from '@/types/product';
import { getFirstAvailableSize, getProductId, getProductImage } from '@/lib/storefront-runtime';

const CountdownTimer = ({ targetDate }: { targetDate: string }) => {
    const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

    useEffect(() => {
        const calculateTime = () => {
            const difference = +new Date(targetDate) - +new Date();
            if (difference > 0) {
                return {
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                };
            }
            return null;
        };

        setTimeout(() => setTimeLeft(calculateTime()), 0);
        const timer = setInterval(() => {
            const next = calculateTime();
            setTimeLeft(next);
            if (!next) clearInterval(timer);
        }, 1000);
        
        return () => clearInterval(timer);
    }, [targetDate]);

    if (!timeLeft) return <span className="text-brand-volt italic">LIVE NOW</span>;

    const format = (num: number) => num.toString().padStart(2, '0');

    return (
        <div className="flex items-center space-x-6 text-white font-heading text-4xl md:text-5xl tracking-[0.1em]">
            <div className="flex flex-col items-center">
                <span className="text-brand-volt italic">{format(timeLeft.days)}</span>
                <span className="text-[11px] text-white/30 uppercase font-mono tracking-[0.3em]">Days</span>
            </div>
            <span className="text-white/10 pb-4">:</span>
            <div className="flex flex-col items-center">
                <span className="italic">{format(timeLeft.hours)}</span>
                <span className="text-[11px] text-white/30 uppercase font-mono tracking-[0.3em]">Hrs</span>
            </div>
            <span className="text-white/10 pb-4">:</span>
            <div className="flex flex-col items-center">
                <span className="italic">{format(timeLeft.minutes)}</span>
                <span className="text-[11px] text-white/30 uppercase font-mono tracking-[0.3em]">Min</span>
            </div>
            <span className="text-white/10 pb-4">:</span>
            <div className="flex flex-col items-center">
                <span className="italic">{format(timeLeft.seconds)}</span>
                <span className="text-[11px] text-white/30 uppercase font-mono tracking-[0.3em]">Sec</span>
            </div>
        </div>
    );
};

export function NewDrops({ products }: { products: CatalogProduct[] }) {
    const { addToCart } = useCart();

    const displayProducts = products?.length > 0 ? products : [];

    return (
        <section className="py-32 px-6 max-w-[1400px] mx-auto bg-brand-black border-t border-white/5">
            <div className="mb-20 flex flex-col lg:flex-row lg:items-end justify-between gap-10">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-2 h-2 bg-brand-volt rounded-none animate-pulse" />
                        <span className="text-brand-volt font-mono text-[12px] tracking-[0.4em] uppercase">New This Season</span>
                    </div>
                    <h2 className="text-7xl md:text-9xl font-black italic tracking-[0.02em] text-white leading-none">
                        NEW <span className="text-white/10 tracking-[0.05em]">DROPS</span>
                    </h2>
                </div>
                <div className="flex flex-col items-start lg:items-end gap-4">
                    <span className="font-mono text-[12px] text-white/40 uppercase tracking-[0.3em]">Next Release In:</span>
                    <CountdownTimer targetDate="2026-05-25T00:00:00" />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {displayProducts.map((product, index) => {
                    const availableSize = getFirstAvailableSize(product);
                    return (
                    <motion.div
                        key={product._id || product.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-50px' }}
                        transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                        className="group"
                    >
                        <div className="relative aspect-[3/4] bg-brand-surface border border-white/5 mb-6">
                            <div className="absolute top-4 left-4 z-20 flex flex-col gap-1">
                                <span className="bg-brand-volt text-black text-[11px] font-black px-2 py-1 uppercase tracking-[0.1em]">
                                    Pre-Order
                                </span>
                                <span className="bg-black/50 backdrop-blur-md text-white/50 text-[11px] font-mono px-2 py-0.5 border border-white/10 uppercase tracking-[0.2em]">
                                    {(product._id || product.id || "UNKNOWN").slice(-8).toUpperCase()}
                                </span>
                            </div>

                            <Image
                                src={getImageUrl(product.images?.[0])}
                                alt={product.name}
                                fill
                                priority={index < 4}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                className="object-cover group-hover:scale-110 transition-all duration-700"
                            />

                            <div className="absolute inset-0 bg-brand-volt/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                            <button
                                onClick={() => availableSize && addToCart({
                                    id: getProductId(product),
                                    name: product.name,
                                    image: getProductImage(product),
                                    price: product.price,
                                    quantity: 1,
                                    size: availableSize,
                                    color: product.colors?.[0]?.name,
                                })}
                                disabled={!availableSize}
                                className="absolute bottom-6 right-6 bg-white text-black p-4 rounded-none opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 z-10 shadow-2xl hover:bg-brand-volt"
                            >
                                <Plus size={20} strokeWidth={3} />
                            </button>
                        </div>

                        <div className="flex justify-between items-start">
                            <div className="space-y-2">
                                <h3 className="text-white font-black text-xs tracking-[0.2em] uppercase leading-tight max-w-[180px]">
                                    {product.name}
                                </h3>
                                <div className="text-brand-volt font-mono text-[12px] font-bold italic tracking-[0.15em]">
                                    <FormattedPrice amount={product.price} />
                                </div>
                            </div>
                            <div className="h-[1px] w-8 bg-white/20 mt-2" />
                        </div>
                    </motion.div>
                    );
                })}
            </div>
        </section>
    );
}
