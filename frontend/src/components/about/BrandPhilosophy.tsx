"use client";
import { motion } from 'framer-motion';

export function BrandPhilosophy() {
    return (
        <section className="py-40 px-6 max-w-4xl mx-auto text-center">
            <motion.div
                whileInView={{ opacity: 1, scale: 1 }}
                initial={{ opacity: 0, scale: 0.95 }}
                className="space-y-12"
            >
                <h2 className="text-white/20 font-mono text-[10px] tracking-[0.8em] uppercase">Protocol_Philosophy</h2>
                <p className="text-3xl md:text-5xl font-heading italic uppercase leading-tight tracking-tight">
                    We don’t follow <span className="text-white/40 text-outline">trends.</span> <br />
                    We build <span className="text-brand-volt">statements.</span>
                </p>
                <p className="text-white/40 font-body text-sm leading-loose tracking-[0.1em] uppercase">
                    KAVON is the intersection of urban survival and luxury craftsmanship. Our garments are engineered to provide presence in a world that encourages blending in. Every stitch is a refusal to be ordinary.
                </p>
            </motion.div>
        </section>
    );
}