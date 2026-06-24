import { ChevronDown, Search, Grid, List } from "lucide-react";

interface ShopHeaderProps {
    resultCount: number;
    sortOption: string;
    setSortOption: (val: string) => void;
    searchQuery: string;
    setSearchQuery: (val: string) => void;
    viewMode: "grid" | "list";
    setViewMode: (val: "grid" | "list") => void;
    onOpenFilters: () => void;
}

export function ShopHeader({ resultCount, sortOption, setSortOption, searchQuery, setSearchQuery, viewMode, setViewMode, onOpenFilters }: ShopHeaderProps) {

    return (
        <header className="mb-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 border-l-2 border-brand-volt pl-8">
                <div>
                    <span className="font-mono text-[12px] tracking-[0.4em] text-brand-volt uppercase mb-2 block">KAVON_CATALOG</span>
                    <h1 className="text-6xl md:text-8xl font-heading italic uppercase tracking-tighter">Shop <span className="text-white/20">Kavon</span></h1>
                </div>
                <div className="flex items-center gap-4 md:gap-6 text-[12px] font-mono text-white/30 uppercase tracking-[0.2em]">
                    <span className="hidden sm:inline">Products: {resultCount.toString().padStart(2, '0')}</span>
                    
                    {/* Mobile Filter Trigger */}
                    <button 
                        onClick={onOpenFilters}
                        className="lg:hidden flex items-center gap-2 bg-brand-volt/10 text-brand-volt border border-brand-volt/20 px-4 py-2 hover:bg-brand-volt hover:text-black transition-all"
                    >
                        Filters
                    </button>

                    {/* View Toggle */}
                    <div className="hidden md:flex items-center gap-2 border-x border-white/10 px-6">
                        <button 
                            onClick={() => setViewMode("grid")}
                            className={`p-1.5 transition-colors ${viewMode === "grid" ? "text-brand-volt" : "text-white/20 hover:text-white"}`}
                        >
                            <Grid size={16} />
                        </button>
                        <button 
                            onClick={() => setViewMode("list")}
                            className={`p-1.5 transition-colors ${viewMode === "list" ? "text-brand-volt" : "text-white/20 hover:text-white"}`}
                        >
                            <List size={16} />
                        </button>
                    </div>

                    <div className="group relative cursor-pointer">
                        <div className="flex items-center gap-2 text-white">Sort: {sortOption} <ChevronDown size={14} className="text-brand-volt" /></div>
                        <div className="absolute top-full right-0 mt-4 w-48 bg-brand-surface border border-white/5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                            {['latest', 'price_asc', 'price_desc', 'newest', 'popular'].map(opt => (
                                <button key={opt} onClick={() => setSortOption(opt)} className="w-full text-left px-4 py-3 hover:bg-brand-volt hover:text-black transition-colors uppercase">{opt.replace('_', ' ')}</button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative group max-w-2xl">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-brand-volt transition-colors" size={20} />
                <input
                    type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Products..."
                    className="w-full bg-brand-surface/50 border border-white/5 py-6 pl-16 pr-8 text-[13px] font-mono tracking-widest uppercase focus:outline-none focus:border-brand-volt transition-all"
                />
            </div>
        </header>
    );
}