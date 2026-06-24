"use client";

import React from 'react';
import { Bot, User } from 'lucide-react';

interface ChatBubbleProps {
    role: 'user' | 'assistant';
    content: string;
    children?: React.ReactNode; // This allows AIAssistantCard to be nested inside
}

export function ChatBubble({ role, content, children }: ChatBubbleProps) {
    const isAssistant = role === 'assistant';

    return (
        <div className={`flex w-full mb-6 ${isAssistant ? 'justify-start' : 'justify-end'}`}>
            <div className={`flex gap-3 max-w-[85%] ${isAssistant ? 'flex-row' : 'flex-row-reverse'}`}>

                {/* Avatar Icon */}
                <div className={`w-8 h-8 shrink-0 flex items-center justify-center border ${isAssistant
                        ? 'bg-brand-volt/10 border-brand-volt/30 text-brand-volt'
                        : 'bg-white/10 border-white/20 text-white'
                    }`}>
                    {isAssistant ? <Bot size={16} /> : <User size={16} />}
                </div>

                {/* Message Content */}
                <div className="flex flex-col gap-1">
                    {/* Status Header */}
                    <div className={`flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase opacity-60 ${isAssistant ? 'justify-start' : 'justify-end'
                        }`}>
                        <span>{isAssistant ? 'KAVON Assistant' : 'You'}</span>
                        <div className={`w-1 h-1 rounded-full ${isAssistant ? 'bg-brand-volt animate-pulse' : 'bg-white'}`} />
                    </div>

                    {/* Bubble Layout */}
                    <div className={`relative p-4 text-[14px] font-sans leading-normal border transition-all duration-300 ${isAssistant
                            ? 'bg-white/[0.03] border-white/10 text-white/90 rounded-tr-xl rounded-br-xl rounded-bl-xl'
                            : 'bg-brand-volt border-brand-volt text-black font-bold rounded-tl-xl rounded-bl-xl rounded-br-xl'
                        }`}>
                        {/* The Text Content */}
                        <p className="whitespace-pre-wrap">{content}</p>

                        {/* Special UI: Corner Accents for Assistant */}
                        {isAssistant && (
                            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-brand-volt/40" />
                        )}

                        {/* Nested Product Cards */}
                        {children && (
                            <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
                                {children}
                            </div>
                        )}
                    </div>

                    {/* Timestamp Placeholder */}
                    <span className={`text-[9px] font-mono opacity-30 uppercase tracking-tighter ${isAssistant ? 'text-left' : 'text-right'
                        }`}>
                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                </div>
            </div>
        </div>
    );
}