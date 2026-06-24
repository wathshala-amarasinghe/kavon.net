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
}

interface CheckoutContextType {
    activeCheckoutItem: CheckoutItem | null;
    setBuyNowItem: (item: CheckoutItem) => void;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export function CheckoutProvider({ children }: { children: React.ReactNode }) {
    const [activeCheckoutItem, setActiveCheckoutItem] = useState<CheckoutItem | null>(null);

    const setBuyNowItem = (item: CheckoutItem) => {
        setActiveCheckoutItem(item);
    };

    return (
        <CheckoutContext.Provider value={{ activeCheckoutItem, setBuyNowItem }}>
            {children}
        </CheckoutContext.Provider>
    );
}

export const useCheckout = () => {
    const context = useContext(CheckoutContext);
    if (!context) throw new Error("useCheckout must be used within CheckoutProvider");
    return context;
};