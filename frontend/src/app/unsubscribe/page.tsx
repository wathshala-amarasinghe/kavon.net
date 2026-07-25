"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { unsubscribeMarketing } from '@/lib/api';
import { MailMinus, ShieldAlert, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

function UnsubscribeContent() {
    const searchParams = useSearchParams();
    const email = searchParams.get('email');
    const token = searchParams.get('token');

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const processUnsubscribe = async () => {
            if (!email || !token) {
                setStatus('error');
                setErrorMessage('Missing required termination parameters.');
                return;
            }

            try {
                await unsubscribeMarketing(email, token);
                setStatus('success');
            } catch (err: any) {
                setStatus('error');
                setErrorMessage(err.message || 'Failed to terminate communications.');
            }
        };

        processUnsubscribe();
    }, [email, token]);

    if (status === 'loading') {
        return (
            <div className="text-center space-y-6">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-volt border-t-transparent mx-auto" />
                <h1 className="text-2xl font-black italic uppercase text-white tracking-widest">Processing...</h1>
                <p className="text-[12px] font-mono text-white/40 uppercase tracking-widest">
                    Terminating marketing communications for {email}
                </p>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="text-center space-y-6">
                <ShieldAlert size={48} className="text-red-500 mx-auto" />
                <h1 className="text-3xl md:text-4xl font-black italic uppercase text-white tracking-widest">Action Failed</h1>
                <p className="text-[12px] font-mono text-white/60 uppercase tracking-widest max-w-md mx-auto leading-relaxed">
                    {errorMessage}
                </p>
                <Link href="/" className="inline-block mt-8 text-white font-mono text-[12px] uppercase tracking-[0.4em] border border-white/20 px-8 py-4 hover:bg-white/5 transition-colors">
                    Return to HQ
                </Link>
            </div>
        );
    }

    return (
        <div className="text-center space-y-6">
            <MailMinus size={48} className="text-brand-volt mx-auto" />
            <h1 className="text-3xl md:text-4xl font-black italic uppercase text-white tracking-widest">Unsubscribed</h1>
            
            <div className="space-y-4 max-w-md mx-auto">
                <p className="text-[12px] font-mono text-white/60 uppercase tracking-widest leading-relaxed">
                    Communications successfully terminated for:
                </p>
                <p className="text-sm font-mono text-brand-volt font-bold uppercase tracking-wider bg-brand-volt/5 py-3 px-4 border border-brand-volt/20 inline-block">
                    {email}
                </p>
                <div className="flex items-start gap-3 text-left mt-8 p-4 bg-white/[0.02] border border-white/5">
                    <CheckCircle2 size={16} className="text-brand-volt shrink-0 mt-0.5" />
                    <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest leading-relaxed">
                        You have been removed from our marketing lists. You will no longer receive drops, offers, or promotional updates. Transactional emails (e.g. order confirmations) will still be delivered.
                    </p>
                </div>
            </div>

            <Link href="/" className="inline-block mt-8 text-brand-volt font-mono text-[12px] uppercase tracking-[0.4em] border border-brand-volt/20 px-8 py-4 hover:bg-brand-volt/10 transition-colors font-bold">
                Acknowledge
            </Link>
        </div>
    );
}

export default function UnsubscribePage() {
    return (
        <main className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-volt to-transparent opacity-50" />
            
            <div className="w-full max-w-xl bg-black/40 border border-white/10 p-12 backdrop-blur-sm relative z-10">
                <Suspense fallback={
                    <div className="text-center space-y-6">
                        <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-volt border-t-transparent mx-auto" />
                        <h1 className="text-2xl font-black italic uppercase text-white tracking-widest">Loading...</h1>
                    </div>
                }>
                    <UnsubscribeContent />
                </Suspense>
            </div>
        </main>
    );
}
