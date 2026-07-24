"use client";

import React, { useState, useEffect } from 'react';
import { useCheckout } from "@/context/CheckoutContext";
import { useRouter } from "next/navigation";
import { ArrowLeft, MailWarning, RefreshCw } from "lucide-react";
import Link from "next/link";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { PaymentProtocol } from "@/components/checkout/PaymentProtocol";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { DeliveryProtocol } from "@/components/checkout/DeliveryProtocol";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useSettings } from "@/context/UserSettingsContext";
import { calculateTacticalShipping } from "@/lib/logistics";
import { resendVerificationEmail } from "@/lib/api";

export default function CheckoutPage() {
    const {
        activeCheckoutItem,
        setShippingAddress,
        paymentMethod,
        setPaymentMethod,
        isLoaded: isCheckoutLoaded,
    } = useCheckout();
    const { cart, subtotal, isLoaded: isCartLoaded } = useCart();
    const { user, loading } = useAuth();
    const router = useRouter();
    const { location } = useSettings();
    const [step, setStep] = useState(1);
    const [isCompletingOrder, setIsCompletingOrder] = useState(false);
    const [isResendingVerification, setIsResendingVerification] = useState(false);
    const [verificationMessage, setVerificationMessage] = useState("");
    const [deliveryMethod, setDeliveryMethod] = useState({ 
        id: 'standard', 
        price: calculateTacticalShipping(subtotal, location) 
    });

    const activeSubtotal = activeCheckoutItem ? (activeCheckoutItem.price * activeCheckoutItem.quantity) : subtotal;

    // Derived effective price
    const effectiveDeliveryPrice = deliveryMethod.id === 'standard' ? calculateTacticalShipping(activeSubtotal, location) : deliveryMethod.price;

    // Security Check: Authorized Personnel Only
    useEffect(() => {
        if (!loading && !user) {
            router.replace('/login?redirect=checkout');
        }
    }, [user, loading, router]);

    // Cart Readiness Check
    useEffect(() => {
        if (
            !loading
            && isCartLoaded
            && isCheckoutLoaded
            && user
            && !isCompletingOrder
            && !activeCheckoutItem
            && cart.length === 0
        ) {
            router.replace('/shop');
        }
    }, [activeCheckoutItem, cart, isCartLoaded, isCheckoutLoaded, isCompletingOrder, loading, router, user]);

    if (loading || !isCartLoaded || !isCheckoutLoaded) return (
        <div className="min-h-screen bg-brand-black flex items-center justify-center font-mono text-brand-volt uppercase tracking-widest text-xs animate-pulse">
            Syncing...
        </div>
    );

    if (!user || (!activeCheckoutItem && cart.length === 0)) return null;

    if (user.emailVerified === false) {
        const handleResendVerification = async () => {
            setIsResendingVerification(true);
            setVerificationMessage("");
            try {
                const response = await resendVerificationEmail(user.email);
                setVerificationMessage(response.message);
            } catch (error) {
                setVerificationMessage(
                    error instanceof Error
                        ? error.message
                        : "Unable to request a verification email right now."
                );
            } finally {
                setIsResendingVerification(false);
            }
        };

        return (
            <div className="min-h-screen bg-brand-black px-6 pb-20 pt-44 text-white">
                <div className="mx-auto max-w-xl border border-brand-volt/30 bg-brand-surface p-8 text-center shadow-2xl md:p-12">
                    <MailWarning className="mx-auto mb-7 h-12 w-12 text-brand-volt" />
                    <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.35em] text-brand-volt">
                        Verification required
                    </p>
                    <h1 className="mb-5 text-3xl font-black uppercase italic">
                        Verify before checkout
                    </h1>
                    <p className="mx-auto max-w-md text-sm leading-7 text-white/60">
                        Please verify your email before completing your purchase. We will
                        send the verification link to <span className="text-white">{user.email}</span>.
                    </p>
                    {verificationMessage && (
                        <p className="mt-6 border border-white/10 bg-black/30 p-4 text-xs leading-6 text-white/60">
                            {verificationMessage}
                        </p>
                    )}
                    <button
                        type="button"
                        onClick={handleResendVerification}
                        disabled={isResendingVerification}
                        className="mt-8 flex w-full items-center justify-center gap-3 bg-brand-volt px-5 py-5 text-xs font-black uppercase tracking-[0.2em] text-black disabled:opacity-50"
                    >
                        <RefreshCw
                            className={`h-4 w-4 ${isResendingVerification ? "animate-spin" : ""}`}
                        />
                        {isResendingVerification ? "Sending" : "Resend verification email"}
                    </button>
                    <Link
                        href="/cart"
                        className="mt-4 block border border-white/10 px-5 py-4 text-xs font-bold uppercase tracking-widest text-white/60 hover:text-white"
                    >
                        Return to cart
                    </Link>
                </div>
            </div>
        );
    }

    const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    return (
        <div className="bg-brand-black min-h-screen text-white">
            <main className="pt-44 pb-20 px-6 max-w-[1400px] mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <Link href="/cart" className="flex items-center gap-2 text-white/40 hover:text-brand-volt font-mono text-[13px] uppercase tracking-widest transition-colors">
                        <ArrowLeft size={16} /> Back to Cart
                    </Link>
                    
                    {/* Mobile Step Indicator */}
                    <div className="md:hidden w-full border-y border-white/5 py-6">
                        <div className="flex justify-between items-end mb-4">
                            <div>
                                <span className="font-mono text-[12px] text-white/40 uppercase tracking-widest block mb-1">Step {step} of 3</span>
                                <span className="font-black italic uppercase text-xl tracking-tighter text-brand-volt">
                                    {step === 1 && "Shipping Details"}
                                    {step === 2 && "Delivery Method"}
                                    {step === 3 && "Secure Payment"}
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {[1, 2, 3].map(s => (
                                <div key={s} className={`h-1.5 flex-1 transition-all duration-500 ${s <= step ? 'bg-brand-volt' : 'bg-white/10'}`} />
                            ))}
                        </div>
                    </div>

                    {/* Desktop Step Indicator */}
                    <div className="hidden md:flex items-center gap-8 font-mono text-[12px] tracking-[0.2em] uppercase text-white/20">
                        <span className={step >= 1 ? "text-brand-volt font-bold" : ""}>01 SHIPPING</span>
                        <div className="w-8 h-[1px] bg-white/10" />
                        <span className={step >= 2 ? "text-brand-volt font-bold" : ""}>02 DELIVERY</span>
                        <div className="w-8 h-[1px] bg-white/10" />
                        <span className={step >= 3 ? "text-brand-volt font-bold" : ""}>03 PAYMENT</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    <div className="lg:col-span-7 space-y-20">
                        {step === 1 && (
                            <CheckoutForm onNext={(address) => {
                                setShippingAddress(address);
                                nextStep();
                            }} />
                        )}

                        {step === 2 && (
                            <div className="space-y-12">
                                <DeliveryProtocol 
                                    selectedId={deliveryMethod.id}
                                    onSelect={(m) => setDeliveryMethod({ id: m.id, price: m.price })}
                                    subtotal={activeSubtotal}
                                />
                                <div className="flex gap-4">
                                    <button onClick={prevStep} className="flex-1 py-5 border border-white/10 font-mono text-[13px] uppercase tracking-widest hover:bg-white/5">Back</button>
                                    <button onClick={nextStep} className="flex-1 py-5 bg-brand-volt text-black font-black uppercase text-[13px] tracking-widest">Continue to Payment</button>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-12">
                                <PaymentProtocol
                                    selectedMethod={paymentMethod}
                                    onMethodChange={(method) => setPaymentMethod(method as 'cod' | 'card')}
                                />
                                <button onClick={prevStep} className="w-full py-5 border border-white/10 font-mono text-[13px] uppercase tracking-widest hover:bg-white/5 font-bold">Back to Delivery</button>
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-5">
                        <OrderSummary 
                            selectedDeliveryPrice={effectiveDeliveryPrice} 
                            deliveryMethod={deliveryMethod.id}
                            deliverySector={location}
                            isFinalStep={step === 3}
                            onOrderCreated={() => setIsCompletingOrder(true)}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}
