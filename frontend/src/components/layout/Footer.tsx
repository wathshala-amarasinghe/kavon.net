"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { COLLECTION_NAV_LINKS } from '@/lib/catalog';
import { ChevronRight } from 'lucide-react';

export function Footer() {
    // Archive Protocol Links
    const archiveLinks = COLLECTION_NAV_LINKS;

    // Support Protocol Links
    const supportLinks = [
        { name: 'FAQ', href: '/faq' },
        { name: 'Shipping & Returns', href: '/returns' },
        { name: 'Size Guide', href: '/size-guide' },
        { name: 'Track Order', href: '/order-track' },
        { name: 'Contact Us', href: '/contact' }
    ];

    return (
        <footer className="bg-brand-black border-t border-white/5 pt-24 pb-12 px-6 overflow-hidden">
            <div className="max-w-[1400px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="relative w-64 h-20 mb-8 md:w-72 md:h-24">
                            <Image
                                src="/logo/logo.png"
                                alt="KAVON Logo"
                                fill
                                sizes="(max-width: 768px) 256px, 288px"
                                className="object-contain object-left"
                                priority
                            />
                        </div>

                        <p className="text-white/60 text-[12px] font-mono leading-relaxed mb-8 max-w-xs uppercase tracking-wide">
                            High-performance streetwear engineered for the modern nomad. Designed in Sri Lanka with island-wide online delivery.
                        </p>
                    </motion.div>

                    {/* Archive Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        <h4 className="text-[14px] font-black text-white mb-8 tracking-widest uppercase font-heading italic">Shop</h4>
                        <ul className="space-y-4">
                            {archiveLinks.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="group flex items-center text-white/70 hover:text-brand-volt transition-colors text-[12px] font-bold uppercase tracking-wide">
                                        <ChevronRight size={12} className="mr-2 opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Support Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <h4 className="text-[14px] font-black text-white mb-8 tracking-widest uppercase">Support</h4>
                        <ul className="space-y-4">
                            {supportLinks.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="group flex items-center text-white/70 hover:text-brand-volt transition-colors text-[12px] font-bold uppercase tracking-wide">
                                        <ChevronRight size={12} className="mr-2 opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                    >
                        <h4 className="text-[14px] font-black text-white mb-8 tracking-widest uppercase">Newsletter</h4>
                        <p className="text-white/60 text-[12px] font-mono mb-6 uppercase tracking-wide leading-relaxed">
                            Join our community for early access to new collections.
                        </p>
                        <Link href="/#newsletter" className="inline-flex border border-brand-volt px-6 py-4 font-mono text-[11px] uppercase tracking-widest text-brand-volt hover:bg-brand-volt hover:text-black transition-colors">
                            Open newsletter signup
                        </Link>
                    </motion.div>
                </div>

                <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-12">
                        <p className="text-white/60 text-[12px] font-mono tracking-widest uppercase">
                            © 2026 KAVON. ALL RIGHTS RESERVED.
                        </p>
                        <div className="flex items-center gap-6">
                            <Link href="/privacy" className="text-white/60 hover:text-white text-[12px] font-mono transition-colors tracking-wide uppercase">Privacy Policy</Link>
                            <Link href="/tos" className="text-white/60 hover:text-white text-[12px] font-mono transition-colors tracking-wide uppercase">Terms Of Service</Link>
                        </div>
                    </div>
                    <span className="text-white/50 text-[12px] font-black uppercase tracking-widest">Designed in Sri Lanka</span>
                </div>
            </div>
        </footer>
    );
}
