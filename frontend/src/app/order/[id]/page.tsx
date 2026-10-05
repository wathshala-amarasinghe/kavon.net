"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getOrderById } from '@/lib/api';
import { FormattedPrice } from '@/components/ui/FormattedPrice';
import Link from 'next/link';
import { Shield, Package, ArrowLeft, Truck, Clock, CheckCircle2 } from 'lucide-react';
import { TrackingTimeline, Stage } from '@/components/tracking/TrackingTimeline';
import type { StoreOrder } from '@/types/order';

export default function OrderDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    
    const [order, setOrder] = useState<StoreOrder | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrder = async () => {
            if (authLoading) return;
            
            if (!user) {
                router.push('/login');
                return;
            }

            try {
                const token = localStorage.getItem('kavon-token-v1');
                if (!token) throw new Error('Authorization required');
                
                const data = await getOrderById(id as string, token);
                setOrder(data);
            } catch (error: unknown) {
                setError(error instanceof Error ? error.message : 'Failed to load order data');
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id, user, authLoading, router]);

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center pt-24">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-volt border-t-transparent" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-black pt-40 px-6">
                <div className="max-w-2xl mx-auto text-center space-y-6">
                    <Shield size={48} className="text-red-500 mx-auto" />
                    <h1 className="text-3xl font-black italic uppercase text-white tracking-widest">Access Denied</h1>
                    <p className="text-white/50 font-mono text-sm uppercase tracking-widest">{error}</p>
                    <Link href="/dashboard" className="inline-block mt-8 text-brand-volt font-mono text-[12px] uppercase tracking-[0.4em] border border-brand-volt/20 px-6 py-3 hover:bg-brand-volt/10 font-bold">
                        Return to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    if (!order) return null;

    // Build timeline stages based on order status
    const stages: Stage[] = [
        { 
            id: '1', 
            label: 'Order Confirmed', 
            status: 'completed', 
            date: new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), 
            icon: <CheckCircle2 size={18} /> 
        },
        { 
            id: '2', 
            label: 'Processing', 
            status: order.status === 'Authorized' ? 'current' : 'completed', 
            date: order.status === 'Authorized' ? 'ACTIVE' : 'DONE', 
            icon: <Package size={18} /> 
        },
        { 
            id: '3', 
            label: 'Shipped', 
            status: order.status === 'Processing' ? 'current' : (['Shipped', 'Out for Delivery', 'Delivered'].includes(order.status) ? 'completed' : 'pending'), 
            date: ['Shipped', 'Out for Delivery', 'Delivered'].includes(order.status) ? 'SHIPPED' : '--', 
            icon: <Truck size={18} /> 
        },
        { 
            id: '4', 
            label: 'Delivered', 
            status: order.status === 'Out for Delivery' ? 'current' : (order.status === 'Delivered' ? 'completed' : 'pending'), 
            date: order.status === 'Delivered' ? (order.deliveredAt ? new Date(order.deliveredAt).toLocaleDateString() : 'Yes') : 'Pending', 
            icon: <CheckCircle2 size={18} /> 
        },
    ];

    return (
        <main className="min-h-screen bg-black pt-32 pb-20 px-6">
            <div className="max-w-4xl mx-auto space-y-8">
                <Link href="/dashboard" className="inline-flex items-center gap-2 text-[11px] font-mono text-white/40 hover:text-brand-volt uppercase tracking-widest transition-colors mb-4">
                    <ArrowLeft size={14} /> Back to Dashboard
                </Link>

                <header className="border-b border-white/10 pb-8 space-y-2">
                    <div className="flex items-center gap-3">
                        <span className="px-2 py-1 bg-brand-volt/10 text-brand-volt text-[10px] font-mono font-bold uppercase tracking-widest border border-brand-volt/20">
                            {order.status}
                        </span>
                        <span className="text-[12px] font-mono text-white/40 uppercase tracking-widest">
                            <Clock size={12} className="inline mr-1" />
                            {new Date(order.createdAt).toLocaleString()}
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-white">
                        Order <span className="text-brand-volt">#{order._id}</span>
                    </h1>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-8">
                        {/* Timeline */}
                        <div className="bg-white/[0.02] border border-white/5 p-8">
                            <h2 className="text-[13px] font-mono text-white/60 uppercase tracking-widest mb-8">Deployment Status</h2>
                            <TrackingTimeline stages={stages} />
                        </div>

                        {/* Items */}
                        <div className="bg-white/[0.02] border border-white/5 p-8 space-y-6">
                            <h2 className="text-[13px] font-mono text-white/60 uppercase tracking-widest">Acquired Assets</h2>
                            <div className="space-y-4">
                                {order.orderItems.map((item, i: number) => (
                                    <div key={i} className="flex gap-4 p-4 border border-white/5 bg-black/40">
                                        <div className="w-20 h-24 bg-black flex-shrink-0 border border-white/10">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover opacity-80" />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <h3 className="text-sm font-bold text-white uppercase tracking-wider">{item.name}</h3>
                                                <p className="text-[11px] font-mono text-white/40 uppercase tracking-widest mt-1">
                                                    Size: {item.size} | Color: {item.color}
                                                </p>
                                            </div>
                                            <div className="flex justify-between items-end">
                                                <span className="text-[12px] font-mono text-brand-volt">Qty: {item.quantity}</span>
                                                <span className="text-sm font-black italic text-white"><FormattedPrice amount={item.price} /></span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {/* Summary */}
                        <div className="bg-white/[0.02] border border-white/5 p-8 space-y-6">
                            <h2 className="text-[13px] font-mono text-white/60 uppercase tracking-widest">Order Summary</h2>
                            <div className="space-y-3 font-mono text-[12px] uppercase tracking-widest text-white/60">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span className="text-white"><FormattedPrice amount={order.itemsPrice} /></span>
                                </div>
                                <div className="flex justify-between text-brand-volt">
                                    <span>Discount</span>
                                    <span>-<FormattedPrice amount={order.discountPrice} /></span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Delivery Fee</span>
                                    <span className="text-white"><FormattedPrice amount={order.shippingPrice} /></span>
                                </div>
                                <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                                    <span className="text-white">Total</span>
                                    <span className="text-xl font-black italic text-brand-volt leading-none"><FormattedPrice amount={order.totalPrice} /></span>
                                </div>
                            </div>
                        </div>

                        {/* Logistics */}
                        <div className="bg-white/[0.02] border border-white/5 p-8 space-y-6">
                            <h2 className="text-[13px] font-mono text-white/60 uppercase tracking-widest">Logistics</h2>
                            
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">Destination</h3>
                                    <p className="text-xs font-mono text-white/80 uppercase leading-relaxed">
                                        {order.shippingAddress.fullName}<br/>
                                        {order.shippingAddress.address}<br/>
                                        {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br/>
                                        {order.shippingAddress.country}<br/>
                                        {order.shippingAddress.phone}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">Payment Method</h3>
                                    <p className="text-xs font-mono text-white/80 uppercase">
                                        {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Credit Card'}
                                    </p>
                                </div>
                                
                                <div>
                                    <h3 className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">Delivery Method</h3>
                                    <p className="text-xs font-mono text-white/80 uppercase">
                                        {order.deliveryMethod}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
