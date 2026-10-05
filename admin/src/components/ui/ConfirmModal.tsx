"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
}

export function ConfirmModal({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title, 
    message, 
    confirmText = "Authorize", 
    cancelText = "Abort",
    type = 'danger'
}: ConfirmModalProps) {
    if (!isOpen) return null;

    const accentColor = type === 'danger' ? 'text-red-500' : type === 'warning' ? 'text-yellow-500' : 'text-brand-volt';
    const borderColor = type === 'danger' ? 'border-red-500/20' : type === 'warning' ? 'border-yellow-500/20' : 'border-brand-volt/20';
    const buttonBg = type === 'danger' ? 'bg-red-500 hover:bg-red-600' : type === 'warning' ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-brand-volt hover:brightness-110';

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/90 backdrop-blur-md" 
                />
                
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className={`w-full max-w-md bg-brand-black border ${borderColor} relative z-10 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]`}
                >
                    {/* Status Line */}
                    <div className={`h-1 w-full ${type === 'danger' ? 'bg-red-500' : type === 'warning' ? 'bg-yellow-500' : 'bg-brand-volt'}`} />
                    
                    <div className="p-8 space-y-6">
                        <div className="flex items-start gap-5">
                            <div className={`p-3 bg-white/5 border ${borderColor} ${accentColor} shrink-0`}>
                                <AlertTriangle size={24} />
                            </div>
                            <div className="space-y-2">
                                <span className="font-mono text-[10px] text-white/40 uppercase tracking-[0.4em]">Protocol / Confirmation_Required</span>
                                <h3 className="text-xl font-black italic uppercase tracking-wider text-white">{title}</h3>
                                <p className="text-white/60 text-sm font-mono leading-relaxed uppercase tracking-tight">
                                    {message}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button 
                                onClick={onClose}
                                className="flex-1 px-6 py-4 border border-white/10 font-black uppercase text-[12px] tracking-widest hover:bg-white hover:text-black transition-all text-white/60"
                            >
                                {cancelText}
                            </button>
                            <button 
                                onClick={() => { onConfirm(); onClose(); }}
                                className={`flex-1 px-6 py-4 ${buttonBg} text-black font-black uppercase text-[12px] tracking-widest transition-all shadow-[0_0_20px_rgba(0,0,0,0.2)]`}
                            >
                                {confirmText}
                            </button>
                        </div>
                    </div>

                    {/* Scanline Effect */}
                    <div className={`absolute top-0 left-0 w-full h-[1px] ${type === 'danger' ? 'bg-red-500/30' : 'bg-brand-volt/30'} animate-scan pointer-events-none`} />
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
