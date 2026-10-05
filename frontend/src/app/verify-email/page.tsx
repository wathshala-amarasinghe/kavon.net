"use client";

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertCircle, CheckCircle2, LoaderCircle, RefreshCw } from 'lucide-react';
import { ApiError, verifyEmail } from '@/lib/api';

type VerificationState = 'verifying' | 'success' | 'invalid' | 'expired';

// React Strict Mode can remount a page during development. Reusing the same
// promise prevents the single-use token from being submitted twice.
const verificationRequests = new Map<string, Promise<unknown>>();

const submitVerificationOnce = (token: string) => {
    const existingRequest = verificationRequests.get(token);
    if (existingRequest) return existingRequest;
    const request = verifyEmail(token);
    verificationRequests.set(token, request);
    return request;
};

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token') || '';
    const [state, setState] = useState<VerificationState>(
        token ? 'verifying' : 'invalid'
    );
    const [message, setMessage] = useState(
        token ? 'Verifying your email address…' : 'This verification link is invalid.'
    );
    const router = useRouter();

    useEffect(() => {
        if (!token) return;

        let active = true;
        let redirectTimer: number | undefined;

        submitVerificationOnce(token)
            .then(() => {
                if (!active) return;
                setState('success');
                setMessage('Your email has been verified. You can now sign in.');
                redirectTimer = window.setTimeout(
                    () => router.replace('/login?verified=true'),
                    2200
                );
            })
            .catch((error: unknown) => {
                if (!active) return;
                if (error instanceof ApiError && error.code === 'VERIFICATION_EXPIRED') {
                    setState('expired');
                    setMessage('This verification link has expired.');
                    return;
                }
                setState('invalid');
                setMessage(
                    error instanceof Error
                        ? error.message
                        : 'This verification link is invalid.'
                );
            });

        return () => {
            active = false;
            if (redirectTimer) window.clearTimeout(redirectTimer);
        };
    }, [router, token]);

    const icon =
        state === 'verifying' ? (
            <LoaderCircle className="h-10 w-10 animate-spin text-brand-volt" />
        ) : state === 'success' ? (
            <CheckCircle2 className="h-10 w-10 text-emerald-400" />
        ) : (
            <AlertCircle className="h-10 w-10 text-red-400" />
        );

    return (
        <div className="min-h-screen bg-brand-black px-6 pb-20 pt-40 text-white">
            <div className="mx-auto w-full max-w-lg border border-white/10 bg-brand-surface p-8 text-center shadow-2xl md:p-12">
                <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center border border-white/10 bg-black/40">
                    {icon}
                </div>
                <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.35em] text-brand-volt">
                    Email verification
                </p>
                <h1 className="mb-4 text-3xl font-black uppercase italic">
                    {state === 'verifying' && 'Verifying'}
                    {state === 'success' && 'Verification complete'}
                    {state === 'invalid' && 'Invalid link'}
                    {state === 'expired' && 'Link expired'}
                </h1>
                <p className="text-sm leading-7 text-white/60">{message}</p>

                {state === 'success' && (
                    <p className="mt-5 font-mono text-[10px] uppercase tracking-widest text-white/30">
                        Redirecting to sign in…
                    </p>
                )}

                {(state === 'invalid' || state === 'expired') && (
                    <div className="mt-8 space-y-3">
                        <Link
                            href="/check-email"
                            className="flex w-full items-center justify-center gap-3 bg-brand-volt px-5 py-5 text-xs font-black uppercase tracking-[0.2em] text-black"
                        >
                            <RefreshCw className="h-4 w-4" />
                            Send a new link
                        </Link>
                        <Link
                            href="/login"
                            className="block border border-white/10 px-5 py-4 text-xs font-bold uppercase tracking-widest text-white/60 hover:text-white"
                        >
                            Back to sign in
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-brand-black flex items-center justify-center font-mono text-brand-volt uppercase tracking-widest text-xs animate-pulse">
                    Verifying…
                </div>
            }
        >
            <VerifyEmailContent />
        </Suspense>
    );
}
