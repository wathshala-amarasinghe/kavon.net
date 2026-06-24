"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/data/products';
import { useWishlist, WishlistItem } from './WishlistContext';

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
    removeFromCart: (id: string, size: string, isBundle?: boolean) => void;
    updateQuantity: (id: string, size: string, delta: number, isBundle?: boolean) => void;
    moveToWishlist: (id: string, size: string, isBundle?: boolean) => void;
    applyCoupon: (code: string) => boolean;
    subtotal: number;
    discount: number;
    shippingFee: number;
    total: number;
    cartCount: number;
    isLoaded: boolean;
    activeCoupon: string | null;
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
    const [isPointsRedeemed, setIsPointsRedeemed] = useState(false);
    const { toggleWishlist } = useWishlist();

    useEffect(() => {
        const channel = new BroadcastChannel('kavon_sync_sector');
        
        channel.onmessage = (event) => {
            if (event.data.type === 'CART_SYNC') {
                setCart(event.data.payload);
            }
        };

        const savedCart = localStorage.getItem('kavon-manifest-v1');
        if (savedCart) {
            try { 
                const parsed = JSON.parse(savedCart);
                setTimeout(() => setCart(parsed), 0);
            } catch (e) { console.error("CORRUPTION"); }
        }
        setTimeout(() => setIsLoaded(true), 0);

        return () => channel.close();
    }, []);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('kavon-manifest-v1', JSON.stringify(cart));
            
            // Broadcast to other tabs
            const channel = new BroadcastChannel('kavon_sync_sector');
            channel.postMessage({ type: 'CART_SYNC', payload: cart });
            setTimeout(() => channel.close(), 10);
        }
    }, [cart, isLoaded]);

    const addToCart = (newItem: CartItem) => {
        setCart(prev => {
            // Check for match including isBundle flag to avoid merging discounted items with regular ones
            const existing = prev.find(i => 
                i.id === newItem.id && 
                i.size === newItem.size && 
                i.isBundle === newItem.isBundle
            );
            if (existing) {
                return prev.map(i => 
                    (i.id === newItem.id && i.size === newItem.size && i.isBundle === newItem.isBundle) 
                        ? { ...i, quantity: i.quantity + newItem.quantity } 
                        : i
                );
            }
            return [...prev, newItem];
        });
    };

    const removeFromCart = (id: string, size: string, isBundle?: boolean) => {
        setCart(prev => prev.filter(i => !(i.id === id && i.size === size && i.isBundle === isBundle)));
    };

    const updateQuantity = (id: string, size: string, delta: number, isBundle?: boolean) => {
        setCart(prev => prev.map(i => (i.id === id && i.size === size && i.isBundle === isBundle) ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i));
    };

    const moveToWishlist = (id: string, size: string, isBundle?: boolean) => {
        const item = cart.find(i => i.id === id && i.size === size && i.isBundle === isBundle);
        if (item) {
            toggleWishlist({ ...item });
            removeFromCart(id, size, isBundle);
        }
    };

    const applyCoupon = (code: string) => {
        if (code.toUpperCase() === "KAVON10") {
            setActiveCoupon("KAVON10");
            return true;
        }
        return false;
    };

    const subtotal = cart.reduce((acc, i) => acc + (i.price * i.quantity), 0);
    const discount = activeCoupon === "KAVON10" ? subtotal * 0.1 : 0;
    const pointsDiscount = isPointsRedeemed ? (subtotal - discount) * 0.05 : 0;
    const shippingFee = subtotal >= 10000 || subtotal === 0 ? 0 : 500;
    const total = subtotal - discount - pointsDiscount + shippingFee;
    const cartCount = cart.reduce((acc, i) => acc + i.quantity, 0);

    const clearCart = () => {
        setCart([]);
        setActiveCoupon(null);
        localStorage.removeItem('kavon-manifest-v1');
    };

    const moveWishlistToCart = (item: WishlistItem) => {
        addToCart({
            ...item,
            quantity: 1,
            size: "M", // Default tactical size
        });
    };

    return (
        <CartContext.Provider value={{
            cart, addToCart, removeFromCart, updateQuantity, moveToWishlist,
            applyCoupon, subtotal, discount, shippingFee, total, cartCount, isLoaded, activeCoupon,
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