"use client";

import React, { useState } from 'react';
import { ShippingAddress } from '@/context/CheckoutContext';
import { useAuth } from '@/context/AuthContext';

export function CheckoutForm({ onNext }: { onNext: (address: ShippingAddress) => void }) {
    const { user } = useAuth();
    const savedAddress = user?.shippingAddress;
    const [formData, setFormData] = useState<ShippingAddress>({
        fullName: user?.name || '',
        phone: savedAddress?.phone || '',
        secondaryPhone: '',
        address: savedAddress?.address || '',
        city: savedAddress?.city || '',
        postalCode: savedAddress?.postalCode || '',
        country: 'Sri Lanka',
    });

    const updateField = (field: keyof ShippingAddress, value: string) => {
        setFormData((current) => ({ ...current, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onNext({
            ...formData,
            fullName: formData.fullName.trim(),
            phone: formData.phone.trim(),
            secondaryPhone: formData.secondaryPhone?.trim(),
            address: formData.address.trim(),
            city: formData.city.trim(),
            postalCode: formData.postalCode.trim(),
            country: 'Sri Lanka',
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <section className="space-y-8">
                <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-full border border-brand-volt flex items-center justify-center text-brand-volt font-mono text-xs flex-shrink-0 shadow-[0_0_15px_rgba(223, 7, 21,0.3)]">01</span>
                    <h2 className="text-2xl font-black italic uppercase tracking-normal leading-relaxed text-white">
                        Logistics_Deployment
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                    <div className="md:col-span-2 space-y-3">
                        <label className="text-[14px] font-mono text-white uppercase tracking-widest flex items-center gap-1">
                            Full_Name <span className="text-brand-volt">*</span>
                        </label>
                        <input type="text" required autoComplete="name" value={formData.fullName} onChange={(e) => updateField('fullName', e.target.value)} placeholder="YOUR FULL NAME" className="w-full bg-white/[0.03] border border-white/10 p-5 font-mono text-[14px] focus:border-brand-volt outline-none text-white hover:bg-white/[0.05]" />
                    </div>

                    <div className="space-y-3">
                        <label className="text-[14px] font-mono text-white uppercase tracking-widest flex items-center gap-1">Primary_Phone <span className="text-brand-volt">*</span></label>
                        <input type="tel" required autoComplete="tel" pattern="[0-9+() -]{9,20}" value={formData.phone} onChange={(e) => updateField('phone', e.target.value)} placeholder="+94 XX XXX XXXX" className="w-full bg-white/[0.03] border border-white/10 p-5 font-mono text-[14px] focus:border-brand-volt outline-none text-white" />
                    </div>

                    <div className="space-y-3">
                        <label className="text-[14px] font-mono text-white uppercase tracking-widest">Secondary_Backup_Phone</label>
                        <input type="tel" pattern="[0-9+() -]{9,20}" value={formData.secondaryPhone || ''} onChange={(e) => updateField('secondaryPhone', e.target.value)} placeholder="+94 XX XXX XXXX" className="w-full bg-white/[0.03] border border-white/10 p-5 font-mono text-[14px] focus:border-brand-volt outline-none text-white" />
                    </div>

                    <div className="md:col-span-2 space-y-3 relative">
                        <label className="text-[14px] font-mono text-white uppercase tracking-widest flex items-center gap-1">
                            Street_Address_Primary <span className="text-brand-volt">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            autoComplete="street-address"
                            value={formData.address}
                            onChange={(e) => updateField('address', e.target.value)}
                            placeholder="HOUSE NO / STREET NAME"
                            className="w-full bg-white/[0.03] border border-white/10 p-5 font-mono text-[14px] focus:border-brand-volt outline-none text-white"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-[14px] font-mono text-white uppercase tracking-widest flex items-center gap-1">City_Sector <span className="text-brand-volt">*</span></label>
                        <input type="text" required autoComplete="address-level2" value={formData.city} onChange={(e) => updateField('city', e.target.value)} placeholder="COLOMBO" className="w-full bg-white/[0.03] border border-white/10 p-5 font-mono text-[14px] focus:border-brand-volt outline-none text-white" />
                    </div>

                    <div className="space-y-3">
                        <label className="text-[14px] font-mono text-white uppercase tracking-widest flex items-center gap-1">Postal_Zip_Code <span className="text-brand-volt">*</span></label>
                        <input type="text" required autoComplete="postal-code" value={formData.postalCode} onChange={(e) => updateField('postalCode', e.target.value)} placeholder="XXXXX" className="w-full bg-white/[0.03] border border-white/10 p-5 font-mono text-[14px] focus:border-brand-volt outline-none text-white" />
                    </div>
                </div>
            </section>

            <button
                type="submit"
                className="w-full py-6 bg-brand-volt text-black font-black uppercase text-[12px] tracking-[0.2em] hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(63,255,117,0.2)]"
            >
                Confirm_Address_&_Continue
            </button>
        </form>
    );
}
