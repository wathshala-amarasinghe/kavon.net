"use client";

import React, { useState, useEffect } from 'react';
import { Award, Users, TrendingUp, ShieldCheck, Loader2, Star, Trophy, Crown } from 'lucide-react';
import { getUsers } from '@/lib/api';
import toast from 'react-hot-toast';

export default function LoyaltyPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchLoyaltyData = async () => {
            try {
                const token = localStorage.getItem('kavon-admin-token') || '';
                const data = await getUsers(token);
                // Sort by loyalty points descending
                const sorted = data.sort((a: any, b: any) => (b.loyaltyPoints || 0) - (a.loyaltyPoints || 0));
                setUsers(sorted);
            } catch (error: any) {
                toast.error(error.message || 'Failed to sync loyalty data');
            } finally {
                setIsLoading(false);
            }
        };
        fetchLoyaltyData();
    }, []);
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Stats / Config Panel */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="tactical-glass p-8 flex flex-col items-center justify-center text-center space-y-6">
                        <div className="w-20 h-20 bg-brand-volt/10 border border-brand-volt/20 rounded-full flex items-center justify-center text-brand-volt shadow-[0_0_20px_rgba(63,255,117,0.2)]">
                            <Award size={40} />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-xl font-black uppercase tracking-tight">Protocol_Active</h2>
                            <p className="font-mono text-[10px] text-white/40 uppercase tracking-[0.2em]">
                                Credits accrue automatically based on verified purchases.
                            </p>
                        </div>
                    </div>
                    
                    <div className="p-6 border border-white/5 bg-white/[0.02] space-y-3 relative overflow-hidden group hover:border-white/20 transition-colors">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <TrendingUp size={60} />
                        </div>
                        <h4 className="font-black uppercase text-[11px] tracking-widest text-brand-volt">Redemption_Rules</h4>
                        <p className="font-mono text-[10px] text-white/40 uppercase leading-relaxed">
                            Points convert at 10 LKR per 100 Credits.<br/>Minimum 500 Credits required for checkout application.
                        </p>
                    </div>
                </div>

                {/* Leaderboard */}
                <div className="lg:col-span-2 tactical-glass p-8">
                    <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
                        <Trophy size={18} className="text-white/60" />
                        <h2 className="font-heading italic uppercase text-lg text-white">Top Operatives</h2>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center p-12">
                            <Loader2 className="animate-spin text-brand-volt" />
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {users.length === 0 && (
                                <p className="text-white/40 font-mono text-[11px] text-center p-4">No operative data found.</p>
                            )}
                            {users.slice(0, 15).map((user, index) => (
                                <div key={user._id} className="flex items-center justify-between p-4 bg-black/40 border border-white/5 hover:bg-black/60 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 flex justify-center">
                                            {index === 0 ? <Crown size={20} className="text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" /> : 
                                             index === 1 ? <Crown size={18} className="text-gray-300" /> : 
                                             index === 2 ? <Crown size={16} className="text-amber-600" /> : 
                                             <span className="font-mono text-[11px] text-white/40">#{index + 1}</span>}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {user.avatarUrl ? (
                                                <img src={user.avatarUrl} alt="" className="w-8 h-8 rounded border border-white/10 object-cover" />
                                            ) : (
                                                <div className="w-8 h-8 rounded border border-white/10 bg-white/5 flex items-center justify-center">
                                                    <Users size={12} className="text-white/40" />
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-bold text-[12px] uppercase tracking-wider">{user.name}</p>
                                                <p className="font-mono text-[9px] text-white/40">{user.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Star size={12} className="text-brand-volt" />
                                        <span className="font-mono text-[13px] font-bold text-white">{user.loyaltyPoints || 0}</span>
                                        <span className="font-mono text-[9px] text-brand-volt uppercase tracking-widest hidden sm:inline">PTS</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
