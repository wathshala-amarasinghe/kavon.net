"use client";

import React, { useState, useEffect } from 'react';

const TimeUnit = ({ value, label }: { value: number, label: string }) => (
    <div className="flex flex-col items-center min-w-[32px]">
        <span className="text-2xl md:text-3xl font-black text-white italic leading-none tabular-nums">
            {value.toString().padStart(2, '0')}
        </span>
        <span className="text-[8px] font-mono text-brand-volt uppercase tracking-[0.2em] mt-1">
            {label}
        </span>
    </div>
);

export function CountdownTimer({ targetDate }: { targetDate: string }) {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = +new Date(targetDate) - +new Date();
            let timeLeftVal = {
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0
            };

            if (difference > 0) {
                timeLeftVal = {
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                };
            }

            return timeLeftVal;
        };

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    return (
        <div className="flex items-center gap-6 px-6 py-2 border-x border-white/10">
            <div className="flex flex-col shrink-0">
                <span className="text-[14px] font-mono text-white uppercase tracking-[0.3em]">Drop_Timer</span>
                <span className="text-[9px] font-black text-brand-volt uppercase tracking-widest">Active</span>
            </div>

            <div className="flex gap-6">
                <TimeUnit value={timeLeft.days} label="D" />
                <TimeUnit value={timeLeft.hours} label="H" />
                <TimeUnit value={timeLeft.minutes} label="M" />
                <TimeUnit value={timeLeft.seconds} label="S" />
            </div>
        </div>
    );
}