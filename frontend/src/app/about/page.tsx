"use client";

import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { AboutHero } from '@/components/about/AboutHero';
import { BrandPhilosophy } from '@/components/about/BrandPhilosophy';
import { FounderSection } from '@/components/about/FounderSection';
import { MissionVision } from '@/components/about/MissionVision';
import { WhyKavon } from '@/components/about/WhyKavon';
import { Timeline } from '@/components/about/Timeline';
import { CTASection } from '@/components/about/CTASection';

export default function AboutPage() {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <div className="bg-brand-black min-h-screen text-white selection:bg-brand-volt selection:text-black overflow-x-hidden">
            <Navbar />

            {/* 💡 2026 Feature: Scroll Progress Indicator */}
            <motion.div className="fixed top-0 left-0 right-0 h-1 bg-brand-volt z-[110] origin-left" style={{ scaleX }} />

            <main>
                <AboutHero />
                <BrandPhilosophy />
                <FounderSection />

                {/* Visual Break Component */}
                <section className="h-[70vh] relative overflow-hidden group">
                    { }
<img
                        src="/images/lifestyle/about_cinematic.jpeg"
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100"
                        alt="KAVON Division"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <h2 className="text-8xl md:text-[12rem] font-heading italic text-outline opacity-100 uppercase tracking-tighter">THIS IS KAVON.</h2>
                    </div>
                </section>

                <MissionVision />
                <WhyKavon />
                <Timeline />
                <CTASection />
            </main>


        </div>
    );
}