"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getPublicTracking } from '@/lib/api';
import { Shield, Package, Truck, Clock, CheckCircle2 } from 'lucide-react';
import { TrackingTimeline, Stage } from '@/components/tracking/TrackingTimeline';
import Link from 'next/link';
import type { StoreOrder } from '@/types/order';

export default function PublicTrackingPage() {
    const { trackingId } = useParams();
    const [order, setOrder] = useState<StoreOrder | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTracking = async () => {
            try {
                const data = await getPublicTracking(trackingId as string);
                setOrder(data);
            } catch (error: unknown) {
                setError(error instanceof Error ? error.message : 'Tracking ID Not Found');
            } finally {
                setLoading(false);
            }
        };

        if (trackingId) {
            fetchTracking();
        }
    }, [trackingId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center pt-24">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-volt border-t-transparent" />
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-black pt-40 px-6">
                <div className="max-w-2xl mx-auto text-center space-y-6">
                    <Package size={48} className="text-white/20 mx-auto" />
                    <h1 className="text-3xl font-black italic uppercase text-white tracking-widest">Tracking Not Found</h1>
                    <p className="text-white/50 font-mono text-sm uppercase tracking-widest">{error || "Invalid Tracking Code"}</p>
                    <Link href="/" className="inline-block mt-8 text-brand-volt font-mono text-[12px] uppercase tracking-[0.4em] border border-brand-volt/20 px-6 py-3 hover:bg-brand-volt/10 font-bold">
                        Return Home
                    </Link>
                </div>
            </div>
        );
    }

    // Determine timeline states based on the new statuses
    const stages: Stage[] = [
        { 
            id: '1', 
            label: 'Order Placed', 
            status: order.status === 'Order Placed' ? 'current' : 'completed', 
            date: new Date(order.statusHistory?.find((entry) => entry.status === 'Order Placed' || entry.status === 'Confirmed')?.timestamp || order.updatedAt).toLocaleDateString(), 
            icon: <CheckCircle2 size={18} /> 
        },
        { 
            id: '2', 
            label: 'Processing', 
            status: ['Confirmed', 'Processing', 'Packed'].includes(order.status) ? 'current' : (['Shipped', 'Out for Delivery', 'Delivered'].includes(order.status) ? 'completed' : 'pending'), 
            date: ['Shipped', 'Out for Delivery', 'Delivered'].includes(order.status) ? 'DONE' : 'ACTIVE', 
            icon: <Package size={18} /> 
        },
        { 
            id: '3', 
            label: 'Shipped', 
            status: ['Shipped'].includes(order.status) ? 'current' : (['Out for Delivery', 'Delivered'].includes(order.status) ? 'completed' : 'pending'), 
            date: ['Out for Delivery', 'Delivered'].includes(order.status) ? 'DONE' : '--', 
            icon: <Truck size={18} /> 
        },
        { 
            id: '4', 
            label: order.status === 'Cancelled' ? 'Cancelled' : (order.status === 'Returned' ? 'Returned' : 'Delivered'), 
            status: order.status === 'Out for Delivery' ? 'current' : (['Delivered', 'Cancelled', 'Returned'].includes(order.status) ? 'completed' : 'pending'), 
            date: ['Delivered', 'Cancelled', 'Returned'].includes(order.status) ? new Date(order.updatedAt).toLocaleDateString() : 'Pending', 
            icon: ['Cancelled', 'Returned'].includes(order.status) ? <Shield size={18} className="text-red-500" /> : <CheckCircle2 size={18} /> 
        },
    ];

    return (
        <main className="min-h-screen bg-black pt-32 pb-20 px-6">
            <div className="max-w-3xl mx-auto space-y-8">
                
                <header className="border-b border-white/10 pb-8 space-y-4 text-center">
                    <Shield size={32} className="text-brand-volt mx-auto mb-4" />
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-brand-volt/10 text-brand-volt text-[11px] font-mono font-bold uppercase tracking-widest border border-brand-volt/20">
                            {order.status}
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-white">
                        <span className="text-white/40 font-mono text-sm block mb-2 tracking-[0.4em] not-italic font-normal">Tracking ID</span>
                        {order.trackingId}
                    </h1>
                    <p className="text-[12px] font-mono text-white/40 uppercase tracking-widest mt-4">
                        <Clock size={12} className="inline mr-1" />
                        Last Update: {new Date(order.updatedAt).toLocaleString()}
                    </p>
                </header>

                <div className="space-y-8">
                    {/* Timeline */}
                    <div className="bg-white/[0.02] border border-white/5 p-8">
                        <h2 className="text-[13px] font-mono text-white/60 uppercase tracking-widest mb-8 text-center">Deployment Status</h2>
                        <TrackingTimeline stages={stages} />
                    </div>

                    {/* Items */}
                    <div className="bg-white/[0.02] border border-white/5 p-8 space-y-6">
                        <h2 className="text-[13px] font-mono text-white/60 uppercase tracking-widest">Acquired Assets</h2>
                        <div className="space-y-4">
                            {order.orderItems.map((item, i: number) => (
                                <div key={i} className="flex gap-4 p-4 border border-white/5 bg-black/40 items-center justify-between">
                                    <div>
                                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">{item.name}</h3>
                                        <p className="text-[11px] font-mono text-white/40 uppercase tracking-widest mt-1">
                                            Size: {item.size} | Color: {item.color}
                                        </p>
                                    </div>
                                    <Shield size={16} className="text-brand-volt/30" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="text-center pt-8 border-t border-white/10">
                    <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest">
                        For security, this page hides all personal and payment information.
                    </p>
                </div>
            </div>
        </main>
    );
}
