"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { CartItem } from "@/components/cart/CartItem";
import { OrderSummary } from "@/components/cart/OrderSummary";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
    const { cart, isLoaded } = useCart();

    if (!isLoaded) return <div className="h-screen bg-black" />;

    return (
        <div className="bg-brand-black min-h-screen text-white selection:bg-brand-volt">
            <Navbar />
            <main className="pt-48 pb-20 px-6 max-w-[1400px] mx-auto">
                <header className="mb-12 border-l-2 border-brand-volt pl-8">
                    <span className="font-mono text-[10px] tracking-[0.5em] text-brand-volt uppercase mb-2 block">Archive_Check</span>
                    <h1 className="text-5xl md:text-7xl font-black italic uppercase">Manifest</h1>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start relative">
                    {/* List of Items */}
                    <div className="lg:col-span-8 space-y-4">
                        <AnimatePresence mode="popLayout">
                            {cart.map((item) => (
                                <CartItem key={`${item.id}-${item.size}`} item={item} />
                            ))}
                        </AnimatePresence>
                        {cart.length === 0 && (
                            <div className="py-20 border border-dashed border-white/10 text-center uppercase font-mono text-white/20">
                                Manifest_Empty // No_Assets_Acquired
                            </div>
                        )}
                    </div>

                    {/* STICKY SIDEBAR */}
                    <aside className="lg:col-span-4 sticky top-32">
                        <OrderSummary />
                    </aside>
                </div>
            </main>

        </div>
    );
}