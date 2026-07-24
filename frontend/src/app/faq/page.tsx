"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Shield, HelpCircle, Package, CreditCard, RefreshCw, Search, X } from 'lucide-react';
import Link from 'next/link';

const faqData = [
    {
        category: "Shipping & Delivery",
        icon: Package,
        items: [
            {
                q: "What is the standard delivery timeframe?",
                a: "Delivery within Sri Lanka typically takes 2-4 business days after processing."
            },
            {
                q: "Do you ship internationally?",
                a: "Online checkout currently supports delivery within Sri Lanka. Contact support before ordering if you need another destination."
            },
            {
                q: "How can I track my order?",
                a: "Use your order ID and delivery phone number in the Tracking portal, or open the order from your account dashboard."
            }
        ]
    },
    {
        category: "Orders & Payment",
        icon: CreditCard,
        items: [
            {
                q: "Which payment methods are accepted?",
                a: "Cash on Delivery is currently available. Card and digital payment options are not active yet."
            },
            {
                q: "Can I cancel my order?",
                a: "Contact support as soon as possible with your order ID. Cancellation depends on whether fulfillment has already started."
            }
        ]
    },
    {
        category: "Returns & Exchanges",
        icon: RefreshCw,
        items: [
            {
                q: "What is your return policy?",
                a: "You have 7 days from the date of delivery to initiate a return. Items must be in original condition with all tags attached."
            },
            {
                q: "Are limited edition items eligible for return?",
                a: "Exclusive drops and archive items are final sale unless a manufacturing defect is identified."
            }
        ]
    }
];

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredData = useMemo(() => {
        if (!searchQuery.trim()) return faqData;
        
        return faqData.map(cat => ({
            ...cat,
            items: cat.items.filter(item => 
                item.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
                item.a.toLowerCase().includes(searchQuery.toLowerCase())
            )
        })).filter(cat => cat.items.length > 0);
    }, [searchQuery]);

    return (
        <main className="bg-black min-h-screen text-white">
            <div className="pt-44 pb-32 px-6 max-w-4xl mx-auto">
                <header className="mb-20">
                    <div className="flex items-center gap-3 text-brand-volt mb-4">
                        <HelpCircle size={20} />
                        <span className="font-mono text-[12px] uppercase tracking-[0.4em]">Customer Support</span>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-[0.05em] leading-[0.85] mb-8">
                        FREQUENTLY <br /> <span className="text-white/10">ASKED</span> QUESTIONS
                    </h1>
                    
                    {/* Search Bar */}
                    <div className="relative max-w-xl mt-12">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={20} />
                        <input 
                            type="text"
                            placeholder="Search questions..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 py-5 pl-12 pr-12 font-mono text-[13px] uppercase tracking-widest focus:outline-none focus:border-brand-volt transition-all"
                        />
                        {searchQuery && (
                            <button 
                                onClick={() => setSearchQuery("")}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white"
                            >
                                <X size={20} />
                            </button>
                        )}
                    </div>
                </header>

                <div className="space-y-20">
                    {filteredData.length > 0 ? filteredData.map((cat, catIdx) => (
                        <div key={catIdx} className="space-y-8">
                            <div className="flex items-center gap-4 border-b border-white/5 pb-5">
                                <cat.icon size={24} className="text-brand-volt" />
                                <h2 className="font-black italic uppercase tracking-[0.3em] text-xl">{cat.category}</h2>
                            </div>

                            <div className="space-y-4">
                                {cat.items.map((item, itemIdx) => {
                                    const id = `${catIdx}-${itemIdx}`;
                                    const isOpen = openIndex === id;

                                    return (
                                        <div key={itemIdx} className="border border-white/5 bg-white/[0.02] transition-all duration-300">
                                            <button
                                                onClick={() => setOpenIndex(isOpen ? null : id)}
                                                className="w-full flex items-center justify-between p-7 text-left hover:bg-white/[0.04] transition-all"
                                            >
                                                <span className="font-bold text-[13px] md:text-sm uppercase tracking-[0.15em] leading-relaxed">{item.q}</span>
                                                <ChevronDown
                                                    size={20}
                                                    className={`transition-transform duration-500 ${isOpen ? 'rotate-180 text-brand-volt' : 'text-white/20'}`}
                                                />
                                            </button>

                                            <AnimatePresence>
                                                {isOpen && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="px-7 pb-7 text-white/50 font-mono text-[13px] leading-relaxed uppercase tracking-[0.2em] border-t border-white/5 pt-5">
                                                            {item.a}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )) : (
                        <div className="py-20 text-center border border-dashed border-white/10 bg-white/5">
                            <p className="font-mono text-sm text-white/40 uppercase tracking-widest">No results found for &quot;{searchQuery}&quot;</p>
                        </div>
                    )}
                </div>

                {/* CTA SECTION */}
                <div className="mt-32 p-16 bg-white text-black text-center space-y-10">
                    <Shield className="mx-auto" size={44} />
                    <h3 className="text-4xl font-black italic uppercase tracking-[0.2em]">STILL HAVE QUESTIONS?</h3>
                    <p className="font-mono text-[13px] uppercase tracking-[0.2em] leading-loose max-w-md mx-auto opacity-70">
                        If you couldn&apos;t find what you were looking for, please contact our support team directly.
                    </p>
                    <Link href="/contact" className="inline-block px-12 py-5 bg-black text-white font-black uppercase text-[12px] tracking-[0.5em] hover:bg-brand-volt hover:text-black transition-all active:scale-95">
                        Contact Support
                    </Link>
                </div>
            </div>
        </main>
    );
}
