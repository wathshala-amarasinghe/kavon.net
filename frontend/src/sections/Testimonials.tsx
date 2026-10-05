"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { getFeaturedReviews } from '@/lib/api';
import { getImageUrl } from '@/lib/utils';

interface FeaturedReview {
    _id: string;
    userName: string;
    text?: string;
    comment: string;
    rating: number;
    image?: string;
    product?: {
        name?: string;
        images?: string[];
    };
}

const displayName = (name: string) => {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length < 2) return parts[0] || 'Customer';
    return `${parts[0]} ${parts.at(-1)?.charAt(0) || ''}.`;
};

export function Testimonials() {
    const [reviews, setReviews] = useState<FeaturedReview[]>([]);

    useEffect(() => {
        let active = true;
        getFeaturedReviews()
            .then((data) => {
                if (active) setReviews(data);
            })
            .catch((error) => {
                console.error('FEATURED_REVIEW_SYNC_FAILURE:', error);
                if (active) setReviews([]);
            });
        return () => {
            active = false;
        };
    }, []);

    if (reviews.length === 0) return null;

    return (
        <section className="mx-auto max-w-7xl overflow-hidden bg-background px-6 py-24">
            <div className="mb-12 flex items-end justify-between">
                <div>
                    <p className="mb-3 font-mono text-xs uppercase tracking-[0.4em] text-brand-volt">Verified purchases</p>
                    <h2 className="font-heading text-5xl text-white md:text-6xl">CUSTOMER REVIEWS</h2>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {reviews.slice(0, 3).map((review, index) => {
                    const image = review.image || review.product?.images?.[0];
                    return (
                        <motion.article
                            key={review._id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group border border-white/5 bg-brand-surface p-8 transition-colors hover:border-brand-volt/50"
                        >
                            <div className="mb-6 flex gap-1" aria-label={`${review.rating} out of 5 stars`}>
                                {Array.from({ length: 5 }, (_, star) => (
                                    <Star
                                        key={star}
                                        size={16}
                                        aria-hidden="true"
                                        className={star < review.rating ? 'fill-brand-volt text-brand-volt' : 'text-white/15'}
                                    />
                                ))}
                            </div>
                            <p className="mb-8 min-h-[120px] text-lg text-white/80">&ldquo;{review.comment || review.text}&rdquo;</p>
                            <div className="flex items-center gap-4">
                                {image && (
                                    <img
                                        src={getImageUrl(image)}
                                        alt=""
                                        className="h-12 w-12 rounded-full object-cover grayscale"
                                    />
                                )}
                                <div>
                                    <span className="block font-heading text-xl tracking-wider text-white">
                                        {displayName(review.userName)}
                                    </span>
                                    {review.product?.name && (
                                        <span className="font-mono text-[10px] uppercase tracking-widest text-white/35">
                                            {review.product.name}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </motion.article>
                    );
                })}
            </div>
        </section>
    );
}
