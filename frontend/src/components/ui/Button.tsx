"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface ButtonProps {
    label: string;
    onClick?: () => void;
    icon?: LucideIcon;
    variant?: 'primary' | 'secondary' | 'outline';
    className?: string;
    type?: "button" | "submit" | "reset";
}

export function Button({
    label,
    onClick,
    icon: Icon,
    variant = 'primary',
    className = "",
    type = "button"
}: ButtonProps) {

    const variants = {
        primary: "bg-white text-black",
        secondary: "bg-brand-volt text-black",
        outline: "bg-transparent text-white border border-white/20 hover:border-white"
    };

    const shutterColors = {
        primary: "bg-brand-volt",
        secondary: "bg-white",
        outline: "bg-white"
    };

    return (
        <motion.button
            type={type}
            onClick={onClick}
            whileTap={{ scale: 0.98 }}
            className={`
                group relative overflow-hidden px-8 py-4 
                transition-all duration-500 
                ${variants[variant]} 
                ${className}
            `}
        >
            <div className={`
                absolute inset-0 translate-y-full group-hover:translate-y-0 
                transition-transform duration-500 ease-[0.9,0,0.1,1] z-0
                ${shutterColors[variant]}
            `} />

            <div className="relative z-10 flex items-center justify-center gap-3">
                <span className="font-black text-[11px] tracking-[0.3em] uppercase leading-none font-body">
                    {label}
                </span>

                {Icon && (
                    <motion.div
                        initial={{ x: 0 }}
                        whileHover={{ x: 3 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Icon size={14} strokeWidth={3} />
                    </motion.div>
                )}
            </div>

            <div className="absolute top-0 right-0 w-1 h-1 border-t border-r border-black opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-0 left-0 w-1 h-1 border-b border-l border-black opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.button>
    );
}