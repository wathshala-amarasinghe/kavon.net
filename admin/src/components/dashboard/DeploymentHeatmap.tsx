"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface DeploymentHeatmapProps {
  data?: number[][]; // 7 days x 24 hours
}

export default function DeploymentHeatmap({ data }: DeploymentHeatmapProps) {
  // If no data, generate some realistic mock data
  const heatmapData = data || Array.from({ length: 7 }, () => 
    Array.from({ length: 24 }, () => Math.floor(Math.random() * 10))
  );

  const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  
  return (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-[40px_1fr] gap-4">
        {/* Y-axis (Days) */}
        <div className="flex flex-col justify-between py-1 h-48">
          {days.map(day => (
            <span key={day} className="font-mono text-[11px] text-white/20 uppercase leading-none">{day}</span>
          ))}
        </div>

        {/* Heatmap Grid */}
        <div className="grid grid-rows-7 gap-1 h-48">
          {heatmapData.map((dayData, dayIdx) => (
            <div key={dayIdx} className="grid grid-cols-[repeat(24,1fr)] gap-1">
              {dayData.map((val, hourIdx) => (
                <motion.div
                  key={`${dayIdx}-${hourIdx}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: (dayIdx * 24 + hourIdx) * 0.001 }}
                  className="aspect-square rounded-[1px] relative group"
                  style={{ 
                    backgroundColor: val === 0 ? 'rgba(255, 255, 255, 0.02)' : `rgba(223, 7, 21, ${0.1 + Math.min(val / 10, 0.9)})`,
                  }}
                >
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-brand-surface border border-white/10 rounded text-[10px] font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-xl">
                    {days[dayIdx]} {hourIdx}:00 - {val} ORDERS
                  </div>
                </motion.div>
              ))}
            </div>
          ))}
        </div>
      </div>
      
      {/* X-axis (Hours) */}
      <div className="grid grid-cols-[40px_1fr] gap-4">
        <div /> {/* Spacer for alignment */}
        <div className="grid grid-cols-[repeat(24,1fr)] gap-1">
          {[0, 6, 12, 18, 23].map(hour => (
            <span 
              key={hour} 
              className="font-mono text-[11px] text-white/20 uppercase text-center"
              style={{ gridColumnStart: hour + 1 }}
            >
              {hour}h
            </span>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 pt-4 border-t border-white/5">
        <span className="font-mono text-[10px] text-white/20 uppercase">Intensity_Scale:</span>
        <div className="flex gap-1">
          {[0, 0.2, 0.4, 0.6, 0.8, 1].map((lvl) => (
            <div 
              key={lvl} 
              className="w-3 h-3 rounded-[1px]" 
              style={{ backgroundColor: lvl === 0 ? 'rgba(255, 255, 255, 0.02)' : `rgba(223, 7, 21, ${0.1 + lvl * 0.9})` }}
            />
          ))}
        </div>
        <span className="font-mono text-[10px] text-white/20 uppercase ml-auto">Local_System_Time</span>
      </div>
    </div>
  );
}
