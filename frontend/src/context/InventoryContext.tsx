"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { products } from '@/data/products';

interface InventoryState {
    [productId: string]: {
        [size: string]: number;
    };
}

interface InventoryContextType {
    inventory: InventoryState;
    checkStock: (id: string, size: string) => number;
    decrementStock: (id: string, size: string, qty: number) => void;
    syncInventory: (products: { _id?: string, id?: string, sizes: { label: string, stock: number }[] }[]) => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export function InventoryProvider({ children }: { children: React.ReactNode }) {
    // Initializing inventory from localStorage or base product data
    const [inventory, setInventory] = useState<InventoryState>({});

    // Sync inventory from API results
    const syncInventory = useCallback((products: { _id?: string, id?: string, sizes: { label: string, stock: number }[] }[]) => {
        setInventory(prev => {
            const next = { ...prev };
            products.forEach(p => {
                const id = p._id || p.id;
                if (!id) return;
                next[id] = p.sizes.reduce((acc: Record<string, number>, s) => {
                    acc[s.label] = s.stock;
                    return acc;
                }, {});
            });
            return next;
        });
    }, []);

    const checkStock = useCallback((id: string, size: string) => {
        return inventory[id]?.[size] ?? 10; // Default to 10 if not synced yet to avoid flicker
    }, [inventory]);

    const decrementStock = useCallback((id: string, size: string, qty: number) => {
        setInventory(prev => {
            if (!prev[id]) return prev;
            return {
                ...prev,
                [id]: {
                    ...prev[id],
                    [size]: Math.max(0, (prev[id]?.[size] || 0) - qty)
                }
            };
        });
    }, []);

    return (
        <InventoryContext.Provider value={{ inventory, checkStock, decrementStock, syncInventory }}>
            {children}
        </InventoryContext.Provider>
    );
}

export const useInventory = () => {
    const context = useContext(InventoryContext);
    if (!context) throw new Error("useInventory must be used within InventoryProvider");
    return context;
};