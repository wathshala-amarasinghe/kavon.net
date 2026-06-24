"use client";

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import toast from 'react-hot-toast';

export default function VerifyCode() {
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const router = useRouter();

    const handleChange = (index: number, value: string) => {
        const newCode = [...code];
        newCode[index] = value.slice(-1);
        setCode(newCode);
        if (value && index < 5) inputRefs.current[index + 1]?.focus();
    };

    const handleVerify = (e: React.FormEvent) => {
        e.preventDefault();
        const inputCode = code.join('');
        const storedCode = sessionStorage.getItem('kavon_recovery_code');

        // BYPASS LOGIC: Accepts real code OR dummy code '123456'
        if (inputCode === storedCode || inputCode === '123456') {
            toast.success('IDENTITY_CONFIRMED');
            router.push('/forgot-password/reset');
        } else {
            toast.error('INVALID_PROTOCOL', {
                style: { borderRadius: '0px', background: '#000', color: '#ff4b4b', border: '1px solid #ff4b4b' }
            });
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
                                <input key={i} ref={(el) => { inputRefs.current[i] = el; }} type="text" maxLength={1} value={digit} onChange={(e) => handleChange(i, e.target.value)} className="w-full h-14 bg-white/5 border border-white/10 text-center font-mono text-xl focus:border-[#df0715] outline-none" />
                            ))}
                        </div>
                        <button className="w-full py-5 bg-[#df0715] text-black font-black uppercase text-[10px] tracking-widest hover:bg-white transition-all">Confirm_Identity</button>
                    </form>
                </motion.div>
            </main>

        </div>
    );
}