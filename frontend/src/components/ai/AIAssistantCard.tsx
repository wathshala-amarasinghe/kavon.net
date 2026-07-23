"use client";

import React from 'react';
import { useCart } from "@/context/CartContext";
import { ShoppingBag, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from 'next/navigation';
import { CatalogProduct } from '@/types/product';
import { getFirstAvailableSize, getProductImage, isProductAvailable } from '@/lib/storefront-runtime';
import { getImageUrl } from '@/lib/utils';

export function AIAssistantCard({ product, closeChat }: { product: CatalogProduct, closeChat: () => void }) {
    const { addToCart } = useCart();
    const router = useRouter();

    const handleQuickAdd = () => {
        const defaultSize = getFirstAvailableSize(product);
        if (!defaultSize || !isProductAvailable(product)) {
            toast.error(`${product.name} IS OUT OF STOCK`);
            return;
        }

        addToCart({
            id: product._id || product.id || '',
            name: product.name,
            price: product.price,
            quantity: 1,
            size: defaultSize,
            image: getProductImage(product),
            color: product.colors?.[0]?.name,
        });
        toast.success(`${product.name} ADDED TO ARCHIVE`);
    };

    const handleView = () => {
        router.push(`/products/${product._id || product.id}`);
        closeChat();
    };

    return (
        <div className="bg-white/5 border border-white/10 p-3 flex gap-4 my-3 group transition-all hover:border-brand-volt/50 rounded-sm">
            <div className="w-20 h-24 bg-black shrink-0 overflow-hidden rounded-sm">
                { }
<img src={getImageUrl(getProductImage(product))} className="w-full h-full object-cover grayscale group-hover:grayscale-0" alt={product.name} />
            </div>
            <div className="flex-1 flex flex-col justify-between py-0.5">
                <div>
                    <h4 className="text-[12px] font-semibold leading-snug text-white/90 line-clamp-2">{product.name}</h4>
                    <p className="text-[11px] font-medium text-brand-volt mt-1">LKR {product.price.toLocaleString()}</p>
                </div>
                <div className="flex gap-3 mt-2">
                    <button
                        onClick={handleQuickAdd}
                        className="bg-brand-volt text-black text-[10px] font-bold px-3 py-1.5 uppercase flex items-center gap-1.5 hover:brightness-110 rounded-sm transition-all"
                    >
                        <ShoppingBag size={12} /> Add
                    </button>
                    <button
                        onClick={handleView}
                        className="text-white/60 hover:text-white text-[10px] uppercase font-medium flex items-center gap-1 transition-colors"
                    >
                        View <ArrowRight size={12} />
                    </button>
                </div>
            </div>
        </div>
    );
}
