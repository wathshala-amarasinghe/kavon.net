"use client";

import React from 'react';
import { Award, Users, TrendingUp, ShieldCheck } from 'lucide-react';

export default function LoyaltyPage() {
    return (
        <div className="space-y-10">
            <header className="flex justify-between items-end">
                <div className="space-y-2">
                    <span className="font-mono text-[13px] text-white/40 uppercase tracking-[0.4em]">Node_Status / Rewards</span>
                    <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">Division<span className="text-brand-volt">_Credits</span></h1>
                </div>
                <div className="px-6 py-4 tactical-glass flex items-center gap-3">
                    <Award size={16} className="text-brand-volt" />
                    <span className="font-mono text-[13px] uppercase tracking-widest text-white/60">Global_Accrual_Rate: 0.25 / LKR</span>
                </div>
            </header>

            <div className="tactical-glass p-20 flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-20 h-20 bg-brand-volt/10 border border-brand-volt/20 rounded-full flex items-center justify-center text-brand-volt animate-bounce">
                    <Award size={40} />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-black uppercase tracking-tight">Loyalty_Protocol_Restricted</h2>
                    <p className="font-mono text-xs text-white/40 uppercase tracking-[0.2em] max-w-md mx-auto">
                        The Division Credits management interface is currently undergoing secure deployment. 
                        Personnel rewards tracking and manual adjustments will be active shortly.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl mt-12">
                    <div className="p-8 border border-white/5 bg-white/[0.02] space-y-4 text-left relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <Users size={80} />
                        </div>
                        <h4 className="font-black uppercase text-sm tracking-widest text-brand-volt">Operator_Tiers</h4>
                        <p className="font-mono text-[10px] text-white/40 uppercase leading-relaxed">Manage user levels based on credit accumulation and purchase history.</p>
                    </div>
                    <div className="p-8 border border-white/5 bg-white/[0.02] space-y-4 text-left relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <TrendingUp size={80} />
                        </div>
                        <h4 className="font-black uppercase text-sm tracking-widest text-brand-volt">Redemption_Rules</h4>
                        <p className="font-mono text-[10px] text-white/40 uppercase leading-relaxed">Configure conversion rates and minimum credit requirements for checkout redemption.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
