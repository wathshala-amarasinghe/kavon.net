"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { FormattedPrice } from '@/components/ui/FormattedPrice';
import { ShoppingBag, X, Trash2, ArrowRight } from 'lucide-react';
import { getImageUrl } from '@/lib/utils';

export function MiniCart() {
    const { cart, subtotal, removeFromCart } = useCart();

    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 w-80 mt-4 bg-black/90 backdrop-blur-2xl border border-white/10 shadow-2xl z-[150] overflow-hidden"
        >
            {/* Tactical Header */}
            <div className="p-4 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
                <span className="text-[12px] font-mono text-brand-volt uppercase tracking-[0.2em] font-bold">
                    ACTIVE MANIFEST // {cart.length} ITEMS
                </span>
            </div>

            {/* Items List */}
            <div className="max-h-80 overflow-y-auto scrollbar-hide">
                {cart.length > 0 ? (
                    <div className="divide-y divide-white/5">
                        {cart.map((item) => (
                            <div key={`${item.id}-${item.size}-${item.color || 'Default'}-${Boolean(item.isBundle)}`} className="p-4 flex gap-4 group">
                                <div className="w-16 h-20 bg-brand-surface border border-white/5 overflow-hidden shrink-0">
                                    <img src={getImageUrl(item.image)} alt={item.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                                </div>
                                <div className="flex-1 min-w-0 space-y-1">
                                    <div className="flex justify-between items-start">
                                        <h4 className="text-[14px] font-black uppercase tracking-tight text-white truncate group-hover:text-brand-volt transition-colors">
                                            {item.name}
                                        </h4>
                                        <p className="text-[14px] font-mono text-brand-volt font-bold"><FormattedPrice amount={item.price} /></p>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[12px] font-mono text-white/60 uppercase tracking-widest">
                                            SIZE: {item.size} {item.color ? `// ${item.color}` : ''} {"//"} QTY: {item.quantity}
                                        </span>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => removeFromCart(item.id, item.size, item.isBundle, item.color)}
                                    className="text-white/20 hover:text-red-500 transition-colors self-start"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-12 text-center space-y-4">
                        <ShoppingBag size={24} className="mx-auto text-white/10" strokeWidth={1} />
                        <p className="text-[13px] font-mono text-white/50 uppercase tracking-[0.2em] font-bold">
                            MANIFEST EMPTY
                        </p>
                    </div>
                )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
                <div className="p-4 bg-white/[0.02] border-t border-white/5 space-y-4">
                    <div className="flex justify-between items-end">
                        <span className="text-[12px] font-mono text-white/60 uppercase tracking-widest">EST SUBTOTAL</span>
                        <span className="text-xl font-heading italic text-brand-volt leading-none">
                            <FormattedPrice amount={subtotal} />
                        </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                        <Link href="/cart" className="py-4 border border-white/10 text-white font-black uppercase text-[12px] tracking-[0.2em] flex items-center justify-center hover:bg-white hover:text-black transition-all">
                            VIEW CART
                        </Link>
                        <Link href="/checkout" className="py-4 bg-brand-volt text-black font-black uppercase text-[12px] tracking-[0.2em] flex items-center justify-center hover:brightness-110 transition-all gap-2">
                            CHECKOUT <ArrowRight size={16} strokeWidth={3} />
                        </Link>
                    </div>
                </div>
            )}
        </motion.div>
    );
}
