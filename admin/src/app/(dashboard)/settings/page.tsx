"use client";

import React, { useState, useEffect } from 'react';
import { getSettings, updateSettings, uploadImage } from '@/lib/api';
import { Settings as SettingsIcon, Save, Bell, Shield, Radio, Layout, Mail, Phone, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function SettingsPage() {
    const [settings, setSettings] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetch = async () => {
            try {
                const data = await getSettings();
                setSettings(data);
            } catch (error: unknown) {
                toast.error(error instanceof Error ? error.message : "SETTINGS_SYNC_FAILURE");
            } finally {
                setIsLoading(false);
            }
        };
        fetch();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const token = localStorage.getItem('kavon-admin-token') || "";
            await updateSettings(settings, token);
            toast.success("SYSTEM_CONFIG_UPDATED");
        } catch (error: unknown) {
            toast.error(error instanceof Error ? error.message : "MODIFICATION_FAILED");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading || !settings) {
        return (
            <div className="min-h-[400px] flex items-center justify-center font-mono text-brand-volt text-[10px] tracking-[0.5em] animate-pulse">
                RETRIEVING_GLOBAL_CONFIG...
            </div>
        );
    }

    return (
        <div className="max-w-4xl space-y-12 pb-20">
            <header className="space-y-2 border-l-2 border-brand-volt pl-8">
                <span className="font-mono text-[11px] text-white/40 uppercase tracking-[0.4em]">Node_Status / Configuration</span>
                <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">System<span className="text-brand-volt">_Control</span></h1>
            </header>

            <form onSubmit={handleSave} className="space-y-10">
                {/* Promotional Sector */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3 text-white/60">
                        <Radio size={20} className="text-brand-volt" />
                        <h3 className="font-black uppercase tracking-widest text-sm">Promotional_Broadcasting</h3>
                    </div>
                    <div className="p-8 tactical-glass space-y-8">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="font-bold text-xs uppercase tracking-wider">Global Promo Banner</p>
                                <p className="font-mono text-[10px] text-white/30 uppercase">Visibility status across all client nodes</p>
                            </div>
                            <button 
                                type="button"
                                onClick={() => setSettings({...settings, promoBanner: {...settings.promoBanner, enabled: !settings.promoBanner.enabled}})}
                                className={`w-14 h-7 rounded-full p-1 transition-all ${settings.promoBanner.enabled ? 'bg-brand-volt' : 'bg-white/10'}`}
                            >
                                <div className={`w-5 h-5 rounded-full bg-black transition-all ${settings.promoBanner.enabled ? 'translate-x-7' : 'translate-x-0'}`} />
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="font-mono text-[9px] text-white/40 uppercase tracking-widest">Broadcast_Message</label>
                                <input 
                                    type="text" 
                                    value={settings.promoBanner.text}
                                    onChange={(e) => setSettings({...settings, promoBanner: {...settings.promoBanner, text: e.target.value}})}
                                    className="w-full bg-black/40 border border-white/5 p-4 font-mono text-xs focus:border-brand-volt outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Popup Banner Sector */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3 text-white/60">
                        <Bell size={20} className="text-brand-volt" />
                        <h3 className="font-black uppercase tracking-widest text-sm">Engagement_Broadcast (Popup)</h3>
                    </div>
                    <div className="p-8 tactical-glass space-y-8">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="font-bold text-xs uppercase tracking-wider">Home Page Popup</p>
                                <p className="font-mono text-[10px] text-white/30 uppercase">Initial engagement modal for new sessions</p>
                            </div>
                            <button 
                                type="button"
                                onClick={() => setSettings({...settings, popupBanner: {...settings.popupBanner, enabled: !settings.popupBanner.enabled}})}
                                className={`w-14 h-7 rounded-full p-1 transition-all ${settings.popupBanner.enabled ? 'bg-brand-volt' : 'bg-white/10'}`}
                            >
                                <div className={`w-5 h-5 rounded-full bg-black transition-all ${settings.popupBanner.enabled ? 'translate-x-7' : 'translate-x-0'}`} />
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="space-y-2">
                                <label className="font-mono text-[9px] text-white/40 uppercase tracking-widest">Popup_Title</label>
                                <input 
                                    type="text" 
                                    value={settings.popupBanner?.title || ""}
                                    onChange={(e) => setSettings({...settings, popupBanner: {...settings.popupBanner, title: e.target.value}})}
                                    className="w-full bg-black/40 border border-white/5 p-4 font-mono text-xs uppercase focus:border-brand-volt outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="font-mono text-[9px] text-white/40 uppercase tracking-widest">Button_Action_Text</label>
                                <input 
                                    type="text" 
                                    value={settings.popupBanner?.buttonText || ""}
                                    onChange={(e) => setSettings({...settings, popupBanner: {...settings.popupBanner, buttonText: e.target.value}})}
                                    className="w-full bg-black/40 border border-white/5 p-4 font-mono text-xs uppercase focus:border-brand-volt outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="font-mono text-[9px] text-white/40 uppercase tracking-widest">Popup_Link (URL)</label>
                                <input 
                                    type="text" 
                                    value={settings.popupBanner?.buttonLink || ""}
                                    onChange={(e) => setSettings({...settings, popupBanner: {...settings.popupBanner, buttonLink: e.target.value}})}
                                    className="w-full bg-black/40 border border-white/5 p-4 font-mono text-xs focus:border-brand-volt outline-none"
                                    placeholder="/shop"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="font-mono text-[9px] text-white/40 uppercase tracking-widest">Broadcast_Intel (Text)</label>
                            <textarea 
                                value={settings.popupBanner?.text || ""}
                                onChange={(e) => setSettings({...settings, popupBanner: {...settings.popupBanner, text: e.target.value}})}
                                className="w-full bg-black/40 border border-white/5 p-4 font-mono text-xs focus:border-brand-volt outline-none h-20 resize-none"
                            />
                        </div>
                    </div>
                </section>

                {/* Security & Access */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3 text-white/60">
                        <Shield size={20} className="text-brand-volt" />
                        <h3 className="font-black uppercase tracking-widest text-sm">Operational_Protocols</h3>
                    </div>
                    <div className="p-8 tactical-glass space-y-8 border-l-2 border-red-500/50">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="font-bold text-xs uppercase tracking-wider text-red-500">Maintenance Mode</p>
                                <p className="font-mono text-[10px] text-white/30 uppercase">Immediate site-wide kill switch for deployment</p>
                            </div>
                            <button 
                                type="button"
                                onClick={() => setSettings({...settings, maintenanceMode: !settings.maintenanceMode})}
                                className={`w-14 h-7 rounded-full p-1 transition-all ${settings.maintenanceMode ? 'bg-red-500' : 'bg-white/10'}`}
                            >
                                <div className={`w-5 h-5 rounded-full bg-black transition-all ${settings.maintenanceMode ? 'translate-x-7' : 'translate-x-0'}`} />
                            </button>
                        </div>

                        {settings.maintenanceMode && (
                            <div className="flex items-center gap-4 p-4 bg-red-500/10 border border-red-500/20">
                                <AlertTriangle className="text-red-500" size={20} />
                                <p className="font-mono text-[10px] text-red-500 uppercase tracking-widest animate-pulse">WARNING: Public assets will be inaccessible during this protocol.</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Hero Deployment Sector */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3 text-white/60">
                        <Layout size={20} className="text-brand-volt" />
                        <h3 className="font-black uppercase tracking-widest text-sm">Hero_Deployment_Control</h3>
                    </div>
                    <div className="p-8 tactical-glass space-y-10">
                        {/* Countdown Timer */}
                        <div className="space-y-4 border-b border-white/5 pb-8">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="font-bold text-xs uppercase tracking-wider">Global Countdown Target</p>
                                    <p className="font-mono text-[10px] text-white/30 uppercase">Coordinates the next mission drop timer</p>
                                </div>
                                <input 
                                    type="datetime-local" 
                                    value={settings.heroCountdown ? new Date(new Date(settings.heroCountdown).getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().slice(0, 16) : ''}
                                    onChange={(e) => setSettings({...settings, heroCountdown: e.target.value})}
                                    className="bg-black/40 border border-brand-volt/30 p-4 font-mono text-xs focus:border-brand-volt outline-none text-white cursor-pointer"
                                />
                            </div>
                        </div>

                        {/* Hero Slides */}
                        <div className="space-y-8">
                            <p className="font-mono text-[11px] text-white/40 uppercase tracking-[0.2em]">Active_Slides_Manifest</p>
                            <div className="grid grid-cols-1 gap-8">
                                {(settings.heroSlides || []).map((slide: any, idx: number) => (
                                    <div key={idx} className="p-6 bg-white/[0.02] border border-white/5 space-y-6 relative group">
                                        <div className="absolute -top-3 -left-3 w-8 h-8 bg-brand-volt text-black flex items-center justify-center font-black text-xs italic">
                                            0{idx + 1}
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <label className="font-mono text-[9px] text-white/40 uppercase tracking-widest">Slide_Title</label>
                                                    <input 
                                                        type="text" 
                                                        value={slide.title}
                                                        onChange={(e) => {
                                                            const newSlides = [...settings.heroSlides];
                                                            newSlides[idx].title = e.target.value;
                                                            setSettings({...settings, heroSlides: newSlides});
                                                        }}
                                                        className="w-full bg-black/40 border border-white/5 p-3 font-mono text-xs uppercase focus:border-brand-volt outline-none"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="font-mono text-[9px] text-white/40 uppercase tracking-widest">Tagline</label>
                                                    <input 
                                                        type="text" 
                                                        value={slide.tagline}
                                                        onChange={(e) => {
                                                            const newSlides = [...settings.heroSlides];
                                                            newSlides[idx].tagline = e.target.value;
                                                            setSettings({...settings, heroSlides: newSlides});
                                                        }}
                                                        className="w-full bg-black/40 border border-white/5 p-3 font-mono text-xs uppercase focus:border-brand-volt outline-none"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <label className="font-mono text-[9px] text-white/40 uppercase tracking-widest">Video_Asset (Local_Upload)</label>
                                                    <div className="flex gap-2">
                                                        <input 
                                                            type="text" 
                                                            value={slide.video}
                                                            readOnly
                                                            className="flex-1 bg-black/40 border border-white/5 p-3 font-mono text-[10px] text-white/40 focus:border-brand-volt outline-none"
                                                            placeholder="No asset uploaded"
                                                        />
                                                        <label className="bg-white/5 border border-white/10 px-4 py-3 font-mono text-[10px] uppercase tracking-widest hover:bg-white/10 cursor-pointer transition-all">
                                                            Upload
                                                            <input 
                                                                type="file" 
                                                                accept="video/*"
                                                                className="hidden"
                                                                onChange={async (e) => {
                                                                    const file = e.target.files?.[0];
                                                                    if (file) {
                                                                        const uploadToast = toast.loading("UPLOADING_VIDEO_ASSET...");
                                                                        try {
                                                                            if (file.size > 4 * 1024 * 1024) {
                                                                                throw new Error('Video is too large. Maximum upload size is 4 MB');
                                                                            }
                                                                            const token = localStorage.getItem('kavon-admin-token') || "";
                                                                            const data = await uploadImage(file, token);
                                                                            
                                                                            const newSlides = [...settings.heroSlides];
                                                                            newSlides[idx].video = data.url;
                                                                            setSettings({...settings, heroSlides: newSlides});
                                                                            toast.success("VIDEO_ASSET_SYNCHRONIZED", { id: uploadToast });
                                                                        } catch (err) {
                                                                            toast.error(err instanceof Error ? err.message : "UPLOAD_FAILURE", { id: uploadToast });
                                                                        }
                                                                    }
                                                                }}
                                                            />
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="font-mono text-[9px] text-white/40 uppercase tracking-widest">Description</label>
                                                    <textarea 
                                                        value={slide.desc}
                                                        onChange={(e) => {
                                                            const newSlides = [...settings.heroSlides];
                                                            newSlides[idx].desc = e.target.value;
                                                            setSettings({...settings, heroSlides: newSlides});
                                                        }}
                                                        className="w-full bg-black/40 border border-white/5 p-3 font-mono text-xs focus:border-brand-volt outline-none h-16 resize-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* HQ Information */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3 text-white/60">
                        <Phone size={20} className="text-brand-volt" />
                        <h3 className="font-black uppercase tracking-widest text-sm">HQ_Communication_Coordinates</h3>
                    </div>
                    <div className="p-8 tactical-glass grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="font-mono text-[9px] text-white/40 uppercase tracking-widest flex items-center gap-2">
                                <Mail size={12} /> Contact_Email
                            </label>
                            <input 
                                type="email" 
                                value={settings.contactEmail}
                                onChange={(e) => setSettings({...settings, contactEmail: e.target.value})}
                                className="w-full bg-black/40 border border-white/5 p-4 font-mono text-xs focus:border-brand-volt outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="font-mono text-[9px] text-white/40 uppercase tracking-widest flex items-center gap-2">
                                <Phone size={12} /> Contact_Phone
                            </label>
                            <input 
                                type="text" 
                                value={settings.contactPhone}
                                onChange={(e) => setSettings({...settings, contactPhone: e.target.value})}
                                className="w-full bg-black/40 border border-white/5 p-4 font-mono text-xs focus:border-brand-volt outline-none"
                            />
                        </div>
                    </div>
                </section>

                {/* Final Authorization */}
                <div className="pt-10 border-t border-white/5 flex justify-end">
                    <button 
                        type="submit"
                        disabled={isSaving}
                        className="bg-brand-volt text-black px-12 py-5 font-black uppercase text-[11px] tracking-[0.3em] flex items-center gap-3 hover:brightness-110 transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(223, 7, 21,0.2)]"
                    >
                        <Save size={18} />
                        {isSaving ? "SYNCHRONIZING..." : "Authorize_System_Updates"}
                    </button>
                </div>
            </form>
        </div>
    );
}
