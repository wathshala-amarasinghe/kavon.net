"use client";

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { MailCheck, RefreshCw, ArrowLeft, AlertCircle } from 'lucide-react';
import { resendVerificationEmail } from '@/lib/api';

const RESEND_COOLDOWN_SECONDS = 60;

const maskEmail = (email: string) => {
    const [localPart, domain] = email.split('@');
    if (!localPart || !domain) return email;
    const visible = localPart.slice(0, Math.min(2, localPart.length));
    return `${visible}${'*'.repeat(Math.max(3, localPart.length - visible.length))}@${domain}`;
};

export default function CheckEmailPage() {
    const [email, setEmail] = useState('');
    const [emailInput, setEmailInput] = useState('');
    const [secondsRemaining, setSecondsRemaining] = useState(0);
    const [initialEmailSent, setInitialEmailSent] = useState<boolean | null>(null);
    const [isSending, setIsSending] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const initializationTimer = window.setTimeout(() => {
            const storedEmail = sessionStorage.getItem('kavon-verification-email') || '';
            const lastSentAt = Number(
                sessionStorage.getItem('kavon-verification-last-sent-at') || 0
            );
            const storedDeliveryState = sessionStorage.getItem(
                'kavon-verification-email-sent'
            );
            setEmail(storedEmail);
            setEmailInput(storedEmail);
            setInitialEmailSent(
                storedDeliveryState === null ? null : storedDeliveryState === 'true'
            );
            if (lastSentAt > 0) {
                const elapsed = Math.floor((Date.now() - lastSentAt) / 1000);
                setSecondsRemaining(Math.max(0, RESEND_COOLDOWN_SECONDS - elapsed));
            }
        }, 0);
        return () => window.clearTimeout(initializationTimer);
    }, []);

    useEffect(() => {
        if (secondsRemaining <= 0) return;
        const timer = window.setInterval(
            () => setSecondsRemaining((current) => Math.max(0, current - 1)),
            1000
        );
        return () => window.clearInterval(timer);
    }, [secondsRemaining]);

    const displayedEmail = useMemo(() => maskEmail(email), [email]);

    const handleResend = async (event: React.FormEvent) => {
        event.preventDefault();
        const targetEmail = (email || emailInput).trim().toLowerCase();
        if (!targetEmail) {
            setError('Enter the email address used to create your account.');
            return;
        }

        setIsSending(true);
        setError('');
        setMessage('');
        try {
            const response = await resendVerificationEmail(targetEmail);
            setEmail(targetEmail);
            sessionStorage.setItem('kavon-verification-email', targetEmail);
            sessionStorage.setItem(
                'kavon-verification-last-sent-at',
                Date.now().toString()
            );
            setSecondsRemaining(RESEND_COOLDOWN_SECONDS);
            setMessage(response.message);
        } catch (requestError) {
            setError(
                requestError instanceof Error
                    ? requestError.message
                    : 'Unable to request an email right now.'
            );
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-black px-6 pb-20 pt-40 text-white">
            <div className="mx-auto w-full max-w-lg border border-white/10 bg-brand-surface p-8 shadow-2xl md:p-12">
                <div className="mb-8 flex h-16 w-16 items-center justify-center border border-brand-volt/40 bg-brand-volt/10">
                    <MailCheck className="h-8 w-8 text-brand-volt" />
                </div>

                <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.35em] text-brand-volt">
                    Account verification
                </p>
                <h1 className="mb-4 text-4xl font-black uppercase italic tracking-tight">
                    Check your email
                </h1>
                <p className="mb-8 text-sm leading-7 text-white/60">
                    {email ? (
                        initialEmailSent === false ? (
                            <>
                                We could not confirm that a new email was sent to{' '}
                                <span className="font-semibold text-white">{displayedEmail}</span>.
                                Request another link below, or sign in if this account already
                                exists.
                            </>
                        ) : (
                            <>
                                Check{' '}
                                <span className="font-semibold text-white">{displayedEmail}</span>{' '}
                                for a verification link, then select{' '}
                                <strong>Verify My Email</strong>.
                            </>
                        )
                    ) : (
                        'Enter the email address used to create your KAVON account to request a verification link.'
                    )}
                </p>

                <form onSubmit={handleResend} className="space-y-4">
                    {!email && (
                        <div>
                            <label
                                htmlFor="verification-email"
                                className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-white/50"
                            >
                                Email address
                            </label>
                            <input
                                id="verification-email"
                                type="email"
                                required
                                autoComplete="email"
                                value={emailInput}
                                onChange={(event) => setEmailInput(event.target.value)}
                                className="w-full border border-white/10 bg-black/50 px-4 py-4 text-sm outline-none transition-colors focus:border-brand-volt"
                            />
                        </div>
                    )}

                    {message && (
                        <p className="border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs leading-6 text-emerald-300">
                            {message}
                        </p>
                    )}
                    {error && (
                        <p className="flex items-start gap-2 border border-red-500/30 bg-red-500/10 p-4 text-xs leading-6 text-red-300">
                            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={isSending || secondsRemaining > 0}
                        className="flex w-full items-center justify-center gap-3 bg-brand-volt px-5 py-5 text-xs font-black uppercase tracking-[0.25em] text-black transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <RefreshCw className={`h-4 w-4 ${isSending ? 'animate-spin' : ''}`} />
                        {isSending
                            ? 'Sending'
                            : secondsRemaining > 0
                              ? `Resend in ${secondsRemaining}s`
                              : 'Resend email'}
                    </button>
                </form>

                <Link
                    href="/login"
                    className="mt-6 flex items-center justify-center gap-2 border border-white/10 px-5 py-4 text-xs font-bold uppercase tracking-widest text-white/60 transition-colors hover:border-white/30 hover:text-white"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to sign in
                </Link>
            </div>
        </div>
    );
}
