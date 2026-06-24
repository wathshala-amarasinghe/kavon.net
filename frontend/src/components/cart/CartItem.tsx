"use client";

import React from "react";
import { Minus, Plus, X, Heart } from "lucide-react";
import { useCart, CartItem as CartItemType } from "@/context/CartContext";
import { FormattedPrice } from "@/components/ui/FormattedPrice";

export function CartItem({ item }: { item: CartItemType }) {
    const { removeFromCart, updateQuantity, moveToWishlist } = useCart();

    return (
        <div className="group grid grid-cols-12 gap-4 bg-white/[0.02] border border-white/5 p-6 hover:bg-white/[0.04] transition-all">
            <div className="col-span-3 md:col-span-2 aspect-[3/4] bg-brand-surface overflow-hidden border border-white/10">
                { }
<img src={item.image} className="w-full h-full object-cover" alt={item.name} />
            </div>

            <div className="col-span-9 md:col-span-10 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                    <div>
                        <h4 className="font-black uppercase italic text-lg leading-tight">{item.name}</h4>
                        <div className="text-[10px] font-mono text-white/40 uppercase mt-1 flex items-center gap-1">
                            Size: {item.size} {"//"} Price: <FormattedPrice amount={item.price} />
                        </div>
                    </div>
                    <button onClick={() => removeFromCart(item.id, item.size, item.isBundle)} className="text-white/20 hover:text-red-500 transition-colors">
                        <X size={18} />
                    </button>
                </div>

                <div className="flex justify-between items-end mt-4">
                    <div className="flex items-center border border-white/10">
                        <button onClick={() => updateQuantity(item.id, item.size, -1, item.isBundle)} className="p-2 hover:text-brand-volt"><Minus size={14} /></button>
                        <span className="w-10 text-center font-mono text-sm">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.size, 1, item.isBundle)} className="p-2 hover:text-brand-volt"><Plus size={14} /></button>
                    </div>

                    <button
                        onClick={() => moveToWishlist(item.id, item.size, item.isBundle)}
                        className="flex items-center gap-2 text-[10px] font-mono uppercase text-white/20 hover:text-brand-volt transition-all"
                    >
                        <Heart size={12} /> Move_To_Wishlist
                    </button>
                </div>
            </div>
        </div>
    );
}