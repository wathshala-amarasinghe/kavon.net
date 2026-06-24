"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
    {
        id: 1,
        name: 'MARCUS T.',
        text: 'The quality is insane. The heavyweight hoodie feels like armor but fits perfectly. Best drop this year.',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    },
    {
        id: 2,
        name: 'SARAH J.',
        text: 'Finally a brand that understands proportions. The oversized fit is actually designed, not just sized up.',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    },
    {
        id: 3,
        name: 'DAVID L.',
        text: 'Customer service was top tier and the packaging felt premium. KAVON is setting a new standard.',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    },
    {
        id: 4,
        name: 'ELENA R.',
        text: "The materials used are next level. I've washed my tees dozens of times and they still hold their shape perfectly.",
        rating: 5,
        image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    },
];

export function Testimonials() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const next = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    const prev = () => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    return (
        <section className="py-24 px-6 max-w-7xl mx-auto overflow-hidden bg-background">
            <div className="flex items-end justify-between mb-12">
                <h2 className="font-heading text-5xl md:text-6xl text-white">
                    WHAT THEY SAY
                </h2>
                <div className="hidden md:flex gap-4">
                    <button
                        onClick={prev}
                        className="p-3 border border-white/20 text-white hover:bg-white hover:text-brand-black transition-colors"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={next}
                        className="p-3 border border-white/20 text-white hover:bg-white hover:text-brand-black transition-colors"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <div className="relative">
                <div className="md:hidden">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-brand-surface p-8 border border-white/5"
                        >
                            <div className="flex gap-1 mb-6">
                                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={16}
                                        className="fill-brand-volt text-brand-volt"
                                    />
                                ))}
                            </div>
                            <p className="text-white/80 text-lg mb-8 min-h-[100px] font-body">
                            &ldquo;{testimonials[currentIndex].text}&rdquo;
                            </p>
                            <div className="flex items-center gap-4">
                                { }
<img
                                    src={testimonials[currentIndex].image}
                                    alt={testimonials[currentIndex].name}
                                    className="w-12 h-12 rounded-full object-cover grayscale"
                                />
                                <span className="font-heading text-xl text-white tracking-wider">
                                    {testimonials[currentIndex].name}
                                </span>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                    <div className="flex justify-center gap-4 mt-8">
                        <button
                            onClick={prev}
                            className="p-3 border border-white/20 text-white hover:bg-white hover:text-brand-black transition-colors"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={next}
                            className="p-3 border border-white/20 text-white hover:bg-white hover:text-brand-black transition-colors"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                <div className="hidden md:grid grid-cols-3 gap-6">
                    {testimonials.slice(0, 3).map((testimonial, index) => (
                        <motion.div
                            key={testimonial.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-brand-surface p-8 border border-white/5 hover:border-brand-volt/50 transition-colors group"
                        >
                            <div className="flex gap-1 mb-6">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={16}
                                        className="fill-brand-volt text-brand-volt"
                                    />
                                ))}
                            </div>
                            <p className="text-white/80 text-lg mb-8 min-h-[120px] font-body">
                            &ldquo;{testimonial.text}&rdquo;
                            </p>
                            <div className="flex items-center gap-4">
                                { }
<img
                                    src={testimonial.image}
                                    alt={testimonial.name}
                                    className="w-12 h-12 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all"
                                />
                                <span className="font-heading text-xl text-white tracking-wider">
                                    {testimonial.name}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}