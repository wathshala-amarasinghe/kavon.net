"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, AlertTriangle, Send, Loader2, Megaphone, ShieldAlert, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CommunicationsPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Form States
    const [offerTitle, setOfferTitle] = useState('');
    const [offerDetails, setOfferDetails] = useState('');
    const [offerLink, setOfferLink] = useState('');

    const [maintenanceDate, setMaintenanceDate] = useState('');
    const [maintenanceDetails, setMaintenanceDetails] = useState('');

    const [securityMessage, setSecurityMessage] = useState('');

    const handleDispatch = async (endpoint: string, payload: any, successMessage: string) => {
        if (!confirm('Are you sure you want to dispatch this email to all verified users?')) return;
        
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('kavon_admin_token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/communications/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Dispatch failed');
            }

            toast.success(successMessage);
            
            // Clear forms
            if (endpoint === 'offer') {
                setOfferTitle(''); setOfferDetails(''); setOfferLink('');
            } else if (endpoint === 'maintenance') {
                setMaintenanceDate(''); setMaintenanceDetails('');
            } else if (endpoint === 'security') {
                setSecurityMessage('');
            }

        } catch (error: any) {
            toast.error(error.message || 'Transmission failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleTestEmail = async () => {
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('kavon_admin_token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/communications/test`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Test failed');
            }

            toast.success('Test transmission dispatched to your inbox');
        } catch (error: any) {
            toast.error(error.message || 'Test failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black italic uppercase tracking-tighter">Communications</h1>
                <p className="text-white/40 font-mono text-[11px] uppercase tracking-widest mt-1">
                    Manage outgoing transmissions &amp; alerts
                </p>
            </div>

            {/* Test Email Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-brand-surface border border-white/5 p-6"
            >
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <CheckCircle2 size={16} className="text-brand-volt" />
                            <h2 className="text-sm font-black uppercase tracking-widest text-brand-volt">System Diagnostics</h2>
                        </div>
                        <p className="text-xs text-white/50 font-mono leading-relaxed">
                            Verify SMTP relay functionality by sending a test transmission to your own admin email address.
                        </p>
                    </div>
                    <button
                        onClick={handleTestEmail}
                        disabled={isSubmitting}
                        className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-mono text-[11px] uppercase tracking-widest transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Mail size={14} />}
                        Send Test
                    </button>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Marketing Offer */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-brand-surface border border-white/5 p-6 space-y-6"
                >
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Megaphone size={16} className="text-[#df0715]" />
                            <h2 className="text-sm font-black uppercase tracking-widest text-[#df0715]">Marketing / Offer</h2>
                        </div>
                        <p className="text-xs text-white/50 font-mono">Blast a promotional offer to all verified users.</p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">Subject / Title</label>
                            <input 
                                type="text"
                                value={offerTitle}
                                onChange={(e) => setOfferTitle(e.target.value)}
                                placeholder="e.g. 50% OFF CYBER MONDAY"
                                className="w-full bg-black border border-white/10 p-3 text-sm font-mono focus:border-brand-volt outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">Link URL</label>
                            <input 
                                type="url"
                                value={offerLink}
                                onChange={(e) => setOfferLink(e.target.value)}
                                placeholder="https://kavon.net/shop"
                                className="w-full bg-black border border-white/10 p-3 text-sm font-mono focus:border-brand-volt outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">Details (HTML supported)</label>
                            <textarea 
                                value={offerDetails}
                                onChange={(e) => setOfferDetails(e.target.value)}
                                rows={4}
                                placeholder="<p>Enter offer details here. You can use basic HTML tags.</p>"
                                className="w-full bg-black border border-white/10 p-3 text-sm font-mono focus:border-brand-volt outline-none custom-scrollbar"
                            />
                        </div>
                        <button
                            onClick={() => handleDispatch('offer', { title: offerTitle, detailsHtml: offerDetails, linkUrl: offerLink }, 'Marketing offer dispatched')}
                            disabled={isSubmitting || !offerTitle || !offerDetails || !offerLink}
                            className="w-full py-4 bg-[#df0715] hover:bg-red-600 text-white font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
                        >
                            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                            Dispatch Offer
                        </button>
                    </div>
                </motion.div>

                <div className="space-y-6">
                    {/* Maintenance Notice */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-brand-surface border border-white/5 p-6 space-y-6"
                    >
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <AlertTriangle size={16} className="text-yellow-500" />
                                <h2 className="text-sm font-black uppercase tracking-widest text-yellow-500">Maintenance Notice</h2>
                            </div>
                            <p className="text-xs text-white/50 font-mono">Notify users of upcoming downtime.</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">Date / Time</label>
                                <input 
                                    type="text"
                                    value={maintenanceDate}
                                    onChange={(e) => setMaintenanceDate(e.target.value)}
                                    placeholder="e.g. Friday, Nov 15th at 02:00 AM UTC"
                                    className="w-full bg-black border border-white/10 p-3 text-sm font-mono focus:border-brand-volt outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">Details</label>
                                <textarea 
                                    value={maintenanceDetails}
                                    onChange={(e) => setMaintenanceDetails(e.target.value)}
                                    rows={2}
                                    placeholder="System upgrades. Expected downtime: 2 hours."
                                    className="w-full bg-black border border-white/10 p-3 text-sm font-mono focus:border-brand-volt outline-none custom-scrollbar"
                                />
                            </div>
                            <button
                                onClick={() => handleDispatch('maintenance', { date: maintenanceDate, details: maintenanceDetails }, 'Maintenance notice dispatched')}
                                disabled={isSubmitting || !maintenanceDate || !maintenanceDetails}
                                className="w-full py-4 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
                            >
                                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                                Dispatch Notice
                            </button>
                        </div>
                    </motion.div>

                    {/* Security Alert */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-brand-surface border border-white/5 p-6 space-y-6"
                    >
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <ShieldAlert size={16} className="text-orange-500" />
                                <h2 className="text-sm font-black uppercase tracking-widest text-orange-500">Security Alert</h2>
                            </div>
                            <p className="text-xs text-white/50 font-mono">Emergency broadcast to all users regarding security.</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">Alert Message</label>
                                <textarea 
                                    value={securityMessage}
                                    onChange={(e) => setSecurityMessage(e.target.value)}
                                    rows={2}
                                    placeholder="Enter security warning here..."
                                    className="w-full bg-black border border-white/10 p-3 text-sm font-mono focus:border-brand-volt outline-none custom-scrollbar"
                                />
                            </div>
                            <button
                                onClick={() => handleDispatch('security', { message: securityMessage }, 'Security alert dispatched')}
                                disabled={isSubmitting || !securityMessage}
                                className="w-full py-4 bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
                            >
                                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                                Dispatch Alert
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
            
            <p className="text-center text-[10px] font-mono text-white/20 uppercase tracking-[0.2em] mt-8">
                Note: Mass emails are currently limited to batches of 50 to prevent SMTP throttling.
            </p>
        </div>
    );
}
