"use client";

import React, { useState, useEffect } from 'react';
import { getOrders, updateOrderToPaid, updateOrderToDelivered, updateOrderStatus } from '@/lib/api';
import { ShoppingCart, Clock, CheckCircle2, Truck, MoreVertical, ExternalLink, ShieldCheck, Eye, Calendar, X } from 'lucide-react';
import toast from 'react-hot-toast';
import OrderDetails from '@/components/orders/OrderDetails';

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('kavon-admin-token') || "";
            const data = await getOrders(token);
            setOrders(data);
        } catch (e) {
            toast.error("LOGISTICS_SYNC_FAILURE");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        try {
            const token = localStorage.getItem('kavon-admin-token') || "";
            await updateOrderStatus(id, newStatus, token);
            toast.success(`STATUS_UPDATED: ${newStatus.toUpperCase()}`);
            fetchOrders();
        } catch (e) {
            toast.error("MODIFICATION_FAILED");
        }
    };

    const STATUS_OPTIONS = [
        'Authorized', 
        'Processing', 
        'Shipped', 
        'Out for Delivery', 
        'Ready for Pickup', 
        'Delivered', 
        'Cancelled', 
        'Refunded'
    ];

    return (
        <div className="space-y-10">
            <header className="flex justify-between items-end">
                <div className="space-y-2">
                    <span className="font-mono text-[13px] text-white/40 uppercase tracking-[0.4em]">Node_Status / Logistics</span>
                    <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">Command<span className="text-brand-volt">_Manifests</span></h1>
                </div>
                <div className="flex gap-4 items-end">
                    <div className="relative">
                        <ShoppingCart className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                        <input 
                            type="text" 
                            placeholder="SEARCH_MANIFEST_ID..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-black/40 border border-white/5 p-4 pl-12 font-mono text-xs uppercase focus:border-brand-volt outline-none transition-all text-white w-64"
                        />
                    </div>
                    <div className="relative flex gap-2">
                        <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                            <input 
                                type="date" 
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="bg-black/40 border border-white/5 p-4 pl-12 font-mono text-xs uppercase focus:border-brand-volt outline-none transition-all text-white w-48 [color-scheme:dark]"
                            />
                        </div>
                        {selectedDate && (
                            <button 
                                onClick={() => setSelectedDate("")}
                                className="px-4 border border-white/5 text-red-500 hover:bg-white/5 transition-all flex items-center justify-center"
                                title="Clear Date"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>
                    <div className="px-6 py-4 tactical-glass flex items-center gap-3">
                        <Clock size={16} className="text-brand-volt" />
                        <span className="font-mono text-[13px] uppercase tracking-widest text-white/60">Active_Operations: {orders.filter(o => o.status !== 'Delivered').length}</span>
                    </div>
                </div>
            </header>

            <div className="tactical-glass overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-white/5 border-b border-white/5 font-mono text-[12px] uppercase tracking-widest text-white/40">
                        <tr>
                            <th className="p-6">Manifest_ID</th>
                            <th className="p-6">Operator</th>
                            <th className="p-6">Current_Status</th>
                            <th className="p-6">Valuation</th>
                            <th className="p-6 text-right">Deployment_Operations</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i} className="animate-pulse"><td colSpan={5} className="p-8 h-20 bg-white/[0.01]" /></tr>
                            ))
                        ) : orders.filter(o => {
                                const matchesSearch = o._id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                                     (o.user?.name && o.user.name.toLowerCase().includes(searchTerm.toLowerCase()));
                                const matchesDate = !selectedDate || new Date(o.createdAt).toISOString().split('T')[0] === selectedDate;
                                return matchesSearch && matchesDate;
                            }).length === 0 ? (
                            <tr><td colSpan={5} className="p-20 text-center text-white/20 font-mono text-xs uppercase tracking-[0.5em]">NO_MANIFESTS_MATCHING_CRITERIA</td></tr>
                        ) : orders.filter(o => {
                                const matchesSearch = o._id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                                     (o.user?.name && o.user.name.toLowerCase().includes(searchTerm.toLowerCase()));
                                const matchesDate = !selectedDate || new Date(o.createdAt).toISOString().split('T')[0] === selectedDate;
                                return matchesSearch && matchesDate;
                            }).map((order) => (
                            <tr key={order._id} className="hover:bg-white/[0.02] transition-colors group">
                                <td className="p-6">
                                    <button 
                                        onClick={() => { setSelectedOrder(order); setIsDetailsOpen(true); }}
                                        className="flex items-center gap-3 hover:opacity-50 transition-opacity text-left"
                                    >
                                        <ShoppingCart size={14} className="text-white/20" />
                                        <span className="font-mono text-[13px] font-bold text-brand-volt tracking-widest">{order._id.slice(-8).toUpperCase()}</span>
                                    </button>
                                </td>
                                <td className="p-6">
                                    <div className="space-y-1">
                                        <p className="font-bold text-xs uppercase tracking-wider">{order.user?.name || "GUEST_OPERATOR"}</p>
                                        <p className="font-mono text-[11px] text-white/40 uppercase">{order.shippingAddress.city}</p>
                                    </div>
                                </td>
                                <td className="p-6">
                                    <span className={`px-3 py-1 font-mono text-[11px] uppercase tracking-widest border ${
                                        order.status === 'Delivered' ? 'bg-brand-volt/10 border-brand-volt text-brand-volt' :
                                        order.status === 'Authorized' ? 'bg-purple-500/10 border-purple-500 text-purple-500' :
                                        order.status === 'Processing' ? 'bg-blue-500/10 border-blue-500 text-blue-500' :
                                        order.status === 'Shipped' ? 'bg-indigo-500/10 border-indigo-500 text-indigo-500' :
                                        order.status === 'Out for Delivery' ? 'bg-cyan-500/10 border-cyan-500 text-cyan-500' :
                                        order.status === 'Ready for Pickup' ? 'bg-orange-500/10 border-orange-500 text-orange-500' :
                                        order.status === 'Cancelled' ? 'bg-red-500/10 border-red-500 text-red-500' :
                                        order.status === 'Refunded' ? 'bg-pink-500/10 border-pink-500 text-pink-500' :
                                        'bg-white/5 border-white/10 text-white/40'
                                    }`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="p-6">
                                    <span className="font-mono text-xs font-bold text-white">
                                        LKR {order.totalPrice.toLocaleString()}
                                    </span>
                                </td>
                                <td className="p-6 text-right">
                                    <div className="flex items-center justify-end gap-4">
                                        <div className="relative group/status">
                                            <select 
                                                value={order.status}
                                                onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                                className="bg-black/40 border border-white/10 px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-white outline-none focus:border-brand-volt cursor-pointer appearance-none pr-8"
                                            >
                                                {STATUS_OPTIONS.map(opt => (
                                                    <option key={opt} value={opt} className="bg-brand-black">{opt}</option>
                                                ))}
                                            </select>
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">
                                                <MoreVertical size={12} />
                                            </div>
                                        </div>

                                        <button 
                                            onClick={() => { setSelectedOrder(order); setIsDetailsOpen(true); }}
                                            className="p-2 text-white/20 hover:text-white transition-colors"
                                        >
                                            <Eye size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <OrderDetails 
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
                order={selectedOrder}
                onUpdate={fetchOrders}
            />
        </div>
    );
}
