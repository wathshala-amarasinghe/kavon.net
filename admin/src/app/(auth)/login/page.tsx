"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/api';
import { ShieldCheck, ShieldAlert, Lock, User, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const data = await login({ email, password });
            localStorage.setItem('kavon-admin-token', data.token);
            localStorage.setItem('kavon-admin-user', JSON.stringify(data.user));
            toast.success("ACCESS_GRANTED: SECURE_SESSION_ESTABLISHED");
            router.push('/');
        } catch (error: any) {
            toast.error(error.message || "AUTHORIZATION_FAILURE");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-black flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-volt/5 blur-[120px] rounded-full pointer-events-none" />
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md tactical-glass p-12 space-y-10 relative z-10 border-t-2 border-brand-volt"
            >
                <div className="space-y-4 text-center">
                    <div className="inline-flex p-4 bg-brand-volt/10 rounded-full border border-brand-volt/20 mb-4">
                        <ShieldCheck className="text-brand-volt" size={32} />
                    </div>
                    <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white">
                        Sector<span className="text-brand-volt">_Auth</span>
                    </h1>
                    <p className="font-mono text-[10px] text-white/40 uppercase tracking-[0.4em]">Administrative Clearance Required</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="font-mono text-[9px] text-white/40 uppercase tracking-widest ml-1">Operator_ID (Email)</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                            <input 
                                type="email" 
                                required
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="IDENTIFY_OPERATOR..."
                                className="w-full bg-black/40 border border-white/5 p-4 pl-12 font-mono text-xs uppercase focus:border-brand-volt outline-none transition-all text-white"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="font-mono text-[9px] text-white/40 uppercase tracking-widest ml-1">Security_Cipher (Password)</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                            <input 
                                type="password" 
                                required
                                autoComplete="current-password"
                                minLength={8}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="ENTER_CIPHER..."
                                className="w-full bg-black/40 border border-white/5 p-4 pl-12 font-mono text-xs uppercase focus:border-brand-volt outline-none transition-all text-white"
                            />
                        </div>
                    </div>

                    <button 
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-brand-volt text-black py-5 font-black uppercase text-[11px] tracking-[0.3em] flex items-center justify-center gap-3 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                        {isLoading ? "AUTHORIZING..." : "INITIATE_SESSION"}
                        {!isLoading && <ArrowRight size={16} />}
                    </button>
                </form>

                <div className="flex items-center gap-4 py-4 border-t border-white/5">
                    <ShieldAlert size={14} className="text-white/20" />
                    <p className="font-mono text-[9px] text-white/20 uppercase leading-relaxed">
                        Restricted system. Invalid credentials are denied and repeated login attempts are rate-limited.
                    </p>
                </div>
            </motion.div>

            {/* Scanning Line Animation */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-brand-volt/20 shadow-[0_0_15px_rgba(223, 7, 21,0.5)] animate-scan pointer-events-none" />
        </div>
    );
}
