"use client";

import React, { useState } from 'react';
import { CreditCard, Banknote, ShieldCheck, Lock, Plus, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PaymentProtocolProps {
    selectedMethod: string;
    onMethodChange: (method: string) => void;
}

export function PaymentProtocol({ selectedMethod, onMethodChange }: PaymentProtocolProps) {
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    const methods = [
        { id: 'card', name: 'Credit_Debit_Card', icon: <CreditCard size={18} />, desc: 'Visa, Mastercard, Amex via Secure Gateway' },
        { id: 'cod', name: 'Cash_On_Delivery', icon: <Banknote size={18} />, desc: 'Pay upon tactical delivery fulfillment' }
    ];

    const handleSaveCard = () => {
        setIsSaving(true);
        // Simulate tactical encryption/saving process
        setTimeout(() => {
            setIsSaving(false);
            setIsSaved(true);
        }, 1500);
    };

    return (
        <section className="space-y-8 pb-10">
            {/* Protocol Header */}
            <div className="flex items-center gap-4">
                <span className="w-8 h-8 rounded-full border border-brand-volt flex items-center justify-center text-brand-volt font-mono text-xs flex-shrink-0 shadow-[0_0_15px_rgba(223, 7, 21,0.3)]">02</span>
                <h2 className="text-2xl font-black italic uppercase tracking-normal leading-relaxed text-white">
                    Payment_Protocol
                </h2>
            </div>

            <div className="space-y-4">
                {methods.map((method) => (
                    <div key={method.id} className="space-y-4">
                        <button
                            type="button"
                            onClick={() => onMethodChange(method.id)}
                            className={`w-full p-6 border transition-all text-left flex items-center gap-6 group ${selectedMethod === method.id
                                    ? 'bg-brand-volt/5 border-brand-volt'
                                    : 'bg-white/[0.02] border-white/10 hover:border-white/30'
                                }`}
                        >
                            <div className={`w-12 h-12 flex items-center justify-center border ${selectedMethod === method.id ? 'border-brand-volt text-brand-volt' : 'border-white/10 text-white/40'
                                }`}>
                                {method.icon}
                            </div>
                            <div className="flex-1">
                                <h4 className={`text-xs font-black uppercase tracking-widest ${selectedMethod === method.id ? 'text-brand-volt' : 'text-white'
                                    }`}>
                                    {method.name}
                                </h4>
                                <p className="text-[10px] font-mono text-white/40 uppercase mt-1">{method.desc}</p>
                            </div>
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedMethod === method.id ? 'border-brand-volt' : 'border-white/20'
                                }`}>
                                {selectedMethod === method.id && <div className="w-2 h-2 rounded-full bg-brand-volt shadow-[0_0_8px_#df0715]" />}
                            </div>
                        </button>

                        {/* EXPANDABLE CARD SECURE ENTRY */}
                        <AnimatePresence>
                            {selectedMethod === 'card' && method.id === 'card' && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="p-6 bg-white/[0.03] border border-white/10 space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-mono text-white uppercase tracking-widest">Name_On_Card</label>
                                            <input
                                                type="text"
                                                placeholder="OPERATOR NAME"
                                                className="w-full bg-black/40 border border-white/10 p-4 font-mono text-sm focus:border-brand-volt outline-none text-white placeholder:text-white/10 uppercase"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-mono text-white uppercase tracking-widest">Card_Number</label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    placeholder="XXXX XXXX XXXX XXXX"
                                                    className="w-full bg-black/40 border border-white/10 p-4 font-mono text-sm focus:border-brand-volt outline-none text-white placeholder:text-white/10"
                                                />
                                                <Lock size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-mono text-white uppercase tracking-widest">Expiry_Date</label>
                                                <input
                                                    type="text"
                                                    placeholder="MM / YY"
                                                    className="w-full bg-black/40 border border-white/10 p-4 font-mono text-sm focus:border-brand-volt outline-none text-white placeholder:text-white/10"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-mono text-white uppercase tracking-widest">CVV_Code</label>
                                                <input
                                                    type="password"
                                                    placeholder="XXX"
                                                    maxLength={3}
                                                    className="w-full bg-black/40 border border-white/10 p-4 font-mono text-sm focus:border-brand-volt outline-none text-white placeholder:text-white/10"
                                                />
                                            </div>
                                        </div>

                                        {/* TACTICAL ADD CARD BUTTON */}
                                        <button
                                            type="button"
                                            onClick={handleSaveCard}
                                            disabled={isSaved || isSaving}
                                            className={`w-full py-4 flex items-center justify-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] transition-all border ${isSaved
                                                    ? 'border-brand-volt text-brand-volt bg-brand-volt/5'
                                                    : 'border-white/20 text-white hover:border-brand-volt hover:text-brand-volt'
                                                }`}
                                        >
                                            {isSaving ? (
                                                <span className="animate-pulse">Encrypting_Asset...</span>
                                            ) : isSaved ? (
                                                <>Asset_Linked <Check size={14} /></>
                                            ) : (
                                                <>Save_Card_Node <Plus size={14} /></>
                                            )}
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>

            {/* Security Footer */}
            <div className="pt-6 flex items-center gap-4 text-[9px] font-mono text-white/20 uppercase tracking-[0.2em] leading-relaxed">
                <ShieldCheck size={20} className="text-brand-volt shrink-0" />
                Cipher encryption active. Payment data is never stored on local nodes.
            </div>
        </section>
    );
}