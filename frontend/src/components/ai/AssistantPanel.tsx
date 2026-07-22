"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot } from 'lucide-react';
import { useAIAssistant } from '@/hooks/useAIAssistant';
import { AIAssistantCard } from './AIAssistantCard';
import { ChatBubble } from './ChatBubble';

import { CatalogProduct } from '@/types/product';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    products?: CatalogProduct[];
}

export function AssistantPanel() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: "Hello! I'm your KAVON assistant. How can I help you find something today?" }
    ]);
    const { analyzeAndSearch } = useAIAssistant();
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: Message = { role: 'user', content: input.toUpperCase() };
        setMessages(prev => [...prev, userMsg]);

        // Processing
        try {
            const response = await analyzeAndSearch(input);
            let botMsg: Message;

            if (response.type === 'faq') {
                botMsg = {
                    role: 'assistant',
                    content: response.content || ""
                };
            } else {
                botMsg = {
                    role: 'assistant',
                    content: response.found
                        ? `I found ${response.results?.length} items for you:`
                        : "I couldn't find any items matching your search. Try searching for something like 'Oversized Tee' or 'Black Hoodie'.",
                    products: response.found ? response.results : undefined
                };
            }

            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            console.error('ASSISTANT_SYNC_FAILURE:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "I couldn't reach the live catalog. Please try again shortly.",
            }]);
        }

        setInput("");
    };

    return (
        <div className="fixed bottom-8 right-8 z-[200]">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="absolute bottom-20 right-0 w-[380px] h-[550px] bg-black/95 border border-white/10 backdrop-blur-2xl flex flex-col shadow-2xl"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-brand-volt/5">
                            <div className="flex items-center gap-3">
                                <Bot size={18} className="text-brand-volt" />
                                <span className="font-black italic text-xs tracking-widest uppercase">KAVON_AI v1.0</span>
                            </div>
                            <button onClick={() => setIsOpen(false)}><X size={18} className="text-white/20 hover:text-white" /></button>
                        </div>

                        {/* Messages */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:20px_20px]">
                            {messages.map((m, i) => (
                                <ChatBubble key={i} role={m.role} content={m.content}>
                                    {m.products && m.products.map(p => (
                                        <AIAssistantCard key={p._id || p.id} product={p} closeChat={() => setIsOpen(false)} />
                                    ))}
                                </ChatBubble>
                            ))}
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-white/10 bg-black/50">
                            <div className="flex gap-2 bg-white/5 border border-white/10 p-1">
                                <input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="TYPE_QUERY..."
                                    className="flex-1 bg-transparent p-3 text-[12px] font-mono outline-none text-white uppercase placeholder:text-white/20"
                                />
                                <button
                                    onClick={handleSend}
                                    className="px-4 bg-brand-volt text-black hover:bg-white transition-colors"
                                >
                                    <Send size={14} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 bg-brand-volt text-black flex items-center justify-center shadow-[0_0_20px_rgba(223,7,21,0.4)] hover:scale-110 transition-transform active:scale-95"
            >
                {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
            </button>
        </div>
    );
}
