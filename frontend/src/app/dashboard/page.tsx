"use client";

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSettings } from '@/context/UserSettingsContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Package,
    Shield,
    Zap,
    Radio,
    MapPin,
    Settings,
    ChevronRight,
    Clock,
    CreditCard,
    Bell
} from 'lucide-react';
import Link from 'next/link';
import { FormattedPrice } from '@/components/ui/FormattedPrice';
import Avatar from '@/components/Avatar';
import toast from 'react-hot-toast';
import { API_URL } from '@/lib/api';

export default function DashboardPage() {
    const { user, loading, orderHistory, loyaltyPoints, transmissions, logout, updateProfile, updateAvatar } = useAuth();
    const { location } = useSettings();
    const [activeTab, setActiveTab] = useState<'history' | 'comms' | 'intel'>('history');
    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [isSavingAddress, setIsSavingAddress] = useState(false);
    const [addressError, setAddressError] = useState('');
    const [addressForm, setAddressForm] = useState({
        address: '',
        city: '',
        postalCode: '',
        country: 'Sri Lanka',
        phone: '',
    });
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

    const handleLogout = () => {
        logout();
    };

    const openAddressEditor = () => {
        setAddressForm({
            address: user?.shippingAddress?.address || '',
            city: user?.shippingAddress?.city || '',
            postalCode: user?.shippingAddress?.postalCode || '',
            country: 'Sri Lanka',
            phone: user?.shippingAddress?.phone || '',
        });
        setAddressError('');
        setIsEditingAddress(true);
    };

    const saveAddress = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (isSavingAddress) return;

        const normalized = Object.fromEntries(
            Object.entries(addressForm).map(([key, value]) => [key, value.trim()])
        ) as typeof addressForm;
        if (Object.values(normalized).some((value) => !value)) {
            setAddressError('Complete every address field.');
            return;
        }

        setIsSavingAddress(true);
        setAddressError('');
        try {
            await updateProfile({
                name: user?.name,
                email: user?.email,
                shippingAddress: normalized,
            });
            setIsEditingAddress(false);
        } catch (error) {
            setAddressError(error instanceof Error ? error.message : 'Address update failed.');
        } finally {
            setIsSavingAddress(false);
        }
    };

    const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            toast.error('File too large. Maximum size is 2MB.');
            return;
        }

        const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            toast.error('Invalid file type. Only JPG, PNG, and WebP are allowed.');
            return;
        }

        setIsUploadingAvatar(true);
        try {
            const token = localStorage.getItem('kavon-token-v1');
            
            // 1. Get Signature
            const sigRes = await fetch(`${API_URL}/users/avatar/signature`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!sigRes.ok) throw new Error('Failed to obtain upload signature');
            const { signature, timestamp, folder, cloudName, apiKey } = await sigRes.json();

            // 2. Upload to Cloudinary
            const formData = new FormData();
            formData.append('file', file);
            formData.append('api_key', apiKey);
            formData.append('timestamp', timestamp);
            formData.append('signature', signature);
            formData.append('folder', folder);

            const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                method: 'POST',
                body: formData
            });
            if (!uploadRes.ok) throw new Error('Failed to upload image to Cloudinary');
            const uploadData = await uploadRes.json();

            // 3. Save to backend
            const updateRes = await fetch(`${API_URL}/users/avatar`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    avatarUrl: uploadData.secure_url,
                    avatarPublicId: uploadData.public_id
                })
            });

            if (!updateRes.ok) throw new Error('Failed to save avatar to profile');
            
            // 4. Update Context
            updateAvatar(uploadData.secure_url, uploadData.public_id);
            toast.success('Avatar updated successfully');
        } catch (error: unknown) {
            toast.error(error instanceof Error ? error.message : 'Avatar upload failed');
        } finally {
            setIsUploadingAvatar(false);
            event.target.value = '';
        }
    };

    const handleAvatarRemove = async () => {
        if (!confirm('Are you sure you want to remove your profile picture?')) return;
        setIsUploadingAvatar(true);
        try {
            const token = localStorage.getItem('kavon-token-v1');
            const res = await fetch(`${API_URL}/users/avatar`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to remove avatar');
            updateAvatar(undefined, undefined);
            toast.success('Avatar removed successfully');
        } catch (error: unknown) {
            toast.error(error instanceof Error ? error.message : 'Failed to remove avatar');
        } finally {
            setIsUploadingAvatar(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-volt border-t-transparent" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8">
                <div className="w-16 h-16 border border-brand-volt flex items-center justify-center text-brand-volt mb-8 animate-pulse">
                    <Shield size={32} />
                </div>
                <h1 className="text-2xl font-black uppercase italic tracking-[0.4em] text-white mb-4">Login Required</h1>
                <p className="text-white/40 font-mono text-sm uppercase tracking-[0.2em] mb-8 text-center max-w-md">
                    Access to your dashboard is restricted. Please login to continue.
                </p>
                <Link href="/login" className="bg-brand-volt text-black px-12 py-4 font-black uppercase text-xs tracking-[0.5em] hover:brightness-110 transition-all">
                    Login
                </Link>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-black pt-52 pb-20 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                {/* 1. STATUS_HEADER */}
                <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-12">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-brand-volt">
                            <Shield size={16} />
                            <span className="font-mono text-[12px] uppercase tracking-[0.4em]">Account Status: Active</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black uppercase italic leading-none tracking-[0.1em]">
                            {user.name.split(' ')[0]}<span className="text-brand-volt">_Account</span>
                        </h1>
                        <div className="flex items-center gap-6 text-[12px] font-mono text-white/40 uppercase tracking-[0.2em]">
                            <div className="flex items-center gap-2">
                                <Radio size={12} /> Region: {location}
                            </div>
                            <div className="flex items-center gap-2">
                                <Bell size={12} /> Account: Verified
                            </div>
                        </div>
                    </div>

                    {/* LOYALTY_CREDITS_WIDGET */}
                    <div className="bg-brand-surface border border-white/10 p-6 md:p-8 min-w-[300px] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Zap size={64} className="text-brand-volt" />
                        </div>
                        <span className="text-[12px] font-mono text-white/40 uppercase tracking-[0.4em] block mb-2">Loyalty Points</span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-black italic text-brand-volt tracking-[0.1em]">{loyaltyPoints.toLocaleString()}</span>
                            <span className="text-[12px] font-mono text-white/60 uppercase tracking-[0.2em]">Points</span>
                        </div>
                        <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center text-[11px] font-mono uppercase tracking-[0.2em]">
                            <span className="text-white/20">Next Reward at 5,000</span>
                            <Link href="/shop" className="text-brand-volt hover:underline flex items-center gap-1 font-bold">
                                Earn Points <ChevronRight size={10} />
                            </Link>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* 2. COMMAND_NAVIGATION */}
                    <aside className="lg:col-span-3 space-y-2">
                        <button
                            onClick={() => setActiveTab('history')}
                            className={`w-full flex items-center gap-4 p-5 font-mono text-[13px] uppercase tracking-[0.2em] transition-all border ${activeTab === 'history' ? 'bg-brand-volt text-black border-brand-volt' : 'bg-white/[0.02] border-white/5 text-white hover:border-white/20'}`}
                        >
                            <Package size={18} /> ORDER HISTORY
                        </button>
                        <button
                            onClick={() => setActiveTab('comms')}
                            className={`w-full flex items-center gap-4 p-5 font-mono text-[14px] uppercase tracking-[0.2em] transition-all border ${activeTab === 'comms' ? 'bg-brand-volt text-black border-brand-volt' : 'bg-white/[0.02] border-white/5 text-white hover:border-white/20'}`}
                        >
                            <Radio size={18} /> MESSAGES
                            {transmissions.length > 0 && <span className={`ml-auto w-2.5 h-2.5 rounded-full ${activeTab === 'comms' ? 'bg-black' : 'bg-brand-volt animate-pulse'}`} />}
                        </button>
                        <button
                            onClick={() => setActiveTab('intel')}
                            className={`w-full flex items-center gap-4 p-5 font-mono text-[14px] uppercase tracking-[0.2em] transition-all border ${activeTab === 'intel' ? 'bg-brand-volt text-black border-brand-volt' : 'bg-white/[0.02] border-white/5 text-white hover:border-white/20'}`}
                        >
                            <Settings size={18} /> ACCOUNT SETTINGS
                        </button>

                        <div className="pt-8 mt-8 border-t border-white/10">
                            <button
                                onClick={handleLogout}
                                className="w-full text-left p-5 font-mono text-[12px] uppercase text-red-500/80 hover:text-red-500 transition-all tracking-[0.3em] font-bold"
                            >
                                LOG OUT
                            </button>
                        </div>
                    </aside>

                    {/* 3. CONTENT_AREA */}
                    <div className="lg:col-span-9">
                        <AnimatePresence mode="wait">
                            {activeTab === 'history' && (
                                <motion.div
                                    key="history"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="flex items-center justify-between mb-8">
                                        <h2 className="text-3xl font-black uppercase italic text-white flex items-center gap-4 tracking-[0.1em]">
                                            ORDER HISTORY <span className="text-white/40 font-mono text-sm font-normal tracking-[0.1em]">[{orderHistory.length} ORDERS]</span>
                                        </h2>
                                    </div>

                                    {orderHistory.length > 0 ? (
                                        <div className="space-y-4">
                                            {orderHistory.map((order) => {
                                                const orderId = order._id || order.id || 'UNKNOWN';
                                                return (
                                                    <div key={orderId} className="bg-white/[0.02] border border-white/10 p-6 group hover:border-brand-volt/40 transition-all">
                                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                                        <div className="space-y-2">
                                                            <div className="flex items-center gap-4">
                                                                <span className="text-[13px] font-black uppercase tracking-[0.3em] text-white">#{orderId}</span>
                                                                <span className="px-2 py-0.5 bg-brand-volt/20 text-brand-volt text-[12px] font-mono uppercase tracking-[0.2em] border border-brand-volt/40 font-bold">
                                                                    {order.status}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-4 text-[12px] font-mono text-white/30 uppercase tracking-[0.2em]">
                                                                <span className="flex items-center gap-1"><Clock size={12} /> {new Date(order.date || order.createdAt || "2024-01-01T00:00:00Z").toLocaleDateString()}</span>
                                                                <span className="flex items-center gap-1"><Package size={12} /> {(order.items || order.orderItems || []).length} Items</span>
                                                            </div>
                                                        </div>

                                                        <div className="text-right">
                                                            <div className="text-lg font-black italic text-white group-hover:text-brand-volt transition-colors tracking-[0.1em]">
                                                                <FormattedPrice amount={order.totalPrice || order.totals?.total || 0} />
                                                            </div>
                                                            <Link 
                                                                href={`/order-track?id=${orderId}&phone=${order.shippingAddress?.phone || ""}`}
                                                                className="text-[12px] font-mono text-white hover:text-brand-volt uppercase tracking-[0.3em] mt-2 block font-bold"
                                                            >
                                                                Track Order
                                                            </Link>
                                                        </div>
                                                    </div>

                                                    {/* MINI_ITEM_PREVIEW */}
                                                    <div className="mt-6 pt-6 border-t border-white/5 flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                                                        {(order.items || order.orderItems || []).map((item, i: number) => (
                                                            <div key={i} className="w-12 h-16 bg-black border border-white/10 shrink-0">
                                                                <img src={item.image} alt="" className="w-full h-full object-cover opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all" />
                                                            </div>
                                                        ))}
                                                    </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="py-20 text-center border-2 border-dashed border-white/5 bg-white/[0.01]">
                                            <p className="font-mono text-xs text-white/20 uppercase tracking-[0.4em]">You haven&apos;t placed any orders yet.</p>
                                            <Link href="/shop" className="inline-block mt-8 text-brand-volt font-mono text-[12px] uppercase tracking-[0.4em] border border-brand-volt/20 px-6 py-2 hover:bg-brand-volt/10 font-bold">
                                                Start Shopping
                                            </Link>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {activeTab === 'comms' && (
                                <motion.div
                                    key="comms"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <h2 className="text-2xl font-black uppercase italic text-white flex items-center gap-4 mb-8 tracking-[0.2em]">
                                        MESSAGES <Radio className="text-brand-volt animate-pulse" size={20} />
                                    </h2>

                                    <div className="space-y-4">
                                        {transmissions.length > 0 ? (
                                            transmissions.map((msg) => (
                                                <div key={msg.id} className="bg-white/[0.02] border-l-2 border-brand-volt p-6 space-y-3">
                                                    <div className="flex justify-between items-start">
                                                        <span className="text-[12px] font-mono text-brand-volt uppercase tracking-[0.2em] font-bold">{msg.subject}</span>
                                                        <span className="text-[12px] font-mono text-white/40 uppercase tracking-[0.2em]">{new Date(msg.date).toLocaleTimeString()}</span>
                                                    </div>
                                                    <p className="text-[13px] font-mono text-white/60 leading-relaxed uppercase tracking-[0.2em]">
                                                        {msg.body}
                                                    </p>
                                                    <div className="flex items-center gap-4 pt-2">
                                                        <span className={`text-[12px] font-mono px-2 py-0.5 uppercase border tracking-[0.2em] ${msg.priority === 'High' ? 'border-red-500/60 text-red-500' : 'border-white/20 text-white/50'}`}>
                                                            Priority: {msg.priority}
                                                        </span>
                                                        <span className="text-[12px] font-mono text-white/40 uppercase tracking-[0.2em]">Source: KAVON_SUPPORT</span>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="py-20 text-center border-2 border-dashed border-white/5 bg-white/[0.01]">
                                                <p className="font-mono text-xs text-white/20 uppercase tracking-[0.4em]">No messages yet.</p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'intel' && (
                                <motion.div
                                    key="intel"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="grid grid-cols-1 md:grid-cols-2 gap-8"
                                >
                                    {/* PROFILE_AVATAR */}
                                    <div className="bg-white/[0.02] border border-white/10 p-8 space-y-6 md:col-span-2">
                                        <div className="flex items-center gap-6">
                                            <Avatar src={user.avatarUrl} name={user.name} size={80} />
                                            <div className="space-y-3">
                                                <div>
                                                    <h3 className="text-lg font-black uppercase italic text-white tracking-[0.2em]">Profile Avatar</h3>
                                                    <p className="text-[11px] font-mono text-white/50 uppercase tracking-[0.1em]">JPG, PNG, WebP up to 2MB. Crops to square.</p>
                                                </div>
                                                <div className="flex flex-wrap gap-3">
                                                    <label className={`cursor-pointer px-4 py-2 bg-brand-volt text-black text-[11px] font-black uppercase tracking-[0.2em] transition-opacity ${isUploadingAvatar ? 'opacity-50 cursor-not-allowed' : 'hover:brightness-110'}`}>
                                                        {isUploadingAvatar ? 'Uploading...' : 'Upload Picture'}
                                                        <input 
                                                            type="file" 
                                                            accept="image/jpeg, image/png, image/webp" 
                                                            className="hidden" 
                                                            onChange={handleAvatarUpload}
                                                            disabled={isUploadingAvatar}
                                                        />
                                                    </label>
                                                    {user.avatarUrl && (
                                                        <button 
                                                            onClick={handleAvatarRemove}
                                                            disabled={isUploadingAvatar}
                                                            className="px-4 py-2 border border-white/20 text-white/70 hover:text-white hover:bg-white/5 text-[11px] font-mono uppercase tracking-[0.2em] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            Remove
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* NOTIFICATION_PREFERENCES */}
                                    <div className="bg-white/[0.02] border border-white/10 p-8 space-y-6 md:col-span-2">
                                        <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                                            <Bell size={20} className="text-brand-volt" />
                                            <h3 className="text-lg font-black uppercase italic text-white tracking-[0.2em]">Notification Preferences</h3>
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-black/40 border border-white/5">
                                            <div className="space-y-1">
                                                <div className="text-[12px] font-mono text-white uppercase tracking-[0.2em]">Marketing Emails</div>
                                                <div className="text-[10px] font-mono text-white/50 tracking-[0.1em]">Receive offers, exclusive drops, and announcements.</div>
                                            </div>
                                            <button 
                                                onClick={async () => {
                                                    try {
                                                        const newVal = !user.marketingEmailConsent;
                                                        await updateProfile({ marketingEmailConsent: newVal });
                                                        toast.success(newVal ? 'Subscribed to marketing emails' : 'Unsubscribed from marketing emails');
                                                    } catch (error: unknown) {
                                                        toast.error(error instanceof Error ? error.message : 'Failed to update preferences');
                                                    }
                                                }}
                                                className={`w-12 h-6 rounded-full p-1 transition-colors relative flex items-center ${user.marketingEmailConsent ? 'bg-brand-volt' : 'bg-white/20'}`}
                                            >
                                                <div className={`w-4 h-4 rounded-full bg-black transition-transform ${user.marketingEmailConsent ? 'translate-x-6' : 'translate-x-0'}`} />
                                            </button>
                                        </div>
                                        <p className="text-[10px] font-mono text-white/40 italic">Note: You will always receive critical operational emails like order confirmations and security alerts regardless of this setting.</p>
                                    </div>

                                    {/* ADDRESS_MANAGEMENT */}
                                    <div className="bg-white/[0.02] border border-white/10 p-8 space-y-6">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-black uppercase italic text-white flex items-center gap-3 tracking-[0.2em]">
                                                <MapPin size={18} className="text-brand-volt" /> Shipping Address
                                            </h3>
                                            <button
                                                onClick={openAddressEditor}
                                                className="text-[12px] font-mono text-brand-volt uppercase tracking-[0.3em] hover:underline font-bold bg-brand-volt/10 px-3 py-1 border border-brand-volt/20"
                                            >
                                                {user.shippingAddress?.address ? 'Update' : 'Add'}
                                            </button>
                                        </div>
                                        <div className="space-y-4">
                                            {isEditingAddress ? (
                                                <form onSubmit={saveAddress} className="space-y-3">
                                                    {([
                                                        ['address', 'Street address'],
                                                        ['city', 'City'],
                                                        ['postalCode', 'Postal code'],
                                                        ['country', 'Country'],
                                                        ['phone', 'Phone'],
                                                    ] as const).map(([field, label]) => (
                                                        <label key={field} className="block space-y-1">
                                                            <span className="text-[10px] font-mono text-white/50 uppercase tracking-[0.2em]">{label}</span>
                                                            <input
                                                                value={addressForm[field]}
                                                                onChange={(event) => setAddressForm((current) => ({
                                                                    ...current,
                                                                    [field]: event.target.value,
                                                                }))}
                                                                autoComplete={field === 'postalCode' ? 'postal-code' : field === 'address' ? 'street-address' : field === 'phone' ? 'tel' : field}
                                                                readOnly={field === 'country'}
                                                                required
                                                                className="w-full bg-black/60 border border-white/15 px-3 py-3 text-xs font-mono text-white outline-none focus:border-brand-volt read-only:text-white/50"
                                                            />
                                                        </label>
                                                    ))}
                                                    {addressError && <p role="alert" className="text-xs font-mono text-red-400">{addressError}</p>}
                                                    <div className="flex gap-3 pt-2">
                                                        <button
                                                            type="submit"
                                                            disabled={isSavingAddress}
                                                            className="flex-1 py-3 bg-brand-volt text-black text-[11px] font-black uppercase tracking-[0.2em] disabled:opacity-50"
                                                        >
                                                            {isSavingAddress ? 'Saving...' : 'Save Address'}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setIsEditingAddress(false)}
                                                            className="px-4 py-3 border border-white/20 text-[11px] font-mono uppercase"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </form>
                                            ) : (
                                                <div className="p-4 bg-black/40 border border-white/5">
                                                    <span className="text-[12px] font-mono text-white/40 uppercase block mb-1 tracking-[0.3em]">Primary Address</span>
                                                    {user.shippingAddress?.address ? (
                                                        <address className="text-[13px] not-italic font-mono text-white uppercase tracking-[0.1em] leading-relaxed">
                                                            {user.shippingAddress.address}<br />
                                                            {user.shippingAddress.city}, {user.shippingAddress.postalCode}<br />
                                                            {user.shippingAddress.country}<br />
                                                            {user.shippingAddress.phone}
                                                        </address>
                                                    ) : (
                                                        <p className="text-[13px] font-mono text-white/50 uppercase tracking-[0.1em]">No address saved yet</p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* PAYMENT_METHODS */}
                                    <div className="bg-white/[0.02] border border-white/10 p-8 space-y-6">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-black uppercase italic text-white flex items-center gap-3 tracking-[0.2em]">
                                                <CreditCard size={18} className="text-brand-volt" /> Payment Methods
                                            </h3>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="p-10 text-center border border-dashed border-white/5">
                                                <p className="text-[12px] font-mono text-white/40 uppercase tracking-[0.3em]">Cash on Delivery is available at checkout</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </main>
    );
}
