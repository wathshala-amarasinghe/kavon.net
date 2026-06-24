"use client";

import React from 'react';

export function BrandMarquee() {
    const phrases = [
        'LIMITED DROPS',
        'PREMIUM STREETWEAR',
        'wear power wear kavon',
        'KAVON ORIGINAL',
        'DESIGNED IN SRI LANKA',
    ];

    const items = [...phrases, ...phrases, ...phrases];

    return (
        <div className="w-full overflow-hidden bg-brand-surface py-10 border-y border-white/5 relative flex items-center">
            <div className="flex whitespace-nowrap animate-marquee w-max">
                {items.map((phrase, index) => (
                    <div key={index} className="flex items-center mx-8 md:mx-12">
                        <span className="font-heading text-5xl md:text-8xl text-white/10 uppercase tracking-[0.05em] italic hover:text-brand-volt transition-colors duration-700 cursor-default select-none">
                            {phrase}
                        </span>

                        <div className="mx-16 flex items-center justify-center">
                            <div
                                className="w-[2px] h-12 rotate-[20deg] opacity-40 shadow-[0_0_15px_rgba(223, 7, 21,0.3)]"
                                style={{ backgroundColor: '#df0715ff' }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}