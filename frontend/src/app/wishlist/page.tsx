"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, ArrowLeft, Trash2, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Product } from '@/data/products';
import { useWishlist, WishlistItem } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { FormattedPrice } from '@/components/ui/FormattedPrice';
import toast from 'react-hot-toast';

export default function WishlistPage() {
    const { wishlist, toggleWishlist } = useWishlist();
    const { moveWishlistToCart, isLoaded } = useCart();

    const handleMoveToCart = (item: WishlistItem) => {
        moveWishlistToCart(item);
        toggleWishlist(item); // Remove from wishlist after moving

        toast.success(`${item.name} added to cart`, {
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

    // Hydration guard to prevent flicker
    if (!isLoaded) {
        return (
            <div className="bg-brand-black min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-brand-volt border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (wishlist.length === 0) {
        return (
            <div className="bg-brand-black min-h-screen text-white flex flex-col">
                <main className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden pt-40 md:pt-48">
                    <div className="relative z-10 flex flex-col items-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative mb-12"
                        >
                            <div className="w-32 h-32 bg-brand-surface border border-white/5 flex items-center justify-center backdrop-blur-xl relative z-10">
                                <Heart size={48} className="text-white/10" strokeWidth={1} />
                                <motion.div
                                    animate={{ opacity: [0, 1, 0] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="absolute inset-0 flex items-center justify-center"
                                >
                                    <Sparkles size={32} className="text-brand-volt/40" />
                                </motion.div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-center"
                        >
                            <h2 className="text-5xl md:text-7xl font-heading italic uppercase mb-4 tracking-tighter">
                                Wishlist <span className="text-white/20">Empty</span>
                            </h2>
                            <p className="text-white/40 font-mono text-[12px] tracking-[0.3em] uppercase mb-12 max-w-[300px] mx-auto leading-loose">
                                Your wishlist is empty. Save items you love to find them here later.
                            </p>

                            <Link href="/shop">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="group flex items-center gap-6 px-12 py-6 bg-white text-black font-black uppercase text-[13px] tracking-[0.3em] transition-all relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-brand-volt translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                    <span className="relative z-10 flex items-center gap-4">
                                        <ArrowLeft size={14} strokeWidth={3} /> Browse Shop
                                    </span>
                                </motion.button>
                            </Link>
                        </motion.div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="bg-brand-black min-h-screen text-white selection:bg-brand-volt">
            <main className="pt-64 md:pt-72 pb-20 px-6 max-w-[1400px] mx-auto">
                <motion.header
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-24 border-l-2 border-brand-volt pl-8"
                >
                    <span className="font-mono text-[12px] tracking-[0.4em] text-brand-volt uppercase mb-2 block">
                        Saved Items
                    </span>
                    <h1 className="text-6xl md:text-9xl font-heading italic uppercase leading-none tracking-tighter">
                        My <span className="text-white/20">Wishlist</span>
                    </h1>
                </motion.header>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 relative">
                    <AnimatePresence mode="popLayout">
                        {wishlist.map((item, index) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ delay: index * 0.05 }}
                                className="group relative bg-brand-surface border border-white/5 overflow-hidden"
                            >
                                <div className="relative aspect-[3/4] overflow-hidden">
                                    { }
<img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
                                    />

                                    <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-sm flex flex-col items-center justify-center gap-4 p-8">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => handleMoveToCart(item)}
                                            className="w-full py-5 bg-white text-black font-black uppercase text-[12px] tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-brand-volt transition-colors"
                                        >
                                            <ShoppingBag size={14} strokeWidth={3} /> Add to Cart
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => toggleWishlist(item)}
                                            className="w-full py-5 bg-white/5 border border-white/10 text-white/40 font-black uppercase text-[12px] tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-red-500/20 hover:text-red-500 hover:border-red-500/50 transition-all"
                                        >
                                            <Trash2 size={14} strokeWidth={3} /> Remove
                                        </motion.button>
                                    </div>

                                    <div className="absolute top-4 left-4 z-10">
                                        <div className="bg-brand-volt/10 backdrop-blur-md border border-brand-volt/20 p-2">
                                            <Heart size={12} className="text-brand-volt fill-brand-volt" />
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 space-y-3 relative">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-[12px] font-black tracking-[0.15em] uppercase leading-tight max-w-[70%]">{item.name}</h3>
                                        <span className="font-mono text-[11px] text-white/20 uppercase tracking-tighter">#{item.id.slice(0, 4)}</span>
                                    </div>
                                    <p className="text-brand-volt font-mono text-base italic font-bold tracking-widest">
                                        <FormattedPrice amount={typeof item.price === 'number' ? item.price : 0} />
                                    </p>
                                    <div className="h-[1px] w-0 group-hover:w-full bg-brand-volt/30 transition-all duration-700" />
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}