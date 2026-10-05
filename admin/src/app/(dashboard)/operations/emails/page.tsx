"use client";

<<<<<<< HEAD
import React, { useState, useEffect, useCallback } from 'react';
=======
import React, { useState, useEffect } from 'react';
>>>>>>> 0046e567ddbf60b0a1c0c1c6fa8ee5d2dd390c70
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, RefreshCw, AlertTriangle, CheckCircle2, XCircle, Search, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { getEmailJobs, retryEmailJob } from '@/lib/api';

export default function EmailLogsPage() {
    const [jobs, setJobs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRetrying, setIsRetrying] = useState<string | null>(null);
    
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [statusFilter, setStatusFilter] = useState('all');

<<<<<<< HEAD
    const fetchJobs = useCallback(async (p = page) => {
=======
    const fetchJobs = async (p = page) => {
>>>>>>> 0046e567ddbf60b0a1c0c1c6fa8ee5d2dd390c70
        setIsLoading(true);
        try {
            const token = localStorage.getItem('kavon-admin-token') || '';
            const data = await getEmailJobs(token, { page: p, limit: 20, status: statusFilter });
            setJobs(data.jobs);
            setTotalPages(data.pages);
            setPage(data.page);
        } catch (e: any) {
            toast.error(e.message || 'Failed to load email logs');
        } finally {
            setIsLoading(false);
        }
<<<<<<< HEAD
    }, [page, statusFilter]);

    useEffect(() => {
        fetchJobs(1);
    }, [fetchJobs]);
=======
    };

    useEffect(() => {
        fetchJobs(1);
    }, [statusFilter]);
>>>>>>> 0046e567ddbf60b0a1c0c1c6fa8ee5d2dd390c70

    const handleRetry = async (id: string) => {
        setIsRetrying(id);
        try {
            const token = localStorage.getItem('kavon-admin-token') || '';
            await retryEmailJob(id, token);
            toast.success('Email re-queued and sent');
            fetchJobs();
        } catch (e: any) {
            toast.error(e.message || 'Retry failed');
        } finally {
            setIsRetrying(null);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Sent': return <CheckCircle2 size={16} className="text-brand-volt" />;
            case 'Failed': return <XCircle size={16} className="text-red-500" />;
            case 'Processing': return <Loader2 size={16} className="text-yellow-500 animate-spin" />;
            default: return <Mail size={16} className="text-white/40" />;
        }
    };

    const getEventColor = (event: string) => {
        switch (event) {
            case 'Delivered': return 'text-brand-volt bg-brand-volt/10 border-brand-volt/20';
            case 'Opened': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
            case 'Clicked': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
            case 'Bounced':
            case 'Rejected':
            case 'Spam': return 'text-red-500 bg-red-500/10 border-red-500/20';
            case 'Unsubscribed': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
            default: return 'text-white/40 bg-white/5 border-white/10';
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black italic uppercase tracking-tighter">Email Logs</h1>
                    <p className="text-white/40 font-mono text-[11px] uppercase tracking-widest mt-1">
                        Monitor transmissions, delivery events, and failures
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-brand-surface border border-white/10 px-4 py-2 text-[11px] font-mono text-white outline-none cursor-pointer"
                    >
                        <option value="all">All Statuses</option>
                        <option value="Sent">Sent</option>
                        <option value="Failed">Failed</option>
                        <option value="Processing">Processing</option>
                    </select>
                    <button 
                        onClick={() => fetchJobs()}
                        className="p-2 border border-white/10 bg-brand-surface hover:bg-white/5 transition-colors"
                    >
                        <RefreshCw size={16} />
                    </button>
                </div>
            </div>

            <div className="bg-brand-surface border border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="border-b border-white/10 bg-black/40 text-[10px] font-mono uppercase tracking-widest text-white/40">
                                <th className="p-4 font-normal">Recipient</th>
                                <th className="p-4 font-normal">Subject & Type</th>
                                <th className="p-4 font-normal">Status</th>
                                <th className="p-4 font-normal">Delivery Event</th>
                                <th className="p-4 font-normal">Attempts</th>
                                <th className="p-4 font-normal">Date</th>
                                <th className="p-4 font-normal text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center">
                                        <Loader2 className="animate-spin text-brand-volt mx-auto" />
                                    </td>
                                </tr>
                            ) : jobs.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-white/40 font-mono text-[11px] uppercase tracking-widest">
                                        No transmissions found
                                    </td>
                                </tr>
                            ) : (
                                <AnimatePresence>
                                    {jobs.map((job) => (
                                        <motion.tr 
                                            key={job._id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                                        >
                                            <td className="p-4">
                                                <div className="text-[13px] font-medium">{job.recipientName}</div>
                                                <div className="text-[11px] font-mono text-white/50">{job.recipient}</div>
                                            </td>
                                            <td className="p-4">
                                                <div className="text-[12px] line-clamp-1 max-w-[250px]" title={job.subject}>{job.subject}</div>
                                                <div className="text-[10px] font-mono uppercase tracking-widest text-brand-volt mt-1">{job.type}</div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    {getStatusIcon(job.status)}
                                                    <span className={`text-[11px] font-mono uppercase tracking-wider ${job.status === 'Failed' ? 'text-red-500' : 'text-white/80'}`}>
                                                        {job.status}
                                                    </span>
                                                </div>
                                                {job.lastError && (
                                                    <div className="text-[10px] font-mono text-red-400 mt-1 line-clamp-1 max-w-[150px]" title={job.lastError}>
                                                        {job.lastError}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                <span className={`inline-block px-2 py-1 text-[10px] font-mono uppercase tracking-widest border ${getEventColor(job.deliveryEvent)}`}>
                                                    {job.deliveryEvent}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <span className="text-[11px] font-mono text-white/60">{job.attempts}</span>
                                            </td>
                                            <td className="p-4">
                                                <div className="text-[11px] font-mono text-white/60">
                                                    {new Date(job.createdAt).toLocaleString()}
                                                </div>
                                            </td>
                                            <td className="p-4 text-right">
                                                {job.status === 'Failed' && (
                                                    <button
                                                        onClick={() => handleRetry(job._id)}
                                                        disabled={isRetrying === job._id}
                                                        className="inline-flex items-center gap-2 px-3 py-1.5 border border-white/20 text-[10px] font-mono uppercase tracking-widest hover:bg-white/10 disabled:opacity-50"
                                                    >
                                                        {isRetrying === job._id ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
                                                        Retry
                                                    </button>
                                                )}
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            )}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="p-4 border-t border-white/10 flex justify-between items-center bg-black/20">
                        <button
                            disabled={page === 1}
                            onClick={() => fetchJobs(page - 1)}
                            className="text-[11px] font-mono uppercase tracking-widest text-white/60 hover:text-white disabled:opacity-30"
                        >
                            PREV
                        </button>
                        <span className="text-[11px] font-mono text-white/40">
                            PAGE {page} OF {totalPages}
                        </span>
                        <button
                            disabled={page === totalPages}
                            onClick={() => fetchJobs(page + 1)}
                            className="text-[11px] font-mono uppercase tracking-widest text-brand-volt hover:text-white disabled:opacity-30"
                        >
                            NEXT
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
