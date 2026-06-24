"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
    Instagram,
    Twitter,
    Facebook,
    Mail,
    ChevronRight
} from 'lucide-react';

const PinterestIcon = ({ size = 18 }: { size?: number }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <line x1="8" y1="22" x2="14" y2="3" />
        <path d="M9 14.9c-2.8-1.5-4-5.2-2.7-8.3C7.6 3.5 11 2 14.1 2.9c3.1.9 4.6 4.3 3.6 7.4-.9 2.5-3.3 4-5.7 4" />
        <path d="M12 11c1.5 1.5 3 2.5 3 4.5 0 2-1.5 3.5-3 3.5s-3-1.5-3-3.5" />
    </svg>
);

const TikTokIcon = ({ size = 18 }: { size?: number }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
);

export function Footer() {
    const socialLinks = [
        { icon: Instagram, href: '#' },
        { icon: Facebook, href: '#' },
        { icon: Twitter, href: '#' },
        { icon: TikTokIcon, href: '#' },
        { icon: PinterestIcon, href: '#' }
    ];

    // Archive Protocol Links
    const archiveLinks = [
        { name: 'Shop All', href: '/shop' },
        { name: 'New Drops', href: '/shop?isNewDrop=true' },
        { name: 'Oversized', href: '/shop?category=Oversized' },
        { name: 'Essentials', href: '/shop?category=Essentials' },
        { name: 'Limited Edition', href: '/shop?category=Limited Edition' },
        { name: 'Best Sellers', href: '/shop?isBestSeller=true' },
    ];

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
                            High-performance streetwear engineered for the modern nomad. Designed in Sri Lanka, deployed globally.
                        </p>
                        <div className="flex gap-3">
                            {socialLinks.map((social, i) => (
                                <motion.a
                                    key={i}
                                    href={social.href}
                                    whileHover={{ scale: 1.1, color: '#df0715ff', borderColor: '#df0715ff' }}
                                    className="w-10 h-10 border border-white/10 flex items-center justify-center text-white transition-all duration-300"
                                >
                                    <social.icon size={16} />
                                </motion.a>
                            ))}
                        </div>
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
                        <div className="relative group">
                            <input
                                type="email"
                                placeholder="ENTER YOUR EMAIL"
                                className="w-full bg-brand-surface border border-white/10 px-4 py-4 text-[12px] font-mono text-white outline-none focus:border-brand-volt transition-colors placeholder:text-white/20 tracking-wide"
                            />
                            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-volt hover:text-white transition-colors">
                                <Mail size={16} />
                            </button>
                        </div>
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
                    <div className="flex items-center gap-2">
                        <span className="text-[#df0715ff] animate-pulse text-[12px]">●</span>
                        <span className="text-white/70 text-[12px] font-black uppercase tracking-widest">Active Status</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}