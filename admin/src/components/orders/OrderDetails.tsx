"use client";

import React, { useState } from 'react';
import { X, Package, MapPin, Phone, User, Calendar, CreditCard, ExternalLink, ShieldCheck, Truck, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FormattedPrice } from '@/components/ui/FormattedPrice';
import { updateOrderTracking } from '@/lib/api';
import toast from 'react-hot-toast';

interface OrderDetailsProps {
    isOpen: boolean;
    onClose: () => void;
    order: any;
    onUpdate?: () => void;
}

export default function OrderDetails({ isOpen, onClose, order, onUpdate }: OrderDetailsProps) {
    const [trackingNumber, setTrackingNumber] = useState(order?.trackingNumber || "");
    const [carrier, setCarrier] = useState(order?.carrier || "");
    const [isUpdating, setIsUpdating] = useState(false);

    if (!isOpen || !order) return null;

    const handleUpdateTracking = async () => {
        setIsUpdating(true);
        try {
            const token = localStorage.getItem('kavon-admin-token') || "";
            await updateOrderTracking(order._id, { trackingNumber, carrier }, token);
            toast.success("TRACKING_METADATA_UPDATED");
            if (onUpdate) onUpdate();
        } catch (error: unknown) {
            toast.error(error instanceof Error ? error.message : "UPDATE_FAILURE");
        } finally {
            setIsUpdating(false);
        }
    };

    const statusColors: any = {
        'Authorized': 'text-purple-500 border-purple-500/30 bg-purple-500/10',
        'Processing': 'text-blue-500 border-blue-500/30 bg-blue-500/10',
        'Shipped': 'text-indigo-500 border-indigo-500/30 bg-indigo-500/10',
        'Out for Delivery': 'text-cyan-500 border-cyan-500/30 bg-cyan-500/10',
        'Ready for Pickup': 'text-orange-500 border-orange-500/30 bg-orange-500/10',
        'Delivered': 'text-brand-volt border-brand-volt/30 bg-brand-volt/10',
        'Cancelled': 'text-red-500 border-red-500/30 bg-red-500/10',
        'Refunded': 'text-pink-500 border-pink-500/30 bg-pink-500/10'
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/95 backdrop-blur-xl" 
                />
                
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="w-full max-w-5xl bg-brand-black border border-white/10 relative z-10 overflow-hidden flex flex-col max-h-[90vh] shadow-[0_0_50px_rgba(0,0,0,1)]"
                >
                    {/* Tactical Header */}
                    <div className="p-10 border-b border-white/5 flex justify-between items-start bg-white/[0.02]">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-brand-volt/10 border border-brand-volt/20 rounded-sm">
                                    <Package className="text-brand-volt" size={24} />
                                </div>
                                <div className="space-y-1">
                                    <span className="font-mono text-[10px] text-brand-volt uppercase tracking-[0.4em]">Manifest_ID / Secured</span>
                                    <h2 className="text-3xl font-black italic uppercase tracking-tighter">KVN-{order._id.slice(-8).toUpperCase()}</h2>
                                </div>
                            </div>
                            <div className={`inline-flex items-center gap-2 px-4 py-1.5 border font-mono text-[10px] uppercase tracking-widest ${statusColors[order.status] || 'text-white/40 border-white/10 bg-white/5'}`}>
                                <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                                    order.status === 'Delivered' ? 'bg-brand-volt' : 
                                    order.status === 'Authorized' ? 'bg-purple-500' :
                                    order.status === 'Processing' ? 'bg-blue-500' : 
                                    order.status === 'Shipped' ? 'bg-indigo-500' :
                                    order.status === 'Out for Delivery' ? 'bg-cyan-500' :
                                    order.status === 'Ready for Pickup' ? 'bg-orange-500' :
                                    order.status === 'Cancelled' ? 'bg-red-500' :
                                    order.status === 'Refunded' ? 'bg-pink-500' :
                                    'bg-white/40'
                                }`} />
                                {order.status}
                            </div>
                        </div>
                        <button onClick={onClose} className="p-3 hover:bg-white/10 text-white/40 hover:text-white transition-all">
                            <X size={28} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-10 grid grid-cols-1 lg:grid-cols-12 gap-12 custom-scrollbar">
                        {/* Order Items */}
                        <div className="lg:col-span-7 space-y-10">
                            <h3 className="font-black italic uppercase tracking-wider text-white/60 border-l-2 border-brand-volt pl-4">Asset_Breakdown</h3>
                            <div className="space-y-4">
                                {order.orderItems.map((item: any, idx: number) => (
                                    <div key={idx} className="flex items-center gap-6 p-6 bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
                                        <div className="w-20 h-24 bg-white/5 border border-white/10 shrink-0 overflow-hidden">
                                            <img src={item.image} className="w-full h-full object-cover opacity-80" alt="" />
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <p className="font-black text-sm uppercase tracking-wider">{item.name}</p>
                                            <p className="font-mono text-[10px] text-white/40 uppercase">Size: {item.size} / Qty: {item.quantity}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-mono text-sm font-bold text-brand-volt">LKR {item.price.toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="p-8 bg-brand-volt/5 border border-brand-volt/10 space-y-4">
                                <div className="flex justify-between font-mono text-[11px] text-white/40 uppercase tracking-widest">
                                    <span>Subtotal</span>
                                    <span>LKR {order.itemsPrice.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between font-mono text-[11px] text-white/40 uppercase tracking-widest">
                                    <span>Logistics_Fee</span>
                                    <span>LKR {order.shippingPrice.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between border-t border-white/10 pt-4">
                                    <span className="font-black italic uppercase text-lg">Total_Valuation</span>
                                    <span className="font-black text-xl text-brand-volt">LKR {order.totalPrice.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Logistics Intel */}
                        <div className="lg:col-span-5 space-y-8">
                            <div className="p-8 tactical-glass space-y-6">
                                <h3 className="font-black italic uppercase tracking-wider text-white/60">Logistics_Protocol</h3>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="font-mono text-[9px] text-white/40 uppercase tracking-widest">Tracking_ID</label>
                                        <input 
                                            type="text" 
                                            value={trackingNumber}
                                            onChange={(e) => setTrackingNumber(e.target.value)}
                                            className="w-full bg-black/40 border border-white/5 p-3 font-mono text-xs uppercase focus:border-brand-volt outline-none"
                                            placeholder="UNASSIGNED"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="font-mono text-[9px] text-white/40 uppercase tracking-widest">Carrier_Node</label>
                                        <input 
                                            type="text" 
                                            value={carrier}
                                            onChange={(e) => setCarrier(e.target.value)}
                                            className="w-full bg-black/40 border border-white/5 p-3 font-mono text-xs uppercase focus:border-brand-volt outline-none"
                                            placeholder="UNASSIGNED"
                                        />
                                    </div>
                                    <button 
                                        onClick={handleUpdateTracking}
                                        disabled={isUpdating}
                                        className="w-full py-3 bg-brand-volt text-black font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:brightness-110 transition-all disabled:opacity-50"
                                    >
                                        <Save size={14} /> {isUpdating ? 'SYNCHRONIZING...' : 'UPDATE_LOGISTICS_INTEL'}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-8 p-8 tactical-glass">
                                <h3 className="font-black italic uppercase tracking-wider text-white/60">Operator_Intel</h3>
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <User size={18} className="text-brand-volt mt-1" />
                                        <div className="space-y-1">
                                            <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest">Designation</p>
                                            <p className="font-bold text-sm uppercase">{order.user?.name || "GUEST_OPERATOR"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <Phone size={18} className="text-brand-volt mt-1" />
                                        <div className="space-y-1">
                                            <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest">Comms_Channel</p>
                                            <p className="font-bold text-sm">{order.shippingAddress.phone}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8 p-8 tactical-glass">
                                <h3 className="font-black italic uppercase tracking-wider text-white/60">Deployment_Coordinates</h3>
                                <div className="flex items-start gap-4">
                                    <MapPin size={18} className="text-brand-volt mt-1" />
                                    <div className="space-y-2">
                                        <p className="font-mono text-[11px] text-white/90 leading-relaxed uppercase">
                                            {order.shippingAddress.address}<br />
                                            {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                                        </p>
                                        <a 
                                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}`)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 font-mono text-[10px] text-brand-volt uppercase tracking-widest hover:opacity-50 transition-opacity"
                                        >
                                            Open_In_Tactical_Grid <ExternalLink size={14} />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-10 border-t border-white/5 bg-white/[0.02] flex justify-end gap-4">
                        <button 
                            onClick={onClose}
                            className="px-10 py-5 border border-white/10 font-black uppercase text-[11px] tracking-[0.2em] hover:bg-white hover:text-black transition-all"
                        >
                            Dismiss
                        </button>
                        <button 
                            onClick={() => window.print()}
                            className="px-10 py-5 bg-white text-black font-black uppercase text-[11px] tracking-[0.2em] hover:bg-brand-volt transition-all flex items-center gap-3"
                        >
                            Print_Manifest <ShieldCheck size={16} />
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
