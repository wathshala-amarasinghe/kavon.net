"use client";

import React, { useState, useEffect } from 'react';
import { getAllProducts, deleteProduct, createProduct, updateProduct } from '@/lib/api';
import { Plus, Search, Filter, MoreVertical, Trash2, Edit3, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';
import ProductForm from '@/components/inventory/ProductForm';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { PRODUCT_CATEGORIES } from '@/lib/catalog';

export default function InventoryPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<string | null>(null);

    const fetch = async () => {
        setIsLoading(true);
        try {
            const data = await getAllProducts();
            setProducts(data.products);
        } catch (error: unknown) {
            toast.error(error instanceof Error ? error.message : "CATALOG_SYNC_FAILURE");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetch();
    }, []);

    const handleSubmit = async (formData: any) => {
        const token = localStorage.getItem('kavon-admin-token') || "";
        try {
            if (editingProduct) {
                await updateProduct(editingProduct._id, formData, token);
                toast.success("ASSET_MODIFIED: DATA_SYNC_COMPLETE");
            } else {
                await createProduct(formData, token);
                toast.success("ASSET_REGISTERED: DEPLOYMENT_AUTHORIZED");
            }
            fetch(); // Refresh table
        } catch (error: any) {
            toast.error(error.message || "OPERATION_FAILURE");
            throw error;
        }
    };

    const handleDeleteClick = (id: string) => {
        setProductToDelete(id);
        setIsConfirmOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!productToDelete) return;
        
        try {
            const token = localStorage.getItem('kavon-admin-token') || "";
            await deleteProduct(productToDelete, token);
            setProducts(products.filter(p => p._id !== productToDelete));
            toast.success("ASSET_TERMINATED");
        } catch (error: unknown) {
            toast.error(error instanceof Error ? error.message : "TERMINATION_FAILED");
        } finally {
            setProductToDelete(null);
        }
    };

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (!categoryFilter || product.category === categoryFilter)
    );

    return (
        <div className="space-y-10">
            <header className="flex justify-between items-end">
                <div className="space-y-2">
                    <span className="font-mono text-[13px] text-white/40 uppercase tracking-[0.4em]">Node_Status / Inventory</span>
                    <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">Asset<span className="text-brand-volt">_Management</span></h1>
                </div>
                <button 
                    onClick={() => { setEditingProduct(null); setIsFormOpen(true); }}
                    className="bg-brand-volt text-black px-8 py-4 font-black uppercase text-[13px] tracking-[0.2em] flex items-center gap-3 hover:brightness-110 transition-all"
                >
                    Register_New_Asset <Plus size={16} />
                </button>
            </header>

            {/* Filter Bar */}
            <div className="flex gap-4 p-4 tactical-glass">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                    <input 
                        type="text" 
                        placeholder="SEARCH_CATALOG..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-black/40 border border-white/5 p-4 pl-12 font-mono text-xs uppercase focus:border-brand-volt outline-none transition-all"
                    />
                </div>
                <label className="px-4 border border-white/5 flex items-center gap-2 font-mono text-[12px] text-white/40 uppercase focus-within:text-white focus-within:border-brand-volt transition-all">
                    <Filter size={16} />
                    <select
                        aria-label="Filter products by category"
                        value={categoryFilter}
                        onChange={(event) => setCategoryFilter(event.target.value)}
                        className="bg-black py-4 outline-none uppercase"
                    >
                        <option value="">All categories</option>
                        {PRODUCT_CATEGORIES.map((category) => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                </label>
            </div>

            {/* Product Table */}
            <div className="tactical-glass overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-white/5 border-b border-white/5 font-mono text-[12px] uppercase tracking-widest text-white/40">
                        <tr>
                            <th className="p-6">Asset_Intel</th>
                            <th className="p-6">Category</th>
                            <th className="p-6">Inventory_Status</th>
                            <th className="p-6">Valuation</th>
                            <th className="p-6 text-right">Operations</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td colSpan={5} className="p-8 h-20 bg-white/[0.01]" />
                                </tr>
                            ))
                        ) : filteredProducts.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-20 text-center text-white/20 font-mono text-xs uppercase tracking-[0.5em]">
                                    NO_ASSETS_MATCHING_CRITERIA
                                </td>
                            </tr>
                        ) : filteredProducts.map((product) => (
                            <tr key={product._id} className="hover:bg-white/[0.02] transition-colors group">
                                <td className="p-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-16 bg-white/5 border border-white/10 shrink-0">
                                            <img src={product.images?.[0] || product.image} className="w-full h-full object-cover" alt="" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="font-bold text-xs uppercase tracking-wider">{product.name}</p>
                                            <p className="font-mono text-[11px] text-white/40 uppercase">ID: {product._id.slice(-8)}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-6">
                                    <span className="px-3 py-1 bg-white/5 border border-white/10 font-mono text-[11px] uppercase text-white/60">
                                        {product.category}
                                    </span>
                                </td>
                                <td className="p-6">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-1.5 h-1.5 rounded-full ${product.stock > 10 ? 'bg-brand-volt' : 'bg-red-500'} animate-pulse`} />
                                        <span className="font-mono text-[13px] uppercase tracking-widest">
                                            {product.stock} UNITS
                                        </span>
                                    </div>
                                </td>
                                <td className="p-6">
                                    <span className="font-mono text-xs font-bold text-brand-volt">
                                        LKR {product.price.toLocaleString()}
                                    </span>
                                </td>
                                <td className="p-6 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={() => { setEditingProduct(product); setIsFormOpen(true); }}
                                            className="p-2 hover:bg-white/10 transition-all text-white/60 hover:text-white" 
                                            title="EDIT_ASSET"
                                        >
                                            <Edit3 size={16} />
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteClick(product._id)}
                                            className="p-2 hover:bg-red-500/10 transition-all text-white/20 hover:text-red-500" 
                                            title="TERMINATE_ASSET"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <ProductForm 
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleSubmit}
                initialData={editingProduct}
                title={editingProduct ? 'Modify_Asset' : 'Register_New_Asset'}
            />

            <ConfirmModal 
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleDeleteConfirm}
                title="Confirm Termination"
                message="Are you sure you want to remove this asset from the database? This action is irreversible."
                confirmText="Terminate Asset"
                type="danger"
            />
        </div>
    );
}
