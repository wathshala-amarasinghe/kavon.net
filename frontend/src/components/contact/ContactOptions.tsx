"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Mail, MapPin, Clock } from 'lucide-react';

const OPTIONS = [
    {
        icon: MessageSquare,
        title: 'WhatsApp',
        detail: 'Instant Chat Support',
        action: 'Open WhatsApp',
        href: 'https://wa.me/94112345678'
    },
    {
        icon: Mail,
        title: 'Email',
        detail: 'support@kavon.com',
        action: 'Send Message',
        href: 'mailto:support@kavon.com'
    },
    {
        icon: MapPin,
        title: 'Location',
        detail: 'No. 45, KAVON Tower, Colombo 07',
        action: 'Open Google Maps',
        href: 'https://maps.app.goo.gl/bwyx8KdSKH5uycap6'
    },
    {
        icon: Clock,
        title: 'Operation',
        detail: 'Mon–Sat | 9AM–8PM',
        action: 'Current Status',
        href: '#status'
    }
];

export function ContactOptions() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const checkStatus = () => {
            const now = new Date();
            const day = now.getDay();
            const hour = now.getHours();

            const isWeekday = day >= 1 && day <= 6;
            const isWorkingHour = hour >= 9 && hour < 20;

            setIsOpen(isWeekday && isWorkingHour);
        };

        checkStatus();
        const interval = setInterval(checkStatus, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {OPTIONS.map((opt, i) => (
                <motion.a
                    key={i}
                    href={opt.href}
                    target={opt.href.startsWith('http') ? "_blank" : "_self"}
                    rel={opt.href.startsWith('http') ? "noopener noreferrer" : ""}
                    whileHover={{ y: -5 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-brand-surface border border-white/5 p-8 group hover:border-brand-volt transition-colors relative overflow-hidden"
                >
                    <opt.icon size={24} className="text-brand-volt mb-6" />

                    <h3 className="text-sm font-black uppercase tracking-widest mb-2 flex items-center gap-3">
                        {opt.title}
                        {opt.title === 'Operation' && (
                            <span className="flex h-2 w-2 relative">
                                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isOpen ? 'bg-brand-volt' : 'bg-red-500'}`}></span>
                                <span className={`relative inline-flex rounded-full h-2 w-2 ${isOpen ? 'bg-brand-volt' : 'bg-red-500'}`}></span>
                            </span>
                        )}
                    </h3>

                    <p className="text-[10px] text-white/40 uppercase mb-6 leading-relaxed">
                        {opt.detail}
                        {opt.title === 'Operation' && (
                            <span className={`block mt-1 font-mono ${isOpen ? 'text-brand-volt' : 'text-red-500/60'}`}>
                                {isOpen ? '// SYSTEM_ONLINE' : '// SYSTEM_OFFLINE'}
                            </span>
                        )}
                    </p>

                    <span className="text-[9px] font-mono text-brand-volt border-b border-brand-volt/20 pb-1 group-hover:border-brand-volt transition-colors uppercase tracking-widest">
                        {opt.action}
                    </span>
                </motion.a>
            ))}
        </div>
    );
}