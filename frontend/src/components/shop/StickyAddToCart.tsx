"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';

interface StickyAddToCartProps {
    product: Record<string, unknown>;
    onAdd: () => void;
    isVisible: boolean;
}

export function StickyAddToCart({ product, onAdd, isVisible }: StickyAddToCartProps) {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    exit={{ y: 100 }}
                    className="fixed bottom-0 left-0 right-0 z-[400] lg:hidden bg-black/90 backdrop-blur-xl border-t border-white/10 p-4 pb-8"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-16 bg-brand-surface border border-white/10 shrink-0">
                            { }
<img src={product.images[0]} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-[12px] font-black uppercase italic truncate">{product.name}</h4>
                            <p className="text-sm font-mono font-bold text-brand-volt">LKR {product.price.toLocaleString()}</p>
                        </div>
                        <button
                            onClick={onAdd}
                            className="bg-brand-volt text-black px-6 py-3 font-black uppercase text-[12px] tracking-widest flex items-center gap-2 active:scale-95 transition-all"
                        >
                            <ShoppingBag size={14} /> Add
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
