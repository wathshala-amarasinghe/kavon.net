"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSettings } from '@/lib/api';

export interface HeroSlide {
    id: string;
    video: string;
    title: string;
    tagline: string;
    tag?: string;
    desc: string;
}

export interface SystemSettings {
    heroSlides?: HeroSlide[];
    heroCountdown?: string;
    promoBanner?: {
        enabled: boolean;
        text: string;
    };
}

interface SystemSettingsContextType {
    settings: SystemSettings | null;
    isLoading: boolean;
    refreshSettings: () => Promise<void>;
}

const SystemSettingsContext = createContext<SystemSettingsContextType | undefined>(undefined);

export function SystemSettingsProvider({ children }: { children: React.ReactNode }) {
    const [settings, setSettings] = useState<SystemSettings | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const refreshSettings = async () => {
        try {
            const data = await getSettings();
            setSettings(data);
        } catch (error) {
            // Silently handle configuration sync failures to prevent console clutter
            // The application will fallback to default states
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setTimeout(() => {
            refreshSettings();
        }, 0);
    }, []);

    return (
        <SystemSettingsContext.Provider value={{ settings, isLoading, refreshSettings }}>
            {children}
        </SystemSettingsContext.Provider>
    );
}

export const useSystemSettings = () => {
    const context = useContext(SystemSettingsContext);
    if (!context) throw new Error("useSystemSettings must be used within SystemSettingsProvider");
    return context;
};
