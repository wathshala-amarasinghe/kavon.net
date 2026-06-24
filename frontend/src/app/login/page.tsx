"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Mail, Lock, User, ArrowRight, ChevronRight, Fingerprint, Activity, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login, register, user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            router.push('/');
        }
    }, [user, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            if (isLogin) {
                await login({ email, password });
            } else {
                await register({ name, email, password });
            }
        } catch (err: Record<string, unknown>) {
            setError(err.message || 'Authentication failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-black flex flex-col pt-32 pb-20 px-6 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-volt/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-volt/5 blur-[120px] rounded-full" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]" />
            </div>

            <div className="max-w-[450px] w-full mx-auto relative z-10">
                <header className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center justify-center w-16 h-16 border border-brand-volt/30 bg-brand-volt/5 mb-6 shadow-[0_0_20px_rgba(223, 7, 21,0.1)]"
                    >
                        <Fingerprint className="text-brand-volt w-8 h-8" />
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl font-black italic uppercase tracking-tighter mb-2"
                    >
                        {isLogin ? 'Access_Protocol' : 'Identity_Initialization'}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-white/40 font-mono text-[11px] uppercase tracking-[0.3em]"
                    >
                        {isLogin ? 'Enter Credentials for Biometric Match' : 'Register your signature in the KAVON division'}
                    </motion.p>
                </header>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-brand-surface/40 backdrop-blur-xl border border-white/5 p-8 shadow-2xl relative"
                >
                    {/* Scanner Line Effect */}
                    <motion.div 
                        animate={{ top: ['0%', '100%', '0%'] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="absolute left-0 right-0 h-[1px] bg-brand-volt/20 z-20 pointer-events-none" 
                    />

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <AnimatePresence mode="wait">
                            {!isLogin && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="space-y-2"
                                >
                                    <label className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] ml-1">Asset_Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                        <input
                                            type="text"
                                            name="name"
                                            autoComplete="name"
                                            required
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full bg-black/50 border border-white/10 py-4 pl-12 pr-4 text-sm font-mono focus:border-brand-volt/50 focus:outline-none transition-all placeholder:text-white/10"
                                            placeholder="OPERATIVE NAME"
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-2">
                            <label className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] ml-1">Secure_Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                <input
                                    type="email"
                                    name="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-black/50 border border-white/10 py-4 pl-12 pr-4 text-sm font-mono focus:border-brand-volt/50 focus:outline-none transition-all placeholder:text-white/10"
                                    placeholder="OPERATIVE@KAVON.LK"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] ml-1">Access_Key</label>
                                {isLogin && (
                                    <Link href="/forgot-password" className="text-[10px] font-mono text-brand-volt/60 hover:text-brand-volt transition-colors uppercase tracking-widest">
                                        Lost_Key?
                                    </Link>
                                )}
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                <input
                                    type="password"
                                    name="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-black/50 border border-white/10 py-4 pl-12 pr-4 text-sm font-mono focus:border-brand-volt/50 focus:outline-none transition-all placeholder:text-white/10"
                                    placeholder="••••••••••••"
                                />
                            </div>
                        </div>

                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono italic"
                                >
                                    <AlertCircle size={14} />
                                    <span>PROTOCOL_ERROR: {error.toUpperCase()}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-5 bg-brand-volt text-black font-black uppercase text-[12px] tracking-[0.3em] flex items-center justify-center gap-3 group transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <Activity className="w-4 h-4 animate-spin" />
                            ) : (
                                <>
                                    {isLogin ? 'VERIFY_IDENTITY' : 'INITIALIZE_ACCOUNT'}
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-white/5 text-center">
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-[11px] font-mono text-white/40 hover:text-brand-volt transition-colors uppercase tracking-[0.2em] flex items-center justify-center gap-2 mx-auto"
                        >
                            {isLogin ? "No signature yet? Create Initialization" : "Already registered? Access Protocol"}
                            <ChevronRight size={14} />
                        </button>
                    </div>
                </motion.div>

                <footer className="mt-12 flex items-center justify-between opacity-20 hover:opacity-100 transition-opacity">
                    <div className="flex gap-4">
                        <Shield size={16} />
                        <span className="text-[9px] font-mono uppercase tracking-[0.3em]">End-to-End Encrypted</span>
                    </div>
                    <span className="text-[9px] font-mono uppercase tracking-[0.3em]">Division_v1.0.42</span>
                </footer>
            </div>
        </div>
    );
}