"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Globe, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { CountdownTimer } from '@/components/home/CountdownTimer';
import { useSystemSettings } from '@/context/SystemSettingsContext';

const MainButton = ({ label, onClick }: { label: string; onClick: () => void }) => (
    <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className="group relative overflow-hidden px-12 py-5 bg-white transition-all duration-500 w-full md:w-auto"
    >
        <div className="absolute inset-0 bg-brand-volt translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.9,0,0.1,1] z-0" />
        <div className="relative z-10 flex items-center justify-center gap-4 text-black">
            <span className="font-black text-[13px] tracking-[0.4em] uppercase leading-none font-body">{label}</span>
            <motion.div initial={{ x: 0 }} whileHover={{ x: 5 }} transition={{ duration: 0.3 }}>
                <ArrowRight size={16} strokeWidth={3} />
            </motion.div>
        </div>
        <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-black opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.button>
);

export default function HeroSection() {
    const router = useRouter();
    const { settings } = useSystemSettings();
    const [index, setIndex] = useState(0);
    const [isMounted, setIsMounted] = useState(false);
    const [containerElement, setContainerElement] = useState<HTMLElement | null>(null);

    const { scrollYProgress } = useScroll({
        target: containerElement ? { current: containerElement } as React.RefObject<Record<string, unknown>> : undefined,
        offset: ["start start", "end start"]
    });

    const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const textY = useTransform(scrollYProgress, [0, 1], ["0%", "150%"]);
    const foregroundY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    // Default slides — always show at least these 3
    const defaultSlides = [
        {
            id: "01",
            video: "/videos/hero-1.mp4",
            title: "KAVON",
            tagline: "WEAR POWER. WEAR KAVON.",
            tag: "NEW COLLECTION",
            desc: "HIGH-PERFORMANCE STREETWEAR ENGINEERED FOR THE MODERN NOMAD. LIMITED EDITION RELEASE."
        },
        {
            id: "02",
            video: "/videos/hero-2.mp4",
            title: "TACTICAL",
            tagline: "URBAN SURVIVAL GEAR.",
            tag: "LIMITED DROP",
            desc: "MILITARY-INSPIRED UTILITY MEETS PREMIUM JAPANESE STREETWEAR."
        },
        {
            id: "03",
            video: "/videos/hero-3.mp4",
            title: "CYBER",
            tagline: "FUTURE READY.",
            tag: "ESSENTIALS",
            desc: "MINIMALIST DESIGN, MAXIMUM IMPACT. THE FUTURE OF STREET CULTURE."
        }
    ];

    // If admin has configured 3+ slides use those, otherwise use the 3 local defaults
    const activeSlides = (settings?.heroSlides?.length >= 3) ? settings.heroSlides : defaultSlides;

    useEffect(() => {
        setTimeout(() => setIsMounted(true), 0);
    }, []);

    const nextSlide = useCallback(() => {
        setIndex((prev: number) => (prev + 1) % activeSlides.length);
    }, [activeSlides.length]);

    useEffect(() => {
        const timer = setInterval(nextSlide, 8000);
        return () => clearInterval(timer);
    }, [nextSlide]);

    const handleShopNavigation = () => {
        router.push('/shop');
    };

    const currentSlide = activeSlides[index] || activeSlides[0];

    if (!isMounted || !currentSlide) return <div className="h-screen bg-brand-black" />;

    return (
        <motion.section
            ref={setContainerElement}
            className="relative h-screen w-full bg-brand-black overflow-hidden flex flex-col justify-between p-6 md:p-10 pt-40 md:pt-48"
        >
            <motion.div style={{ y: backgroundY }} className="absolute inset-0 z-0">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide.id}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 0.5, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
                        className="h-full w-full"
                    >
                        {currentSlide.video && (
                            <video
                                autoPlay
                                muted
                                loop
                                playsInline
                                key={currentSlide.video}
                                className="h-full w-full object-cover grayscale opacity-60"
                                src={currentSlide.video}
                            />
                        )}
                    </motion.div>
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-b from-brand-black via-transparent to-brand-black z-10" />
                <div
                    className="absolute inset-0 opacity-[0.03] z-10 pointer-events-none animate-scanline"
                    style={{ backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, #fff 3px)` }}
                />
            </motion.div>

            {/* SECONDARY PARALLAX LAYER (Foreground Depth) */}
            <motion.div
                style={{ y: foregroundY }}
                className="absolute inset-0 z-[15] pointer-events-none overflow-hidden"
            >
                <div className="absolute top-1/4 -left-20 w-96 h-96 bg-brand-volt/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-white/5 blur-[150px] rounded-full" />
            </motion.div>

            {/* HEADER STATUS LAYER */}
            <div className="relative z-20 flex justify-between items-start">
                {/* Left Status */}
                <div className="flex items-center gap-4">
                    <Zap size={14} className="text-brand-volt animate-pulse" />
                    <div className="flex flex-col">
                        <span className="text-white text-[13px] font-black tracking-[0.2em] uppercase leading-none font-body">KAVON COLLECTION</span>
                        <span className="text-white/50 font-mono text-[12px] uppercase mt-1.5">New Season // {currentSlide.id}</span>
                    </div>
                </div>

                {/* Right Status + Relocated Timer */}
                <div className="flex flex-col items-end">
                    <div className="flex items-center gap-2 mb-1.5">
                        <Globe size={12} className="text-white/60" />
                        <span className="text-white/60 font-mono text-[12px] uppercase tracking-widest">Worldwide Shipping</span>
                    </div>
                    <span className="text-brand-volt font-mono text-[13px] font-bold uppercase mb-4">Shop Now</span>
                    <div className="hidden md:block border-t border-white/10 pt-4">
                        <CountdownTimer targetDate={settings?.heroCountdown || "2026-06-01T00:00:00"} />
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT LAYER */}
            <motion.div style={{ y: textY, opacity }} className="relative z-20 w-full grid grid-cols-1 md:grid-cols-12 gap-10 items-end mb-12">
                <div className="md:col-span-9">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentSlide.id}
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 50, opacity: 0 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <span className="text-brand-volt font-mono text-[12px] md:text-[14px] tracking-[0.4em] uppercase block mb-4 ml-2">
                                {currentSlide.tagline}
                            </span>
                            <h1 className="text-white text-[18vw] md:text-[14vw] font-black leading-[0.75] tracking-[0.05em] uppercase italic font-heading">
                                {currentSlide.title}
                            </h1>
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="md:col-span-3 flex flex-col gap-8 md:items-end">
                    <motion.p
                        key={currentSlide.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-white/80 text-[13px] md:text-right font-mono tracking-wide uppercase leading-relaxed max-w-[280px]"
                    >
                        {currentSlide.desc}
                    </motion.p>
                    <MainButton label="Shop Now" onClick={handleShopNavigation} />
                </div>
            </motion.div>

            {/* FOOTER NAV LAYER */}
            <div className="relative z-20 flex flex-col md:flex-row justify-between items-end gap-6 border-t border-white/10 pt-8 pb-4">
                <div className="flex gap-4">
                    {activeSlides.map((_: Record<string, unknown>, i: number) => (
                        <button key={i} onClick={() => setIndex(i)} className="group flex flex-col gap-2">
                            <span className={`font-mono text-[12px] transition-colors ${i === index ? 'text-white' : 'text-white/20'}`}>
                                0{i + 1}
                            </span>
                            <div className={`h-[2px] transition-all duration-700 ${i === index ? 'w-20 bg-brand-volt' : 'w-4 bg-white/10 group-hover:bg-white/30'}`} />
                        </button>
                    ))}
                </div>

                <div className="flex gap-12 font-mono text-[12px] text-white/20 uppercase tracking-[0.3em]">
                    <div className="flex flex-col gap-1">
                        <span>Lat: 35.6762 N</span>
                        <span>Lon: 139.6503 E</span>
                    </div>
                    <div className="hidden sm:block text-right">
                        <span>All Rights Reserved</span>
                        <br />
                        <span>KAVON ©2026</span>
                    </div>
                </div>
            </div>
        </motion.section>
    );
}