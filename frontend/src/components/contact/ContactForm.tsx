"use client";

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';

export function ContactForm() {
    const formRef = useRef<HTMLFormElement>(null);
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formRef.current) return;

        setStatus('sending');

        // Replace these strings with your actual IDs from EmailJS
        const SERVICE_ID = 'service_8m8xecf';
        const TEMPLATE_ID = 'template_vdoyytn';
        const PUBLIC_KEY = 'iwawzuJjOqQ-hGU2_';

        emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, PUBLIC_KEY)
            .then(() => {
                setStatus('success');
                formRef.current?.reset();
                setTimeout(() => setStatus('idle'), 5000);
            })
            .catch((error) => {
                console.error('EmailJS Error:', error);
                setStatus('error');
                setTimeout(() => setStatus('idle'), 5000);
            });
    };

    return (
        <div className="bg-brand-surface border border-white/5 p-10 md:p-16 relative overflow-hidden">
            <div className="relative z-10">
                <h2 className="text-2xl font-heading italic uppercase mb-12">Submit_Inquiry</h2>

                <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[9px] font-mono text-white/30 uppercase tracking-widest">Full_Name</label>
                            <input
                                required
                                name="from_name"
                                type="text"
                                className="w-full bg-transparent border-b border-white/10 py-3 focus:outline-none focus:border-brand-volt transition-colors font-mono text-xs"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-mono text-white/30 uppercase tracking-widest">Email_Address</label>
                            <input
                                required
                                name="reply_to"
                                type="email"
                                className="w-full bg-transparent border-b border-white/10 py-3 focus:outline-none focus:border-brand-volt transition-colors font-mono text-xs"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[9px] font-mono text-white/30 uppercase tracking-widest">Inquiry_Subject</label>
                        <select
                            name="subject"
                            className="w-full bg-transparent border-b border-white/10 py-3 focus:outline-none focus:border-brand-volt transition-colors font-mono text-xs uppercase"
                        >
                            <option className="bg-brand-black" value="Order Issue">Order Issue</option>
                            <option className="bg-brand-black" value="Product Question">Product Question</option>
                            <option className="bg-brand-black" value="General Inquiry">General Inquiry</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[9px] font-mono text-white/30 uppercase tracking-widest">Message_Body</label>
                        <textarea
                            required
                            name="message"
                            rows={4}
                            className="w-full bg-transparent border-b border-white/10 py-3 focus:outline-none focus:border-brand-volt transition-colors font-mono text-xs resize-none"
                        />
                    </div>

                    <button
                        disabled={status === 'sending'}
                        className={`w-full py-5 font-black uppercase text-xs tracking-[0.4em] transition-all flex items-center justify-center gap-4 group ${status === 'success' ? 'bg-brand-volt text-black' : 'bg-white text-black hover:bg-brand-volt'
                            }`}
                    >
                        {status === 'idle' && (
                            <>
                                Transmit_Data <Send size={14} className="group-hover:translate-x-2 transition-transform" />
                            </>
                        )}
                        {status === 'sending' && (
                            <>
                                Transmitting... <Send size={14} className="animate-pulse" />
                            </>
                        )}
                        {status === 'success' && (
                            <>
                                Message_Sent <CheckCircle2 size={14} />
                            </>
                        )}
                        {status === 'error' && (
                            <>
                                Transmission_Failed <AlertCircle size={14} />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}