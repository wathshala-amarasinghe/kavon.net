"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getMe, login as apiLogin, register as apiRegister, updateProfile as apiUpdateProfile, getMyOrders } from '@/lib/api';
import toast from 'react-hot-toast';

export interface OrderItem {
    image?: string;
    name?: string;
    price?: number;
    quantity?: number;
    size?: string;
}

export interface Order {
    _id?: string;
    id?: string; // Support legacy
    orderItems?: OrderItem[];
    items?: OrderItem[]; // Support legacy
    itemsPrice?: number;
    shippingPrice?: number;
    discountPrice?: number;
    totalPrice?: number;
    totals?: { subtotal: number; discount: number; shipping: number; total: number }; // Support legacy
    createdAt?: string;
    date?: string; // Support legacy
    status: string;
    shippingAddress?: {
        phone: string;
        city: string;
    };
    pointsEarned?: number;
    pointsUsed?: number;
    pointsBurned?: number; // Support legacy
}

interface Transmission {
    id: string;
    subject: string;
    body: string;
    date: string;
    priority: 'Low' | 'Medium' | 'High';
}

export interface AuthUser {
    _id?: string;
    id?: string;
    name: string;
    email: string;
    role: "user" | "admin";
    loyaltyPoints: number;
    shippingAddress?: {
        address: string;
        city: string;
        postalCode: string;
        country: string;
        phone: string;
    };
}

interface AuthContextType {
    user: AuthUser | null;
    loading: boolean;
    login: (credentials: Record<string, unknown>) => Promise<void>;
    register: (userData: Record<string, unknown>) => Promise<void>;
    logout: () => void;
    addOrderToHistory: (order: Order) => void;
    loyaltyPoints: number;
    orderHistory: Order[];
    transmissions: Transmission[];
    deductPoints: (amount: number) => void;
    updateProfile: (userData: Record<string, unknown>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getTransmissionStorageKey = (account: AuthUser) => {
    const identity = account._id || account.id || account.email.trim().toLowerCase();
    return `kavon-user-messages-v1:${identity}`;
};

const loadTransmissions = (account: AuthUser): Transmission[] => {
    const saved = localStorage.getItem(getTransmissionStorageKey(account));
    if (!saved) return [];

    try {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        localStorage.removeItem(getTransmissionStorageKey(account));
        return [];
    }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [loyaltyPoints, setLoyaltyPoints] = useState(0);
    const [orderHistory, setOrderHistory] = useState<Order[]>([]);
    const [transmissions, setTransmissions] = useState<Transmission[]>([]);

    useEffect(() => {
        const initAuth = async () => {
            // This legacy key mixed account data together on shared browsers.
            localStorage.removeItem('kavon-user-intel-v1');
            const token = localStorage.getItem('kavon-token-v1');
            if (token) {
                try {
                    const userData = await getMe(token);
                    if (userData) {
                        setUser(userData);
                        setLoyaltyPoints(userData.loyaltyPoints || 0);
                        setTransmissions(loadTransmissions(userData));

                        try {
                            const backendOrders = await getMyOrders(token);
                            setOrderHistory(Array.isArray(backendOrders) ? backendOrders : []);
                        } catch {
                            setOrderHistory([]);
                        }
                    } else {
                        localStorage.removeItem('kavon-token-v1');
                    }
                } catch {
                    localStorage.removeItem('kavon-token-v1');
                }
            }
            setLoading(false);
        };
        initAuth();
    }, []);

    useEffect(() => {
        if (!user) return;
        localStorage.setItem(getTransmissionStorageKey(user), JSON.stringify(transmissions));
    }, [transmissions, user]);

    const login = async (credentials: Record<string, unknown>) => {
        try {
            const data = await apiLogin(credentials);
            localStorage.setItem('kavon-token-v1', data.token);
            setUser(data.user);
            setLoyaltyPoints(Number(data.user.loyaltyPoints) || 0);
            setOrderHistory([]);
            setTransmissions(loadTransmissions(data.user));

            try {
                const backendOrders = await getMyOrders(data.token);
                setOrderHistory(Array.isArray(backendOrders) ? backendOrders : []);
            } catch {
                setOrderHistory([]);
            }
            toast.success("ACCESS_GRANTED");
        } catch (error: unknown) {
            toast.error(error instanceof Error ? error.message : "Login failed");
            throw error;
        }
    };

    const register = async (userData: Record<string, unknown>) => {
        try {
            const data = await apiRegister(userData);
            setUser(data.user);
            setLoyaltyPoints(Number(data.user.loyaltyPoints) || 0);
            setOrderHistory([]);
            setTransmissions([]);
            localStorage.setItem('kavon-token-v1', data.token);
            toast.success("IDENTITY_VERIFIED: WELCOME_INITIATED");
        } catch (error: unknown) {
            toast.error(error instanceof Error ? error.message : "Registration failed");
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        setOrderHistory([]);
        setTransmissions([]);
        setLoyaltyPoints(0);
        localStorage.removeItem('kavon-token-v1');
        sessionStorage.removeItem('kavon_last_order');
        sessionStorage.removeItem('kavon_checkout_session_v1');
        toast.success("SESSION_TERMINATED");
    };

    const addOrderToHistory = (order: Order) => {
        const subtotal = order.itemsPrice || order.totals?.subtotal || 0;
        const id = order._id || order.id || "UNKNOWN";
        const earnedPoints = Math.floor(subtotal * 0.25);
        
        const orderWithPoints = { ...order, pointsEarned: earnedPoints };
        setOrderHistory(prev => [orderWithPoints, ...prev]);

        const newTransmission: Transmission = {
            id: `MSG-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
            subject: `DEPLOYMENT_CONFIRMED // ${id}`,
            body: `Your order ${id} has been authorized. ${earnedPoints} Division Credits will be added after delivery.`,
            date: new Date().toISOString(),
            priority: 'High'
        };
        setTransmissions(prev => [newTransmission, ...prev]);
    };

    const deductPoints = (amount: number) => {
        setLoyaltyPoints(prev => Math.max(0, prev - amount));
    };

    const updateProfile = async (userData: Record<string, unknown>) => {
        try {
            const token = localStorage.getItem('kavon-token-v1');
            if (!token) throw new Error("No authorization token found");

            const data = await apiUpdateProfile(userData, token);
            setUser(data.user);
            setLoyaltyPoints(Number(data.user.loyaltyPoints) || 0);
            localStorage.setItem('kavon-token-v1', data.token);
            toast.success("PROFILE_SYNCHRONIZED: ASSETS_UPDATED");
        } catch (error: unknown) {
            toast.error(error instanceof Error ? error.message : "Update failed");
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ 
            user, loading, login, register, logout, 
            addOrderToHistory, loyaltyPoints, orderHistory, transmissions,
            deductPoints, updateProfile
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};
