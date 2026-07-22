"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tag, Check, AlertCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export function CouponBox() {
    const { applyCoupon, subtotal, couponError } = useCart();
    const [coupon, setCoupon] = useState('');
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const [isApplying, setIsApplying] = useState(false);

    const handleApply = async () => {
        if (!coupon.trim() || isApplying) return;
        setIsApplying(true);
        if (await applyCoupon(coupon, subtotal)) {
            setStatus('success');
        } else {
            setStatus('error');
            setTimeout(() => setStatus('idle'), 3000);
        }
        setIsApplying(false);
    };

    return (
        <div className="pt-8 border-t border-white/5">
            <h4 className="text-[10px] font-mono tracking-[0.4em] text-white/30 uppercase mb-4">
                Access_Code
            </h4>

            <div className="relative flex gap-2">
                <div className="relative flex-1 group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-brand-volt transition-colors">
                        <Tag size={14} />
                    </div>
                    <input
                        type="text"
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value)}
                        placeholder="ENTER_CODE"
                        className="w-full bg-black/40 border border-white/10 px-12 py-4 font-mono text-[11px] tracking-widest text-white placeholder:text-white/10 focus:border-brand-volt focus:outline-none transition-all uppercase"
                    />
                </div>

                <button
                    onClick={handleApply}
                    disabled={isApplying || !coupon.trim()}
                    className="px-6 bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all"
                >
                    {isApplying ? 'Checking...' : 'Apply'}
                </button>
            </div>

            <AnimatePresence>
                {status === 'success' && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mt-4 flex items-center gap-3 text-brand-volt font-mono text-[9px] tracking-widest uppercase"
                    >
                        <Check size={12} /> Code_Verified // 10% Discount Applied
                    </motion.div>
                )}
                {status === 'error' && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mt-4 flex items-center gap-3 text-red-500 font-mono text-[9px] tracking-widest uppercase"
                    >
                        <AlertCircle size={12} /> {couponError || 'Invalid promotion code'}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
