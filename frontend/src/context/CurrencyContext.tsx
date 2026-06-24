"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type Currency = 'LKR' | 'USD' | 'EUR';

interface CurrencyContextType {
    currency: Currency;
    setCurrency: (c: Currency) => void;
    convert: (amount: number) => number;
    symbol: string;
    formatPrice: (amount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const RATES: Record<Currency, number> = {
    LKR: 1,
    USD: 1 / 300, // 1 USD = 300 LKR (Simulated)
    EUR: 1 / 325, // 1 EUR = 325 LKR (Simulated)
};

const SYMBOLS: Record<Currency, string> = {
    LKR: 'LKR',
    USD: '$',
    EUR: '€',
};

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
    const [currency, setCurrency] = useState<Currency>('LKR');

    useEffect(() => {
        const saved = localStorage.getItem('kavon_currency_v1') as Currency;
        if (saved) {
            setTimeout(() => setCurrency(saved), 0);
        } else {
            // Auto-detect based on IP (Simulated with fetch)
            fetch('https://ipapi.co/json/')
                .then(res => res.json())
                .then(data => {
                    if (data.country_code !== 'LK') {
                        setCurrency('USD');
                    }
                })
                .catch(() => console.log("GEO_SYNC_OFFLINE // DEFAULTING LKR"));
        }
    }, []);

    const updateCurrency = (c: Currency) => {
        setCurrency(c);
        localStorage.setItem('kavon_currency_v1', c);
    };

    const convert = (amount: number) => {
        return amount * RATES[currency];
    };

    const formatPrice = (amount: number) => {
        const converted = convert(amount);
        const sym = SYMBOLS[currency];
        
        if (currency === 'LKR') {
            return `${sym} ${amount.toLocaleString()}`;
        }
        
        return `${sym}${converted.toFixed(2)}`;
    };

    return (
        <CurrencyContext.Provider value={{ 
            currency, 
            setCurrency: updateCurrency, 
            convert, 
            symbol: SYMBOLS[currency],
            formatPrice
        }}>
            {children}
        </CurrencyContext.Provider>
    );
}

export const useCurrency = () => {
    const context = useContext(CurrencyContext);
    if (!context) throw new Error("useCurrency must be used within CurrencyProvider");
    return context;
};
