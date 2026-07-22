"use client";

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import toast from 'react-hot-toast';
import { verifyPasswordResetCode } from '@/lib/api';

export default function VerifyCode() {
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const router = useRouter();

    const handleChange = (index: number, value: string) => {
        const newCode = [...code];
        newCode[index] = value.slice(-1);
        setCode(newCode);
        if (value && index < 5) inputRefs.current[index + 1]?.focus();
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        const inputCode = code.join('');
        const email = sessionStorage.getItem('kavon_recovery_email');

        if (!email) {
            toast.error('REQUEST_A_NEW_RECOVERY_CODE');
            router.push('/forgot-password');
            return;
        }

        setIsSubmitting(true);
        try {
            const data = await verifyPasswordResetCode(email, inputCode);
            sessionStorage.setItem('kavon_reset_token', data.resetToken);
            toast.success('IDENTITY_CONFIRMED');
            router.push('/forgot-password/reset');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'INVALID_PROTOCOL', {
                style: { borderRadius: '0px', background: '#000', color: '#ff4b4b', border: '1px solid #ff4b4b' }
            });
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
                    <h2 className="text-3xl font-heading italic uppercase mb-2">Verify_<span className="text-white/20">Code</span></h2>
                    <form onSubmit={handleVerify} className="space-y-8">
                        <div className="flex justify-between gap-2">
                            {code.map((digit, i) => (
                                <input key={i} ref={(el) => { inputRefs.current[i] = el; }} type="text" inputMode="numeric" pattern="[0-9]" maxLength={1} value={digit} onChange={(e) => handleChange(i, e.target.value.replace(/\D/g, ''))} className="w-full h-14 bg-white/5 border border-white/10 text-center font-mono text-xl focus:border-[#df0715] outline-none" />
                            ))}
                        </div>
                        <button disabled={isSubmitting || code.some((digit) => !digit)} className="w-full py-5 bg-[#df0715] text-black font-black uppercase text-[10px] tracking-widest hover:bg-white transition-all disabled:opacity-50">{isSubmitting ? 'VERIFYING...' : 'Confirm_Identity'}</button>
                    </form>
                </motion.div>
            </main>

        </div>
    );
}
