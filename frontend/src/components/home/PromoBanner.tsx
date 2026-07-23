"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Zap, Plus } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { FormattedPrice } from '@/components/ui/FormattedPrice';
import toast from 'react-hot-toast';
import { CatalogProduct } from '@/types/product';
import {
    getFirstAvailableSize,
    getProductId,
    getProductImage,
    isProductAvailable,
} from '@/lib/storefront-runtime';
import { getImageUrl } from '@/lib/utils';

export function PromoBanner({ products = [] }: { products?: CatalogProduct[] }) {
    const { addToCart } = useCart();
    const displayProducts = products.slice(0, 4);
    const [timeLeft, setTimeLeft] = useState({
        hours: 24,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.hours === 0 && prev.minutes === 0 && prev.seconds === 0) {
                    clearInterval(timer);
                    return prev;
                }
                let s = prev.seconds - 1;
                let m = prev.minutes;
                let h = prev.hours;

                if (s < 0) {
                    s = 59;
                    m -= 1;
                }
                if (m < 0) {
                    m = 59;
                    h -= 1;
                }
                return { hours: h, minutes: m, seconds: s };
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (time: number) => time.toString().padStart(2, '0');

    const handleQuickAdd = (product: CatalogProduct) => {
        const id = getProductId(product);
        const size = getFirstAvailableSize(product);
        if (!id || !size || !isProductAvailable(product)) return;

        addToCart({
            id,
            name: product.name,
            price: product.price,
            image: getProductImage(product),
            quantity: 1,
            size,
            color: product.colors?.[0]?.name,
        });

        toast.success(`${product.name} ADDED TO ARCHIVE`, {
            style: {
                borderRadius: '0px',
                background: '#000',
                color: '#df0715',
                border: '1px solid #df0715',
                fontSize: '10px',
                fontFamily: 'monospace',
            },
        });
    };

    return (
        <section className="px-6 py-20 max-w-[1400px] mx-auto space-y-12">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative h-[500px] md:h-[600px] bg-brand-surface border border-white/5 overflow-hidden flex items-center"
            >
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] select-none pointer-events-none">
                    <h2 className="text-[20vw] font-black italic tracking-tighter">OFF_SHADOW</h2>
                </div>

                <div className="relative z-10 px-12 md:px-24 w-full grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="flex items-center gap-4 mb-6">
                            <span className="bg-brand-volt text-black text-[10px] font-black px-3 py-1 uppercase tracking-[0.2em]">
                                Limited_Time_Offer
                            </span>
                            <div className="h-[1px] w-20 bg-white/20" />
                            <span className="text-white/40 font-mono text-[10px] uppercase tracking-[0.3em] flex items-center gap-2">
                                <Zap size={12} className="text-brand-volt" /> System_Update_0505
                            </span>
                        </div>

                        <h2 className="text-6xl md:text-8xl font-heading italic uppercase leading-none mb-8 tracking-tighter">
                            TODAY&apos;S <br /> <span className="text-brand-volt">TACTICAL</span> DROP
                        </h2>

                        <Link href="/promotions">
                            <motion.button
                                whileHover={{ x: 10 }}
                                className="group flex items-center gap-8 text-[11px] font-black uppercase tracking-[0.5em] text-white"
                            >
                                View All Promotions
                                <div className="w-12 h-12 border border-white/20 flex items-center justify-center group-hover:border-brand-volt group-hover:bg-brand-volt group-hover:text-black transition-all">
                                    <ArrowRight size={16} />
                                </div>
                            </motion.button>
                        </Link>
                    </div>

                    <div className="bg-black/40 backdrop-blur-md border border-white/10 p-8 md:p-12 flex flex-col items-center justify-center text-center">
                        <span className="text-brand-volt font-mono text-[10px] tracking-[0.5em] uppercase mb-8">System_Purge_Countdown</span>

                        <div className="flex gap-4 md:gap-8">
                            {[
                                { label: 'HRS', value: formatTime(timeLeft.hours) },
                                { label: 'MIN', value: formatTime(timeLeft.minutes) },
                                { label: 'SEC', value: formatTime(timeLeft.seconds) }
                            ].map((unit, i) => (
                                <div key={i} className="flex flex-col items-center">
                                    <div className="text-5xl md:text-7xl font-heading text-white tracking-tighter tabular-nums flex items-baseline">
                                        {unit.value}
                                        {i < 2 && <span className="text-brand-volt/20 mx-1 md:mx-2 text-4xl md:text-6xl">:</span>}
                                    </div>
                                    <span className="text-[8px] font-mono text-white/40 tracking-[0.4em] mt-4">{unit.label}</span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-10 w-full h-1 bg-white/5 relative overflow-hidden">
                            <motion.div
                                className="absolute inset-y-0 left-0 bg-brand-volt"
                                initial={{ width: "100%" }}
                                animate={{ width: "0%" }}
                                transition={{ duration: 86400, ease: "linear" }}
                            />
                        </div>
                        <p className="mt-4 text-[8px] font-mono text-white/20 tracking-widest uppercase">Archive_Clearance_In_Progress</p>
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {displayProducts.map((product, index) => {
                    const productId = getProductId(product);
                    const inStock = isProductAvailable(product);
                    return (
                    <motion.div
                        key={productId}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="group relative bg-brand-surface border border-white/5 overflow-hidden p-4"
                    >
                        <div className="relative aspect-square overflow-hidden mb-4 bg-brand-black">
                            <img
                                src={getImageUrl(getProductImage(product))}
                                alt={product.name}
                                className={`w-full h-full object-cover transition-all duration-700 ${inStock
                                        ? "group-hover:scale-110"
                                        : "grayscale opacity-40"
                                    }`}
                            />

                            {/* Tags logic */}
                            <div className="absolute top-2 left-2 flex flex-col gap-1">
                                <span className="bg-brand-volt text-black text-[8px] font-black px-2 py-0.5 uppercase">
                                    {product.isNewDrop ? 'NEW_DROP' : product.category}
                                </span>
                                {!inStock && (
                                    <span className="bg-red-600 text-white text-[8px] font-black px-2 py-0.5 uppercase tracking-tighter">
                                        SOLD_OUT
                                    </span>
                                )}
                            </div>

                            {/* Quick Add Overlay - Only active if in stock */}
                            {inStock && (
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
                                    <button
                                        onClick={() => handleQuickAdd(product)}
                                        className="p-4 bg-white text-black hover:bg-brand-volt transition-colors active:scale-90"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>
                            )}

                            {/* Sold Out Center Label */}
                            {!inStock && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="border border-white/20 bg-black/60 backdrop-blur-sm px-4 py-2 font-mono text-[10px] tracking-[0.3em] text-white/60 uppercase">
                                        Archive_Empty
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="space-y-1">
                            <h3 className={`text-[10px] font-black tracking-widest uppercase transition-colors ${inStock ? "text-white/60 group-hover:text-white" : "text-white/20"
                                }`}>
                                {product.name}
                            </h3>
                            <p className={`font-mono text-sm italic font-bold ${inStock ? "text-brand-volt" : "text-white/10"
                                }`}>
                                <FormattedPrice amount={product.price} />
                            </p>
                        </div>
                    </motion.div>
                    );
                })}
            </div>
        </section>
    );
}
