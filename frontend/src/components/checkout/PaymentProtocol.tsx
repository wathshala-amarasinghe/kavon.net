"use client";

import React from 'react';
import { CreditCard, Banknote, ShieldCheck } from 'lucide-react';

interface PaymentProtocolProps {
    selectedMethod: string;
    onMethodChange: (method: string) => void;
}

export function PaymentProtocol({ selectedMethod, onMethodChange }: PaymentProtocolProps) {
    const methods = [
        {
            id: 'cod',
            name: 'Cash_On_Delivery',
            icon: <Banknote size={18} />,
            desc: 'Pay when your order is delivered',
            disabled: false,
        },
        {
            id: 'card',
            name: 'Credit_Debit_Card',
            icon: <CreditCard size={18} />,
            desc: 'Coming soon — secure payment gateway is not active yet',
            disabled: true,
        },
    ];

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
                            disabled={method.disabled}
                            onClick={() => !method.disabled && onMethodChange(method.id)}
                            className={`w-full p-6 border transition-all text-left flex items-center gap-6 group ${method.disabled ? 'opacity-40 cursor-not-allowed' : ''} ${selectedMethod === method.id
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

                    </div>
                ))}
            </div>

            {/* Security Footer */}
            <div className="pt-6 flex items-center gap-4 text-[9px] font-mono text-white/20 uppercase tracking-[0.2em] leading-relaxed">
                <ShieldCheck size={20} className="text-brand-volt shrink-0" />
                Cash on Delivery is the only payment method currently available. Card details are not collected.
            </div>
        </section>
    );
}
