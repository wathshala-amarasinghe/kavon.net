"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { normalizeCartItems } from '@/lib/storefront-runtime';

interface CheckoutItem {
    id: string;
    name: string;
    price: number;
    image: string;
    color: string;
    size: string;
    quantity: number;
    isBundle?: boolean;
}

export interface ShippingAddress {
    fullName: string;
    phone: string;
    secondaryPhone?: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
}

interface CheckoutContextType {
    activeCheckoutItem: CheckoutItem | null;
    setBuyNowItem: (item: CheckoutItem) => void;
    clearBuyNowItem: () => void;
    shippingAddress: ShippingAddress | null;
    setShippingAddress: (address: ShippingAddress) => void;
    paymentMethod: 'cod' | 'card';
    setPaymentMethod: (method: 'cod' | 'card') => void;
    isLoaded: boolean;
}

const CHECKOUT_SESSION_KEY = 'kavon_checkout_session_v1';
const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export function CheckoutProvider({ children }: { children: React.ReactNode }) {
    const [activeCheckoutItem, setActiveCheckoutItem] = useState<CheckoutItem | null>(null);
    const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card'>('cod');
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        let disposed = false;
        let restoredItem: CheckoutItem | null = null;
        let restoredAddress: ShippingAddress | null = null;

        try {
            const saved = JSON.parse(sessionStorage.getItem(CHECKOUT_SESSION_KEY) || '{}');
            const item = normalizeCartItems(saved.activeCheckoutItem)[0];
            if (item) restoredItem = { ...item, color: item.color || 'Default' };
            if (saved.shippingAddress && typeof saved.shippingAddress === 'object') {
                restoredAddress = saved.shippingAddress as ShippingAddress;
            }
        } catch {
            sessionStorage.removeItem(CHECKOUT_SESSION_KEY);
        }

        queueMicrotask(() => {
            if (disposed) return;
            setActiveCheckoutItem(restoredItem);
            setShippingAddress(restoredAddress);
            setIsLoaded(true);
        });

        return () => {
            disposed = true;
        };
    }, []);

    useEffect(() => {
        if (!isLoaded) return;
        sessionStorage.setItem(CHECKOUT_SESSION_KEY, JSON.stringify({
            activeCheckoutItem: activeCheckoutItem ? [activeCheckoutItem] : [],
            shippingAddress,
        }));
    }, [activeCheckoutItem, shippingAddress, isLoaded]);

    const setBuyNowItem = (item: CheckoutItem) => {
        setActiveCheckoutItem(item);
    };

    const clearBuyNowItem = () => setActiveCheckoutItem(null);

    return (
        <CheckoutContext.Provider value={{
            activeCheckoutItem,
            setBuyNowItem,
            clearBuyNowItem,
            shippingAddress,
            setShippingAddress,
            paymentMethod,
            setPaymentMethod,
            isLoaded,
        }}>
            {children}
        </CheckoutContext.Provider>
    );
}

export const useCheckout = () => {
    const context = useContext(CheckoutContext);
    if (!context) throw new Error("useCheckout must be used within CheckoutProvider");
    return context;
};
