"use client";

import React, { useState, useEffect } from 'react';
import { Star, Camera, X, Plus, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import { getProductReviews, createReview } from '@/lib/api';
import toast from 'react-hot-toast';

export function ReviewSection({ productId }: { productId: string }) {
    const [reviews, setReviews] = useState<Record<string, unknown>[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newReview, setNewReview] = useState({ rating: 5, comment: "", image: null as string | null });

    useEffect(() => {
        const fetchReviews = async () => {
            setIsLoading(true);
            try {
                const data = await getProductReviews(productId);
                setReviews(data);
            } catch (error) {
                console.error("Failed to fetch reviews.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchReviews();
    }, [productId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('kavon-token-v1');
        if (!token) {
            toast.error("Please log in to submit a review.");
            return;
        }

        setIsSubmitting(true);
        try {
            const reviewData = {
                productId,
                rating: newReview.rating,
                comment: newReview.comment,
                image: newReview.image
            };
            
            const createdReview = await createReview(reviewData, token);
            setReviews(prev => [createdReview, ...prev]);
            setIsModalOpen(false);
            setNewReview({ rating: 5, comment: "", image: null });
            toast.success("Review submitted! Thank you.");
        } catch (error: unknown) {
            toast.error(error instanceof Error ? error.message : "Error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="border-t border-white/5 pt-20">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                <div className="space-y-4">
                    <div className="flex items-center gap-3 text-brand-volt">
                        <ShieldCheck size={16} />
                        <span className="font-mono text-[12px] uppercase tracking-[0.4em]">Customer Reviews</span>
                    </div>
                    <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white">
                        Customer<span className="text-brand-volt">_Reviews</span>
                    </h2>
                </div>

                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-3 bg-white text-black px-8 py-4 font-black uppercase text-[12px] tracking-[0.2em] hover:bg-brand-volt transition-all"
                >
                    Write a Review <Plus size={16} />
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-64 bg-white/[0.02] border border-white/5 animate-pulse" />
                    ))
                ) : reviews.length === 0 ? (
                    <div className="lg:col-span-3 py-20 text-center border border-dashed border-white/10">
                        <span className="font-mono text-[12px] text-white/20 uppercase tracking-[0.4em]">No reviews yet. Be the first!</span>
                    </div>
                ) : reviews.map((rev) => (
                    <div key={rev._id} className="group p-8 bg-white/[0.02] border border-white/5 space-y-6 hover:border-white/20 transition-all">
                        <div className="flex justify-between items-center">
                            <span className="font-mono text-[11px] text-brand-volt uppercase tracking-widest">{rev.userName}</span>
                            <div className="flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={10} fill={i < rev.rating ? "#df0715" : "none"} className={i < rev.rating ? "text-brand-volt" : "text-white/10"} />
                                ))}
                            </div>
                        </div>
                        
                        {rev.image && (
                            <div className="aspect-square bg-black border border-white/10 overflow-hidden">
                                <img src={rev.image} alt="User media" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-500" />
                            </div>
                        )}

                        <p className="text-[13px] text-white/70 leading-relaxed italic uppercase font-mono tracking-tight">&quot;{rev.comment}&quot;</p>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                            <span className="text-[11px] font-mono text-white/20 uppercase tracking-widest">
                                {new Date(rev.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                            </span>
                            <span className="text-[11px] font-mono text-brand-volt/40 uppercase">Verified Purchase</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* SUBMISSION_MODAL */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/90 backdrop-blur-sm" 
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-lg bg-brand-surface border border-white/10 p-10 space-y-8"
                        >
                            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-white/40 hover:text-white">
                                <X size={24} />
                            </button>

                            <div className="space-y-2">
                                <span className="text-brand-volt font-mono text-[12px] tracking-[0.4em] uppercase">Leave a Review</span>
                                <h3 className="text-3xl font-black uppercase italic text-white">Write a Review</h3>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-3">
                                    <label className="text-[12px] font-mono text-white/40 uppercase tracking-widest">Your Rating</label>
                                    <div className="flex gap-2">
                                        {[1,2,3,4,5].map((star) => (
                                            <button 
                                                key={star} 
                                                type="button"
                                                onClick={() => setNewReview({...newReview, rating: star})}
                                                className={`p-2 border transition-all ${newReview.rating >= star ? 'border-brand-volt text-brand-volt bg-brand-volt/5' : 'border-white/10 text-white/20'}`}
                                            >
                                                <Star size={20} fill={newReview.rating >= star ? "currentColor" : "none"} />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[12px] font-mono text-white/40 uppercase tracking-widest">Your Review</label>
                                    <textarea 
                                        required
                                        value={newReview.comment}
                                        onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                                        className="w-full bg-white/5 border border-white/10 p-5 font-mono text-sm focus:border-brand-volt outline-none text-white min-h-[120px] placeholder:text-white/10 uppercase"
                                        placeholder="SHARE YOUR THOUGHTS..."
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[12px] font-mono text-white/40 uppercase tracking-widest">Photo (Optional)</label>
                                    <div className="flex gap-4">
                                        <div className="w-24 h-24 border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-2 text-white/20 hover:border-brand-volt hover:text-brand-volt cursor-pointer transition-all relative">
                                            <input 
                                                type="file" 
                                                className="absolute inset-0 opacity-0 cursor-pointer" 
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        const url = URL.createObjectURL(file);
                                                        setNewReview({...newReview, image: url});
                                                    }
                                                }}
                                            />
                                            <Camera size={24} />
                                            <span className="text-[11px] font-mono uppercase tracking-tighter">Attach</span>
                                        </div>
                                        {newReview.image && (
                                            <div className="w-24 h-24 border border-brand-volt relative group">
                                                <img src={newReview.image} className="w-full h-full object-cover" alt="" />
                                                <button 
                                                    type="button"
                                                    onClick={() => setNewReview({...newReview, image: null})}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X size={10} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <button 
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-brand-volt text-black py-5 font-black uppercase text-[12px] tracking-[0.3em] hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50"
                                >
                                    {isSubmitting ? "Submitting..." : "Submit Review"}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}