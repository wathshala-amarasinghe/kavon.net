"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import toast from 'react-hot-toast';

export default function ResetPassword() {
    const router = useRouter();

    const handleReset = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success('ENCRYPTION_UPDATED: SYSTEM_READY', {
            style: { borderRadius: '0px', background: '#000', color: '#df0715', border: '1px solid #df0715' }
        });
        sessionStorage.removeItem('kavon_recovery_code');
        router.push('/login');
    };

    return (
        <div className="bg-brand-black min-h-screen text-white">
            <Navbar />
            <main className="min-h-screen flex items-center justify-center px-6 pt-20">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md bg-brand-surface border border-white/10 p-12 relative shadow-2xl">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-[#df0715]" />
                    <h2 className="text-3xl font-heading italic uppercase mb-2">New_<span className="text-white/20">Encryption</span></h2>
                    <form onSubmit={handleReset} className="space-y-6">
                        <input type="password" required placeholder="NEW_ACCESS_KEY" className="w-full bg-white/5 border border-white/10 px-4 py-4 font-mono text-xs focus:border-[#df0715] outline-none transition-all" />
                        <input type="password" required placeholder="CONFIRM_KEY" className="w-full bg-white/5 border border-white/10 px-4 py-4 font-mono text-xs focus:border-[#df0715] outline-none transition-all" />
                        <button className="w-full py-5 bg-white text-black font-black uppercase text-[10px] tracking-widest hover:bg-[#df0715] transition-all">Update_Protocol</button>
                    </form>
                </motion.div>
            </main>

        </div>
    );
}