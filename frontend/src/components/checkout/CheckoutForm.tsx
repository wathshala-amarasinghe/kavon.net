"use client";

import React, { useState } from 'react';

export function CheckoutForm({ onNext }: { onNext: () => void }) {
    // Simulated Auto-fill Logic
    const [address, setAddress] = useState("");
    const [suggestions, setSuggestions] = useState<string[]>([]);

    const handleAddressChange = (val: string) => {
        setAddress(val);
        if (val.length > 5) {
            // Simulated local dataset for Sri Lanka
            setSuggestions(["45/A Shadow Lane, Colombo 07", "12 Tactical Blvd, Kandy", "Unit 9, Galle Fort"]);
        } else {
            setSuggestions([]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onNext();
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
                        <input type="text" required placeholder="OPERATOR NAME" className="w-full bg-white/[0.03] border border-white/10 p-5 font-mono text-[14px] focus:border-brand-volt outline-none text-white hover:bg-white/[0.05]" />
                    </div>

                    <div className="space-y-3">
                        <label className="text-[14px] font-mono text-white uppercase tracking-widest flex items-center gap-1">Primary_Phone <span className="text-brand-volt">*</span></label>
                        <input type="tel" required pattern="[0-9+ ]{10,15}" placeholder="+94 XX XXX XXXX" className="w-full bg-white/[0.03] border border-white/10 p-5 font-mono text-[14px] focus:border-brand-volt outline-none text-white" />
                    </div>

                    <div className="space-y-3">
                        <label className="text-[14px] font-mono text-white uppercase tracking-widest">Secondary_Backup_Phone</label>
                        <input type="tel" placeholder="+94 XX XXX XXXX" className="w-full bg-white/[0.03] border border-white/10 p-5 font-mono text-[14px] focus:border-brand-volt outline-none text-white" />
                    </div>

                    <div className="md:col-span-2 space-y-3 relative">
                        <label className="text-[14px] font-mono text-white uppercase tracking-widest flex items-center gap-1">
                            Street_Address_Primary <span className="text-brand-volt">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={address}
                            onChange={(e) => handleAddressChange(e.target.value)}
                            placeholder="HOUSE NO / STREET NAME"
                            className="w-full bg-white/[0.03] border border-white/10 p-5 font-mono text-[14px] focus:border-brand-volt outline-none text-white"
                        />
                        {/* Auto-fill Suggestions Dropdown */}
                        {suggestions.length > 0 && (
                            <div className="absolute left-0 right-0 top-full bg-brand-surface border border-brand-volt z-50 shadow-2xl">
                                {suggestions.map((s, i) => (
                                    <button
                                        key={i}
                                        type="button"
                                        onClick={() => { setAddress(s); setSuggestions([]); }}
                                        className="w-full text-left p-4 font-mono text-[12px] hover:bg-brand-volt hover:text-black border-b border-white/5 uppercase"
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="space-y-3">
                        <label className="text-[14px] font-mono text-white uppercase tracking-widest flex items-center gap-1">City_Sector <span className="text-brand-volt">*</span></label>
                        <input type="text" required placeholder="COLOMBO" className="w-full bg-white/[0.03] border border-white/10 p-5 font-mono text-[14px] focus:border-brand-volt outline-none text-white" />
                    </div>

                    <div className="space-y-3">
                        <label className="text-[14px] font-mono text-white uppercase tracking-widest flex items-center gap-1">Postal_Zip_Code <span className="text-brand-volt">*</span></label>
                        <input type="text" required placeholder="XXXXX" className="w-full bg-white/[0.03] border border-white/10 p-5 font-mono text-[14px] focus:border-brand-volt outline-none text-white" />
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