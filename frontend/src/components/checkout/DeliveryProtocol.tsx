"use client";

import React from 'react';
import { Truck, Zap, Navigation, Check, MapPin } from 'lucide-react';
import { useSettings } from '@/context/UserSettingsContext';
import { calculateTacticalShipping, DeliverySector } from '@/lib/logistics';

interface DeliveryMethod {
    id: string;
    name: string;
    eta: string;
    price: number;
    icon: React.ReactNode;
    disabled?: boolean;
}

interface DeliveryProtocolProps {
    selectedId: string;
    onSelect: (method: DeliveryMethod) => void;
    subtotal: number;
}

export function DeliveryProtocol({ selectedId, onSelect, subtotal }: DeliveryProtocolProps) {
    const { location, setLocation } = useSettings();

    const selectSector = (sector: DeliverySector) => {
        setLocation(sector);
        if (sector === 'OUTSTATION' && selectedId === 'same-day') {
            onSelect({
                id: 'standard',
                name: 'Standard_Ground',
                eta: '3–5 Business Days',
                price: calculateTacticalShipping(subtotal, sector),
                icon: <Truck size={18} />,
            });
        }
    };
    
    const methods: DeliveryMethod[] = [
        {
            id: 'standard',
            name: 'Standard_Ground',
            eta: location === 'COLOMBO' ? '1–3 Business Days' : '3–5 Business Days',
            price: calculateTacticalShipping(subtotal, location),
            icon: <Truck size={18} />
        },
        {
            id: 'express',
            name: 'Tactical_Express',
            eta: location === 'COLOMBO' ? 'Next Day' : '1–2 Business Days',
            price: location === 'COLOMBO' ? 800 : 1500,
            icon: <Zap size={18} />
        },
        {
            id: 'same-day',
            name: 'Same_Day_Deployment',
            eta: 'Within 24 Hours',
            price: 2500,
            icon: <Navigation size={18} />,
            disabled: location === 'OUTSTATION'
        }
    ];

    return (
        <section className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/20 font-mono text-xs flex-shrink-0">1.4</span>
                    <h2 className="text-2xl font-black italic uppercase tracking-normal leading-relaxed text-white">
                        Operation_Sector
                    </h2>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    {(["COLOMBO", "OUTSTATION"] as DeliverySector[]).map((sector) => (
                        <button
                            key={sector}
                            onClick={() => selectSector(sector)}
                            className={`p-6 border transition-all text-left flex flex-col gap-2 group ${location === sector 
                                ? 'bg-brand-volt/5 border-brand-volt' 
                                : 'bg-white/[0.02] border-white/10 hover:border-white/30'}`}
                        >
                            <div className="flex justify-between items-center w-full">
                                <span className={`text-[10px] font-mono uppercase tracking-widest ${location === sector ? 'text-brand-volt' : 'text-white/40'}`}>
                                    {sector === 'COLOMBO' ? 'In-City' : 'Island-Wide'}
                                </span>
                                <MapPin size={14} className={location === sector ? 'text-brand-volt' : 'text-white/20'} />
                            </div>
                            <span className={`text-sm font-black uppercase tracking-widest ${location === sector ? 'text-white' : 'text-white/40'}`}>
                                {sector}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex items-center gap-4 pt-4">
                <span className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/20 font-mono text-xs flex-shrink-0">1.5</span>
                <h2 className="text-2xl font-black italic uppercase tracking-normal leading-relaxed text-white">
                    Delivery_Method
                </h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {methods.map((method) => (
                    <button
                        key={method.id}
                        type="button"
                        disabled={method.disabled}
                        onClick={() => onSelect(method)}
                        className={`w-full p-6 border transition-all text-left flex items-center gap-6 group ${method.disabled ? 'opacity-20 grayscale cursor-not-allowed' : ''} ${selectedId === method.id
                                ? 'bg-brand-volt/5 border-brand-volt'
                                : 'bg-white/[0.02] border-white/10 hover:border-white/30'
                            }`}
                    >
                        <div className={`w-12 h-12 flex items-center justify-center border ${selectedId === method.id ? 'border-brand-volt text-brand-volt' : 'border-white/10 text-white/40'
                            }`}>
                            {method.icon}
                        </div>
                        <div className="flex-1">
                            <h4 className={`text-xs font-black uppercase tracking-widest ${selectedId === method.id ? 'text-brand-volt' : 'text-white'
                                }`}>
                                {method.name}
                            </h4>
                            <p className="text-[10px] font-mono text-white/40 uppercase mt-1">{method.eta}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-mono font-bold text-white">
                                {method.price === 0 ? "FREE" : `LKR ${method.price.toLocaleString()}`}
                            </p>
                        </div>
                    </button>
                ))}
            </div>
        </section>
    );
}
