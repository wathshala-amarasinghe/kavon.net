"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { ProductCard } from "@/components/collections/productCard";
import { FilterBar } from "@/components/collections/filterBar";
import { FiltersSidebar } from "@/components/collections/FiltersSidebar";
import { CatalogProduct } from "@/types/product";

// Seed data from Shared Products for Collections
export default function CollectionsPage() {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState("All");
    const [activeGender, setActiveGender] = useState("All");
    const [activeSizes, setActiveSizes] = useState<string[]>([]);
    const [activeColors, setActiveColors] = useState<string[]>([]);
    const [priceMax, setPriceMax] = useState<number>(100000);
    const [priceFilterActive, setPriceFilterActive] = useState(false);
    const [sortOption, setSortOption] = useState("latest");
    const [inStockOnly, setInStockOnly] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [allProducts, setAllProducts] = useState<CatalogProduct[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);

    // Fetch Products from Backend
    useEffect(() => {
        const fetchAll = async () => {
            try {
                const { getProducts } = await import("@/lib/api");
                const data = await getProducts({ limit: 1000 });
                setAllProducts(data.products || []);
            } catch (error) {
                console.error("Failed to fetch products:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAll();
    }, []);

    const toggleSize = (size: string) => {
        setActiveSizes((prev: string[]) =>
            prev.includes(size) ? prev.filter((s: string) => s !== size) : [...prev, size]
        );
        setCurrentPage(1);
    };

    const toggleColor = (color: string) => {
        setActiveColors((prev: string[]) =>
            prev.includes(color) ? prev.filter((c: string) => c !== color) : [...prev, color]
        );
        setCurrentPage(1);
    };

    // Reset Filters
    const clearAll = () => {
        setActiveCategory("All");
        setActiveGender("All");
        setActiveSizes([]);
        setActiveColors([]);
        setPriceMax(100000);
        setPriceFilterActive(false);
        setInStockOnly(false);
        setCurrentPage(1);
    };

    const hasActiveFilters = activeCategory !== "All" || activeGender !== "All" || activeSizes.length > 0 || activeColors.length > 0 || inStockOnly || priceFilterActive;
    const ITEMS_PER_PAGE = 15;

    // Filter and Sort Logic
    const filteredAndSortedProducts = useMemo(() => {
        const result = allProducts.filter((product) => {
            const matchesCategory = activeCategory === "All" || product.category === activeCategory;
            const matchesGender = activeGender === "All" || product.gender === activeGender;
            const matchesSize = activeSizes.length === 0 || product.sizes?.some((s: { label: string }) => activeSizes.includes(s.label));
            const matchesColor = activeColors.length === 0 || product.colors?.some((c: { name: string }) => activeColors.includes(c.name));
            const matchesPrice = !priceFilterActive || product.price <= priceMax;
            const matchesStock = inStockOnly ? (product.stock ?? 0) > 0 : true;
            const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());

            return matchesCategory && matchesGender && matchesSize && matchesColor && matchesPrice && matchesStock && matchesSearch;
        });

        if (sortOption === "price_asc") {
            result.sort((a, b) => a.price - b.price);
        } else if (sortOption === "price_desc") {
            result.sort((a, b) => b.price - a.price);
        }

        return result;
    }, [activeCategory, activeGender, activeSizes, activeColors, priceMax, priceFilterActive, sortOption, inStockOnly, searchQuery, allProducts]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE);
    const paginatedProducts = filteredAndSortedProducts.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // Scroll to top when page changes
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentPage]);

    const handleSearch = () => {
        setCurrentPage(1);
    };

    return (
        <section className="pt-48 pb-20 px-6 max-w-[1400px] mx-auto">
            <header className="mb-20 border-l-2 border-brand-volt pl-8">
                <span className="font-mono text-[10px] tracking-[0.5em] text-brand-volt uppercase mb-2 block">
                    Archives_v4.0
                </span>
                <h1 className="text-6xl md:text-8xl font-heading italic tracking-[0.02em] uppercase">
                    {activeCategory === "All" ? "All" : activeCategory}{" "}
                    <span className="text-white/20">Collections</span>
                </h1>
                <div className="mt-8">
                    <form onSubmit={(e: React.FormEvent) => {
                        e.preventDefault();
                        handleSearch();
                    }} className="relative group max-w-md">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-brand-volt transition-colors" size={20} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                            placeholder="Search archival drops..."
                            className="w-full bg-white/5 border border-white/10 py-5 pl-16 pr-6 text-white font-mono text-sm focus:border-brand-volt/50 focus:bg-white/10 transition-all outline-none"
                        />
                    </form>
                </div>
            </header>

            <FilterBar
                onOpenFilters={() => setSidebarOpen(true)}
                activeCategory={activeCategory}
                activeSizes={activeSizes}
                onResetCategory={() => { setActiveCategory("All"); setCurrentPage(1); }}
                onRemoveSize={(size: string) => toggleSize(size)}
                sortOption={sortOption}
                setSortOption={(val: string) => { setSortOption(val); setCurrentPage(1); }}
                resultCount={filteredAndSortedProducts.length}
            />

            <div className="flex gap-12">
                <aside className="hidden lg:block w-64 shrink-0">
                    <FiltersSidebar
                        activeCategory={activeCategory}
                        setActiveCategory={(cat: string) => { setActiveCategory(cat); setCurrentPage(1); }}
                        activeGender={activeGender}
                        setActiveGender={(gen: string) => { setActiveGender(gen); setCurrentPage(1); }}
                        activeSizes={activeSizes}
                        toggleSize={toggleSize}
                        activeColors={activeColors}
                        toggleColor={toggleColor}
                        priceMax={priceMax}
                        priceFilterActive={priceFilterActive}
                        setPriceMax={(val: number) => { setPriceMax(val); setPriceFilterActive(true); setCurrentPage(1); }}
                        inStockOnly={inStockOnly}
                        setInStockOnly={(val: boolean) => { setInStockOnly(val); setCurrentPage(1); }}
                        clearAll={clearAll}
                        hasActiveFilters={hasActiveFilters}
                    />
                </aside>

                <section className="flex-1">
                    <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 relative">
                        <AnimatePresence mode="popLayout">
                            {paginatedProducts.map((product, i: number) => (
                                <ProductCard key={product._id || product.id} product={product} index={i} />
                            ))}
                        </AnimatePresence>
                    </motion.div>

                    {filteredAndSortedProducts.length === 0 && (
                        <div className="py-20 text-center border border-white/5 bg-white/5">
                            <p className="text-white/20 font-mono text-[10px] uppercase tracking-[0.4em]">
                                No_Assets_Found_In_This_Sector
                            </p>
                        </div>
                    )}

                    {/* Tactical Pagination UI */}
                    {totalPages > 1 && (
                        <div className="mt-20 flex flex-col items-center gap-8 border-t border-white/5 pt-12">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage((prev: number) => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="p-4 border border-white/10 hover:border-brand-volt disabled:opacity-20 disabled:hover:border-white/10 transition-all"
                                >
                                    <ChevronLeft size={16} />
                                </button>

                                <div className="flex gap-2">
                                    {Array.from({ length: totalPages }).map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentPage(i + 1)}
                                            className={`w-12 h-12 font-mono text-[10px] transition-all border ${currentPage === i + 1
                                                ? "bg-brand-volt text-black border-brand-volt"
                                                : "border-white/10 hover:border-white/40 text-white/40 hover:text-white"
                                                }`}
                                        >
                                            {String(i + 1).padStart(2, '0')}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => setCurrentPage((prev: number) => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className="p-4 border border-white/10 hover:border-brand-volt disabled:opacity-20 disabled:hover:border-white/10 transition-all"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                            <span className="font-mono text-[9px] text-white/20 uppercase tracking-[0.3em]">
                                Sector {currentPage} / {totalPages}
                            </span>
                        </div>
                    )}
                </section>
            </div>

            {/* Mobile Filter Sidebar Drawer */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSidebarOpen(false)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] lg:hidden"
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-full w-[85%] max-sm max-w-sm bg-brand-black border-l border-white/10 z-[70] p-8 lg:hidden overflow-y-auto"
                        >
                            <div className="flex items-center justify-between mb-12">
                                <span className="font-mono text-[10px] tracking-[0.5em] text-brand-volt uppercase">Filters_Config</span>
                                <button onClick={() => setSidebarOpen(false)} className="text-white hover:text-brand-volt transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <FiltersSidebar
                                activeCategory={activeCategory}
                                setActiveCategory={(cat) => { setActiveCategory(cat); setCurrentPage(1); }}
                                activeGender={activeGender}
                                setActiveGender={(gen) => { setActiveGender(gen); setCurrentPage(1); }}
                                activeSizes={activeSizes}
                                toggleSize={toggleSize}
                                activeColors={activeColors}
                                toggleColor={toggleColor}
                                priceMax={priceMax}
                                priceFilterActive={priceFilterActive}
                                setPriceMax={(val) => { setPriceMax(val); setPriceFilterActive(true); setCurrentPage(1); }}
                                inStockOnly={inStockOnly}
                                setInStockOnly={(val) => { setInStockOnly(val); setCurrentPage(1); }}
                                clearAll={clearAll}
                                hasActiveFilters={hasActiveFilters}
                            />
                            <button onClick={() => setSidebarOpen(false)} className="w-full mt-12 py-5 bg-brand-volt text-black font-black uppercase text-xs tracking-[0.3em]">
                                Apply_Filters
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </section>
    );
}
