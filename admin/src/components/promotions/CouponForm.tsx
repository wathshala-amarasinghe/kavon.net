"use client";

import React, { useState, useEffect } from 'react';
import { X, Save, Tag, Percent, DollarSign, Calendar, Hash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CouponFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => Promise<void>;
    initialData?: any;
    title: string;
}

export default function CouponForm({ isOpen, onClose, onSubmit, initialData, title }: CouponFormProps) {
    const [formData, setFormData] = useState({
        code: '',
        discountType: 'Percentage',
        discountValue: 0,
        expiryDate: '',
        usageLimit: 0,
        minOrderAmount: 0,
        isActive: true
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                code: initialData.code || '',
                discountType: initialData.discountType || 'Percentage',
                discountValue: initialData.discountValue || 0,
                expiryDate: initialData.expiryDate ? new Date(initialData.expiryDate).toISOString().slice(0, 16) : '',
                usageLimit: initialData.usageLimit || 0,
                minOrderAmount: initialData.minOrderAmount || 0,
                isActive: initialData.isActive ?? true
            });
        } else {
            setFormData({
                code: '',
                discountType: 'Percentage',
                discountValue: 0,
                expiryDate: '',
                usageLimit: 0,
                minOrderAmount: 0,
                isActive: true
            });
        }
    }, [initialData, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            await onSubmit(formData);
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/90 backdrop-blur-md" 
                />
                
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="w-full max-w-2xl bg-brand-black border border-white/10 relative z-10 overflow-hidden flex flex-col max-h-[90vh]"
                >
                    <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-brand-volt text-black flex items-center justify-center">
                                <Tag size={20} />
                            </div>
                            <h2 className="text-2xl font-black italic uppercase tracking-tighter">{title}</h2>
                        </div>
                        <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="font-mono text-[10px] text-white/40 uppercase tracking-widest flex items-center gap-2">
                                    <Hash size={12} /> Incentive_Code
                                </label>
                                <input 
                                    required
                                    type="text" 
                                    value={formData.code}
                                    onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                                    className="w-full bg-black/40 border border-white/5 p-4 font-mono text-xs uppercase focus:border-brand-volt outline-none"
                                    placeholder="E.G. KAVON_FORCE_20"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="font-mono text-[10px] text-white/40 uppercase tracking-widest">Incentive_Type</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button 
                                        type="button"
                                        onClick={() => setFormData({...formData, discountType: 'Percentage'})}
                                        className={`p-4 border font-mono text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${formData.discountType === 'Percentage' ? 'bg-brand-volt text-black border-brand-volt' : 'bg-white/5 text-white/40 border-white/10'}`}
                                    >
                                        <Percent size={14} /> Percentage
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => setFormData({...formData, discountType: 'Fixed'})}
                                        className={`p-4 border font-mono text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${formData.discountType === 'Fixed' ? 'bg-brand-volt text-black border-brand-volt' : 'bg-white/5 text-white/40 border-white/10'}`}
                                    >
                                        <DollarSign size={14} /> Fixed_Value
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="font-mono text-[10px] text-white/40 uppercase tracking-widest">Incentive_Value</label>
                                <input 
                                    required
                                    type="number" 
                                    min="0.01"
                                    max={formData.discountType === 'Percentage' ? 100 : undefined}
                                    step="0.01"
                                    value={formData.discountValue}
                                    onChange={(e) => setFormData({...formData, discountValue: Number(e.target.value)})}
                                    className="w-full bg-black/40 border border-white/5 p-4 font-mono text-xs focus:border-brand-volt outline-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="font-mono text-[10px] text-white/40 uppercase tracking-widest flex items-center gap-2">
                                    <Calendar size={12} /> Expiration_Timeline
                                </label>
                                <input 
                                    required
                                    type="datetime-local" 
                                    value={formData.expiryDate}
                                    onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                                    className="w-full bg-black/40 border border-white/5 p-4 font-mono text-[10px] focus:border-brand-volt outline-none [color-scheme:dark]"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="font-mono text-[10px] text-white/40 uppercase tracking-widest">Global_Quota (Usage Limit)</label>
                                <input 
                                    type="number" 
                                    min="0"
                                    step="1"
                                    value={formData.usageLimit}
                                    onChange={(e) => setFormData({...formData, usageLimit: Number(e.target.value)})}
                                    className="w-full bg-black/40 border border-white/5 p-4 font-mono text-xs focus:border-brand-volt outline-none"
                                    placeholder="0 for unlimited"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="font-mono text-[10px] text-white/40 uppercase tracking-widest">Minimum_Order_Valuation</label>
                                <input 
                                    type="number" 
                                    min="0"
                                    step="0.01"
                                    value={formData.minOrderAmount}
                                    onChange={(e) => setFormData({...formData, minOrderAmount: Number(e.target.value)})}
                                    className="w-full bg-black/40 border border-white/5 p-4 font-mono text-xs focus:border-brand-volt outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/5">
                            <input 
                                type="checkbox" 
                                checked={formData.isActive}
                                onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                                className="w-5 h-5 rounded-none border-white/10 bg-black accent-brand-volt cursor-pointer"
                                id="is-active"
                            />
                            <label htmlFor="is-active" className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/60 cursor-pointer">
                                Module_Active_Status
                            </label>
                        </div>

                        <div className="pt-8 border-t border-white/5 flex justify-end gap-4">
                            <button 
                                type="button" 
                                onClick={onClose}
                                className="px-8 py-4 border border-white/10 font-black uppercase text-[11px] tracking-widest hover:bg-white hover:text-black transition-all"
                            >
                                Abort
                            </button>
                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="px-8 py-4 bg-brand-volt text-black font-black uppercase text-[11px] tracking-widest hover:brightness-110 transition-all flex items-center gap-2 disabled:opacity-50"
                            >
                                <Save size={16} /> {isSubmitting ? 'GENERATING...' : 'Authorize_Incentive'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
