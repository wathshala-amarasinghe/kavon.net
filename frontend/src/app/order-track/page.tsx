"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Package, Truck, Navigation, CheckCircle2, AlertCircle } from 'lucide-react';
import { Stage, TrackingTimeline } from "@/components/tracking/TrackingTimeline";
import { trackOrder } from '@/lib/api';
import { useSearchParams } from 'next/navigation';

interface TrackedOrder {
    _id: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    shippingAddress: { city: string };
}

interface TrackingResult {
    id: string;
    status: string;
    destination: string;
    estDelivery: string;
    stages: Stage[];
}

function TrackingContent() {
    const searchParams = useSearchParams();
    const [orderId, setOrderId] = useState(searchParams.get('id') || "");
    const [phone, setPhone] = useState(searchParams.get('phone') || "");
    const [isSearching, setIsSearching] = useState(false);
    const [trackingData, setTrackingData] = useState<TrackingResult | "NOT_FOUND" | null>(null);

    const mapAndSetData = (data: TrackedOrder) => {
        const stages: Stage[] = [
            { 
                id: '1', 
                label: 'Order Confirmed', 
                status: 'completed' as const, 
                date: new Date(data.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), 
                icon: <CheckCircle2 size={18} /> 
            },
            { 
                id: '2', 
                label: 'Processing', 
                status: data.status === 'Authorized' ? 'current' as const : 'completed' as const, 
                date: data.status === 'Authorized' ? 'ACTIVE' : 'DONE', 
                icon: <Package size={18} /> 
            },
            { 
                id: '3', 
                label: 'Shipped', 
                status: data.status === 'Processing' ? 'current' as const : (['Shipped', 'Out for Delivery', 'Delivered'].includes(data.status) ? 'completed' as const : 'pending' as const), 
                date: ['Shipped', 'Out for Delivery', 'Delivered'].includes(data.status) ? 'SHIPPED' : '--', 
                icon: <Truck size={18} /> 
            },
            { 
                id: '4', 
                label: 'Delivered', 
                status: data.status === 'Out for Delivery' ? 'current' as const : (data.status === 'Delivered' ? 'completed' as const : 'pending' as const), 
                date: data.status === 'Delivered' ? new Date(data.updatedAt).toLocaleDateString() : 'Pending', 
                icon: <Navigation size={18} /> 
            },
        ];

        setTrackingData({
            id: data._id,
            status: data.status,
            destination: data.shippingAddress.city,
            estDelivery: "See Timeline",
            stages
        });
    };

    useEffect(() => {
        const id = searchParams.get('id');
        const ph = searchParams.get('phone');
        if (id && ph) {
            const autoSearch = async () => {
                setIsSearching(true);
                try {
                    const data = await trackOrder(id, ph) as TrackedOrder;
                    mapAndSetData(data);
                } catch (e) {
                    setTrackingData("NOT_FOUND");
                } finally {
                    setIsSearching(false);
                }
            };
            autoSearch();
        }
    }, [searchParams]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSearching(true);
        setTrackingData(null);

        try {
            const data = await trackOrder(orderId.trim(), phone.trim()) as TrackedOrder;
            mapAndSetData(data);
        } catch (error: unknown) {
            setTrackingData("NOT_FOUND");
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <main className="pt-44 pb-20 px-6 max-w-[1400px] mx-auto">
            <header className="mb-12 border-l-2 border-brand-volt pl-8">
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                    <span className="font-mono text-[11px] tracking-[0.4em] text-white/50 uppercase mb-2 block">
                        SYSTEM SYNC / TRACK
                    </span>
                    <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-[0.05em]">
                        ORDER TRACKING
                    </h1>
                </motion.div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                <div className="lg:col-span-5 space-y-8">
                    <div className="bg-white/[0.02] border border-white/5 p-8 space-y-8">
                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold uppercase italic tracking-[0.1em]">Track Your Order</h3>
                            <p className="text-[13px] font-mono text-white/60 uppercase tracking-[0.1em] leading-relaxed">
                                Enter your order ID and phone number to see your delivery status.
                            </p>
                        </div>

                        <form onSubmit={handleSearch} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[11px] font-mono text-white/60 uppercase tracking-[0.2em]">ORDER ID</label>
                                <input
                                    required
                                    type="text"
                                    value={orderId}
                                    onChange={(e) => setOrderId(e.target.value)}
                                    placeholder="PASTE YOUR ORDER ID"
                                    className="w-full bg-white/5 border border-white/10 p-6 font-mono text-sm tracking-[0.1em] focus:border-brand-volt outline-none text-white uppercase placeholder:opacity-20"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-mono text-white/60 uppercase tracking-[0.2em]">MOBILE NUMBER</label>
                                <input
                                    required
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="+94 XX XXX XXXX"
                                    className="w-full bg-white/5 border border-white/10 p-6 font-mono text-sm tracking-[0.1em] focus:border-brand-volt outline-none text-white placeholder:opacity-20"
                                />
                            </div>
                            <button
                                disabled={isSearching}
                                className="w-full py-7 bg-white text-black font-black uppercase text-[13px] tracking-[0.3em] hover:bg-brand-volt transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95 shadow-xl"
                            >
                                {isSearching ? "Searching..." : "Track Order"} <Search size={18} />
                            </button>
                        </form>
                    </div>
                </div>

                <div className="lg:col-span-7">
                    <AnimatePresence mode="wait">
                        {!trackingData ? (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="h-[400px] border border-dashed border-white/5 flex flex-col items-center justify-center text-center p-8 space-y-4"
                            >
                                <Package size={48} className="text-white/10" />
                                <p className="text-[12px] font-mono text-white/20 uppercase tracking-[0.4em]">Enter your order ID to get started</p>
                            </motion.div>
                        ) : trackingData === "NOT_FOUND" ? (
                            <motion.div
                                key="error"
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                className="bg-red-500/10 border border-red-500/20 p-8 flex items-start gap-4"
                            >
                                <AlertCircle className="text-red-500 shrink-0" />
                                <div className="space-y-1">
                                    <h4 className="font-bold uppercase text-red-500 text-sm tracking-[0.2em]">Order Not Found</h4>
                                    <p className="text-[12px] font-mono text-white/60 uppercase leading-relaxed tracking-[0.1em]">The order ID provided could not be found. Please check your order ID and phone number and try again.</p>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="results"
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                className="space-y-8"
                            >
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-6 bg-white/[0.02] border border-white/5 space-y-1">
                                        <p className="text-[12px] font-mono text-white/40 uppercase tracking-[0.4em]">Order Status</p>
                                        <p className="text-xl font-black italic uppercase text-brand-volt tracking-[0.15em]">{trackingData.status}</p>
                                    </div>
                                    <div className="p-6 bg-white/[0.02] border border-white/5 space-y-1">
                                        <p className="text-[12px] font-mono text-white/40 uppercase tracking-[0.4em]">Est. Delivery</p>
                                        <p className="text-xl font-black italic uppercase text-white tracking-[0.15em]">{trackingData.estDelivery}</p>
                                    </div>
                                </div>

                                <div className="bg-white/[0.02] border border-white/5 p-8">
                                    <div className="flex items-center gap-2 mb-8 border-b border-white/5 pb-4">
                                        <Navigation size={14} className="text-brand-volt" />
                                        <span className="text-[12px] font-mono text-white uppercase tracking-[0.3em]">Delivery Timeline / {trackingData.id}</span>
                                    </div>
                                    <TrackingTimeline stages={trackingData.stages} />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </main>
    );
}

export default function OrderTrackPage() {
    return (
        <div className="bg-brand-black min-h-screen text-white selection:bg-brand-volt">
            <Suspense fallback={<div className="pt-44 text-center font-mono text-[12px] uppercase tracking-widest animate-pulse text-brand-volt">Loading tracker...</div>}>
                <TrackingContent />
            </Suspense>
        </div>
    );
}
