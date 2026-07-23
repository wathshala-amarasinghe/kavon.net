"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useWishlist, WishlistItem } from './WishlistContext';
import { validateCoupon } from '@/lib/api';
import {
    cartsAreEqual,
    getFirstAvailableSize,
    normalizeCartItems,
    sameCartLine,
} from '@/lib/storefront-runtime';

export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    size: string;
    image: string;
    color?: string;
    isBundle?: boolean; // NEW: Track bundle items for pricing logic
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: string, size: string, isBundle?: boolean, color?: string) => void;
    updateQuantity: (id: string, size: string, delta: number, isBundle?: boolean, color?: string) => void;
    moveToWishlist: (id: string, size: string, isBundle?: boolean, color?: string) => Promise<void>;
    applyCoupon: (code: string, amount?: number) => Promise<boolean>;
    subtotal: number;
    discount: number;
    shippingFee: number;
    total: number;
    cartCount: number;
    isLoaded: boolean;
    activeCoupon: string | null;
    couponError: string | null;
    getCouponDiscount: (amount: number) => number;
    clearCart: () => void;
    moveWishlistToCart: (item: WishlistItem) => void;
    isPointsRedeemed: boolean;
    setIsPointsRedeemed: (val: boolean) => void;
    pointsDiscount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [activeCoupon, setActiveCoupon] = useState<string | null>(null);
    const [couponData, setCouponData] = useState<{
        discountType: 'Percentage' | 'Fixed';
        discountValue: number;
        minOrderAmount: number;
    } | null>(null);
    const [couponError, setCouponError] = useState<string | null>(null);
    const [isPointsRedeemed, setIsPointsRedeemed] = useState(false);
    const { toggleWishlist, isInWishlist } = useWishlist();
    const channelRef = useRef<BroadcastChannel | null>(null);

    useEffect(() => {
        let disposed = false;
        const applySynchronizedCart = (value: unknown) => {
            const synchronized = normalizeCartItems(value);
            setCart((current) => cartsAreEqual(current, synchronized) ? current : synchronized);
        };
        const handleStorage = (event: StorageEvent) => {
            if (event.key !== 'kavon-manifest-v1') return;
            try {
                applySynchronizedCart(event.newValue ? JSON.parse(event.newValue) : []);
            } catch {
                applySynchronizedCart([]);
            }
        };

        if (typeof BroadcastChannel !== 'undefined') {
            const channel = new BroadcastChannel('kavon_sync_sector');
            channel.onmessage = (event) => {
                if (event.data?.type === 'CART_SYNC') {
                    applySynchronizedCart(event.data.payload);
                }
            };
            channelRef.current = channel;
        }
        window.addEventListener('storage', handleStorage);

        let initialCart: CartItem[] = [];
        const savedCart = localStorage.getItem('kavon-manifest-v1');
        if (savedCart) {
            try {
                initialCart = normalizeCartItems(JSON.parse(savedCart));
            } catch {
                localStorage.removeItem('kavon-manifest-v1');
            }
        }
        queueMicrotask(() => {
            if (disposed) return;
            setCart(initialCart);
            setIsLoaded(true);
        });

        return () => {
            disposed = true;
            window.removeEventListener('storage', handleStorage);
            channelRef.current?.close();
            channelRef.current = null;
        };
    }, []);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('kavon-manifest-v1', JSON.stringify(cart));
            channelRef.current?.postMessage({ type: 'CART_SYNC', payload: cart });
        }
    }, [cart, isLoaded]);

    const addToCart = (newItem: CartItem) => {
        const normalizedItem = normalizeCartItems([newItem])[0];
        if (!normalizedItem) return;

        setCart(prev => {
            const existing = prev.find((item) => sameCartLine(item, normalizedItem));
            if (existing) {
                return prev.map((item) =>
                    sameCartLine(item, normalizedItem)
                        ? { ...item, quantity: Math.min(20, item.quantity + normalizedItem.quantity) }
                        : item
                );
            }
            return [...prev, normalizedItem];
        });
    };

    const removeFromCart = (id: string, size: string, isBundle?: boolean, color?: string) => {
        setCart((current) => current.filter((item) => !sameCartLine(item, { id, size, isBundle, color })));
    };

    const updateQuantity = (id: string, size: string, delta: number, isBundle?: boolean, color?: string) => {
        setCart((current) => current.map((item) => (
            sameCartLine(item, { id, size, isBundle, color })
                ? { ...item, quantity: Math.min(20, Math.max(1, item.quantity + delta)) }
                : item
        )));
    };

    const moveToWishlist = async (id: string, size: string, isBundle?: boolean, color?: string) => {
        const item = cart.find((candidate) => sameCartLine(candidate, { id, size, isBundle, color }));
        if (item) {
            const saved = isInWishlist(id) || await toggleWishlist({ ...item });
            if (saved) removeFromCart(id, size, isBundle, color);
        }
    };

    const applyCoupon = async (code: string, amount = subtotal) => {
        setCouponError(null);
        try {
            const coupon = await validateCoupon(code, amount);
            setActiveCoupon(coupon.code);
            setCouponData({
                discountType: coupon.discountType,
                discountValue: Number(coupon.discountValue) || 0,
                minOrderAmount: Number(coupon.minOrderAmount) || 0,
            });
            return true;
        } catch (error) {
            setActiveCoupon(null);
            setCouponData(null);
            setCouponError(error instanceof Error ? error.message : 'Invalid promotion code');
            return false;
        }
    };

    const subtotal = cart.reduce((acc, i) => acc + (i.price * i.quantity), 0);
    const getCouponDiscount = (amount: number) => {
        if (!couponData || amount < couponData.minOrderAmount) return 0;
        return couponData.discountType === 'Percentage'
            ? amount * Math.min(100, Math.max(0, couponData.discountValue)) / 100
            : Math.min(amount, Math.max(0, couponData.discountValue));
    };
    const discount = getCouponDiscount(subtotal);
    const pointsDiscount = isPointsRedeemed ? (subtotal - discount) * 0.05 : 0;
    const shippingFee = subtotal >= 10000 || subtotal === 0 ? 0 : 500;
    const total = subtotal - discount - pointsDiscount + shippingFee;
    const cartCount = cart.reduce((acc, i) => acc + i.quantity, 0);

    const clearCart = () => {
        setCart([]);
        setActiveCoupon(null);
        setCouponData(null);
        setCouponError(null);
        localStorage.removeItem('kavon-manifest-v1');
    };

    const moveWishlistToCart = (item: WishlistItem) => {
        const size = item.size || getFirstAvailableSize({ sizes: item.sizes || [] }) || 'M';

        addToCart({
            ...item,
            quantity: 1,
            size,
            color: item.colors?.[0]?.name,
        });
    };

    return (
        <CartContext.Provider value={{
            cart, addToCart, removeFromCart, updateQuantity, moveToWishlist,
            applyCoupon, subtotal, discount, shippingFee, total, cartCount, isLoaded, activeCoupon, couponError, getCouponDiscount,
            clearCart, moveWishlistToCart,
            isPointsRedeemed, setIsPointsRedeemed, pointsDiscount
        }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart Provider Missing");
    return context;
};
