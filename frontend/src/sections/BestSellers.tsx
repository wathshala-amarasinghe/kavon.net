"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useCart } from '@/context/CartContext';

import { FormattedPrice } from '@/components/ui/FormattedPrice';
import Image from 'next/image';
import { getImageUrl } from '@/lib/utils';
import { CatalogProduct } from '@/types/product';

export function BestSellers({ products = [] }: { products?: CatalogProduct[] }) {
    const { addToCart } = useCart();
    
    // Select the best sellers (e.g., top 4 from backend)
    const bestSellerProducts = products.slice(0, 4); 


    return (
        <section className="py-24 px-6 max-w-[1400px] mx-auto bg-brand-black">
            <div className="mb-16 flex items-end justify-between border-b border-white/10 pb-8">
                <h2 className="text-6xl md:text-8xl font-black italic tracking-[0.05em] text-white leading-none uppercase">
                    BEST <span className="text-white/20 tracking-[0.08em]">SELLERS</span>
                </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {bestSellerProducts.map((product, index) => (
                    <motion.div
                        key={product._id || product.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-50px' }}
                        transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                        className="group cursor-pointer"
                    >
                        <div className="relative aspect-[3/4] bg-brand-surface overflow-hidden border border-white/5 mb-6">
                            <div className="absolute top-4 left-4 z-20 flex flex-col gap-1">
                                <span className="bg-brand-volt text-black text-[12px] font-black px-3 py-1 uppercase tracking-widest">
                                    {product.tag || 'TRENDING'}
                                </span>
                                <span className="bg-black/60 backdrop-blur-md text-white/80 text-[12px] font-mono px-2 py-1 border border-white/20 uppercase tracking-widest">
                                    REF: {(product._id || product.id || "UNKNOWN").slice(-8).toUpperCase()}
                                </span>
                            </div>

                            <Image
                                src={getImageUrl(product.images?.[0] || product.image)}
                                alt={product.name}
                                fill
                                priority={index < 4}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                className="object-cover transition-all duration-700 group-hover:scale-110"
                            />

                            <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-10 transition-opacity duration-500 z-10 bg-[linear-gradient(transparent_0%,_rgba(223, 7, 21,0.2)_50%,_transparent_100%)] bg-[length:100%_4px]" />

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    addToCart({
                                        id: product._id || product.id || "",
                                        name: product.name,
                                        image: product.images?.[0] || product.image || "",
                                        price: product.price,
                                        quantity: 1,
                                        size: 'M'
                                    });
                                }}
                                className="absolute bottom-4 right-4 bg-white text-black p-4 rounded-none opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 hover:bg-brand-volt z-20 active:scale-95"
                            >
                                <Plus size={20} strokeWidth={3} />
                            </button>
                        </div>

                        <div className="flex justify-between items-start">
                            <div className="space-y-1.5">
                                <h3 className="text-white font-black text-sm tracking-widest uppercase leading-tight max-w-[180px]">
                                    {product.name}
                                </h3>
                                <div className="text-brand-volt font-mono text-sm font-bold italic tracking-wider">
                                    <FormattedPrice amount={product.price} />
                                </div>
                            </div>
                            <div className="h-[1px] w-8 bg-white/20 mt-2" />
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
