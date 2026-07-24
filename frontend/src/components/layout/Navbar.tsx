"use client";

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { useCurrency } from '@/context/CurrencyContext';
import { useSystemSettings } from '@/context/SystemSettingsContext';
import { getProducts } from '@/lib/api';
import { CatalogProduct } from '@/types/product';
import { SearchDropdown } from './SearchDropdown';
import { MiniCart } from './MiniCart';
import { COLLECTION_NAV_LINKS } from '@/lib/catalog';
import {
    Search,
    ShoppingBag,
    User,
    Menu,
    X,
    Mail,
    Phone,
    Heart,
    LogOut,
    ShieldCheck,
    ChevronRight
} from 'lucide-react';

export function Navbar() {
    const { cartCount } = useCart();
    const { wishlistCount } = useWishlist();
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [isCartHovered, setIsCartHovered] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<CatalogProduct[]>([]);
    const [searchResultQuery, setSearchResultQuery] = useState("");
    const searchInputRef = useRef<HTMLInputElement>(null);

    const { scrollY } = useScroll();

    // Smart UX: Hide on scroll down, Reveal on scroll up
    useMotionValueEvent(scrollY, "change", (latest: number) => {
        const previous = scrollY.getPrevious() ?? 0;
        if (latest > previous && latest > 150) {
            setHidden(true);
        } else if (latest < previous) {
            setHidden(false);
        }
    });

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (isSearchOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isSearchOpen]);

    useEffect(() => {
        const query = searchQuery.trim();
        if (query.length < 2) {
            return;
        }

        let isActive = true;
        const timer = window.setTimeout(async () => {
            try {
                const response = await getProducts({ q: query, limit: 5 });
                if (isActive) {
                    setSearchResults(response.products || []);
                    setSearchResultQuery(query);
                }
            } catch (error) {
                console.error('SEARCH_SYNC_FAILURE:', error);
                if (isActive) setSearchResults([]);
            }
        }, 250);

        return () => {
            isActive = false;
            window.clearTimeout(timer);
        };
    }, [searchQuery]);

    const visibleSearchResults = searchResultQuery === searchQuery.trim() ? searchResults : [];

    const handleLogout = () => {
        logout();
    };

    const { currency, setCurrency } = useCurrency();
    const { settings } = useSystemSettings();
    const contactEmail = settings?.contactEmail || 'hq@kavon.net';
    const contactPhone = settings?.contactPhone || '+94 77 123 4567';
    const contactPhoneHref = contactPhone.replace(/[^+\d]/g, '');

    const [isCollectionsOpen, setIsCollectionsOpen] = useState(false);

    const navLinks = [
        { name: 'Home', href: '/' },
        { 
            name: 'Collections', 
            href: '/shop', 
            dropdown: COLLECTION_NAV_LINKS
        },
        { name: 'Tracking', href: '/order-track' },
        { name: 'About', href: '/about' },
    ];

    return (
        <motion.nav
            variants={{
                visible: { y: 0 },
                hidden: { y: "-100%" },
            }}
            animate={hidden ? "hidden" : "visible"}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className={`fixed top-0 left-0 right-0 z-[200] transition-colors duration-500 ${scrolled ? 'bg-black/95 backdrop-blur-md border-b border-white/10' : 'bg-transparent'
                }`}
        >
            <div className={`hidden md:flex border-b border-white/5 px-6 transition-all duration-500 overflow-hidden ${scrolled ? 'h-0 opacity-0' : 'h-12 opacity-100'}`}>
                <div className="max-w-[1400px] mx-auto w-full flex justify-between items-center">
                    <div className="flex items-center gap-8 font-mono">
                        <div className="flex items-center gap-2">
                            {['LKR', 'USD', 'EUR'].map((c) => (
                                <button
                                    key={c}
                                    onClick={() => setCurrency(c as 'LKR' | 'USD' | 'EUR')}
                                    className={`text-[12px] font-black tracking-widest transition-all px-2 py-0.5 border ${currency === c ? 'bg-brand-volt text-black border-brand-volt' : 'text-white/40 border-transparent hover:text-white'}`}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>
                        <div className="w-px h-3 bg-white/10 mx-2" />
                        <a href={`mailto:${contactEmail}`} className="flex items-center gap-2 text-[12px] font-bold text-white uppercase tracking-widest hover:text-[#df0715ff] transition-all">
                            <Mail size={12} strokeWidth={2.5} /> {contactEmail}
                        </a>
                        <div className="w-px h-3 bg-white/10 mx-2" />
                        <a href={`tel:${contactPhoneHref}`} className="flex items-center gap-2 text-[12px] font-bold text-white uppercase tracking-widest hover:text-[#df0715ff] transition-all">
                            <Phone size={12} strokeWidth={2.5} /> {contactPhone}
                        </a>
                    </div>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-6 h-20 md:h-24 flex items-center justify-between relative">
                <div className="hidden md:flex items-center space-x-10 flex-1">
                    {navLinks.map((link) => (
                        <div 
                            key={link.name} 
                            className="relative group"
                            onMouseEnter={() => link.dropdown && setIsCollectionsOpen(true)}
                            onMouseLeave={() => link.dropdown && setIsCollectionsOpen(false)}
                            onFocus={() => link.dropdown && setIsCollectionsOpen(true)}
                            onBlur={(event) => {
                                if (link.dropdown && !event.currentTarget.contains(event.relatedTarget)) {
                                    setIsCollectionsOpen(false);
                                }
                            }}
                            onKeyDown={(event) => {
                                if (event.key === 'Escape') setIsCollectionsOpen(false);
                            }}
                        >
                            <Link
                                href={link.href}
                                aria-haspopup={link.dropdown ? 'menu' : undefined}
                                aria-expanded={link.dropdown ? isCollectionsOpen : undefined}
                                className="text-[14px] font-black uppercase tracking-[0.2em] text-white/70 hover:text-white transition-all relative py-4"
                            >
                                {link.name}
                                <span className="absolute bottom-3 left-0 w-0 h-[1px] bg-[#df0715ff] transition-all duration-300 group-hover:w-full" />
                            </Link>

                            {link.dropdown && (
                                <AnimatePresence>
                                    {isCollectionsOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            role="menu"
                                            className="absolute top-full left-0 w-64 bg-black/95 border border-white/10 backdrop-blur-xl p-4 shadow-2xl"
                                        >
                                            <div className="space-y-4">
                                                {link.dropdown.map((subItem) => (
                                                    <Link
                                                        key={subItem.name}
                                                        href={subItem.href}
                                                        className="block text-[12px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-brand-volt transition-all"
                                                    >
                                                        {subItem.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex justify-center flex-shrink-0">
                    <Link href="/" className="relative w-40 h-12 md:w-52 md:h-16 block">
                        <Image
                            src="/logo/logo-1.png"
                            alt="KAVON LOGO"
                            fill
                            sizes="(max-width: 768px) 160px, 208px"
                            className="object-contain"
                            priority
                        />
                    </Link>
                </div>

                <div className="flex items-center justify-end space-x-6 md:space-x-8 flex-1">
                    <button 
                        onClick={() => setIsSearchOpen(!isSearchOpen)} 
                        className="text-white opacity-60 hover:opacity-100 transition-opacity z-[130]"
                        aria-label={isSearchOpen ? "Close Search" : "Open Search"}
                    >
                        {isSearchOpen ? <X size={20} /> : <Search size={20} />}
                    </button>

                    {user ? (
                        <div className="flex items-center gap-4 group">
                            <div className="hidden lg:flex flex-col items-end mr-2">
                                <span className="text-[12px] font-mono text-white/50 tracking-widest uppercase leading-none mb-1">DASHBOARD</span>
                                <Link href="/dashboard" className="text-[14px] font-black text-brand-volt uppercase tracking-tighter leading-none hover:underline" aria-label={`View profile for ${user.name}`}>
                                    {user.name}
                                </Link>
                            </div>
                            <button onClick={handleLogout} className="text-white/60 hover:text-red-500 transition-all" aria-label="Logout">
                                <LogOut size={20} strokeWidth={2.5} />
                            </button>
                        </div>
                    ) : (
                        <Link href="/login" className="flex items-center gap-2 group text-white hover:opacity-100 transition-opacity" aria-label="Access Login Portal">
                            <User size={22} strokeWidth={2.5} />
                            <span className="hidden lg:block font-mono text-[13px] uppercase tracking-[0.2em] font-bold">Login</span>
                        </Link>
                    )}

                    <Link href="/wishlist" className="hidden sm:block relative group" aria-label="View Saved Assets">
                        <Heart size={20} strokeWidth={2.5} className="text-white group-hover:opacity-100 transition-opacity" />
                        {wishlistCount > 0 && (
                            <span className="absolute -top-2.5 -right-2.5 bg-brand-volt text-black text-[12px] font-black w-6 h-6 flex items-center justify-center rounded-full shadow-[0_0_15px_rgba(223, 7, 21,0.5)] z-20">
                                {wishlistCount}
                            </span>
                        )}
                    </Link>

                    <div
                        className="relative group"
                        onMouseEnter={() => setIsCartHovered(true)}
                        onMouseLeave={() => setIsCartHovered(false)}
                        onFocus={() => setIsCartHovered(true)}
                        onBlur={(event) => {
                            if (!event.currentTarget.contains(event.relatedTarget)) setIsCartHovered(false);
                        }}
                    >
                        <Link href="/cart" className="relative block" aria-label={`View Cart: ${cartCount} items`}>
                            <ShoppingBag size={20} strokeWidth={2.5} className="text-white group-hover:opacity-100 transition-opacity" />
                            {cartCount > 0 && (
                                <span className="absolute -top-2.5 -right-2.5 bg-brand-volt text-black text-[12px] font-black w-6 h-6 flex items-center justify-center rounded-full shadow-[0_0_15px_rgba(223, 7, 21,0.5)] z-20">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                        <AnimatePresence>
                            {isCartHovered && !isOpen && (
                                <MiniCart />
                            )}
                        </AnimatePresence>
                    </div>

                    <button
                        className="md:hidden text-white"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
                        aria-expanded={isOpen}
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                <AnimatePresence>
                    {isSearchOpen && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="absolute right-32 left-6 md:left-auto md:right-48 md:w-96 bg-black/90 border border-white/10 backdrop-blur-xl h-12 flex items-center px-4 z-[120]"
                        >
                            <form className="w-full flex items-center gap-3" onSubmit={(e: React.FormEvent) => e.preventDefault()}>
                                <Search size={14} className="text-[#df0715ff]" />
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                                    placeholder="SEARCH PRODUCTS..."
                                    className="flex-1 bg-transparent border-none text-white text-[12px] font-black uppercase tracking-widest outline-none placeholder:text-white/20"
                                />
                            </form>
                            <SearchDropdown
                                query={searchQuery}
                                results={visibleSearchResults}
                                close={() => { setIsSearchOpen(false); setSearchQuery(""); }}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            {/* MOBILE_DEPLOYMENT_MENU */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-0 bg-black z-[250] flex flex-col p-8 md:hidden"
                    >
                        <div className="flex justify-between items-center mb-16">
                            <Link href="/" onClick={() => setIsOpen(false)} className="w-32 h-10 relative">
                                <Image src="/logo/logo-1.png" alt="KAVON" fill sizes="128px" className="object-contain" />
                            </Link>
                            <button onClick={() => setIsOpen(false)} className="text-white" aria-label="Close navigation menu">
                                <X size={32} />
                            </button>
                        </div>

                        <nav className="flex-1 space-y-6 overflow-y-auto custom-scrollbar pr-4">
                            {navLinks.map((link, i) => (
                                <motion.div
                                    key={link.name}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="space-y-4"
                                >
                                    <Link
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className="text-4xl font-black uppercase italic tracking-tighter text-white hover:text-brand-volt transition-all flex items-center justify-between group"
                                    >
                                        {link.name}
                                        {link.dropdown ? (
                                            <ChevronRight size={24} className="text-white/20" />
                                        ) : (
                                            <ChevronRight size={24} className="opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all" />
                                        )}
                                    </Link>
                                    
                                    {link.dropdown && (
                                        <div className="pl-6 space-y-4 border-l border-white/10 ml-1">
                                            {link.dropdown.map((subItem) => (
                                                <Link
                                                    key={subItem.name}
                                                    href={subItem.href}
                                                    onClick={() => setIsOpen(false)}
                                                    className="block text-lg font-bold uppercase tracking-widest text-white/40 hover:text-brand-volt transition-all"
                                                >
                                                    {subItem.name}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </nav>

                        <div className="pt-8 border-t border-white/10 space-y-6">
                            {user ? (
                                <div className="space-y-4">
                                    <Link 
                                        href="/dashboard" 
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-4 bg-brand-volt/10 border border-brand-volt/20 p-5 group"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-brand-volt flex items-center justify-center text-black font-black italic">
                                            {user.name[0]}
                                        </div>
                                        <div>
                                            <span className="text-[12px] font-mono text-brand-volt uppercase tracking-widest block">USER ACCOUNT</span>
                                            <span className="text-lg font-black uppercase italic text-white">{user.name}</span>
                                        </div>
                                    </Link>
                                    <button 
                                        onClick={() => { handleLogout(); setIsOpen(false); }}
                                        className="w-full text-left font-mono text-[12px] uppercase text-red-500 tracking-[0.3em] px-2 font-bold"
                                    >
                                        Log Out
                                    </button>
                                </div>
                            ) : (
                                <Link
                                    href="/login"
                                    onClick={() => setIsOpen(false)}
                                    className="block bg-white text-black p-6 text-center font-black uppercase tracking-[0.2em] text-sm"
                                >
                                    Login to your account
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
