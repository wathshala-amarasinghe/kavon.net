"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, Radio, Shield } from 'lucide-react';

const UGC_ASSETS = [
    { id: 'OP_82', img: '/images/products/product_1.jpeg', tag: '#KAVONDivision' },
    { id: 'UNIT_04', img: '/images/products/product_2.jpeg', tag: '#TacticalGear' },
    { id: 'VOID_9', img: '/images/products/product_3.jpeg', tag: '#UrbanDivision' },
    { id: 'STRIKE_2', img: '/images/products/product_4.jpeg', tag: '#CyberStreet' },
    { id: 'ALPHA_X', img: '/images/products/product_5.jpeg', tag: '#Techwear' },
    { id: 'OPER_12', img: '/images/products/product_6.jpeg', tag: '#KAVONCore' },
];

export function CommunityUGC() {
    return (
        <section className="py-32 bg-black border-t border-white/5 relative overflow-hidden">
            {/* Background Branding */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/[0.02] font-black text-[20vw] italic pointer-events-none select-none uppercase whitespace-nowrap tracking-[0.1em]">
                COMMUNITY_ASSETS
            </div>

            <div className="max-w-[1400px] mx-auto px-6 relative z-10">
                <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-brand-volt">
                            <Radio size={16} className="animate-pulse" />
                            {/* Increased tracking for the feed label */}
                            <span className="font-mono text-[12px] uppercase tracking-[0.4em]">Community Feed</span>
                        </div>
                        {/* Increased tracking for the main heading */}
                        <h2 className="text-5xl md:text-7xl font-black uppercase italic leading-none tracking-[0.05em]">
                            Community<span className="text-brand-volt">_Spotlight</span>
                        </h2>
                    </div>

                    <a
                        href="https://instagram.com"
                        target="_blank"
                        className="flex items-center gap-4 bg-white/5 border border-white/10 px-8 py-5 hover:bg-brand-volt hover:text-black transition-all group"
                    >
                        <Instagram size={20} />
                        {/* Increased tracking for the button text */}
                        <span className="font-black uppercase text-[12px] tracking-[0.3em]">Follow on Instagram</span>
                    </a>
                </header>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {UGC_ASSETS.map((asset, i) => (
                        <motion.div
                            key={asset.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className="group relative aspect-[3/4] bg-brand-surface border border-white/10 overflow-hidden"
                        >
                            { }
<img
                                src={asset.img}
                                alt={asset.id}
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
                            />

                            {/* Overlay Info */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 p-6 flex flex-col justify-end">
                                <div className="flex items-center gap-2 text-brand-volt mb-1">
                                    <Shield size={10} />
                                    {/* Increased tracking for the asset ID */}
                                    <span className="text-[11px] font-mono uppercase tracking-[0.3em]">{asset.id}</span>
                                </div>
                                {/* Increased tracking for the hashtag */}
                                <span className="text-[11px] font-mono text-white/60 uppercase tracking-[0.2em]">
                                    {asset.tag}
                                </span >
                            </div>

                            {/* Corner Badge */}
                            <div className="absolute top-2 right-2 w-6 h-6 border border-white/20 flex items-center justify-center bg-black/40 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all">
                                <Instagram size={12} className="text-white" />
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-16 flex justify-center">
                    {/* Increased tracking for the footer status text */}
                    <p className="font-mono text-[11px] text-white/20 uppercase tracking-[0.6em] animate-pulse">
                        @KAVON.Official — Tag us to be featured
                    </p>
                </div>
            </div>
        </section>
    );
}