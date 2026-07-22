"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import toast from 'react-hot-toast';
import { requestPasswordReset } from '@/lib/api';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSendCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const normalizedEmail = email.trim().toLowerCase();
            await requestPasswordReset(normalizedEmail);
            sessionStorage.setItem('kavon_recovery_email', normalizedEmail);

            toast.success('TRANSMISSION_SENT: CHECK_INBOX', {
                style: { borderRadius: '0px', background: '#000', color: '#df0715', border: '1px solid #df0715', fontFamily: 'monospace' }
            });
            router.push('/forgot-password/verify');
        } catch (error) {
            toast.error('TRANSMISSION_FAILED');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-brand-black min-h-screen text-white">
            <Navbar />
            <main className="min-h-screen flex items-center justify-center px-6 pt-20">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md bg-brand-surface border border-white/10 p-12 relative shadow-2xl">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-[#df0715]" />
                    <h2 className="text-3xl font-heading italic uppercase mb-2">Recover_<span className="text-white/20">Access</span></h2>
                    <form onSubmit={handleSendCode} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[9px] font-mono text-white/80 uppercase tracking-widest font-bold">Email_Target</label>
                            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="OPERATOR@KAVON.COM" className="w-full bg-white/5 border border-white/10 px-4 py-4 font-mono text-xs focus:border-[#df0715] outline-none" />
                        </div>
                        <button disabled={loading} className="w-full py-5 bg-white text-black font-black uppercase text-[10px] tracking-widest hover:bg-[#df0715] transition-all disabled:opacity-50">
                            {loading ? 'TRANSMITTING...' : 'Send_Protocol_Code'}
                        </button>
                    </form>
                </motion.div>
            </main>

        </div>
    );
}
