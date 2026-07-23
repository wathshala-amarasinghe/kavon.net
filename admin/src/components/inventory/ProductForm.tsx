"use client";

import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Save, AlertCircle, UploadCloud } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { uploadImage } from '@/lib/api';
import { PRODUCT_CATEGORIES } from '@/lib/catalog';
import toast from 'react-hot-toast';

interface ProductFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => Promise<void>;
    initialData?: any;
    title: string;
}

export default function ProductForm({ isOpen, onClose, onSubmit, initialData, title }: ProductFormProps) {
    const [formData, setFormData] = useState<any>({
        name: '',
        price: 0,
        stock: 0,
        category: '',
        gender: 'Unisex',
        description: '',
        images: [''],
        colors: [{ name: 'Default', hex: '#000000', img: '' }],
        sizes: [
            { label: 'S', stock: 0 },
            { label: 'M', stock: 0 },
            { label: 'L', stock: 0 },
            { label: 'XL', stock: 0 }
        ],
        isNewDrop: true,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const totalSizeStock = formData.sizes.reduce(
        (total: number, size: { stock?: number | string }) => total + (Number(size.stock) || 0),
        0
    );

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                images: initialData.images?.length ? initialData.images : [''],
                colors: initialData.colors?.length ? initialData.colors : [{ name: 'Default', hex: '#000000', img: '' }],
                sizes: initialData.sizes?.length ? initialData.sizes : [
                    { label: 'S', stock: 0 },
                    { label: 'M', stock: 0 },
                    { label: 'L', stock: 0 },
                    { label: 'XL', stock: 0 }
                ]
            });
        } else {
            setFormData({
                name: '',
                price: 0,
                stock: 0,
                category: '',
                gender: 'Unisex',
                description: '',
                images: [''],
                colors: [{ name: 'Default', hex: '#000000', img: '' }],
                sizes: [
                    { label: 'S', stock: 0 },
                    { label: 'M', stock: 0 },
                    { label: 'L', stock: 0 },
                    { label: 'XL', stock: 0 }
                ],
                isNewDrop: true,
            });
        }
    }, [initialData, isOpen]);

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isSubmitting || isUploading) return;

        if (!formData.name?.trim()) {
            toast.error("DATA_INCOMPLETE: Product name is required.");
            return;
        }

        if (!formData.category) {
            toast.error("DATA_INCOMPLETE: Select a product category.");
            return;
        }

        if (!Number.isFinite(Number(formData.price)) || Number(formData.price) <= 0) {
            toast.error("DATA_INVALID: Product price must be greater than zero.");
            return;
        }

        const cleanedImages = formData.images.filter((url: string) => url && url.trim() !== '');
        
        if (cleanedImages.length === 0) {
            toast.error("UPLOAD_REQUIRED: Please provide at least one visual manifest.");
            return;
        }

        if (!formData.description?.trim()) {
            toast.error("DATA_INCOMPLETE: Asset description is required.");
            return;
        }

        const cleanedColors = formData.colors
            .map((color: any) => ({
                name: String(color.name || '').trim(),
                hex: String(color.hex || '#000000').trim(),
                img: String(color.img || '').trim(),
            }))
            .filter((color: any) => color.name);

        const finalData = {
            ...formData,
            name: formData.name.trim(),
            description: formData.description.trim(),
            images: cleanedImages,
            price: Number(formData.price),
            stock: totalSizeStock,
            sizes: formData.sizes.map((s: any) => ({ ...s, stock: Number(s.stock) || 0 })),
            colors: cleanedColors.length > 0
                ? cleanedColors
                : [{ name: 'Default', hex: '#000000', img: '' }],
        };

        setIsSubmitting(true);
        try {
            await onSubmit(finalData);
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const allowedTypes = new Set([
            'image/jpeg',
            'image/png',
            'image/webp',
            'image/gif',
        ]);

        if (!allowedTypes.has(file.type)) {
            toast.error('Only JPG, PNG, WebP, or GIF images are allowed.');
            e.target.value = '';
            return;
        }

        if (file.size > 4 * 1024 * 1024) {
            toast.error('Image is too large. Please choose an image below 4 MB.');
            e.target.value = '';
            return;
        }

        try {
            setIsUploading(true);
            const token = localStorage.getItem('kavon-admin-token');
            if (!token) throw new Error("No token");
            
            const res = await uploadImage(file, token);
            const fullUrl = res.url;
            
            const newImages = [...formData.images];
            newImages[index] = fullUrl;
            setFormData({...formData, images: newImages});
        } catch (error: any) {
            console.error("Upload failed", error);
            toast.error(error?.message || "Image upload failed. Please try again.");
            e.target.value = '';
        } finally {
            setIsUploading(false);
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
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="w-full max-w-4xl bg-brand-black border border-white/10 relative z-10 overflow-hidden flex flex-col max-h-[90vh]"
                >
                    {/* Header */}
                    <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                        <div className="space-y-1">
                            <span className="font-mono text-[10px] text-brand-volt uppercase tracking-[0.4em]">Protocol / Asset_Modification</span>
                            <h2 className="text-2xl font-black italic uppercase tracking-wider">{title}</h2>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/10 text-white/40 hover:text-white transition-all">
                            <X size={24} />
                        </button>
                    </div>

                    {/* Form Body */}
                    <form id="product-form" onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Basic Info */}
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="font-mono text-[9px] text-white/40 uppercase tracking-widest">Asset_Name</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        className="w-full bg-black/40 border border-white/5 p-4 font-mono text-xs uppercase focus:border-brand-volt outline-none transition-all"
                                        placeholder="IDENTIFY_ASSET..."
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="font-mono text-[9px] text-white/40 uppercase tracking-widest">Base_Valuation (LKR)</label>
                                        <input 
                                            type="number" 
                                            required
                                            min="0.01"
                                            step="0.01"
                                            value={formData.price}
                                            onChange={(e) => setFormData({...formData, price: e.target.value === '' ? '' : Number(e.target.value)})}
                                            className="w-full bg-black/40 border border-white/5 p-4 font-mono text-xs focus:border-brand-volt outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="font-mono text-[9px] text-white/40 uppercase tracking-widest">Global_Stock</label>
                                        <input 
                                            type="number" 
                                            readOnly
                                            value={totalSizeStock}
                                            className="w-full bg-black/40 border border-white/5 p-4 font-mono text-xs text-white/50 cursor-not-allowed"
                                            title="Automatically calculated from size inventory"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="font-mono text-[9px] text-white/40 uppercase tracking-widest">Category_Sector</label>
                                    <select 
                                        required
                                        value={formData.category}
                                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                                        className="w-full bg-black/40 border border-white/5 p-4 font-mono text-xs uppercase focus:border-brand-volt outline-none transition-all appearance-none"
                                    >
                                        <option value="" disabled>Select a category</option>
                                        {PRODUCT_CATEGORIES.map((category) => (
                                            <option key={category} value={category}>{category}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="font-mono text-[9px] text-white/40 uppercase tracking-widest">Target_Division (Gender)</label>
                                    <select 
                                        value={formData.gender}
                                        onChange={(e) => setFormData({...formData, gender: e.target.value})}
                                        className="w-full bg-black/40 border border-white/5 p-4 font-mono text-xs uppercase focus:border-brand-volt outline-none transition-all appearance-none"
                                    >
                                        <option value="Men">Men</option>
                                        <option value="Women">Women</option>
                                        <option value="Child">Child</option>
                                        <option value="Unisex">Unisex</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="font-mono text-[9px] text-white/40 uppercase tracking-widest">Asset_Description</label>
                                    <textarea 
                                        value={formData.description}
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                        className="w-full bg-black/40 border border-white/5 p-4 font-mono text-xs focus:border-brand-volt outline-none transition-all h-32 resize-none"
                                        placeholder="TECHNICAL_SPECIFICATIONS..."
                                    />
                                </div>
                            </div>

                            {/* Images & Variants */}
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <label className="font-mono text-[9px] text-white/40 uppercase tracking-widest block">Visual_Manifests (Uploads)</label>
                                    {formData.images.map((url: string, index: number) => (
                                        <div key={index} className="flex gap-4 items-start">
                                            {url ? (
                                                <div className="w-16 h-20 bg-white/5 border border-white/10 shrink-0 overflow-hidden relative group">
                                                    <img src={url} className="w-full h-full object-cover" alt="" />
                                                    <button 
                                                        type="button"
                                                        onClick={() => {
                                                            const newImages = [...formData.images];
                                                            newImages[index] = '';
                                                            setFormData({...formData, images: newImages});
                                                        }}
                                                        className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <Trash2 size={16} className="text-red-500" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <label className="w-16 h-20 bg-white/5 border border-dashed border-white/10 shrink-0 flex items-center justify-center cursor-pointer hover:border-brand-volt transition-colors relative">
                                                    <input 
                                                        type="file" 
                                                        accept="image/jpeg,image/png,image/webp,image/gif"
                                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                                        onChange={(e) => handleImageUpload(e, index)}
                                                    />
                                                    <Plus size={16} className="text-white/40" />
                                                </label>
                                            )}
                                            
                                            <div className="flex-1 flex flex-col justify-center">
                                                <input 
                                                    type="text" 
                                                    value={url}
                                                    readOnly
                                                    className="w-full bg-black/40 border border-white/5 p-3 font-mono text-[10px] focus:border-brand-volt outline-none text-white/40 cursor-not-allowed"
                                                    placeholder="UPLOAD_PENDING..."
                                                />
                                            </div>

                                            {index > 0 && (
                                                <button 
                                                    type="button"
                                                    onClick={() => setFormData({...formData, images: formData.images.filter((_:any, i:number) => i !== index)})}
                                                    className="p-3 mt-1 text-white/20 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button 
                                        type="button"
                                        onClick={() => setFormData({...formData, images: [...formData.images, '']})}
                                        className="w-full p-3 border border-dashed border-white/10 font-mono text-[9px] uppercase text-white/20 hover:text-brand-volt hover:border-brand-volt/50 transition-all flex items-center justify-center gap-2"
                                        disabled={isUploading}
                                    >
                                        <Plus size={14} /> Add_Manifest_Slot
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <label className="font-mono text-[9px] text-white/40 uppercase tracking-widest block">Size_Distribution</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        {formData.sizes.map((s: any, index: number) => (
                                            <div key={s.label} className="flex items-center gap-3 bg-white/[0.02] border border-white/5 p-3">
                                                <span className="font-mono text-[10px] text-brand-volt w-6">{s.label}</span>
                                                <input 
                                                    type="number"
                                                    min="0"
                                                    value={s.stock}
                                                    onChange={(e) => {
                                                        const newSizes = [...formData.sizes];
                                                        newSizes[index] = {
                                                            ...newSizes[index],
                                                            stock: e.target.value === '' ? '' : Math.max(0, Number(e.target.value)),
                                                        };
                                                        setFormData({
                                                            ...formData,
                                                            sizes: newSizes,
                                                            stock: newSizes.reduce((total: number, size: any) => total + (Number(size.stock) || 0), 0),
                                                        });
                                                    }}
                                                    className="flex-1 bg-transparent font-mono text-[10px] outline-none text-right"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <label className="font-mono text-[9px] text-white/40 uppercase tracking-widest">Color_Palette</label>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({
                                                ...formData,
                                                colors: [...formData.colors, { name: '', hex: '#000000', img: '' }],
                                            })}
                                            className="text-[9px] font-mono uppercase tracking-widest text-brand-volt hover:text-white transition-colors"
                                        >
                                            + Add Color
                                        </button>
                                    </div>
                                    <div className="space-y-3">
                                        {formData.colors.map((color: any, index: number) => (
                                            <div key={index} className="grid grid-cols-[44px_1fr_auto] gap-3 items-center bg-white/[0.02] border border-white/5 p-3">
                                                <input
                                                    type="color"
                                                    value={color.hex || '#000000'}
                                                    onChange={(e) => {
                                                        const colors = [...formData.colors];
                                                        colors[index] = { ...colors[index], hex: e.target.value };
                                                        setFormData({ ...formData, colors });
                                                    }}
                                                    className="w-11 h-10 bg-transparent border-0 cursor-pointer"
                                                    aria-label={`Color value ${index + 1}`}
                                                />
                                                <input
                                                    type="text"
                                                    required
                                                    value={color.name}
                                                    onChange={(e) => {
                                                        const colors = [...formData.colors];
                                                        colors[index] = { ...colors[index], name: e.target.value };
                                                        setFormData({ ...formData, colors });
                                                    }}
                                                    placeholder="COLOR NAME"
                                                    className="bg-transparent font-mono text-[10px] uppercase outline-none"
                                                />
                                                <button
                                                    type="button"
                                                    disabled={formData.colors.length === 1}
                                                    onClick={() => setFormData({
                                                        ...formData,
                                                        colors: formData.colors.filter((_: any, colorIndex: number) => colorIndex !== index),
                                                    })}
                                                    className="p-2 text-white/20 hover:text-red-500 transition-colors disabled:opacity-10"
                                                    aria-label={`Remove ${color.name || 'color'}`}
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Deployment Protocols Section */}
                        <div className="space-y-6 pt-6 border-t border-white/5">
                            <div className="flex items-center gap-3 text-brand-volt">
                                <Plus size={18} />
                                <h3 className="font-black uppercase tracking-widest text-sm">Deployment_Protocols</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 tactical-glass p-8 border border-white/5">
                                 <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="font-bold text-xs uppercase tracking-wider text-white/80">New Drop Status</p>
                                        <p className="font-mono text-[9px] text-white/30 uppercase tracking-widest">Flag asset for discovery</p>
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={() => setFormData({...formData, isNewDrop: !formData.isNewDrop})}
                                        className={`w-12 h-6 rounded-full p-1 transition-all ${formData.isNewDrop ? 'bg-brand-volt' : 'bg-white/10'}`}
                                    >
                                        <div className={`w-4 h-4 rounded-full bg-black transition-all ${formData.isNewDrop ? 'translate-x-6' : 'translate-x-0'}`} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>

                    {/* Footer */}
                    <div className="p-8 border-t border-white/5 bg-white/[0.02] flex justify-between items-center">
                        <div className="flex items-center gap-3 text-white/20">
                            <AlertCircle size={16} />
                            <p className="font-mono text-[9px] uppercase tracking-widest">Verification required before deployment</p>
                        </div>
                        <div className="flex gap-4">
                            <button 
                                type="button" 
                                onClick={onClose}
                                className="px-8 py-4 border border-white/10 font-black uppercase text-[11px] tracking-widest hover:bg-white hover:text-black transition-all"
                            >
                                Abort
                            </button>
                            <button 
                                type="submit"
                                form="product-form"
                                disabled={isSubmitting || isUploading}
                                className="px-10 py-4 bg-brand-volt text-black font-black uppercase text-[11px] tracking-widest hover:brightness-110 transition-all flex items-center gap-3 disabled:opacity-50"
                            >
                                <Save size={16} />
                                {isUploading ? 'UPLOADING...' : isSubmitting ? 'SYNCING...' : 'Authorize_Deployment'}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
