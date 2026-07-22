"use client";

import React from "react";
import { SlidersHorizontal, ChevronDown, X } from "lucide-react";

interface FilterBarProps {
    onOpenFilters: () => void;
    activeCategory: string;
    activeSizes: string[];
    onResetCategory: () => void;
    onRemoveSize: (size: string) => void;
    sortOption: string;
    setSortOption: (option: string) => void;
    resultCount: number;
}

export function FilterBar({
    onOpenFilters,
    activeCategory,
    activeSizes,
    onResetCategory,
    onRemoveSize,
    sortOption,
    setSortOption,
    resultCount,
}: FilterBarProps) {
    const safeResultCount = Number.isFinite(resultCount) ? resultCount : 0;

    const sortOptions = [
        { label: "Latest Arrivals", value: "latest" },
        { label: "Price: Low to High", value: "price_asc" },
        { label: "Price: High to Low", value: "price_desc" },
    ];

    const currentSortLabel =
        sortOptions.find((opt) => opt.value === sortOption)?.label ??
        "Latest Arrivals";

    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 py-6 border-y border-white/5 bg-brand-black/50 backdrop-blur-md sticky top-20 z-40">
            <div className="flex items-center gap-8">
                <button
                    onClick={onOpenFilters}
                    className="flex lg:hidden items-center gap-3 px-6 py-3 bg-white text-black font-black text-[10px] tracking-[0.3em] uppercase hover:bg-brand-volt transition-colors"
                >
                    <SlidersHorizontal size={14} />
                    Open_Filters
                </button>

                <div className="hidden lg:flex items-center gap-6">
                    <span className="font-mono text-[9px] text-white/30 uppercase tracking-[0.4em]">
                        Active_Filters:
                    </span>

                    <div className="flex flex-wrap gap-2">
                        {activeCategory !== "All" && (
                            <button
                                type="button"
                                onClick={onResetCategory}
                                className="px-3 py-1 bg-white/5 border border-white/10 rounded-none text-[9px] text-white/60 uppercase tracking-widest flex items-center gap-2 hover:border-brand-volt hover:text-brand-volt transition-colors"
                            >
                                {activeCategory} <X size={10} />
                            </button>
                        )}

                        {activeSizes.map((size) => (
                            <button
                                type="button"
                                key={size}
                                onClick={() => onRemoveSize(size)}
                                className="px-3 py-1 bg-white/5 border border-white/10 rounded-none text-[9px] text-white/60 uppercase tracking-widest flex items-center gap-2 hover:border-brand-volt hover:text-brand-volt transition-colors"
                            >
                                Size: {size} <X size={10} />
                            </button>
                        ))}

                        {activeCategory === "All" && activeSizes.length === 0 && (
                            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-none text-[9px] text-white/30 uppercase tracking-widest">
                                No_Active_Filters
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-6 self-end md:self-auto">
                <div className="relative group">
                    <div className="flex items-center gap-3 cursor-pointer">
                        <span className="font-mono text-[9px] text-white/30 uppercase tracking-[0.4em] group-hover:text-white transition-colors">
                            Sort_By:
                        </span>

                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white">
                            {currentSortLabel}
                            <ChevronDown
                                size={14}
                                className="text-brand-volt transition-transform group-hover:rotate-180"
                            />
                        </div>
                    </div>

                    <div className="absolute top-full right-0 mt-4 w-48 bg-brand-surface border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                        {sortOptions.map((option) => (
                            <button
                                type="button"
                                key={option.value}
                                onClick={() => setSortOption(option.value)}
                                className={`w-full text-left px-4 py-3 text-[9px] uppercase tracking-widest hover:bg-brand-volt hover:text-black transition-colors ${sortOption === option.value
                                        ? "text-brand-volt"
                                        : "text-white/60"
                                    }`}
                            >
                                {option.label.replace(/ /g, "_")}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="hidden sm:block h-8 w-[1px] bg-white/10 mx-2" />

                <div className="hidden sm:flex items-center gap-2 font-mono text-[9px] text-white/30 uppercase tracking-[0.4em]">
                    {`Showing_${safeResultCount.toString().padStart(2, "0")}_Assets`}
                </div>
            </div>
        </div>
    );
}
