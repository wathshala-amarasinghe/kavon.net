"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Heart, Eye } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import Link from 'next/link';
import { FormattedPrice } from '@/components/ui/FormattedPrice';
import toast from 'react-hot-toast';
import { Product } from '@/data/products';
import Image from 'next/image';
import { getImageUrl } from '@/lib/utils';

export function ProductCard({ product, index, layout = "grid" }: { product: Record<string, unknown>, index: number, layout?: "grid" | "list" }) {
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const isFavorite = isInWishlist(product._id);

    const isOutOfStock = product.stock === 0;

    if (layout === "list") {
        return (
            <motion.div 
                layout 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="group flex gap-8 items-center border border-white/5 bg-brand-surface/20 p-4 hover:border-brand-volt/30 transition-all"
            >
                <div className="relative w-40 aspect-[3/4] overflow-hidden shrink-0">
                    <Image 
                        src={getImageUrl(product.images?.[0])} 
                        alt={product.name}
                        fill
                        sizes="160px"
                        className="object-cover transition-all duration-700 group-hover:scale-110" 
                    />
                </div>

                <div className="flex-1 space-y-4">
                    <div>
                        <span className="text-brand-volt font-mono text-[12px] tracking-[0.2em] uppercase mb-1 block">{product.category}</span>
                        <Link href={`/products/${product._id}`}>
                            <h3 className="text-white font-black text-2xl tracking-tighter uppercase italic hover:text-brand-volt transition-colors">{product.name}</h3>
                        </Link>
                        <p className="text-brand-volt font-mono text-xl italic mt-2"><FormattedPrice amount={product.price} /></p>
                    </div>

                    <p className="text-white/60 text-sm font-body tracking-wider leading-relaxed max-w-xl">
                        Tactical construction with reinforced seams. Engineered for the urban environment. Limited archival release.
                    </p>

                    <div className="flex items-center gap-4 pt-4">
                        <button 
                            onClick={() => !isOutOfStock && addToCart({ id: product._id, name: product.name, image: product.images?.[0], price: product.price, quantity: 1, size: 'M' })} 
                            disabled={isOutOfStock}
                            className={`px-10 py-4 font-black uppercase text-[12px] tracking-[0.2em] transition-all active:scale-95 ${isOutOfStock ? 'bg-white/10 text-white/20 cursor-not-allowed' : 'bg-white text-black hover:bg-brand-volt'}`}
                        >
                            {isOutOfStock ? 'OUT OF STOCK' : 'ADD TO CART'}
                        </button>
                        <button 
                            onClick={() => toggleWishlist({ ...product, id: product._id, image: product.images?.[0] })} 
                            className={`p-4 border border-white/10 ${isFavorite ? 'text-brand-volt' : 'text-white/40'} hover:border-white/30 transition-all`}
                        >
                            <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
                        </button>
                        <Link 
                            href={`/products/${product._id}`} 
                            className="p-4 border border-white/10 text-white/40 hover:text-brand-volt transition-colors"
                        >
                            <Eye size={20} />
                        </Link>
                    </div>
                </div>
            </motion.div>
        );
    }
    return (
        <motion.div layout className="group">
            <div className={`relative aspect-[3/4] bg-brand-surface overflow-hidden border border-white/5 mb-6 ${isOutOfStock ? 'grayscale opacity-60' : ''}`}>
                <Image 
                    src={getImageUrl(product.images?.[0])} 
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover transition-all duration-700 group-hover:scale-110" 
                />

                {isOutOfStock && (
                    <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md px-3 py-1.5 border border-white/10 z-30">
                        <span className="text-[11px] font-black uppercase tracking-widest text-white">Out of Stock</span>
                    </div>
                )}

                {!isOutOfStock && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 z-20">
                        <button onClick={() => addToCart({ id: product._id, name: product.name, image: product.images?.[0], price: product.price, quantity: 1, size: 'M' })} className="p-5 bg-white text-black hover:bg-brand-volt transition-colors active:scale-90">
                            <Plus size={20} />
                        </button>

                        <Link href={`/products/${product._id}`} className="p-5 bg-white text-black hover:bg-brand-volt transition-colors">
                            <Eye size={20} />
                        </Link>

                        <button onClick={() => toggleWishlist({ ...product, id: product._id, image: product.images?.[0] })} className={`p-5 ${isFavorite ? 'bg-brand-volt text-black' : 'bg-white text-black'} active:scale-90`}>
                            <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
                        </button>
                    </div>
                )}

                {isOutOfStock && (
                    <Link href={`/products/${product._id}`} className="absolute inset-0 z-20 flex items-center justify-center">
                        <div className="p-5 bg-black/80 text-white hover:text-brand-volt transition-colors border border-white/10">
                            <Eye size={20} />
                        </div>
                    </Link>
                )}
            </div>

            <div className="space-y-2">
                <Link href={`/products/${product._id}`}>
                    <h3 className="text-white font-black text-[13px] tracking-[0.15em] uppercase hover:text-brand-volt transition-colors leading-tight">{product.name}</h3>
                </Link>
                <div className="flex justify-between items-center">
                    <p className="text-brand-volt font-mono text-[14px] italic font-bold tracking-wider"><FormattedPrice amount={product.price} /></p>
                    <span className="text-[12px] font-mono text-white/20 uppercase tracking-widest">{product.category}</span>
                </div>
            </div>
        </motion.div>
    );
}