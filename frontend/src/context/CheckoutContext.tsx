"use client";

import React, { createContext, useContext, useState } from 'react';

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
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export function CheckoutProvider({ children }: { children: React.ReactNode }) {
    const [activeCheckoutItem, setActiveCheckoutItem] = useState<CheckoutItem | null>(null);
    const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card'>('cod');

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
