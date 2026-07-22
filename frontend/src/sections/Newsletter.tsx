"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';

export function Newsletter() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    // Initialize EmailJS once when the component mounts
    useEffect(() => {
        emailjs.init('iwawzuJjOqQ-hGU2_');
    }, []);

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();

        if (status === 'loading') return;

        setStatus('loading');

        const SERVICE_ID = 'service_8m8xecf';
        const TEMPLATE_ID = 'template_rvhjmcu';

        const templateParams = {
            user_email: email,
            subscription_source: "KAVON_SHADOW_COMMUNITY"
        };

        try {
            // emailjs.send() resolves on success (status 200) and rejects on failure.
            // The rejection is a plain object {status: number, text: string}, NOT an Error instance.
            await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams);

            setStatus('success');
            setEmail("");
        } catch (error: unknown) {
            // EmailJS rejects with {status, text} — extract a readable message
            let message = 'Unknown error';
            if (typeof error === 'object' && error !== null && 'text' in error) {
                message = String((error as { text: unknown }).text);
            } else if (error instanceof Error) {
                message = error.message;
            }

            console.error('KAVON_SYSTEM_ERROR // Transmission Interrupted:', message);
            setStatus('error');
            setTimeout(() => setStatus('idle'), 5000);
        }
    };

    return (
        <section id="newsletter" className="py-32 px-6 max-w-[1400px] mx-auto bg-brand-black scroll-mt-32">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-brand-black border border-white/5 p-12 md:p-24 text-center relative overflow-hidden"
            >
                {/* Visual Accents */}
                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white/20" />
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white/20" />

                <div className="mb-4">
                    <span className="text-brand-volt font-mono text-[12px] tracking-[0.4em] uppercase">
                        {status === 'success' ? 'Thank You' : 'Stay Connected'}
                    </span>
                </div>

                <h2 className="font-heading text-5xl md:text-8xl text-white mb-6 tracking-[-0.04em] uppercase italic">
                    {status === 'success' ? 'SUBSCRIBED' : 'JOIN OUR COMMUNITY'}
                </h2>

                <p className="text-white/40 mb-12 max-w-lg mx-auto font-body text-[13px] tracking-[0.1em] uppercase leading-relaxed">
                    {status === 'success'
                        ? 'Your email has been received. Watch for exclusive updates.'
                        : 'Secure early access to new drops, limited archival releases, and exclusive content.'}
                </p>

                {status !== 'success' && (
                    <form className="flex flex-col sm:flex-row gap-2 max-w-xl mx-auto" onSubmit={handleSubscribe}>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="ENTER YOUR EMAIL"
                            className="flex-1 bg-white/5 border border-white/10 px-8 py-5 text-white placeholder:text-white/10 focus:outline-none focus:border-brand-volt transition-all font-mono text-[12px] tracking-[0.2em] uppercase"
                            disabled={status === 'loading'}
                            required
                        />
                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="px-12 py-5 bg-white text-black font-black uppercase text-[12px] tracking-[0.2em] hover:bg-brand-volt transition-all duration-500 whitespace-nowrap active:scale-95 disabled:opacity-50"
                        >
                            {status === 'loading' ? 'Loading...' : 'Subscribe'}
                        </button>
                    </form>
                )}

                <div className="mt-12 pt-8 border-t border-white/5 flex justify-center gap-12">
                    <div className="flex flex-col items-center">
                        <span className="text-white/10 font-mono text-[11px] uppercase tracking-[0.2em]">Status</span>
                        <span className={`font-mono text-[12px] uppercase tracking-[0.2em] ${status === 'error' ? 'text-red-500' : 'text-brand-volt animate-pulse'}`}>
                            {status === 'error' ? 'Error' : 'Connected'}
                        </span>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
