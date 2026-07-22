"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductCard } from '@/components/collections/productCard';
import { SlidersHorizontal, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { CatalogProduct } from '@/types/product';
import { getCampaigns, getProducts } from '@/lib/api';
import { PRODUCT_CATEGORIES } from '@/lib/catalog';

const ITEMS_PER_PAGE = 20;

export default function PromotionsPage() {
    const [promoProducts, setPromoProducts] = useState<CatalogProduct[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [activePriceRange, setActivePriceRange] = useState<string | null>(null);
    const [activeSize, setActiveSize] = useState<string | null>(null);
    const [activeStockStatus, setActiveStockStatus] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState("Latest");
    const [currentPage, setCurrentPage] = useState(1);
    const [loadError, setLoadError] = useState<string | null>(null);

    useEffect(() => {
        let isActive = true;

        const loadPromotions = async () => {
            setIsLoading(true);
            setLoadError(null);
            try {
                const campaigns = await getCampaigns();
                const now = Date.now();
                const campaignProducts = (Array.isArray(campaigns) ? campaigns : [])
                    .filter((campaign) =>
                        campaign.status === 'Active' &&
                        new Date(campaign.startDate).getTime() <= now &&
                        new Date(campaign.endDate).getTime() >= now
                    )
                    .flatMap((campaign) => Array.isArray(campaign.products) ? campaign.products : []);

                let products = campaignProducts;
                if (products.length === 0) {
                    const response = await getProducts({ isNewDrop: true, limit: 100 });
                    products = response.products;
                }

                const uniqueProducts = Array.from(
                    new Map(products.map((product: CatalogProduct) => [product._id || product.id, product])).values()
                ).filter((product): product is CatalogProduct => Boolean(product));

                if (isActive) setPromoProducts(uniqueProducts);
            } catch (error: unknown) {
                if (isActive) {
                    setPromoProducts([]);
                    setLoadError(error instanceof Error ? error.message : 'Promotions could not be loaded');
                }
            } finally {
                if (isActive) setIsLoading(false);
            }
        };

        loadPromotions();
        return () => {
            isActive = false;
        };
    }, []);

    // Filter Logic
    const filteredProducts = useMemo(() => {
        let result = [...promoProducts];

        if (activeCategory) result = result.filter(p => p.category === activeCategory);

        if (activePriceRange) {
            if (activePriceRange === "Under LKR 5,000") result = result.filter(p => p.price < 5000);
            if (activePriceRange === "LKR 5,000 - 10,000") result = result.filter(p => p.price >= 5000 && p.price <= 10000);
            if (activePriceRange === "Above LKR 10,000") result = result.filter(p => p.price > 10000);
        }

        if (activeSize) result = result.filter(p => p.sizes.some(s => s.label === activeSize));

        if (activeStockStatus) {
            const availableStock = (product: CatalogProduct) =>
                Number.isFinite(Number(product.stock))
                    ? Number(product.stock)
                    : product.sizes.reduce((total, size) => total + Number(size.stock || 0), 0);
            if (activeStockStatus === "In Stock") result = result.filter(p => availableStock(p) > 0);
            if (activeStockStatus === "Sold Out") result = result.filter(p => availableStock(p) <= 0);
        }

        if (sortBy === "Price: Low to High") result.sort((a, b) => a.price - b.price);
        if (sortBy === "Price: High to Low") result.sort((a, b) => b.price - a.price);

        return result;
    }, [promoProducts, activeCategory, activePriceRange, activeSize, activeStockStatus, sortBy]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const currentItems = useMemo(() => {
        const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
        const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
        return filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
    }, [filteredProducts, currentPage]);

    // Reset page to 1 when filters change
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCurrentPage(1);
    }, [activeCategory, activePriceRange, activeSize, activeStockStatus, sortBy]);

    const resetFilters = () => {
        setActiveCategory(null);
        setActivePriceRange(null);
        setActiveSize(null);
        setActiveStockStatus(null);
    };

    return (
        <div className="bg-brand-black min-h-screen text-white selection:bg-brand-volt selection:text-black">

            <main className="pt-48 pb-20 px-6 max-w-[1400px] mx-auto">
                <header className="mb-12 border-l-2 border-brand-volt pl-8">
                    <span className="font-mono text-[12px] tracking-[0.4em] text-brand-volt uppercase mb-2 block">
                        Sales &amp; Promotions
                    </span>
                    <h1 className="text-6xl md:text-8xl font-heading italic uppercase tracking-tighter">
                        Active <span className="text-white/20">Promotions</span>
                    </h1>
                </header>

                {/* Toolbar */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 py-6 border-y border-white/5">
                    <div className="flex items-center gap-8 w-full md:w-auto">
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="flex items-center gap-3 group"
                        >
                            <div className={`p-2 border transition-colors ${isFilterOpen || activeCategory || activePriceRange || activeSize || activeStockStatus ? 'bg-brand-volt border-brand-volt text-black' : 'border-white/10 text-white group-hover:border-brand-volt'}`}>
                                <SlidersHorizontal size={14} />
                            </div>
                            <span className="font-mono text-[12px] uppercase tracking-[0.2em] font-bold">Filters</span>
                        </button>

                        {(activeCategory || activePriceRange || activeSize || activeStockStatus) && (
                            <button onClick={resetFilters} className="text-[12px] font-mono text-brand-volt uppercase flex items-center gap-2 hover:brightness-110">
                                <X size={12} /> Clear All
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-6">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-transparent font-mono text-[12px] uppercase tracking-[0.2em] outline-none border-b border-transparent hover:border-brand-volt cursor-pointer"
                        >
                            <option className="bg-brand-black" value="Latest">Latest</option>
                            <option className="bg-brand-black" value="Price: Low to High">Low to High</option>
                            <option className="bg-brand-black" value="Price: High to Low">High to Low</option>
                        </select>

                        <div className="font-mono text-[12px] text-white/20 uppercase tracking-[0.2em]">
                            Results: <span className="text-white">{filteredProducts.length}</span>
                        </div>
                    </div>
                </div>

                {/* Sliding Filter Panel */}
                <AnimatePresence>
                    {isFilterOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden mb-12"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 py-10 border-b border-white/5 bg-white/[0.02] px-8">
                                <div className="space-y-6">
                                    <h4 className="font-mono text-[12px] text-brand-volt uppercase tracking-[0.3em] font-bold">Category</h4>
                                    <div className="flex flex-col gap-3">
                                        {PRODUCT_CATEGORIES.map(cat => (
                                            <button key={cat} onClick={() => setActiveCategory(activeCategory === cat ? null : cat)} className={`text-left font-mono text-[12px] uppercase tracking-[0.15em] transition-colors ${activeCategory === cat ? 'text-brand-volt' : 'text-white/40 hover:text-white'}`}>{cat}</button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <h4 className="font-mono text-[12px] text-brand-volt uppercase tracking-[0.3em] font-bold">Price Range</h4>
                                    <div className="flex flex-col gap-3">
                                        {["Under LKR 5,000", "LKR 5,000 - 10,000", "Above LKR 10,000"].map(range => (
                                            <button key={range} onClick={() => setActivePriceRange(activePriceRange === range ? null : range)} className={`text-left font-mono text-[12px] uppercase tracking-[0.15em] transition-colors ${activePriceRange === range ? 'text-brand-volt' : 'text-white/40 hover:text-white'}`}>{range}</button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <h4 className="font-mono text-[12px] text-brand-volt uppercase tracking-[0.3em] font-bold">Availability</h4>
                                    <div className="flex flex-col gap-3">
                                        {["In Stock", "Sold Out"].map(status => (
                                            <button key={status} onClick={() => setActiveStockStatus(activeStockStatus === status ? null : status)} className={`text-left font-mono text-[12px] uppercase tracking-[0.15em] transition-colors ${activeStockStatus === status ? 'text-brand-volt' : 'text-white/40 hover:text-white'}`}>{status}</button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <h4 className="font-mono text-[12px] text-brand-volt uppercase tracking-[0.3em] font-bold">Size</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {['S', 'M', 'L', 'XL', '30', '32'].map(size => (
                                            <button key={size} onClick={() => setActiveSize(activeSize === size ? null : size)} className={`w-10 h-10 border flex items-center justify-center font-mono text-[12px] transition-all ${activeSize === size ? 'border-brand-volt text-brand-volt' : 'border-white/10 text-white/40 hover:border-white'}`}>{size}</button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Products Grid */}
                {isLoading ? (
                    <div className="py-24 text-center font-mono text-brand-volt uppercase tracking-[0.3em]">Loading promotions...</div>
                ) : loadError ? (
                    <div role="alert" className="border border-red-500/20 bg-red-500/5 p-8 text-center font-mono text-xs uppercase tracking-widest text-red-300">
                        {loadError}
                    </div>
                ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                    <AnimatePresence mode="popLayout">
                        {currentItems.map((product, index) => (
                            <motion.div
                                key={product._id || product.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2 }}
                            >
                                <ProductCard product={product} index={index} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
                )}

                {/* Tactical Pagination */}
                {totalPages > 1 && (
                    <div className="mt-24 flex flex-col items-center gap-8 pt-12 border-t border-white/5">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="p-4 border border-white/10 hover:border-brand-volt disabled:opacity-20 disabled:hover:border-white/10 transition-colors"
                            >
                                <ChevronLeft size={20} />
                            </button>

                            <div className="flex items-center gap-2">
                                {Array.from({ length: totalPages }).map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`w-12 h-12 font-mono text-[12px] flex items-center justify-center border transition-all ${currentPage === i + 1
                                                ? "bg-brand-volt border-brand-volt text-black font-bold"
                                                : "border-white/10 text-white/40 hover:border-white/40"
                                            }`}
                                    >
                                        {String(i + 1).padStart(2, '0')}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="p-4 border border-white/10 hover:border-brand-volt disabled:opacity-20 disabled:hover:border-white/10 transition-colors"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                        <span className="font-mono text-[12px] text-white/20 uppercase tracking-[0.3em]">
                            Page {currentPage} of {totalPages}
                        </span>
                    </div>
                )}

                {!isLoading && !loadError && filteredProducts.length === 0 && (
                    <div className="py-20 text-center border border-white/5 bg-white/[0.01]">
                        <p className="font-mono text-[12px] uppercase tracking-[0.3em] text-white/20">No products found. Try adjusting your filters.</p>
                    </div>
                )}
            </main>


        </div>
    );
}
