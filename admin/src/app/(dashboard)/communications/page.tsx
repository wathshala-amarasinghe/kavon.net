"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Megaphone, Mail, AlertTriangle, Send, Loader2, ShieldAlert, Users, LayoutTemplate, Tag, Trash2, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { 
    getAnnouncements, 
    createAnnouncement, 
    estimateRecipients, 
    sendTestAnnouncement, 
    dispatchAnnouncement, 
    deleteAnnouncement 
} from '@/lib/api';

export default function CommunicationsPage() {
    const [announcements, setAnnouncements] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [type, setType] = useState('offer');
    const [targetAudience, setTargetAudience] = useState('all');
    const [channels, setChannels] = useState<string[]>(['banner']);
    const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 16));
    const [endDate, setEndDate] = useState('');
    const [linkedProductId, setLinkedProductId] = useState('');
    
    const [estimatedCount, setEstimatedCount] = useState<number | null>(null);
    const [products, setProducts] = useState<any[]>([]);

    const fetchAnnouncements = async () => {
        try {
            const token = localStorage.getItem('kavon-admin-token') || '';
            const data = await getAnnouncements(token);
            setAnnouncements(data);
        } catch (e: any) {
            toast.error(e.message || 'Failed to load announcements');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAnnouncements();
        // Fetch products for dropdown
        const fetchProducts = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/products`);
                const data = await res.json();
                if (data.products) setProducts(data.products);
            } catch (e) {
                console.error('Failed to load products');
            }
        };
        fetchProducts();
    }, []);

    const toggleChannel = (c: string) => {
        setChannels(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
    };

    const handleCalculateRecipients = async () => {
        try {
            const token = localStorage.getItem('kavon-admin-token') || '';
            const data = await estimateRecipients({ type, targetAudience }, token);
            setEstimatedCount(data.count);
            toast.success(`Estimated recipients: ${data.count}`);
        } catch (e: any) {
            toast.error(e.message || 'Failed to estimate');
        }
    };

    const handleSendTest = async () => {
        if (!title || !message) return toast.error('Title and message required for test');
        try {
            setIsSubmitting(true);
            const token = localStorage.getItem('kavon-admin-token') || '';
            await sendTestAnnouncement({ title, message, type, linkedProductId: type === 'offer' && linkedProductId ? linkedProductId : undefined }, token);
            toast.success('Test email sent to your inbox');
        } catch (e: any) {
            toast.error(e.message || 'Test failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeploy = async () => {
        if (!title || !message || channels.length === 0) {
            return toast.error('Title, message, and at least one channel are required');
        }
        if (!confirm('Are you sure you want to deploy this announcement?')) return;
        
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('kavon-admin-token') || '';
            
            // Check if it's scheduled for future
            const isFuture = new Date(startDate) > new Date();
            const status = isFuture ? 'scheduled' : 'active';
            
            const payload = {
                title, message, type, targetAudience, channels, 
                startDate: new Date(startDate).toISOString(),
                endDate: endDate ? new Date(endDate).toISOString() : undefined,
                linkedProductId: type === 'offer' && linkedProductId ? linkedProductId : undefined,
                status
            };

            const created = await createAnnouncement(payload, token);
            
            if (channels.includes('email') && status === 'active') {
                await dispatchAnnouncement(created._id, token);
                toast.success('Announcement saved and email dispatch initiated');
            } else {
                toast.success('Announcement saved');
            }
            
            // Reset form
            setTitle(''); setMessage(''); setChannels(['banner']); setEstimatedCount(null); setLinkedProductId('');
            fetchAnnouncements();
        } catch (e: any) {
            toast.error(e.message || 'Deployment failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this announcement?')) return;
        try {
            const token = localStorage.getItem('kavon-admin-token') || '';
            await deleteAnnouncement(id, token);
            toast.success('Deleted');
            fetchAnnouncements();
        } catch (e: any) {
            toast.error(e.message || 'Delete failed');
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black italic uppercase tracking-tighter">Announcements Module</h1>
                <p className="text-white/40 font-mono text-[11px] uppercase tracking-widest mt-1">
                    Manage website banners and targeted email communications
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Composer Section */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-brand-surface border border-white/5 p-6 h-fit"
                >
                    <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
                        <Megaphone size={18} className="text-brand-volt" />
                        <h2 className="font-heading italic uppercase text-lg">Composer</h2>
                    </div>

                    <div className="space-y-5">
                        <div>
                            <label className="block text-[10px] font-mono uppercase text-white/50 mb-2">Internal & Public Title</label>
                            <input 
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 px-3 py-2 text-[12px] font-mono text-white focus:border-white/30 outline-none"
                                placeholder="e.g. Flash Sale Live"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-mono uppercase text-white/50 mb-2">Message (HTML Supported)</label>
                            <textarea 
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                rows={4}
                                className="w-full bg-black/50 border border-white/10 px-3 py-2 text-[12px] font-mono text-white focus:border-white/30 outline-none"
                                placeholder="Enter alert details or marketing copy..."
                            />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-mono uppercase text-white/50 mb-2">Type</label>
                                <select 
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    className="w-full bg-black/50 border border-white/10 px-3 py-2 text-[12px] font-mono text-white outline-none"
                                >
                                    <option value="offer">Offer / Promotion</option>
                                    <option value="maintenance">Maintenance</option>
                                    <option value="delivery">Delivery Issue</option>
                                    <option value="security">Security Alert</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-mono uppercase text-white/50 mb-2">Target Audience</label>
                                <select 
                                    value={targetAudience}
                                    onChange={(e) => setTargetAudience(e.target.value)}
                                    className="w-full bg-black/50 border border-white/10 px-3 py-2 text-[12px] font-mono text-white outline-none"
                                >
                                    <option value="all">All Users</option>
                                    <option value="consented">Consented Only</option>
                                    <option value="affected">Affected/Cohort</option>
                                </select>
                            </div>
                        </div>

                        {type === 'offer' && (
                            <div>
                                <label className="block text-[10px] font-mono uppercase text-white/50 mb-2">Linked Product (Embed in Email)</label>
                                <select 
                                    value={linkedProductId}
                                    onChange={(e) => setLinkedProductId(e.target.value)}
                                    className="w-full bg-black/50 border border-white/10 px-3 py-2 text-[12px] font-mono text-white outline-none"
                                >
                                    <option value="">None</option>
                                    {products.map(p => (
                                        <option key={p._id} value={p._id}>{p.name} - LKR {p.price}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div>
                            <label className="block text-[10px] font-mono uppercase text-white/50 mb-2">Channels</label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={channels.includes('banner')} 
                                        onChange={() => toggleChannel('banner')}
                                        className="w-4 h-4 accent-brand-volt" 
                                    />
                                    <span className="text-[12px] font-mono">Website Banner</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={channels.includes('email')} 
                                        onChange={() => toggleChannel('email')}
                                        className="w-4 h-4 accent-brand-volt" 
                                    />
                                    <span className="text-[12px] font-mono">Email Blast</span>
                                </label>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-mono uppercase text-white/50 mb-2">Start Time</label>
                                <input 
                                    type="datetime-local"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full bg-black/50 border border-white/10 px-3 py-2 text-[12px] font-mono text-white outline-none [color-scheme:dark]"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-mono uppercase text-white/50 mb-2">End Time (Optional)</label>
                                <input 
                                    type="datetime-local"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full bg-black/50 border border-white/10 px-3 py-2 text-[12px] font-mono text-white outline-none [color-scheme:dark]"
                                />
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/10 flex flex-wrap gap-3">
                            <button 
                                type="button"
                                onClick={handleCalculateRecipients}
                                className="flex items-center gap-2 px-4 py-2 border border-white/20 text-[11px] font-mono uppercase tracking-widest hover:bg-white/5"
                            >
                                <Users size={14} /> Calculate
                            </button>
                            <button 
                                type="button"
                                onClick={handleSendTest}
                                disabled={isSubmitting}
                                className="flex items-center gap-2 px-4 py-2 border border-white/20 text-[11px] font-mono uppercase tracking-widest hover:bg-white/5 disabled:opacity-50"
                            >
                                <Mail size={14} /> Test
                            </button>
                            <button 
                                type="button"
                                onClick={handleDeploy}
                                disabled={isSubmitting}
                                className="flex items-center gap-2 px-4 py-2 bg-brand-volt text-black border border-brand-volt text-[11px] font-mono uppercase tracking-widest hover:bg-brand-volt/90 font-bold ml-auto disabled:opacity-50"
                            >
                                {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />} 
                                Deploy
                            </button>
                        </div>
                        {estimatedCount !== null && (
                            <p className="text-[10px] font-mono text-brand-volt mt-2">Estimated Recipients: {estimatedCount}</p>
                        )}
                    </div>
                </motion.div>

                {/* History Section */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-brand-surface border border-white/5 p-6"
                >
                    <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
                        <div className="flex items-center gap-2">
                            <LayoutTemplate size={18} className="text-white/60" />
                            <h2 className="font-heading italic uppercase text-lg">Active & History</h2>
                        </div>
                        <span className="text-[10px] font-mono text-white/40">{announcements.length} Total</span>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center p-8"><Loader2 className="animate-spin text-brand-volt" /></div>
                    ) : (
                        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                            {announcements.length === 0 && <p className="text-white/40 font-mono text-[11px]">No announcements found.</p>}
                            <AnimatePresence>
                                {announcements.map((a: any) => (
                                    <motion.div 
                                        key={a._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="bg-black/50 border border-white/10 p-4"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-[13px] uppercase tracking-wide flex items-center gap-2">
                                                {a.title}
                                                {a.status === 'active' && <span className="w-2 h-2 rounded-full bg-brand-volt shadow-[0_0_8px_#3fff75]" />}
                                                {a.status === 'scheduled' && <span className="w-2 h-2 rounded-full bg-yellow-500" />}
                                            </h3>
                                            <button onClick={() => handleDelete(a._id)} className="text-white/40 hover:text-red-500">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                        <p className="text-[11px] font-mono text-white/50 line-clamp-2 mb-3">
                                            {a.message.replace(/<[^>]*>?/gm, '')}
                                        </p>
                                        <div className="flex flex-wrap gap-2 text-[9px] font-mono uppercase tracking-widest text-white/40">
                                            <span className="border border-white/10 px-2 py-0.5 bg-white/5">{a.type}</span>
                                            <span className="border border-white/10 px-2 py-0.5 bg-white/5">Status: {a.status}</span>
                                            {a.channels.includes('email') && (
                                                <span className="border border-white/10 px-2 py-0.5 bg-white/5 flex items-center gap-1">
                                                    <Mail size={10} /> {a.emailSentCount || 0} Sent
                                                </span>
                                            )}
                                            {a.channels.includes('banner') && (
                                                <span className="border border-white/10 px-2 py-0.5 bg-white/5 flex items-center gap-1">
                                                    <LayoutTemplate size={10} /> Banner
                                                </span>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
