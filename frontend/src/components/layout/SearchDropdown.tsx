"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getHighlightedParts } from '@/lib/utils';
import { Product } from "@/data/products";

import { FormattedPrice } from '../ui/FormattedPrice';

// Internal Highlight Component
const Highlight = ({ text, query }: { text: string; query: string }) => {
    const parts = getHighlightedParts(text, query);
    return (
        <>
            {parts.map((part, i) => (
                <span
                    key={i}
                    className={part.isMatch ? "text-[#df0715ff] bg-[#df0715ff]/10 font-black" : ""}
                >
                    {part.text}
                </span>
            ))}
        </>
    );
};

export function SearchDropdown({ query, results, close }: { query: string, results: Product[], close: () => void }) {
    if (!query) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full left-0 w-full bg-black/95 border border-white/10 backdrop-blur-2xl max-h-[400px] overflow-y-auto z-[150] shadow-2xl"
        >
            <div className="p-4 border-b border-white/5 bg-white/[0.02]">
                <span className="text-[14px] font-mono text-[#df0715ff] uppercase tracking-[0.1em] font-bold">
                    SEARCH RESULTS // FOUND {results.length} ITEMS
                </span>
            </div>

            {results.length > 0 ? (
                <div className="divide-y divide-white/5">
                    {results.map((product) => (
                        <Link
                            key={product._id || product.id}
                            href={`/products/${product._id || product.id}`}
                            onClick={close}
                            className="flex items-center gap-4 p-4 hover:bg-[#df0715ff]/5 transition-all group border-l-2 border-transparent hover:border-[#df0715ff]"
                        >
                            <div className="w-12 h-16 bg-brand-surface border border-white/10 overflow-hidden shrink-0">
                                { }
<img
                                    src={product.images?.[0] || product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                />
                            </div>

                            <div className="flex-1 min-w-0">
                                <h4 className="text-[15px] font-black uppercase tracking-wide text-white group-hover:text-[#df0715ff] transition-colors truncate">
                                    <Highlight text={product.name} query={query} />
                                </h4>
                                <div className="flex items-center gap-2 mt-1.5">
                                    <span className="text-[12px] font-mono text-white/60 uppercase tracking-widest bg-white/10 px-2 py-0.5 font-bold">
                                        <Highlight text={product.category} query={query} />
                                    </span>
                                    <span className="text-[12px] font-mono text-[#df0715ff]/80 uppercase">
                                        REF: {String(product._id || product.id || "UNKNOWN").slice(-6).toUpperCase()}
                                    </span>
                                </div>
                            </div>

                            <div className="text-right shrink-0">
                                <span className="text-sm font-mono text-[#df0715ff] font-bold">
                                    <FormattedPrice amount={product.price} />
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="p-12 text-center">
                    <p className="text-[14px] font-mono text-white/40 uppercase tracking-[0.2em] font-bold italic animate-pulse">
                        NO ASSETS FOUND IN ARCHIVE
                    </p>
                </div>
            )}
        </motion.div>
    );
}
