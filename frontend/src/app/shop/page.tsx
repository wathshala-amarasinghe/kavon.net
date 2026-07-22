"use client";

import React, { useCallback, Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { ShopHeader } from "@/components/shop/ShopHeader";
import { FiltersSidebar } from "@/components/collections/FiltersSidebar";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SkeletonProduct } from "@/components/layout/SkeletonProduct";
import { getProducts } from "@/lib/api";
import { useInventory } from "@/context/InventoryContext";
import { CatalogProduct } from "@/types/product";

const ITEMS_PER_PAGE = 15;

function ShopContent() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(true);
    const [products, setProducts] = useState<CatalogProduct[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
    const { syncInventory } = useInventory();

    // URL State Extractors
    const activeCategory = searchParams.get("category") || "All";
    const activeGender = searchParams.get("gender") || "All";
    const activeSizes = searchParams.get("sizes")?.split(",") || [];
    const activeColors = searchParams.get("colors")?.split(",") || [];
    const priceMax = parseInt(searchParams.get("price") || "30000");
    const sortOption = searchParams.get("sort") || "latest";
    const viewMode = (searchParams.get("view") as "grid" | "list") || "grid";
    const inStockOnly = searchParams.get("stock") === "true";
    const searchQuery = searchParams.get("q") || "";
    const currentPage = parseInt(searchParams.get("page") || "1");

    useEffect(() => {
        const fetchFiltered = async () => {
            setIsLoading(true);
            try {
                const params = {
                    category: activeCategory,
                    gender: activeGender,
                    sizes: activeSizes.join(","),
                    colors: activeColors.join(","),
                    maxPrice: priceMax,
                    sort: sortOption,
                    q: searchQuery,
                    page: currentPage,
                    limit: ITEMS_PER_PAGE
                };
                
                const data = await getProducts(params);
                const safeProducts = Array.isArray(data?.products) ? data.products : [];
                const safePages = Number.isFinite(Number(data?.pages)) ? Number(data.pages) : 0;
                const safeTotal = Number.isFinite(Number(data?.total)) ? Number(data.total) : safeProducts.length;

                setProducts(safeProducts);
                setTotalPages(safePages);
                setTotalItems(safeTotal);
                syncInventory(safeProducts);
            } catch (error) {
                console.error("CATALOG_SYNC_FAILURE:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchFiltered();
    }, [activeCategory, activeGender, activeSizes.join(","), activeColors.join(","), priceMax, sortOption, searchQuery, currentPage, syncInventory]);

    // URL State Updater
    const updateUrl = useCallback((params: Record<string, string | null>) => {
        const newParams = new URLSearchParams(searchParams.toString());
        Object.entries(params).forEach(([key, value]) => {
            if (value === null || value === "" || value === "All") newParams.delete(key);
            else newParams.set(key, value);
        });
        router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
    }, [searchParams, pathname, router]);

    return (
        <div className="min-h-screen">
            {/* Increased padding-top from pt-32 to pt-52 for more space below Navbar */}
            <section className="pt-52 pb-20 px-6 max-w-[1440px] mx-auto">
                <ShopHeader
                    resultCount={totalItems}
                    sortOption={sortOption}
                    setSortOption={(val: string) => updateUrl({ sort: val, page: "1" })}
                    searchQuery={searchQuery}
                    setSearchQuery={(val: string) => updateUrl({ q: val, page: "1" })}
                    viewMode={viewMode}
                    setViewMode={(val: "grid" | "list") => updateUrl({ view: val })}
                    onOpenFilters={() => setIsMobileFiltersOpen(true)}
                />

                <div className="flex gap-12 mt-12">
                    <aside className="hidden lg:block w-64 shrink-0">
                        <FiltersSidebar
                            activeCategory={activeCategory}
                            setActiveCategory={(cat) => updateUrl({ category: cat, page: "1" })}
                            activeGender={activeGender}
                            setActiveGender={(gen) => updateUrl({ gender: gen, page: "1" })}
                            activeSizes={activeSizes}
                            toggleSize={(s) => {
                                const next = activeSizes.includes(s) ? activeSizes.filter(x => x !== s) : [...activeSizes, s];
                                updateUrl({ sizes: next.join(","), page: "1" });
                            }}
                            activeColors={activeColors}
                            toggleColor={(c) => {
                                const next = activeColors.includes(c) ? activeColors.filter(x => x !== c) : [...activeColors, c];
                                updateUrl({ colors: next.join(","), page: "1" });
                            }}
                            priceMax={priceMax}
                            setPriceMax={(val) => updateUrl({ price: val.toString(), page: "1" })}
                            inStockOnly={inStockOnly}
                            setInStockOnly={(val) => updateUrl({ stock: val.toString(), page: "1" })}
                            clearAll={() => {
                                updateUrl({
                                    category: "All",
                                    gender: "All",
                                    sizes: null,
                                    colors: null,
                                    price: null,
                                    stock: null,
                                    page: "1"
                                });
                            }}
                            hasActiveFilters={
                                activeCategory !== "All" ||
                                activeGender !== "All" ||
                                activeSizes.length > 0 ||
                                activeColors.length > 0 ||
                                priceMax < 30000 ||
                                inStockOnly
                            }
                        />
                    </aside>

                    <section className="flex-1">
                        {isLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <SkeletonProduct key={i} />
                                ))}
                            </div>
                        ) : (
                            <ProductGrid products={products} viewMode={viewMode} />
                        )}

                        {totalPages > 1 && (
                            <div className="mt-20 flex items-center justify-center gap-4 border-t border-white/5 pt-12">
                                <button onClick={() => updateUrl({ page: (currentPage - 1).toString() })} disabled={currentPage === 1} className="p-4 border border-white/10 disabled:opacity-20"><ChevronLeft size={20} /></button>
                                <div className="flex gap-2">
                                    {Array.from({ length: totalPages }).map((_, i) => (
                                        <button key={i} onClick={() => updateUrl({ page: (i + 1).toString() })} className={`w-12 h-12 font-mono text-xs ${currentPage === i + 1 ? "bg-brand-volt text-black" : "bg-white/5"}`}>{(i + 1).toString().padStart(2, '0')}</button>
                                    ))}
                                </div>
                                <button onClick={() => updateUrl({ page: (currentPage + 1).toString() })} disabled={currentPage === totalPages} className="p-4 border border-white/10 disabled:opacity-20"><ChevronRight size={20} /></button>
                            </div>
                        )}
                    </section>
                </div>
            </section>

            {/* Mobile Filters Drawer */}
            <AnimatePresence>
                {isMobileFiltersOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileFiltersOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[300] lg:hidden"
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-full w-full max-w-sm bg-brand-surface z-[301] lg:hidden border-l border-white/10 flex flex-col"
                        >
                            <div className="p-8 border-b border-white/10 flex items-center justify-between">
                                <h2 className="text-2xl font-black italic uppercase tracking-tighter">Filter Options</h2>
                                <button onClick={() => setIsMobileFiltersOpen(false)} className="text-white/40 hover:text-white transition-colors">
                                    <X size={24} />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                                <FiltersSidebar
                                    activeCategory={activeCategory}
                                    setActiveCategory={(cat) => updateUrl({ category: cat, page: "1" })}
                                    activeGender={activeGender}
                                    setActiveGender={(gen) => updateUrl({ gender: gen, page: "1" })}
                                    activeSizes={activeSizes}
                                    toggleSize={(s) => {
                                        const next = activeSizes.includes(s) ? activeSizes.filter(x => x !== s) : [...activeSizes, s];
                                        updateUrl({ sizes: next.join(","), page: "1" });
                                    }}
                                    activeColors={activeColors}
                                    toggleColor={(c) => {
                                        const next = activeColors.includes(c) ? activeColors.filter(x => x !== c) : [...activeColors, c];
                                        updateUrl({ colors: next.join(","), page: "1" });
                                    }}
                                    priceMax={priceMax}
                                    setPriceMax={(val) => updateUrl({ price: val.toString(), page: "1" })}
                                    inStockOnly={inStockOnly}
                                    setInStockOnly={(val) => updateUrl({ stock: val.toString(), page: "1" })}
                                    clearAll={() => {
                                        updateUrl({
                                            category: "All",
                                            gender: "All",
                                            sizes: null,
                                            colors: null,
                                            price: null,
                                            stock: null,
                                            page: "1"
                                        });
                                    }}
                                    hasActiveFilters={
                                        activeCategory !== "All" ||
                                        activeGender !== "All" ||
                                        activeSizes.length > 0 ||
                                        activeColors.length > 0 ||
                                        priceMax < 30000 ||
                                        inStockOnly
                                    }
                                />
                            </div>
                            <div className="p-8 border-t border-white/10">
                                <button 
                                    onClick={() => setIsMobileFiltersOpen(false)}
                                    className="w-full bg-brand-volt text-black py-5 font-black uppercase tracking-widest text-sm"
                                >
                                    Apply Changes
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function ShopPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center font-mono text-brand-volt uppercase tracking-widest text-xs animate-pulse">Loading Catalog...</div>}>
            <ShopContent />
        </Suspense>
    );
}
