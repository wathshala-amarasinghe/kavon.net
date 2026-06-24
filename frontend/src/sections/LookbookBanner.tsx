"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function LookbookBanner() {
    const router = useRouter();
    const ref = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

    const handleNavigation = () => {
        router.push('/shop');
    };

    return (
        <motion.section ref={ref} className="relative h-[80vh] min-h-[600px] w-full overflow-hidden flex items-center justify-center bg-brand-black">
            <motion.div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-50"
                style={{
                    backgroundImage: 'url("/images/lookbook/banner-bg.jpeg")',
                    y
                }}
            />

            <div className="absolute inset-0 bg-gradient-to-b from-brand-black via-transparent to-brand-black z-10" />

            <div className="absolute inset-0 opacity-[0.03] z-10 pointer-events-none"
                style={{ backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, #fff 3px)` }}
            />

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-20 text-center px-6 max-w-5xl mx-auto flex flex-col items-center"
            >
                <motion.span
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 0.5 }}
                    className="font-mono text-[11px] tracking-[0.8em] uppercase mb-8 text-white"
                >
                    Visual_Archive_001
                </motion.span>

                <h2 className="text-white text-[12vw] md:text-[8vw] font-black leading-[0.8] tracking-[0.05em] uppercase italic mb-12">
                    STREET <br />
                    <span className="text-outline tracking-[0.1em]">ADAPTATION</span>
                </h2>

                <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleNavigation}
                    className="group relative overflow-hidden px-14 py-6 bg-white transition-all duration-500"
                >
                    <div className="absolute inset-0 bg-brand-volt translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.9,0,0.1,1] z-0" />

                    <div className="relative z-10 flex items-center justify-center gap-4 text-black">
                        <span className="font-black text-[11px] tracking-[0.5em] uppercase leading-none">
                            View_Lookbook
                        </span>
                        <motion.div
                            initial={{ x: 0 }}
                            whileHover={{ x: 5 }}
                            transition={{ duration: 0.3 }}
                        >
                            <ArrowRight size={16} strokeWidth={3} />
                        </motion.div>
                    </div>

                    <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-black opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>
            </motion.div>

            <div className="absolute bottom-10 left-10 hidden md:block">
                <span className="font-mono text-[9px] text-white/20 uppercase tracking-[0.8em] [writing-mode:vertical-rl]">
                    KAVON_SYSTEMS_2026
                </span>
            </div>
        </motion.section>
    );
}