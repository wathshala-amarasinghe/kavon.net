"use client";

import React, { useState, useEffect } from 'react';
import { X, Save, Calendar, Type, FileText, Image as ImageIcon, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllProducts } from '@/lib/api';
import toast from 'react-hot-toast';

interface CampaignFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => Promise<void>;
    initialData?: any;
    title: string;
}

export default function CampaignForm({ isOpen, onClose, onSubmit, initialData, title }: CampaignFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        status: 'Scheduled',
        bannerImage: '',
        products: [] as string[]
    });
    const [availableProducts, setAvailableProducts] = useState<any[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                description: initialData.description || '',
                startDate: initialData.startDate ? new Date(initialData.startDate).toISOString().slice(0, 16) : '',
                endDate: initialData.endDate ? new Date(initialData.endDate).toISOString().slice(0, 16) : '',
                status: initialData.status || 'Scheduled',
                bannerImage: initialData.bannerImage || '',
                products: Array.isArray(initialData.products)
                    ? initialData.products.map((product: any) => typeof product === 'string' ? product : product._id).filter(Boolean)
                    : []
            });
        } else {
            setFormData({
                name: '',
                description: '',
                startDate: '',
                endDate: '',
                status: 'Scheduled',
                bannerImage: '',
                products: []
            });
        }
    }, [initialData, isOpen]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getAllProducts();
                setAvailableProducts(data.products);
            } catch (error: unknown) {
                toast.error(error instanceof Error ? error.message : 'PRODUCT_SYNC_FAILED');
            }
        };
        if (isOpen) fetchProducts();
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;

        if (new Date(formData.endDate) <= new Date(formData.startDate)) {
            alert('Deployment end must be later than deployment start.');
            return;
        }

        if (formData.products.length === 0) {
            alert('Select at least one product for this campaign.');
            return;
        }
        setIsSubmitting(true);
        try {
            await onSubmit(formData);
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/90 backdrop-blur-md" 
                />
                
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="w-full max-w-4xl bg-brand-black border border-white/10 relative z-10 overflow-hidden flex flex-col max-h-[90vh]"
                >
                    <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-brand-volt text-black flex items-center justify-center">
                                <Calendar size={20} />
                            </div>
                            <h2 className="text-2xl font-black italic uppercase tracking-tighter">{title}</h2>
                        </div>
                        <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="font-mono text-[10px] text-white/40 uppercase tracking-widest flex items-center gap-2">
                                        <Type size={12} /> Campaign_Name
                                    </label>
                                    <input 
                                        required
                                        type="text" 
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        className="w-full bg-black/40 border border-white/5 p-4 font-mono text-xs uppercase focus:border-brand-volt outline-none"
                                        placeholder="E.G. NEON_VOID_DROP"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="font-mono text-[10px] text-white/40 uppercase tracking-widest flex items-center gap-2">
                                        <FileText size={12} /> Mission_Brief (Description)
                                    </label>
                                    <textarea 
                                        value={formData.description}
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                        className="w-full bg-black/40 border border-white/5 p-4 font-mono text-xs focus:border-brand-volt outline-none h-32 resize-none"
                                        placeholder="Describe the campaign objectives..."
                                    />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="font-mono text-[10px] text-white/40 uppercase tracking-widest">Deployment_Start</label>
                                        <input 
                                            required
                                            type="datetime-local" 
                                            value={formData.startDate}
                                            onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                                            className="w-full bg-black/40 border border-white/5 p-4 font-mono text-[10px] focus:border-brand-volt outline-none [color-scheme:dark]"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="font-mono text-[10px] text-white/40 uppercase tracking-widest">Deployment_End</label>
                                        <input 
                                            required
                                            type="datetime-local" 
                                            value={formData.endDate}
                                            onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                                            className="w-full bg-black/40 border border-white/5 p-4 font-mono text-[10px] focus:border-brand-volt outline-none [color-scheme:dark]"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="font-mono text-[10px] text-white/40 uppercase tracking-widest">Current_Status</label>
                                    <select 
                                        value={formData.status}
                                        onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                                        className="w-full bg-black/40 border border-white/5 p-4 font-mono text-xs uppercase tracking-widest focus:border-brand-volt outline-none cursor-pointer"
                                    >
                                        <option value="Scheduled">Scheduled</option>
                                        <option value="Active">Active</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="font-mono text-[10px] text-white/40 uppercase tracking-widest flex items-center gap-2">
                                        <ImageIcon size={12} /> Visual_Asset_URL
                                    </label>
                                    <input 
                                        type="text" 
                                        value={formData.bannerImage}
                                        onChange={(e) => setFormData({...formData, bannerImage: e.target.value})}
                                        className="w-full bg-black/40 border border-white/5 p-4 font-mono text-xs focus:border-brand-volt outline-none"
                                        placeholder="/images/campaigns/..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="font-mono text-[10px] text-white/40 uppercase tracking-widest flex items-center gap-2">
                                <Package size={12} /> Linked_Assets (Products)
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-60 overflow-y-auto p-4 tactical-glass custom-scrollbar">
                                {availableProducts.map((product) => (
                                    <label key={product._id} className="flex items-center gap-3 p-3 border border-white/5 bg-black/20 hover:bg-white/5 cursor-pointer transition-all">
                                        <input 
                                            type="checkbox" 
                                            checked={formData.products.includes(product._id)}
                                            onChange={(e) => {
                                                const newProducts = e.target.checked 
                                                    ? [...formData.products, product._id]
                                                    : formData.products.filter(id => id !== product._id);
                                                setFormData({...formData, products: newProducts});
                                            }}
                                            className="w-4 h-4 rounded-none border-white/10 bg-black accent-brand-volt cursor-pointer"
                                        />
                                        <span className="font-mono text-[10px] uppercase truncate">{product.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="pt-8 border-t border-white/5 flex justify-end gap-4">
                            <button 
                                type="button" 
                                onClick={onClose}
                                className="px-8 py-4 border border-white/10 font-black uppercase text-[11px] tracking-widest hover:bg-white hover:text-black transition-all"
                            >
                                Abort
                            </button>
                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="px-8 py-4 bg-brand-volt text-black font-black uppercase text-[11px] tracking-widest hover:brightness-110 transition-all flex items-center gap-2 disabled:opacity-50"
                            >
                                <Save size={16} /> {isSubmitting ? 'SYNCHRONIZING...' : 'Authorize_Deployment'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
