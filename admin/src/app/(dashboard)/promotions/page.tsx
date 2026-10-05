"use client";

import React, { useState, useEffect } from 'react';
import { Tag, Plus, Percent, Gift, Edit2, Trash2, ShieldCheck, ShieldAlert, BarChart3 } from 'lucide-react';
import toast from 'react-hot-toast';
import { getCoupons, createCoupon, updateCoupon, deleteCoupon } from '@/lib/api';
import CouponForm from '@/components/promotions/CouponForm';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

export default function PromotionsPage() {
    const [coupons, setCoupons] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState<any>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [couponToDelete, setCouponToDelete] = useState<string | null>(null);

    const fetchCoupons = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('kavon-admin-token') || "";
            const data = await getCoupons(token);
            setCoupons(data);
        } catch (error) {
            toast.error("DATABASE_SYNC_FAILURE");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    const handleSubmit = async (formData: any) => {
        const token = localStorage.getItem('kavon-admin-token') || "";
        try {
            if (editingCoupon) {
                await updateCoupon(editingCoupon._id, formData, token);
                toast.success("INCENTIVE_MODIFIED");
            } else {
                await createCoupon(formData, token);
                toast.success("INCENTIVE_GENERATED");
            }
            fetchCoupons();
        } catch (error) {
            toast.error("SYNCHRONIZATION_ERROR");
        }
    };

    const handleDeleteClick = (id: string) => {
        setCouponToDelete(id);
        setIsConfirmOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!couponToDelete) return;
        const token = localStorage.getItem('kavon-admin-token') || "";
        try {
            await deleteCoupon(couponToDelete, token);
            toast.success("INCENTIVE_TERMINATED");
            fetchCoupons();
        } catch (error) {
            toast.error("TERMINATION_FAILURE");
        } finally {
            setCouponToDelete(null);
        }
    };

    return (
        <div className="space-y-10">
            <header className="flex justify-between items-end">
                <div className="space-y-2">
                    <span className="font-mono text-[13px] text-white/40 uppercase tracking-[0.4em]">Node_Status / Incentives</span>
                    <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">Promo<span className="text-brand-volt">_Incentives</span></h1>
                </div>
                <button 
                    onClick={() => {
                        setEditingCoupon(null);
                        setIsFormOpen(true);
                    }}
                    className="bg-brand-volt text-black px-8 py-4 font-black uppercase text-[13px] tracking-[0.2em] flex items-center gap-3 hover:brightness-110 transition-all active:scale-95"
                >
                    Generate_Promo_Code <Plus size={16} />
                </button>
            </header>

            {isLoading ? (
                <div className="p-40 flex flex-col items-center justify-center gap-6">
                    <div className="w-16 h-16 border-2 border-brand-volt border-t-transparent rounded-full animate-spin" />
                    <span className="font-mono text-brand-volt text-[10px] tracking-[0.5em] uppercase animate-pulse">Retriving_Active_Coupons...</span>
                </div>
            ) : (
                <div className="w-full overflow-hidden border border-white/5 bg-white/[0.01]">
                    <div className="grid grid-cols-6 bg-white/5 p-6 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 border-b border-white/5">
                        <div className="col-span-2">Code_Identifier</div>
                        <div>Valuation</div>
                        <div>Timeline_Status</div>
                        <div>Usage_Metrics</div>
                        <div className="text-right">Actions</div>
                    </div>
                    
                    {coupons.length === 0 ? (
                        <div className="p-20 text-center text-white/10 font-mono text-xs uppercase tracking-[0.5em]">
                            ZERO_ACTIVE_INCENTIVES_FOUND
                        </div>
                    ) : (
                        <div className="divide-y divide-white/5">
                            {coupons.map((coupon) => (
                                <div key={coupon._id} className="grid grid-cols-6 p-6 items-center hover:bg-white/[0.02] transition-all">
                                    <div className="col-span-2 flex items-center gap-4">
                                        <div className={`p-2 rounded-sm ${coupon.isActive ? 'bg-brand-volt/10 text-brand-volt' : 'bg-red-500/10 text-red-500'}`}>
                                            <Tag size={16} />
                                        </div>
                                        <div className="space-y-1">
                                            <span className="font-black uppercase tracking-wider text-sm">{coupon.code}</span>
                                            {coupon.minOrderAmount > 0 && (
                                                <p className="font-mono text-[9px] text-white/30 tracking-widest">MIN_ORDER: LKR {coupon.minOrderAmount}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="font-mono text-sm font-bold text-white">
                                        {coupon.discountType === 'Percentage' ? `${coupon.discountValue}%` : `LKR ${coupon.discountValue}`}
                                    </div>
                                    <div>
                                        <div className={`inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-widest ${new Date(coupon.expiryDate) > new Date() ? 'text-blue-400' : 'text-red-500'}`}>
                                            {new Date(coupon.expiryDate) > new Date() ? <ShieldCheck size={12} /> : <ShieldAlert size={12} />}
                                            {new Date(coupon.expiryDate).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden max-w-[100px]">
                                            <div 
                                                className="h-full bg-brand-volt" 
                                                style={{ width: coupon.usageLimit > 0 ? `${(coupon.usageCount / coupon.usageLimit) * 100}%` : '0%' }}
                                            />
                                        </div>
                                        <span className="font-mono text-[10px] text-white/40">{coupon.usageCount}{coupon.usageLimit > 0 ? `/${coupon.usageLimit}` : ''}</span>
                                    </div>
                                    <div className="flex justify-end gap-3">
                                        <button 
                                            onClick={() => {
                                                setEditingCoupon(coupon);
                                                setIsFormOpen(true);
                                            }}
                                            className="p-2 text-white/40 hover:text-brand-volt transition-colors"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteClick(coupon._id)}
                                            className="p-2 text-white/40 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <CouponForm 
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleSubmit}
                initialData={editingCoupon}
                title={editingCoupon ? 'Modify_Incentive_Protocol' : 'Generate_New_Incentive'}
            />

            <ConfirmModal 
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleDeleteConfirm}
                title="Terminate Incentive"
                message="This promotion code will be voided immediately. This action cannot be reversed."
                confirmText="Terminate"
                type="danger"
            />
        </div>
    );
}
