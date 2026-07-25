"use client";

import React, { useState, useEffect } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { Search, QrCode, X, Truck, Edit, History, Shield, Save, Mail, Printer } from 'lucide-react';
import { getOrders, updateOrderStatus } from '@/lib/api';
import toast from 'react-hot-toast';

export default function OperationsPage() {
    const [scannerOpen, setScannerOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeOrder, setActiveOrder] = useState<any>(null);

    // Update Form State
    const [newStatus, setNewStatus] = useState("");
    const [updateNote, setUpdateNote] = useState("");
    const [courierRef, setCourierRef] = useState("");
    const [internalNotes, setInternalNotes] = useState("");
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const fetchAllOrders = async () => {
            try {
                const token = localStorage.getItem('kavon-admin-token') || "";
                const data = await getOrders(token);
                setOrders(data);
            } catch (err) {
                toast.error("Failed to load active operations");
            } finally {
                setLoading(false);
            }
        };
        fetchAllOrders();
    }, []);

    const handleSearch = (e?: React.FormEvent, rawQuery?: string) => {
        if (e) e.preventDefault();
        const query = rawQuery || searchQuery;
        if (!query) return;

        // Try to extract KAV-TRK from a URL if a full URL was scanned
        let parsedId = query.trim();
        if (parsedId.includes('/track/')) {
            parsedId = parsedId.split('/track/')[1].split('/')[0].split('?')[0];
        }

        const found = orders.find(o => o.trackingId === parsedId || o._id === parsedId || o.trackingNumber === parsedId);
        if (found) {
            loadActiveOrder(found);
            setScannerOpen(false);
            setSearchQuery("");
        } else {
            toast.error("ASSET_NOT_FOUND_IN_SECTOR");
        }
    };

    const loadActiveOrder = (order: any) => {
        setActiveOrder(order);
        setNewStatus(order.status);
        setCourierRef(order.courierReference || order.trackingNumber || "");
        setInternalNotes(order.internalNotes || "");
        setUpdateNote("");
    };

    const handleUpdate = async () => {
        if (!activeOrder) return;
        setUpdating(true);
        try {
            const token = localStorage.getItem('kavon-admin-token') || "";
            const updateData = {
                status: newStatus,
                note: updateNote,
                courierReference: courierRef,
                internalNotes: internalNotes
            };
            const updated = await updateOrderStatus(activeOrder._id, updateData, token);
            
            // Update local state
            setOrders(orders.map(o => o._id === updated._id ? updated : o));
            loadActiveOrder(updated);
            
            toast.success("LOGISTICS_UPDATED_SUCCESSFULLY");
        } catch (err: any) {
            toast.error(err.message || "Failed to update operations");
        } finally {
            setUpdating(false);
        }
    };

    const statuses = ['Order Placed', 'Confirmed', 'Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled', 'Returned'];

    return (
        <div className="space-y-10">
            <header className="flex justify-between items-end border-l-2 border-brand-volt pl-8">
                <div className="space-y-2">
                    <span className="font-mono text-[13px] text-white/40 uppercase tracking-[0.4em]">Node_Status / Logistics</span>
                    <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">Asset<span className="text-brand-volt">_Tracking</span></h1>
                </div>
            </header>

            {!activeOrder ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Manual Search */}
                    <div className="tactical-glass p-8 space-y-6">
                        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                            <Search className="text-brand-volt" size={20} />
                            <h2 className="text-sm font-mono uppercase tracking-widest text-white/60">Manual Override</h2>
                        </div>
                        <form onSubmit={handleSearch} className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2">Tracking ID or Order ID</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. KAV-TRK-8X2P9..." 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-black/40 border border-white/5 p-4 font-mono text-xs uppercase focus:border-brand-volt outline-none transition-all text-white"
                                />
                            </div>
                            <button type="submit" className="w-full bg-brand-volt text-black font-black italic uppercase tracking-widest text-sm p-4 hover:bg-brand-volt/90 transition-all">
                                INITIATE_SEARCH
                            </button>
                        </form>
                    </div>

                    {/* QR Scanner */}
                    <div className="tactical-glass p-8 space-y-6">
                        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                            <QrCode className="text-brand-volt" size={20} />
                            <h2 className="text-sm font-mono uppercase tracking-widest text-white/60">Optical Scanner</h2>
                        </div>
                        
                        {!scannerOpen ? (
                            <button 
                                onClick={() => setScannerOpen(true)}
                                className="w-full h-32 border-2 border-dashed border-white/10 hover:border-brand-volt/50 flex flex-col items-center justify-center gap-3 transition-colors text-white/40 hover:text-brand-volt"
                            >
                                <QrCode size={32} />
                                <span className="font-mono text-xs uppercase tracking-widest">Activate Camera</span>
                            </button>
                        ) : (
                            <div className="relative border border-brand-volt/30 overflow-hidden bg-black">
                                <button 
                                    onClick={() => setScannerOpen(false)}
                                    className="absolute top-2 right-2 z-10 p-2 bg-black/50 text-white hover:text-red-500"
                                >
                                    <X size={20} />
                                </button>
                                <Scanner 
                                    onScan={(result) => {
                                        if (result && result.length > 0) {
                                            handleSearch(undefined, result[0].rawValue);
                                        }
                                    }}
                                />
                                <div className="absolute bottom-0 w-full p-2 bg-black/80 text-center font-mono text-[10px] text-brand-volt uppercase tracking-widest">
                                    Awaiting valid QR Signature...
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Management */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="tactical-glass p-8">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">Order <span className="text-brand-volt">#{activeOrder._id}</span></h2>
                                    <p className="text-sm font-mono text-white/60 uppercase tracking-widest mt-1">TRK: {activeOrder.trackingId}</p>
                                </div>
                                <button onClick={() => setActiveOrder(null)} className="p-2 border border-white/10 text-white/40 hover:text-white hover:border-white/40 transition-colors">
                                    <X size={16} />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-6 mb-8">
                                <div className="space-y-1 border-l-2 border-brand-volt pl-4">
                                    <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Current Status</p>
                                    <p className="text-lg font-bold text-brand-volt uppercase tracking-wider">{activeOrder.status}</p>
                                </div>
                                <div className="space-y-1 border-l-2 border-white/10 pl-4">
                                    <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Customer</p>
                                    <p className="text-sm text-white uppercase tracking-wider">{activeOrder.shippingAddress.fullName}</p>
                                </div>
                            </div>

                            <h3 className="text-xs font-mono text-white/40 uppercase tracking-widest mb-4 border-b border-white/10 pb-2">Status Update Override</h3>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2">New Status</label>
                                        <select 
                                            value={newStatus}
                                            onChange={(e) => setNewStatus(e.target.value)}
                                            className="w-full bg-black/40 border border-white/5 p-3 font-mono text-xs uppercase focus:border-brand-volt outline-none text-white appearance-none"
                                        >
                                            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2">Courier Reference (Public)</label>
                                        <input 
                                            type="text" 
                                            value={courierRef}
                                            onChange={(e) => setCourierRef(e.target.value)}
                                            placeholder="e.g. DHL-123456789"
                                            className="w-full bg-black/40 border border-white/5 p-3 font-mono text-xs uppercase focus:border-brand-volt outline-none text-white"
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2">Public Update Note (Optional)</label>
                                    <input 
                                        type="text" 
                                        value={updateNote}
                                        onChange={(e) => setUpdateNote(e.target.value)}
                                        placeholder="e.g. Delayed due to weather conditions"
                                        className="w-full bg-black/40 border border-white/5 p-3 font-mono text-xs uppercase focus:border-brand-volt outline-none text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] text-brand-volt/60 font-mono uppercase tracking-widest mb-2">Internal Notes (Classified)</label>
                                    <textarea 
                                        value={internalNotes}
                                        onChange={(e) => setInternalNotes(e.target.value)}
                                        placeholder="Admin only notes..."
                                        rows={3}
                                        className="w-full bg-brand-volt/5 border border-brand-volt/20 p-3 font-mono text-xs text-brand-volt focus:border-brand-volt outline-none resize-none"
                                    />
                                </div>

                                <button 
                                    onClick={handleUpdate}
                                    disabled={updating}
                                    className="w-full flex items-center justify-center gap-2 bg-brand-volt text-black font-black italic uppercase tracking-widest text-sm p-4 hover:bg-brand-volt/90 transition-all disabled:opacity-50"
                                >
                                    {updating ? "Processing..." : <><Save size={16} /> Execute Update</>}
                                </button>
                            </div>
                        </div>

                        {/* Order Items Summary */}
                        <div className="tactical-glass p-8">
                             <h3 className="text-xs font-mono text-white/40 uppercase tracking-widest mb-4 border-b border-white/10 pb-2">Acquired Assets</h3>
                             <div className="space-y-2">
                                {activeOrder.orderItems.map((item: any, i: number) => (
                                    <div key={i} className="flex justify-between items-center bg-white/[0.02] p-3 border border-white/5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-black border border-white/10">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold uppercase tracking-wider text-white">{item.name}</p>
                                                <p className="text-[10px] font-mono uppercase tracking-widest text-white/40">Size: {item.size} | Color: {item.color}</p>
                                            </div>
                                        </div>
                                        <span className="font-mono text-xs text-brand-volt">QTY: {item.quantity}</span>
                                    </div>
                                ))}
                             </div>
                        </div>
                    </div>

                    {/* Right Column: History & Actions */}
                    <div className="space-y-8">
                        <div className="tactical-glass p-8 space-y-4">
                            <button className="w-full flex items-center justify-center gap-2 border border-white/10 p-3 text-xs font-mono uppercase tracking-widest text-white/60 hover:text-white hover:border-white/30 transition-all">
                                <Printer size={14} /> Print QR Label
                            </button>
                            <button className="w-full flex items-center justify-center gap-2 border border-brand-volt/20 bg-brand-volt/5 p-3 text-xs font-mono uppercase tracking-widest text-brand-volt hover:bg-brand-volt/10 transition-all">
                                <Mail size={14} /> Re-send Notification
                            </button>
                        </div>

                        <div className="tactical-glass p-8">
                            <h3 className="text-xs font-mono text-white/40 uppercase tracking-widest mb-6 border-b border-white/10 pb-2 flex items-center gap-2">
                                <History size={14} /> Status History
                            </h3>
                            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-brand-volt before:via-white/10 before:to-transparent">
                                {activeOrder.statusHistory?.map((hist: any, i: number) => (
                                    <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                        <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-black bg-brand-volt shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                        </div>
                                        <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.25rem)] p-4 bg-white/[0.02] border border-white/5 space-y-1">
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs font-bold uppercase tracking-wider text-brand-volt">{hist.status}</span>
                                            </div>
                                            <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{new Date(hist.timestamp).toLocaleString()}</p>
                                            {hist.note && (
                                                <p className="text-[11px] text-white/70 italic mt-2 border-t border-white/5 pt-2">&quot;{hist.note}&quot;</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
