"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ruler, X, ChevronRight, ChevronLeft, Check, Target } from 'lucide-react';

interface FitFinderProps {
    isOpen: boolean;
    onClose: () => void;
    onResult: (size: string) => void;
}

export function FitFinder({ isOpen, onClose, onResult }: FitFinderProps) {
    const [step, setStep] = useState(1);
    const [data, setData] = useState({
        height: 175,
        weight: 75,
        preference: 'Standard' as 'Slim' | 'Standard' | 'Oversized'
    });

    const calculateSize = () => {
        // Simple logic for tactical size recommendation
        const bmi = data.weight / ((data.height / 100) ** 2);
        let baseSize = "M";

        if (data.height > 185 || data.weight > 90) baseSize = "XL";
        else if (data.height > 175 || data.weight > 80) baseSize = "L";
        else if (data.height < 165 || data.weight < 65) baseSize = "S";

        // Adjust based on preference
        const sizes = ["S", "M", "L", "XL"];
        let finalIndex = sizes.indexOf(baseSize);

        if (data.preference === 'Oversized') finalIndex = Math.min(finalIndex + 1, 3);
        if (data.preference === 'Slim') finalIndex = Math.max(finalIndex - 1, 0);

        return sizes[finalIndex];
    };

    const handleFinish = () => {
        const result = calculateSize();
        onResult(result);
        setStep(4);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[400] flex items-center justify-center p-6">
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/95 backdrop-blur-md" 
                    />
                    
                    <motion.div 
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="relative w-full max-w-xl bg-brand-surface border border-white/10 p-12 overflow-hidden"
                    >
                        {/* Decorative Scanner Effect */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-brand-volt/20 animate-[scan_3s_infinite]" />
                        
                        <button onClick={onClose} className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors">
                            <X size={24} />
                        </button>

                        <div className="mb-12">
                            <div className="flex items-center gap-3 text-brand-volt mb-2">
                                <Target size={16} />
                                <span className="font-mono text-[10px] uppercase tracking-[0.4em]">Biometric_Scanner_v2.0</span>
                            </div>
                            <h3 className="text-4xl font-black uppercase italic tracking-tighter text-white">Fit<span className="text-brand-volt">_Finder</span></h3>
                        </div>

                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                                    <div className="space-y-4">
                                        <label className="block text-[11px] font-mono text-white/40 uppercase tracking-widest">Input_Height (CM)</label>
                                        <div className="flex items-center gap-8">
                                            <input 
                                                type="range" min="150" max="210" value={data.height}
                                                onChange={(e) => setData({...data, height: parseInt(e.target.value)})}
                                                className="flex-1 h-1 bg-white/10 appearance-none rounded-full accent-brand-volt"
                                            />
                                            <span className="text-4xl font-black italic text-brand-volt w-24 tabular-nums">{data.height}</span>
                                        </div>
                                    </div>
                                    <button onClick={() => setStep(2)} className="w-full bg-white text-black py-5 font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 group">
                                        Next_Protocol <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                                    <div className="space-y-4">
                                        <label className="block text-[11px] font-mono text-white/40 uppercase tracking-widest">Input_Weight (KG)</label>
                                        <div className="flex items-center gap-8">
                                            <input 
                                                type="range" min="40" max="130" value={data.weight}
                                                onChange={(e) => setData({...data, weight: parseInt(e.target.value)})}
                                                className="flex-1 h-1 bg-white/10 appearance-none rounded-full accent-brand-volt"
                                            />
                                            <span className="text-4xl font-black italic text-brand-volt w-24 tabular-nums">{data.weight}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <button onClick={() => setStep(1)} className="flex-1 border border-white/10 text-white/40 py-5 font-mono text-[10px] uppercase tracking-widest hover:border-white/30">Back</button>
                                        <button onClick={() => setStep(3)} className="flex-[2] bg-white text-black py-5 font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 group">
                                            Final_Analyze <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                                    <div className="space-y-4">
                                        <label className="block text-[11px] font-mono text-white/40 uppercase tracking-widest">Fit_Preference</label>
                                        <div className="grid grid-cols-3 gap-4">
                                            {['Slim', 'Standard', 'Oversized'].map((pref) => (
                                                <button
                                                    key={pref}
                                                    onClick={() => setData({...data, preference: pref as 'Slim' | 'Standard' | 'Oversized'})}
                                                    className={`p-6 border transition-all text-center ${data.preference === pref ? 'border-brand-volt bg-brand-volt/5 text-brand-volt' : 'border-white/10 text-white/30 hover:border-white/30'}`}
                                                >
                                                    <span className="text-[10px] font-mono uppercase tracking-widest">{pref}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <button onClick={handleFinish} className="w-full bg-brand-volt text-black py-6 font-black uppercase text-sm tracking-[0.3em] shadow-[0_0_30px_rgba(223, 7, 21,0.2)]">
                                        Execute_Final_Analysis
                                    </button>
                                </motion.div>
                            )}

                            {step === 4 && (
                                <motion.div key="step4" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center space-y-8">
                                    <div className="w-24 h-24 rounded-full border-2 border-brand-volt flex items-center justify-center mx-auto text-brand-volt animate-[pulse_2s_infinite]">
                                        <Check size={48} />
                                    </div>
                                    <div className="space-y-2">
                                        <span className="text-[10px] font-mono text-white/30 uppercase tracking-[0.4em]">Recommended_Deployment_Size</span>
                                        <div className="text-8xl font-black italic text-white tracking-tighter">{calculateSize()}</div>
                                    </div>
                                    <button onClick={onClose} className="w-full bg-white text-black py-5 font-black uppercase text-xs tracking-widest">
                                        Confirm_Selection_&_Close
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
