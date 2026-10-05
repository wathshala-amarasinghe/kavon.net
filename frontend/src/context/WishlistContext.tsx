"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getWishlist, toggleWishlistApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import {
    normalizeWishlistItem,
    normalizeWishlistItems,
    RuntimeWishlistItem,
} from '@/lib/storefront-runtime';

export type WishlistItem = RuntimeWishlistItem;

interface WishlistContextType {
    wishlist: WishlistItem[];
    toggleWishlist: (product: WishlistItem) => Promise<boolean>;
    isInWishlist: (id: string) => boolean;
    wishlistCount: number;
    isLoaded: boolean;
}

const GUEST_WISHLIST_KEY = 'kavon_wishlist_guest_v1';
const LEGACY_WISHLIST_KEY = 'kavon_wishlist_v4';
const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const readGuestWishlist = (includeLegacy = true) => {
    const saved = localStorage.getItem(GUEST_WISHLIST_KEY)
        || (includeLegacy ? localStorage.getItem(LEGACY_WISHLIST_KEY) : null);
    if (!saved) return [];

    try {
        return normalizeWishlistItems(JSON.parse(saved));
    } catch {
        localStorage.removeItem(GUEST_WISHLIST_KEY);
        localStorage.removeItem(LEGACY_WISHLIST_KEY);
        return [];
    }
};

export function WishlistProvider({ children }: { children: React.ReactNode }) {
    const { user, loading: authLoading } = useAuth();
    const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (authLoading) return;

        let cancelled = false;
        const syncWishlist = async () => {
            const token = localStorage.getItem('kavon-token-v1');

            if (user && token) {
                try {
                    let synchronized = normalizeWishlistItems(await getWishlist(token));
                    const guestItems = readGuestWishlist(false);
                    const backendIds = new Set(synchronized.map((item) => item.id));

                    for (const guestItem of guestItems) {
                        if (backendIds.has(guestItem.id)) continue;
                        synchronized = normalizeWishlistItems(
                            await toggleWishlistApi(guestItem.id, token)
                        );
                        backendIds.add(guestItem.id);
                    }

                    if (!cancelled) {
                        setWishlist(synchronized);
                        localStorage.removeItem(GUEST_WISHLIST_KEY);
                        localStorage.removeItem(LEGACY_WISHLIST_KEY);
                    }
                } catch (error: unknown) {
                    const message = error instanceof Error ? error.message : 'Unknown error';
                    console.error('WISHLIST_SYNC_FAILURE:', message);
                    if (!cancelled) setWishlist([]);
                }
            } else if (!cancelled) {
                setWishlist(readGuestWishlist());
            }

            if (!cancelled) setIsLoaded(true);
        };

        void syncWishlist();
        return () => {
            cancelled = true;
        };
    }, [authLoading, user]);

    useEffect(() => {
        if (!isLoaded || user) return;
        localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(wishlist));
        localStorage.removeItem(LEGACY_WISHLIST_KEY);
    }, [wishlist, isLoaded, user]);

    const toggleWishlist = async (product: WishlistItem) => {
        const normalizedProduct = normalizeWishlistItem(product);
        if (!normalizedProduct) return false;

        const productId = normalizedProduct.id;
        const token = localStorage.getItem('kavon-token-v1');
        const previousWishlist = wishlist;
        const exists = wishlist.some((item) => item.id === productId);

        if (exists) {
            setWishlist((current) => current.filter((item) => item.id !== productId));
            toast.error('ASSET_DE-AUTHORIZED', {
                style: { borderRadius: '0px', background: '#000', color: '#ff4b4b', border: '1px solid #ff4b4b', fontSize: '10px', fontFamily: 'monospace' },
            });
        } else {
            setWishlist((current) => [...current, normalizedProduct]);
            toast.success('ASSET_SECURED', {
                style: { borderRadius: '0px', background: '#000', color: '#df0715ff', border: '1px solid #df0715ff', fontSize: '10px', fontFamily: 'monospace' },
            });
        }

        if (token && user) {
            try {
                setWishlist(normalizeWishlistItems(await toggleWishlistApi(productId, token)));
            } catch (error: unknown) {
                console.error('BACKEND_TOGGLE_FAILURE:', error instanceof Error ? error.message : error);
                setWishlist(previousWishlist);
                toast.error('WISHLIST_SYNC_FAILED');
                return false;
            }
        }

        return true;
    };

    const isInWishlist = (id: string) => wishlist.some((item) => item.id === id);

    return (
        <WishlistContext.Provider value={{
            wishlist,
            toggleWishlist,
            isInWishlist,
            wishlistCount: wishlist.length,
            isLoaded,
        }}>
            {children}
        </WishlistContext.Provider>
    );
}

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) throw new Error('useWishlist must be used within WishlistProvider');
    return context;
};
