"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

const collections = [
    {
        title: 'Oversized Collection',
        image: '/images/collections/collection_1.jpeg',
        href: '/shop?category=Oversized'
    },
    {
        title: 'Limited Edition',
        image: '/images/collections/collection_2.jpeg',
        href: '/shop?category=Limited Edition'
    },
    {
        title: 'Essentials Drop',
        image: '/images/collections/collection_3.jpeg',
        href: '/shop?category=Essentials'
    },
];

export function FeaturedCollections() {
    return (
        <section className="py-24 px-6 max-w-[1400px] mx-auto bg-brand-black">
            <div className="mb-12 flex items-end justify-between border-b border-white/10 pb-8">
                <h2 className="text-5xl md:text-7xl font-heading text-white italic tracking-[0.02em]">
                    FEATURED <span className="text-white/20 tracking-[0.05em]">COLLECTIONS</span>
                </h2>
                <Link
                    href="/shop"
                    className="hidden md:flex items-center gap-2 text-white/60 hover:text-brand-volt transition-colors uppercase font-mono text-[12px] tracking-[0.2em] font-bold"
                >
                    VIEW ALL <ArrowUpRight size={16} />
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {collections.map((collection, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-100px' }}
                        transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                        className="group relative h-[500px] md:h-[650px] w-full overflow-hidden bg-brand-surface border border-white/5 cursor-pointer"
                    >
                        <Link href={collection.href} className="absolute inset-0 z-30" />

                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500 z-10" />
                        { }
<img
                            src={collection.image}
                            alt={collection.title}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        />

                        <div className="absolute inset-0 p-10 flex flex-col justify-end z-20">
                            <h3 className="font-heading text-4xl md:text-5xl text-white mb-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 italic tracking-[0.02em]">
                                {collection.title}
                            </h3>
                            <div className="self-start px-8 py-4 bg-white text-black font-black uppercase text-[12px] tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 group-hover:bg-brand-volt">
                                EXPLORE NOW
                            </div>
                        </div>

                        <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none overflow-hidden opacity-10">
                            <span className="absolute top-[-10px] right-[-5px] text-white text-6xl font-black italic">K</span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}