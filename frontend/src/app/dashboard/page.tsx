"use client";

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSettings } from '@/context/UserSettingsContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Package,
    Shield,
    Zap,
    Radio,
    MapPin,
    Settings,
    ChevronRight,
    Clock,
    CreditCard,
    Bell
} from 'lucide-react';
import Link from 'next/link';
import { FormattedPrice } from '@/components/ui/FormattedPrice';
import toast from 'react-hot-toast';

export default function DashboardPage() {
    const { user, orderHistory, loyaltyPoints, transmissions, logout } = useAuth();
    const { location } = useSettings();
    const [activeTab, setActiveTab] = useState<'history' | 'comms' | 'intel'>('history');

    const handleLogout = () => {
        logout();
        toast.error('LOGGED_OUT', {
            style: {
                borderRadius: '0px',
                background: '#000',
                color: '#ff4b4b',
                border: '1px solid #ff4b4b',
                fontSize: '12px',
                fontFamily: 'monospace',
            },
        });
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8">
                <div className="w-16 h-16 border border-brand-volt flex items-center justify-center text-brand-volt mb-8 animate-pulse">
                    <Shield size={32} />
                </div>
                <h1 className="text-2xl font-black uppercase italic tracking-[0.4em] text-white mb-4">Login Required</h1>
                <p className="text-white/40 font-mono text-sm uppercase tracking-[0.2em] mb-8 text-center max-w-md">
                    Access to your dashboard is restricted. Please login to continue.
                </p>
                <Link href="/login" className="bg-brand-volt text-black px-12 py-4 font-black uppercase text-xs tracking-[0.5em] hover:brightness-110 transition-all">
                    Login
                </Link>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-black pt-52 pb-20 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                {/* 1. STATUS_HEADER */}
                <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-12">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-brand-volt">
                            <Shield size={16} />
                            <span className="font-mono text-[12px] uppercase tracking-[0.4em]">Account Status: Active</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black uppercase italic leading-none tracking-[0.1em]">
                            {user.name.split(' ')[0]}<span className="text-brand-volt">_Account</span>
                        </h1>
                        <div className="flex items-center gap-6 text-[12px] font-mono text-white/40 uppercase tracking-[0.2em]">
                            <div className="flex items-center gap-2">
                                <Radio size={12} /> Region: {location}
                            </div>
                            <div className="flex items-center gap-2">
                                <Bell size={12} /> Account: Verified
                            </div>
                        </div>
                    </div>

                    {/* LOYALTY_CREDITS_WIDGET */}
                    <div className="bg-brand-surface border border-white/10 p-6 md:p-8 min-w-[300px] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Zap size={64} className="text-brand-volt" />
                        </div>
                        <span className="text-[12px] font-mono text-white/40 uppercase tracking-[0.4em] block mb-2">Loyalty Points</span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-black italic text-brand-volt tracking-[0.1em]">{loyaltyPoints.toLocaleString()}</span>
                            <span className="text-[12px] font-mono text-white/60 uppercase tracking-[0.2em]">Points</span>
                        </div>
                        <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center text-[11px] font-mono uppercase tracking-[0.2em]">
                            <span className="text-white/20">Next Reward at 5,000</span>
                            <Link href="/shop" className="text-brand-volt hover:underline flex items-center gap-1 font-bold">
                                Earn Points <ChevronRight size={10} />
                            </Link>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* 2. COMMAND_NAVIGATION */}
                    <aside className="lg:col-span-3 space-y-2">
                        <button
                            onClick={() => setActiveTab('history')}
                            className={`w-full flex items-center gap-4 p-5 font-mono text-[13px] uppercase tracking-[0.2em] transition-all border ${activeTab === 'history' ? 'bg-brand-volt text-black border-brand-volt' : 'bg-white/[0.02] border-white/5 text-white hover:border-white/20'}`}
                        >
                            <Package size={18} /> ORDER HISTORY
                        </button>
                        <button
                            onClick={() => setActiveTab('comms')}
                            className={`w-full flex items-center gap-4 p-5 font-mono text-[14px] uppercase tracking-[0.2em] transition-all border ${activeTab === 'comms' ? 'bg-brand-volt text-black border-brand-volt' : 'bg-white/[0.02] border-white/5 text-white hover:border-white/20'}`}
                        >
                            <Radio size={18} /> MESSAGES
                            {transmissions.length > 0 && <span className={`ml-auto w-2.5 h-2.5 rounded-full ${activeTab === 'comms' ? 'bg-black' : 'bg-brand-volt animate-pulse'}`} />}
                        </button>
                        <button
                            onClick={() => setActiveTab('intel')}
                            className={`w-full flex items-center gap-4 p-5 font-mono text-[14px] uppercase tracking-[0.2em] transition-all border ${activeTab === 'intel' ? 'bg-brand-volt text-black border-brand-volt' : 'bg-white/[0.02] border-white/5 text-white hover:border-white/20'}`}
                        >
                            <Settings size={18} /> ACCOUNT SETTINGS
                        </button>

                        <div className="pt-8 mt-8 border-t border-white/10">
                            <button
                                onClick={handleLogout}
                                className="w-full text-left p-5 font-mono text-[12px] uppercase text-red-500/80 hover:text-red-500 transition-all tracking-[0.3em] font-bold"
                            >
                                LOG OUT
                            </button>
                        </div>
                    </aside>

                    {/* 3. CONTENT_AREA */}
                    <div className="lg:col-span-9">
                        <AnimatePresence mode="wait">
                            {activeTab === 'history' && (
                                <motion.div
                                    key="history"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="flex items-center justify-between mb-8">
                                        <h2 className="text-3xl font-black uppercase italic text-white flex items-center gap-4 tracking-[0.1em]">
                                            ORDER HISTORY <span className="text-white/40 font-mono text-sm font-normal tracking-[0.1em]">[{orderHistory.length} ORDERS]</span>
                                        </h2>
                                    </div>

                                    {orderHistory.length > 0 ? (
                                        <div className="space-y-4">
                                            {orderHistory.map((order) => (
                                                <div key={order.id} className="bg-white/[0.02] border border-white/10 p-6 group hover:border-brand-volt/40 transition-all">
                                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                                        <div className="space-y-2">
                                                            <div className="flex items-center gap-4">
                                                                <span className="text-[13px] font-black uppercase tracking-[0.3em] text-white">#{order.id}</span>
                                                                <span className="px-2 py-0.5 bg-brand-volt/20 text-brand-volt text-[12px] font-mono uppercase tracking-[0.2em] border border-brand-volt/40 font-bold">
                                                                    {order.status}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-4 text-[12px] font-mono text-white/30 uppercase tracking-[0.2em]">
                                                                <span className="flex items-center gap-1"><Clock size={12} /> {new Date(order.date || order.createdAt || "2024-01-01T00:00:00Z").toLocaleDateString()}</span>
                                                                <span className="flex items-center gap-1"><Package size={12} /> {(order.items || order.orderItems || []).length} Items</span>
                                                            </div>
                                                        </div>

                                                        <div className="text-right">
                                                            <div className="text-lg font-black italic text-white group-hover:text-brand-volt transition-colors tracking-[0.1em]">
                                                                <FormattedPrice amount={order.totalPrice || order.totals?.total || 0} />
                                                            </div>
                                                            <Link 
                                                                href={`/order-track?id=${order._id || order.id}&phone=${order.shippingAddress?.phone || ""}`} 
                                                                className="text-[12px] font-mono text-white hover:text-brand-volt uppercase tracking-[0.3em] mt-2 block font-bold"
                                                            >
                                                                Track Order
                                                            </Link>
                                                        </div>
                                                    </div>

                                                    {/* MINI_ITEM_PREVIEW */}
                                                    <div className="mt-6 pt-6 border-t border-white/5 flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                                                        {(order.items || order.orderItems || []).map((item: Record<string, unknown>, i: number) => (
                                                            <div key={i} className="w-12 h-16 bg-black border border-white/10 shrink-0">
                                                                <img src={item.image} alt="" className="w-full h-full object-cover opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all" />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="py-20 text-center border-2 border-dashed border-white/5 bg-white/[0.01]">
                                            <p className="font-mono text-xs text-white/20 uppercase tracking-[0.4em]">You haven&apos;t placed any orders yet.</p>
                                            <Link href="/shop" className="inline-block mt-8 text-brand-volt font-mono text-[12px] uppercase tracking-[0.4em] border border-brand-volt/20 px-6 py-2 hover:bg-brand-volt/10 font-bold">
                                                Start Shopping
                                            </Link>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {activeTab === 'comms' && (
                                <motion.div
                                    key="comms"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <h2 className="text-2xl font-black uppercase italic text-white flex items-center gap-4 mb-8 tracking-[0.2em]">
                                        MESSAGES <Radio className="text-brand-volt animate-pulse" size={20} />
                                    </h2>

                                    <div className="space-y-4">
                                        {transmissions.length > 0 ? (
                                            transmissions.map((msg) => (
                                                <div key={msg.id} className="bg-white/[0.02] border-l-2 border-brand-volt p-6 space-y-3">
                                                    <div className="flex justify-between items-start">
                                                        <span className="text-[12px] font-mono text-brand-volt uppercase tracking-[0.2em] font-bold">{msg.subject}</span>
                                                        <span className="text-[12px] font-mono text-white/40 uppercase tracking-[0.2em]">{new Date(msg.date).toLocaleTimeString()}</span>
                                                    </div>
                                                    <p className="text-[13px] font-mono text-white/60 leading-relaxed uppercase tracking-[0.2em]">
                                                        {msg.body}
                                                    </p>
                                                    <div className="flex items-center gap-4 pt-2">
                                                        <span className={`text-[12px] font-mono px-2 py-0.5 uppercase border tracking-[0.2em] ${msg.priority === 'High' ? 'border-red-500/60 text-red-500' : 'border-white/20 text-white/50'}`}>
                                                            Priority: {msg.priority}
                                                        </span>
                                                        <span className="text-[12px] font-mono text-white/40 uppercase tracking-[0.2em]">Source: KAVON_SUPPORT</span>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="py-20 text-center border-2 border-dashed border-white/5 bg-white/[0.01]">
                                                <p className="font-mono text-xs text-white/20 uppercase tracking-[0.4em]">No messages yet.</p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'intel' && (
                                <motion.div
                                    key="intel"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="grid grid-cols-1 md:grid-cols-2 gap-8"
                                >
                                    {/* ADDRESS_MANAGEMENT */}
                                    <div className="bg-white/[0.02] border border-white/10 p-8 space-y-6">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-black uppercase italic text-white flex items-center gap-3 tracking-[0.2em]">
                                                <MapPin size={18} className="text-brand-volt" /> Shipping Address
                                            </h3>
                                            <button className="text-[12px] font-mono text-brand-volt uppercase tracking-[0.3em] hover:underline font-bold bg-brand-volt/10 px-3 py-1 border border-brand-volt/20">Update</button>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="p-4 bg-black/40 border border-white/5">
                                                <span className="text-[12px] font-mono text-white/40 uppercase block mb-1 tracking-[0.3em]">Primary Address</span>
                                                <p className="text-[13px] font-mono text-white uppercase tracking-[0.1em]">No address saved yet</p>
                                            </div>
                                            <button className="w-full py-4 border border-white/20 text-[12px] font-mono text-white hover:bg-white/5 transition-all uppercase tracking-[0.2em] font-bold">
                                                + Add New Address
                                            </button>
                                        </div>
                                    </div>

                                    {/* PAYMENT_METHODS */}
                                    <div className="bg-white/[0.02] border border-white/10 p-8 space-y-6">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-black uppercase italic text-white flex items-center gap-3 tracking-[0.2em]">
                                                <CreditCard size={18} className="text-brand-volt" /> Payment Methods
                                            </h3>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="p-10 text-center border border-dashed border-white/5">
                                                <p className="text-[12px] font-mono text-white/20 uppercase tracking-[0.3em]">No payment methods linked</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </main>
    );
}