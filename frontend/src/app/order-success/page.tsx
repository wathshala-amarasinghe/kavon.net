"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Package, Truck, ArrowRight, ShieldCheck, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { Order } from '@/context/AuthContext';

export default function OrderSuccessPage() {
    const [order, setOrder] = useState<Order | null>(null);

    useEffect(() => {
        const saved = sessionStorage.getItem('kavon_last_order');
        if (saved) {
            setTimeout(() => setOrder(JSON.parse(saved)), 0);
        }
    }, []);

    const getDeliveryDate = () => {
        const date = new Date();
        date.setDate(date.getDate() + 5);
        return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    };

    if (!order) return <div className="min-h-screen bg-black" />;

    return (
        <div className="bg-brand-black min-h-screen text-white selection:bg-brand-volt">
            <main className="pt-44 pb-20 px-6 max-w-[1000px] mx-auto">
                <div className="text-center space-y-6 mb-16">
                    <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-20 h-20 bg-brand-volt rounded-full mx-auto flex items-center justify-center text-black shadow-[0_0_30px_rgba(223, 7, 21,0.4)]"
                    >
                        <CheckCircle2 size={40} strokeWidth={2.5} />
                    </motion.div>
                    <div className="space-y-2">
                        <span className="font-mono text-[10px] tracking-[0.6em] text-brand-volt uppercase">Mission_Accomplished</span>
                        <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-wider">Order_Authorized</h1>
                    </div>
                    <p className="text-white/40 font-mono text-[11px] uppercase tracking-widest max-w-md mx-auto">
                        Your assets have been locked in the deployment manifest. Initial processing has commenced at Node 07.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    {/* Left: Summary */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white/[0.02] border border-white/5 p-8 space-y-8"
                    >
                        <div className="flex justify-between items-center border-b border-white/5 pb-4">
                            <h3 className="font-black italic uppercase text-lg tracking-widest">Manifest_ID</h3>
                            <span className="text-brand-volt font-mono font-bold tracking-widest">{order._id || order.id}</span>
                        </div>

                        <div className="space-y-6">
                            {(order.orderItems || order.items || []).map((item, idx: number) => (
                                <div key={idx} className="flex gap-4">
                                    <div className="w-16 h-20 bg-brand-surface border border-white/10 shrink-0">
                                        { }
<img src={item.image || ""} className="w-full h-full object-cover" alt="" />
                                    </div>
                                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                                        <h4 className="text-[11px] font-black uppercase truncate tracking-widest">{item.name}</h4>
                                        <p className="text-[9px] font-mono text-white/40 uppercase mt-1 tracking-widest">Size: {item.size} {"//"} Qty: {item.quantity}</p>
                                    </div>
                                    <div className="flex flex-col justify-center text-right">
                                        <span className="text-xs font-mono font-bold tracking-widest">LKR {((item.price || 0) * (item.quantity || 0)).toLocaleString()}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-white/5 pt-6 space-y-3 font-mono text-[10px] uppercase tracking-widest">
                            <div className="flex justify-between text-white/40">
                                <span>Subtotal</span>
                                <span>LKR {(order.itemsPrice || order.totals?.subtotal || 0).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-white/40">
                                <span>Logistics_Fee</span>
                                <span>LKR {(order.shippingPrice || order.totals?.shipping || 0).toLocaleString()}</span>
                            </div>
                            {((order.discountPrice || order.totals?.discount || 0) > 0) && (
                                <div className="flex justify-between text-brand-volt">
                                    <span>Discount</span>
                                    <span>-LKR {(order.discountPrice || order.totals?.discount || 0).toLocaleString()}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-lg font-black italic text-brand-volt pt-2 border-t border-white/5 tracking-widest">
                                <span>Total_Paid</span>
                                <span>LKR {(order.totalPrice || order.totals?.total || 0).toLocaleString()}</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right: Logistics */}
                    <div className="space-y-8">
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white/[0.02] border border-white/5 p-8 space-y-6"
                        >
                            <div className="flex items-center gap-3 text-brand-volt">
                                <Truck size={18} />
                                <h3 className="font-black italic uppercase text-lg tracking-widest">Deployment_Intel</h3>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center shrink-0">
                                        <Package size={14} className="text-white/40" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[11px] font-bold uppercase tracking-widest">Estimated_Arrival</p>
                                        <p className="text-xl font-heading italic text-white tracking-widest">{getDeliveryDate()}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center shrink-0">
                                        <ShieldCheck size={14} className="text-white/40" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[11px] font-bold uppercase tracking-widest">Security_Protocol</p>
                                        <p className="text-[10px] font-mono text-white/40 uppercase leading-relaxed tracking-wider">
                                            A tracking link will be transmitted to your terminal once the asset leaves the vault.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <Link 
                                href="/order-track" 
                                className="w-full py-5 border border-white/10 text-white font-black uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-white hover:text-black transition-all"
                            >
                                Track_Live_Deployment <ExternalLink size={14} />
                            </Link>
                        </motion.div>

                        <div className="space-y-4">
                            <Link 
                                href="/shop" 
                                className="w-full py-6 bg-brand-volt text-black font-black uppercase text-xs tracking-[0.4em] flex items-center justify-center gap-3 hover:brightness-110 transition-all"
                            >
                                Return_To_Base <ArrowRight size={16} />
                            </Link>
                            <p className="text-center text-[9px] font-mono text-white/20 uppercase tracking-widest leading-relaxed px-10">
                                Note: Cancellations are only possible within 2 hours of deployment authorization.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
