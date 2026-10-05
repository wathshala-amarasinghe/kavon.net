"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { ArrowRight, Ticket } from "lucide-react";
import { FormattedPrice } from "@/components/ui/FormattedPrice";

export function OrderSummary() {
    const { subtotal, discount, shippingFee, total, applyCoupon, activeCoupon, couponError } = useCart();
    const { user } = useAuth();
    const [couponInput, setCouponInput] = useState("");
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
    const router = useRouter();

    const handleApply = async () => {
        if (!couponInput.trim() || isApplyingCoupon) return;
        setIsApplyingCoupon(true);
        const success = await applyCoupon(couponInput, subtotal);
        if (success) setCouponInput("");
        setIsApplyingCoupon(false);
    };

    const handleCheckout = () => {
        if (!user) {
            router.push('/login?redirect=checkout');
        } else {
            router.push('/checkout');
        }
    };

    return (
        <div className="bg-white/[0.03] border border-white/10 p-8 space-y-8">
            <h3 className="font-black uppercase tracking-widest text-xl italic border-b border-white/5 pb-4">Summary</h3>

            <div className="space-y-5 font-mono text-sm uppercase">
                <div className="flex justify-between">
                    <span className="text-white/60">Subtotal</span>
                    <span className="text-white font-bold"><FormattedPrice amount={subtotal} /></span>
                </div>
                {discount > 0 && (
                    <div className="flex justify-between text-brand-volt">
                        <span className="font-bold tracking-widest italic">PROMO DISCOUNT ({activeCoupon})</span>
                        <span className="font-bold italic">- <FormattedPrice amount={discount} /></span>
                    </div>
                )}
                <div className="flex justify-between">
                    <span className="text-white/60">Shipping Fee</span>
                    <span className="text-white font-bold">{shippingFee === 0 ? "FREE" : <FormattedPrice amount={shippingFee} />}</span>
                </div>
                <div className="border-t border-white/10 pt-6 flex justify-between text-2xl font-black italic">
                    <span className="text-brand-volt">TOTAL</span>
                    <span className="text-white tracking-tighter"><FormattedPrice amount={total} /></span>
                </div>
            </div>

            {/* Coupon Section */}
            <div className="space-y-3">
                <p className="text-[11px] font-mono text-white/50 uppercase tracking-widest flex items-center gap-2">
                    <Ticket size={14} className="text-brand-volt" /> APPLY PROMO CODE
                </p>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="ENTER CODE"
                        className="flex-1 bg-black/40 border border-white/10 p-3 font-mono text-[10px] focus:border-brand-volt outline-none text-white uppercase"
                    />
                    <button
                        onClick={handleApply}
                        disabled={isApplyingCoupon || !couponInput.trim()}
                        className="px-4 border border-white/20 text-[10px] font-black uppercase hover:bg-white hover:text-black transition-all"
                    >
                        {isApplyingCoupon ? 'Checking...' : 'Apply'}
                    </button>
                </div>
                {couponError && (
                    <p role="alert" className="text-[10px] font-mono text-red-400 uppercase tracking-wide">
                        {couponError}
                    </p>
                )}
            </div>

            <button
                onClick={handleCheckout}
                disabled={total === 0}
                className="w-full py-6 bg-brand-volt text-black font-black uppercase text-sm tracking-[0.3em] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(63,255,117,0.15)]"
            >
                SECURE CHECKOUT <ArrowRight size={18} />
            </button>
        </div>
    );
}
