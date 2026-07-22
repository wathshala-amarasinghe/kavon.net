"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { DeliverySector } from '@/lib/logistics';

interface UserSettingsContextType {
    recentlyViewed: string[];
    trackView: (id: string) => void;
    location: DeliverySector;
    setLocation: (loc: DeliverySector) => void;
}

const UserSettingsContext = createContext<UserSettingsContextType | undefined>(undefined);

export function UserSettingsProvider({ children }: { children: React.ReactNode }) {
    const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
    const [location, setLocation] = useState<DeliverySector>("COLOMBO");

    useEffect(() => {
        const saved = localStorage.getItem('kavon-intel-v1');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setTimeout(() => {
                    setRecentlyViewed(Array.isArray(parsed.viewed) ? parsed.viewed : []);
                    setLocation(parsed.location === 'OUTSTATION' ? 'OUTSTATION' : 'COLOMBO');
                }, 0);
            } catch {
                localStorage.removeItem('kavon-intel-v1');
            }
        }
    }, []);

    // Unified Storage Protocol
    useEffect(() => {
        localStorage.setItem('kavon-intel-v1', JSON.stringify({ viewed: recentlyViewed, location }));
    }, [recentlyViewed, location]);

    const trackView = useCallback((id: string) => {
        setRecentlyViewed(prev => {
            if (prev[0] === id) return prev; // Already tracked
            const filtered = prev.filter(itemId => itemId !== id);
            return [id, ...filtered].slice(0, 10);
        });
    }, []);

    const setLocationValue = useCallback((loc: DeliverySector) => {
        setLocation(loc);
    }, []);

    return (
        <UserSettingsContext.Provider value={{ recentlyViewed, trackView, location, setLocation: setLocationValue }}>
            {children}
        </UserSettingsContext.Provider>
    );
}

export const useSettings = () => {
    const context = useContext(UserSettingsContext);
    if (!context) throw new Error("useSettings must be used within UserSettingsProvider");
    return context;
};
