"use client";

import React, { useEffect, useState } from 'react';
import { getSettings } from '@/lib/api';
import { ShieldAlert, Zap, Lock } from 'lucide-react';

export function MaintenanceGuard({ children }: { children: React.ReactNode }) {
    const [isMaintenance, setIsMaintenance] = useState<boolean | null>(null);

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const data = await getSettings();
                setIsMaintenance(data?.maintenanceMode || false);
            } catch (error) {
                console.error('MAINTENANCE_STATUS_SYNC_FAILURE:', error);
                setIsMaintenance(false);
            }
        };
        checkStatus();
    }, []);

    if (isMaintenance === true) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-volt/5 blur-[120px] rounded-full" />
                
                <div className="text-center space-y-8 relative z-10">
                    <div className="inline-flex p-6 bg-brand-volt/10 border border-brand-volt/20 rounded-full animate-pulse">
                        <ShieldAlert className="text-brand-volt" size={48} />
                    </div>
                    
                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white">
                            Sector<span className="text-brand-volt">_Lockdown</span>
                        </h1>
                        <p className="font-mono text-[11px] text-white/40 uppercase tracking-[0.5em] max-w-md mx-auto leading-relaxed">
                            System is currently undergoing tactical recalibration. Deployment routes are temporarily secured.
                        </p>
                    </div>

                    <div className="flex flex-col items-center gap-6 pt-10">
                        <div className="flex items-center gap-3 text-brand-volt font-mono text-[10px] uppercase tracking-widest">
                            <Zap size={14} className="animate-bounce" /> Expected_Uptime: AS_SOON_AS_POSSIBLE
                        </div>
                        <div className="w-64 h-[1px] bg-white/10 relative overflow-hidden">
                            <div className="absolute inset-0 bg-brand-volt animate-scan" />
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-3 text-white/20 font-mono text-[9px] uppercase tracking-[0.3em]">
                    <Lock size={12} /> Established_By_Command_Center
                </div>
            </div>
        );
    }

    // Configuration failures fail open so a temporary API outage does not hide the storefront.
    return <>{children}</>;
}
