"use client";

import React, { useState } from 'react';
import { Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import toast from 'react-hot-toast';
import { CatalogProduct } from '@/types/product';
import { getImageUrl } from '@/lib/utils';

interface BundleProps {
    currentProduct: CatalogProduct;
    bundleProduct: CatalogProduct; // The product to pair with (e.g., matching pants for a tee)
}

export function BundleSection({ currentProduct, bundleProduct }: BundleProps) {
    const { addToCart } = useCart();
    const [selectedBundleSize, setSelectedBundleSize] = useState(bundleProduct.sizes[1]?.label || "M");

    // Bundle Logic: 10% discount if bought together
    const subtotal = currentProduct.price + bundleProduct.price;
    const bundlePrice = subtotal * 0.9;
    const savings = subtotal - bundlePrice;

    const handleAddBundle = () => {
        // 1. Add current product with 10% discount
        addToCart({
            id: currentProduct._id || currentProduct.id || "",
            name: currentProduct.name,
            image: currentProduct.images[0] || currentProduct.image || "",
            quantity: 1, 
            size: "M", 
            price: currentProduct.price * 0.9, 
            isBundle: true 
        });

        // 2. Add the bundle pairing with 10% discount
        addToCart({
            id: bundleProduct._id || bundleProduct.id || "",
            name: bundleProduct.name,
            image: bundleProduct.images[0] || bundleProduct.image || "",
            quantity: 1,
            size: selectedBundleSize,
            price: bundleProduct.price * 0.9,
            isBundle: true
        });

        toast.success("TACTICAL_SET_SYNCHRONIZED // 10% DISCOUNT APPLIED", {
            style: {
                background: '#df0715ff',
                color: '#000',
                fontWeight: 'bold',
                fontSize: '10px',
                fontFamily: 'monospace'
            }
        });
    };

    return (
        <section className="mt-20 border-t border-white/5 pt-20">
            <header className="mb-10">
                <span className="text-brand-volt font-mono text-[10px] tracking-[0.4em] uppercase block mb-2">Tactical_Synergy</span>
                <h3 className="text-3xl font-black italic uppercase italic">Complete_The_Set</h3>
            </header>

            <div className="bg-white/[0.02] border border-white/5 p-8 flex flex-col md:flex-row items-center gap-8 md:gap-12 relative overflow-hidden">
                {/* Decorative Background Text */}
                <div className="absolute -bottom-4 -right-4 text-white/[0.02] font-black text-8xl italic pointer-events-none select-none">
                    BUNDLE
                </div>

                {/* Items Preview */}
                <div className="flex items-center gap-4 shrink-0">
                    <div className="w-24 h-32 border border-white/10 bg-brand-surface overflow-hidden">
                        { }
<img src={getImageUrl(currentProduct.images[0] || currentProduct.image)} className="w-full h-full object-cover opacity-50" alt="" />
                    </div>
                    <Plus className="text-white/20" size={24} />
                    <div className="w-32 h-44 border-2 border-brand-volt bg-brand-surface overflow-hidden shadow-[0_0_30px_rgba(223, 7, 21,0.1)]">
                        { }
<img src={getImageUrl(bundleProduct.images[0] || bundleProduct.image)} className="w-full h-full object-cover" alt="" />
                    </div>
                </div>

                {/* Bundle Details */}
                <div className="flex-1 space-y-4 text-center md:text-left">
                    <div>
                        <h4 className="font-bold text-white uppercase tracking-wider">{bundleProduct.name}</h4>
                        <p className="text-[10px] font-mono text-white/40 uppercase mt-1">Paired with your current selection</p>
                    </div>

                    <div className="flex flex-wrap justify-center md:justify-start gap-2">
                        {bundleProduct.sizes.map((s) => (
                            <button
                                key={s.label}
                                onClick={() => setSelectedBundleSize(s.label)}
                                className={`px-3 py-1 text-[10px] font-mono border transition-all ${selectedBundleSize === s.label
                                        ? 'bg-white text-black border-white'
                                        : 'border-white/10 text-white/40 hover:border-white/30'
                                    }`}
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Price & Action */}
                <div className="shrink-0 flex flex-col items-center md:items-end gap-4">
                    <div className="text-right">
                        <p className="text-[10px] font-mono text-white/30 uppercase line-through">LKR {subtotal.toLocaleString()}</p>
                        <p className="text-3xl font-black italic text-brand-volt leading-none mt-1">LKR {bundlePrice.toLocaleString()}</p>
                        <p className="text-[9px] font-mono text-brand-volt/60 uppercase tracking-tighter mt-1">SAVE LKR {savings.toLocaleString()} ON THIS SET</p>
                    </div>

                    <button
                        onClick={handleAddBundle}
                        className="flex items-center gap-3 bg-white text-black px-8 py-4 font-black uppercase text-[11px] tracking-[0.2em] hover:bg-brand-volt transition-all group"
                    >
                        Acquire_Set <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </section>
    );
}
