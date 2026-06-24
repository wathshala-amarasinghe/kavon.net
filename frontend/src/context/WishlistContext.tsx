"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getWishlist, toggleWishlistApi } from '@/lib/api';

export interface WishlistItem {
    id: string;
    _id?: string;
    name: string;
    price: number;
    image: string;
}

interface WishlistContextType {
    wishlist: WishlistItem[];
    toggleWishlist: (product: WishlistItem) => void;
    isInWishlist: (id: string) => boolean;
    wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
    const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    // Sync with Backend Protocol
    useEffect(() => {
        const syncWithBackend = async () => {
            const token = localStorage.getItem('kavon-token-v1');
            if (token) {
                try {
                    const backendWishlist = await getWishlist(token);
                    
                    if (Array.isArray(backendWishlist)) {
                        // Map backend _id to id for frontend consistency and filter out nulls
                        const mapped = backendWishlist
                            .filter((item: unknown) => item !== null)
                            .map((item: Record<string, unknown>) => ({
                                ...item,
                                id: item._id as string
                            })) as WishlistItem[];
                        setWishlist(mapped);
                    }
                } catch (error: unknown) {
                    const msg = error instanceof Error ? error.message : "Unknown error";
                    if (msg.includes('401') || msg.toLowerCase().includes('authorized')) {
                        console.warn("WISHLIST_SYNC_UNAUTHORIZED: Token might be expired.");
                    } else {
                        console.error("WISHLIST_SYNC_FAILURE:", msg);
                    }
                }
            } else {
                // Fallback to local storage if not logged in
                const savedWishlist = localStorage.getItem('kavon_wishlist_v4');
                if (savedWishlist) {
                    try { setWishlist(JSON.parse(savedWishlist)); } catch (e) {}
                }
            }
            setIsInitialLoad(false);
        };
        syncWithBackend();
    }, []);

    // Local Persistence Protocol (only for guest mode or as a cache)
    useEffect(() => {
        if (!isInitialLoad) {
            localStorage.setItem('kavon_wishlist_v4', JSON.stringify(wishlist));
        }
    }, [wishlist, isInitialLoad]);

    const toggleWishlist = async (product: WishlistItem) => {
        const productId = product._id || product.id;
        const token = localStorage.getItem('kavon-token-v1');

        // Optimistic UI Update
        const isExist = wishlist.find(item => (item._id || item.id) === productId);
        
        if (isExist) {
            setWishlist(prev => prev.filter(item => (item._id || item.id) !== productId));
            toast.error('ASSET_DE-AUTHORIZED', {
                style: { borderRadius: '0px', background: '#000', color: '#ff4b4b', border: '1px solid #ff4b4b', fontSize: '10px', fontFamily: 'monospace' },
            });
        } else {
            setWishlist(prev => [...prev, product]);
            toast.success('ASSET_SECURED', {
                style: { borderRadius: '0px', background: '#000', color: '#df0715ff', border: '1px solid #df0715ff', fontSize: '10px', fontFamily: 'monospace' },
            });
        }

        // Backend Sync if logged in
        if (token) {
            try {
                const updated = await toggleWishlistApi(productId, token);
                if (Array.isArray(updated)) {
                    const mapped = updated
                        .filter((item: unknown) => item !== null)
                        .map((item: Record<string, unknown>) => ({
                            ...item,
                            id: item._id as string
                        })) as WishlistItem[];
                    setWishlist(mapped);
                }
            } catch (error: unknown) {
                console.error("BACKEND_TOGGLE_FAILURE:", error instanceof Error ? error.message : error);
                // Revert on failure could be added here
            }
        }
    };

    const isInWishlist = (id: string) => wishlist.some(item => (item._id || item.id) === id);
    const wishlistCount = wishlist.length;

    return (
        <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist, wishlistCount }}>
            {children}
        </WishlistContext.Provider>
    );
}

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) throw new Error("useWishlist must be used within WishlistProvider");
    return context;
};