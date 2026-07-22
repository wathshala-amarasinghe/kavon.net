"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import toast from 'react-hot-toast';
import { resetPassword } from '@/lib/api';

export default function ResetPassword() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        const email = sessionStorage.getItem('kavon_recovery_email');
        const token = sessionStorage.getItem('kavon_reset_token');

        if (!email || !token) {
            toast.error('RESET_SESSION_EXPIRED');
            router.push('/forgot-password');
            return;
        }

        if (password.length < 8) {
            toast.error('PASSWORD_MUST_BE_8_CHARACTERS');
            return;
        }

        if (password !== confirmPassword) {
            toast.error('PASSWORDS_DO_NOT_MATCH');
            return;
        }

        setIsSubmitting(true);
        try {
            await resetPassword(email, token, password);
            toast.success('ENCRYPTION_UPDATED: SYSTEM_READY', {
                style: { borderRadius: '0px', background: '#000', color: '#df0715', border: '1px solid #df0715' }
            });
            sessionStorage.removeItem('kavon_recovery_email');
            sessionStorage.removeItem('kavon_reset_token');
            router.push('/login');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'PASSWORD_RESET_FAILED');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-brand-black min-h-screen text-white">
            <Navbar />
            <main className="min-h-screen flex items-center justify-center px-6 pt-20">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md bg-brand-surface border border-white/10 p-12 relative shadow-2xl">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-[#df0715]" />
                    <h2 className="text-3xl font-heading italic uppercase mb-2">New_<span className="text-white/20">Encryption</span></h2>
                    <form onSubmit={handleReset} className="space-y-6">
                        <input type="password" required minLength={8} autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="NEW_ACCESS_KEY" className="w-full bg-white/5 border border-white/10 px-4 py-4 font-mono text-xs focus:border-[#df0715] outline-none transition-all" />
                        <input type="password" required minLength={8} autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="CONFIRM_KEY" className="w-full bg-white/5 border border-white/10 px-4 py-4 font-mono text-xs focus:border-[#df0715] outline-none transition-all" />
                        <button disabled={isSubmitting} className="w-full py-5 bg-white text-black font-black uppercase text-[10px] tracking-widest hover:bg-[#df0715] transition-all disabled:opacity-50">{isSubmitting ? 'UPDATING...' : 'Update_Protocol'}</button>
                    </form>
                </motion.div>
            </main>

        </div>
    );
}
