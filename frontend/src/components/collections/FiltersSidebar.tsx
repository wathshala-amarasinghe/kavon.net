"use client";

import React from 'react';
import { useCurrency } from '@/context/CurrencyContext';
import { PRODUCT_CATEGORIES } from '@/lib/catalog';

interface FiltersSidebarProps {
    activeCategory: string;
    setActiveCategory: (cat: string) => void;
    activeGender: string;
    setActiveGender: (gen: string) => void;
    activeSizes: string[];
    toggleSize: (size: string) => void;
    activeColors: string[];
    toggleColor: (color: string) => void;
    priceMax: number;
    setPriceMax: (val: number) => void;
    priceFilterActive?: boolean;
    inStockOnly: boolean;
    setInStockOnly: (val: boolean) => void;
    clearAll: () => void;
    hasActiveFilters: boolean;
}

export const FiltersSidebar = ({
    activeCategory, setActiveCategory,
    activeGender, setActiveGender,
    activeSizes, toggleSize,
    activeColors, toggleColor,
    priceMax, setPriceMax, priceFilterActive = true,
    inStockOnly, setInStockOnly,
    clearAll, hasActiveFilters
}: FiltersSidebarProps) => {
    const categories = ["All", ...PRODUCT_CATEGORIES];
    const sizes = ["S", "M", "L", "XL", "XXL"];
    const colors = [
        { name: "Phantom Black", hex: "#000000" },
        { name: "Volt Green", hex: "#df0715" },
        { name: "Slate Grey", hex: "#4a4a4a" },
        { name: "Crimson Red", hex: "#8b0000" }
    ];

    const { formatPrice } = useCurrency();

    return (
        <div className="sticky top-32 space-y-12">
            <div>
                <h3 className="text-[11px] font-mono tracking-[0.4em] text-white/60 mb-6 uppercase">SELECT SECTOR</h3>
                <div className="space-y-4">
                    {categories.map((cat) => (
                        <button key={cat} onClick={() => setActiveCategory(cat)} className={`block uppercase tracking-[0.2em] text-[11px] font-bold transition-all ${activeCategory === cat ? "text-brand-volt translate-x-2" : "text-white/40 hover:text-white"}`}>{cat}</button>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="text-[11px] font-mono tracking-[0.4em] text-white/60 mb-6 uppercase">TARGET DIVISION</h3>
                <div className="space-y-4">
                    {["All", "Men", "Women", "Child", "Unisex"].map((gen) => (
                        <button key={gen} onClick={() => setActiveGender(gen)} className={`block uppercase tracking-[0.2em] text-[11px] font-bold transition-all ${activeGender === gen ? "text-brand-volt translate-x-2" : "text-white/40 hover:text-white"}`}>{gen}</button>
                    ))}
                </div>
            </div>

            {/* Colors */}
            <div>
                <h3 className="text-[11px] font-mono tracking-[0.4em] text-white/60 mb-6 uppercase">COLOR PALETTE</h3>
                <div className="flex flex-wrap gap-3">
                    {colors.map((color) => (
                        <button
                            key={color.name}
                            onClick={() => toggleColor(color.name)}
                            title={color.name}
                            className={`w-7 h-7 rounded-full border transition-all ${activeColors.includes(color.name) ? 'border-brand-volt scale-125' : 'border-white/10'}`}
                            style={{ backgroundColor: color.hex }}
                        />
                    ))}
                </div>
            </div>

            <div>
                <h3 className="text-[11px] font-mono tracking-[0.4em] text-white/60 mb-6 uppercase">DIMENSION GRID</h3>
                <div className="grid grid-cols-3 gap-2">
                    {sizes.map((size) => (
                        <button key={size} onClick={() => toggleSize(size)} className={`border py-3 text-[11px] font-mono transition-all ${activeSizes.includes(size) ? "bg-brand-volt border-brand-volt text-black font-black" : "border-white/10 text-white/40 hover:border-white/30"}`}>{size}</button>
                    ))}
                </div>
            </div>

            <div>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-[11px] font-mono tracking-[0.4em] text-white/60 uppercase">PRICE LIMIT</h3>
                    <span className="text-brand-volt font-mono text-[12px] font-bold">
                        {priceFilterActive ? formatPrice(priceMax) : 'ANY'}
                    </span>
                </div>
                <input
                    type="range"
                    min="3000"
                    max="100000"
                    step="1000"
                    value={priceFilterActive ? priceMax : 100000}
                    onChange={(e) => setPriceMax(parseInt(e.target.value))}
                    className="w-full h-1 bg-white/10 appearance-none cursor-pointer accent-brand-volt"
                />
            </div>

            <div className="pt-6 border-t border-white/5">
                <label className="flex items-center justify-between cursor-pointer group">
                    <span className={`text-[11px] font-mono tracking-[0.2em] transition-colors uppercase ${inStockOnly ? 'text-brand-volt' : 'text-white/60 group-hover:text-white'}`}>
                        IN STOCK ONLY
                    </span>
                    <input
                        type="checkbox"
                        className="hidden peer"
                        checked={inStockOnly}
                        onChange={(e) => setInStockOnly(e.target.checked)}
                    />
                    <div className="w-10 h-5 bg-white/5 border border-white/10 peer-checked:bg-brand-volt transition-all relative">
                        <div className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 transition-all ${inStockOnly ? 'bg-black translate-x-[1.2rem]' : 'bg-white/20'}`} />
                    </div>
                </label>
            </div>

            {hasActiveFilters && (
                <button
                    onClick={clearAll}
                    className="w-full py-4 border border-brand-volt/30 text-brand-volt font-mono text-[10px] uppercase tracking-[0.3em] hover:bg-brand-volt hover:text-black transition-all"
                >
                    CLEAR_ALL_FILTERS
                </button>
            )}
        </div>
    );
};
