"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getMe, login as apiLogin, register as apiRegister, updateProfile as apiUpdateProfile, getMyOrders } from '@/lib/api';
import toast from 'react-hot-toast';

export interface Order {
    _id?: string;
    id?: string; // Support legacy
    orderItems?: Record<string, unknown>[];
    items?: Record<string, unknown>[]; // Support legacy
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

interface AuthContextType {
    user: Record<string, unknown> | null;
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<Record<string, unknown> | null>(null);
    const [loading, setLoading] = useState(true);
    const [loyaltyPoints, setLoyaltyPoints] = useState(0);
    const [orderHistory, setOrderHistory] = useState<Order[]>([]);
    const [transmissions, setTransmissions] = useState<Transmission[]>([]);

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('kavon-token-v1');
            if (token) {
                try {
                    const userData = await getMe(token);
                    if (userData) {
                        setUser(userData);
                        setLoyaltyPoints(userData.loyaltyPoints || 0);
                        
                        // Fetch real order history from backend
                        const backendOrders = await getMyOrders(token);
                        setOrderHistory(backendOrders);
                    } else {
                        localStorage.removeItem('kavon-token-v1');
                    }
                } catch (error) {
                    localStorage.removeItem('kavon-token-v1');
                }
            }
            
            const savedIntel = localStorage.getItem('kavon-user-intel-v1');
            if (savedIntel) {
                try {
                    const parsed = JSON.parse(savedIntel);
                    setOrderHistory(parsed.history || []);
                    setTransmissions(parsed.transmissions || []);
                } catch (e) { localStorage.removeItem('kavon-user-intel-v1'); }
            }
            setLoading(false);
        };
        initAuth();
    }, []);

    useEffect(() => {
        localStorage.setItem('kavon-user-intel-v1', JSON.stringify({
            history: orderHistory,
            transmissions: transmissions
        }));
    }, [orderHistory, transmissions]);

    const login = async (credentials: Record<string, unknown>) => {
        try {
            const data = await apiLogin(credentials);
            setUser(data.user);
            setLoyaltyPoints(data.user.loyaltyPoints as number);
            localStorage.setItem('kavon-token-v1', data.token);
            toast.success("BIOMETRIC_MATCH: ACCESS_GRANTED");
        } catch (error: unknown) {
            toast.error(error instanceof Error ? error.message : "Login failed");
            throw error;
        }
    };

    const register = async (userData: Record<string, unknown>) => {
        try {
            const data = await apiRegister(userData);
            setUser(data.user);
            setLoyaltyPoints(data.user.loyaltyPoints as number);
            localStorage.setItem('kavon-token-v1', data.token);
            toast.success("IDENTITY_VERIFIED: WELCOME_INITIATED");
        } catch (error: unknown) {
            toast.error(error instanceof Error ? error.message : "Registration failed");
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('kavon-token-v1');
        toast.success("SESSION_TERMINATED");
    };

    const addOrderToHistory = (order: Order) => {
        const subtotal = order.itemsPrice || order.totals?.subtotal || 0;
        const id = order._id || order.id || "UNKNOWN";
        const earnedPoints = Math.floor(subtotal * 0.25);
        
        const orderWithPoints = { ...order, pointsEarned: earnedPoints };
        setOrderHistory(prev => [orderWithPoints, ...prev]);
        setLoyaltyPoints(prev => prev + earnedPoints);

        const newTransmission: Transmission = {
            id: `MSG-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
            subject: `DEPLOYMENT_CONFIRMED // ${id}`,
            body: `Your order ${id} has been authorized. You earned ${earnedPoints} Division Credits. Total Balance: ${loyaltyPoints + earnedPoints} CRD.`,
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
            setLoyaltyPoints(data.user.loyaltyPoints as number);
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