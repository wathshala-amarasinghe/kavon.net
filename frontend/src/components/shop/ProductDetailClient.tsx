"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from "@/components/layout/Navbar";
import { ReviewSection } from "@/components/shop/ReviewSection";
import {
    ShoppingBag, Truck, Heart, Share2,
    RotateCcw, ShieldCheck, Minus, Plus, ChevronRight, Info, X
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useCheckout } from "@/context/CheckoutContext";
import { useSettings } from "@/context/UserSettingsContext";
import { useInventory } from "@/context/InventoryContext";
import { FitFinder } from "@/components/shop/FitFinder";
import { FormattedPrice } from "@/components/ui/FormattedPrice";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { SizeGuide } from "@/components/shop/SizeGuide";
import { StickyAddToCart } from "@/components/shop/StickyAddToCart";
import { ProductCard } from "@/components/collections/productCard";
import { BundleSection } from "@/components/shop/BundleSection";
import { StockBadge } from "@/components/shared/StockBadge";
import { getProducts } from "@/lib/api";
import Image from 'next/image';
import { getImageUrl } from '@/lib/utils';
import { CatalogProduct } from '@/types/product';

const MotionImage = motion.create(Image);

export default function ProductDetailClient({ product: initialProduct }: { product: CatalogProduct }) {
    const params = useParams();
    const router = useRouter();
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { setBuyNowItem } = useCheckout();
    const { trackView, location } = useSettings();
    const { checkStock, syncInventory } = useInventory();

    const [product] = useState<CatalogProduct>(initialProduct);
    const [relatedProducts, setRelatedProducts] = useState<CatalogProduct[]>([]);
    const [loading, setLoading] = useState(false);

    const [selectedColor, setSelectedColor] = useState<CatalogProduct["colors"][number]>(product.colors?.[0] || { name: 'Standard', hex: '#000', img: product.images[0] });
    const [selectedImage, setSelectedImage] = useState(product.images[0]);
    const [selectedSize, setSelectedSize] = useState<CatalogProduct["sizes"][number]>(product.sizes?.[1] || product.sizes?.[0] || { label: 'FREE', stock: 0 });
    const [quantity, setQuantity] = useState(1);
    const [modalContent, setModalContent] = useState<{ title: string; desc: string; link: string; highlight: string } | null>(null);
    const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
    const [isFitFinderOpen, setIsFitFinderOpen] = useState(false);
    const [isStickyVisible, setIsStickyVisible] = useState(false);

    useEffect(() => {
        const fetchRelated = async () => {
            const response = await getProducts();
            const allProducts = response.products || [];
            const related = allProducts
                .filter((p: CatalogProduct) => p.category === product.category && p._id !== product._id)
                .slice(0, 4);
            setRelatedProducts(related);
            syncInventory(related);
            syncInventory([product]);
        };
        fetchRelated();
    }, [product, syncInventory]);

    // Track View Protocol
    useEffect(() => {
        const productId = product._id || product.id;
        if (productId) trackView(productId);
    }, [product, trackView]);

    const getDeliveryEstimate = () => {
        const today = new Date();
        const min = new Date(today);
        const max = new Date(today);
        const offsetMin = location === "COLOMBO" ? 1 : 3;
        const offsetMax = location === "COLOMBO" ? 3 : 7;
        min.setDate(today.getDate() + offsetMin);
        max.setDate(today.getDate() + offsetMax);
        const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
        return `${min.toLocaleDateString('en-US', options)} - ${max.toLocaleDateString('en-US', options)}`;
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsStickyVisible(window.scrollY > 600);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleWishlist = () => {
        const productId = product._id || product.id || "";
        toggleWishlist({ id: productId, name: product.name, price: product.price, image: selectedImage });
        if (!isInWishlist(productId)) {
            toast.success("ASSET_ADDED_TO_WISHLIST");
        } else {
            toast.error("ASSET_REMOVED_FROM_WISHLIST");
        }
    };

    const openPolicyModal = (type: 'returns' | 'security') => {
        if (type === 'returns') {
            setModalContent({
                title: "Return & Refund Policy",
                highlight: "14-Day Tactical Window",
                desc: "Every asset deployed from our division is eligible for a full refund or exchange within 14 days, provided the original security tags remain intact.",
                link: "/returns"
            });
        } else {
            setModalContent({
                title: "Security & Privacy",
                highlight: "End-to-End Encryption",
                desc: "Your data is secured using the AES-256 standard. We do not store sensitive payment credentials on our local nodes, ensuring maximum operative privacy.",
                link: "/privacy"
            });
        }
    };

    const handleBuyNow = () => {
        setBuyNowItem({ id: product._id || product.id || "", name: product.name, price: product.price, image: selectedImage, size: selectedSize.label, color: selectedColor.name, quantity });
        router.push('/checkout');
    };

    return (
        <div className="bg-brand-black min-h-screen text-white selection:bg-brand-volt">
            <Navbar />
            <main className="pt-44 pb-20 px-6 max-w-[1440px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* GALLERY SECTION */}
                    <div className="lg:col-span-5 flex flex-col md:flex-row gap-4">
                        <div className="hidden md:flex flex-col gap-3">
                            {product.images.map((img: string, idx: number) => (
                                <button
                                    key={idx}
                                    onMouseEnter={() => setSelectedImage(img)}
                                    className={`w-16 md:w-20 aspect-[3/4] border transition-all ${selectedImage === img ? 'border-brand-volt' : 'border-white/10'} bg-brand-surface overflow-hidden relative`}
                                >
                                    <Image src={getImageUrl(img)} fill sizes="80px" className="object-cover" alt="" />
                                </button>
                            ))}
                        </div>

                        <div className="relative flex-1 aspect-[3/4] bg-brand-surface border border-white/5 overflow-hidden group cursor-zoom-in touch-pan-y">
                            <AnimatePresence mode="wait">
                                <MotionImage
                                    key={selectedImage}
                                    src={getImageUrl(selectedImage)}
                                    alt={product.name}
                                    fill
                                    priority
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="object-cover transition-transform duration-700 md:group-hover:scale-110"
                                />
                            </AnimatePresence>

                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 md:hidden">
                                {product.images.map((_, idx: number) => (
                                    <div
                                        key={idx}
                                        className={`w-1.5 h-1.5 rounded-full transition-all ${product.images.indexOf(selectedImage) === idx ? 'bg-brand-volt w-4' : 'bg-white/20'}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* PRODUCT INFO SECTION */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="space-y-2">
                            <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-[0.05em] leading-tight text-white/90">
                                {product.name}
                            </h1>
                            <div className="flex items-center gap-2 text-[12px] font-mono text-brand-volt uppercase tracking-widest">
                                <ShieldCheck size={12} /> Verified Deployment Asset
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="flex flex-row flex-nowrap items-center gap-4 whitespace-nowrap overflow-x-hidden">
                                <span className="text-3xl md:text-4xl font-black italic text-brand-volt tracking-tighter tabular-nums shrink-0">
                                    <FormattedPrice amount={product.price} />
                                </span>
                                {product.oldPrice && (
                                    <div className="flex items-center gap-3 shrink-0">
                                        <span className="text-lg text-white/20 line-through font-mono tabular-nums">
                                            <FormattedPrice amount={product.oldPrice} />
                                        </span>
                                        <span className="bg-brand-volt/10 text-brand-volt text-[11px] font-bold px-2 py-0.5 rounded italic border border-brand-volt/20">
                                            -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% OFF
                                        </span>
                                    </div>
                                )}
                            </div>
                            <p className="text-[12px] font-mono text-white/20 uppercase tracking-widest">100K+ items sold in this sector</p>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-end">
                                <p className="text-[12px] font-mono text-white/40 uppercase tracking-widest">Color: <span className="text-white">{selectedColor.name}</span></p>
                                <StockBadge productId={product._id || product.id || ""} size={selectedSize.label} />
                            </div>
                            <div className="flex gap-3">
                                {product.colors?.map((c) => (
                                    <button
                                        key={c.name}
                                        onClick={() => { setSelectedColor(c); setSelectedImage(c.img); }}
                                        className={`w-10 h-10 border-2 transition-all p-0.5 ring-1 ring-white/20 ${selectedColor.name === c.name ? 'border-brand-volt' : 'border-transparent'}`}
                                    >
                                        <div className="w-full h-full shadow-inner" style={{ backgroundColor: c.hex }} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-end">
                                <p className="text-[12px] font-mono text-white/40 uppercase tracking-widest">Size(Intl)</p>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setIsFitFinderOpen(true)}
                                        className="text-[12px] font-mono text-brand-volt uppercase border-b border-brand-volt/30 hover:border-brand-volt transition-all"
                                    >
                                        Fit_Finder
                                    </button>
                                    <button
                                        onClick={() => setIsSizeGuideOpen(true)}
                                        className="text-[12px] font-mono text-brand-volt uppercase border-b border-brand-volt/30 hover:border-brand-volt transition-all"
                                    >
                                        Size_Guide_Protocol
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {product.sizes?.map((s) => {
                                    const currentStock = checkStock(product._id || product.id || "", s.label);
                                    return (
                                        <button
                                            key={s.label}
                                            disabled={currentStock === 0}
                                            onClick={() => setSelectedSize(s)}
                                            className={`px-5 py-2.5 border text-xs font-mono transition-all ${currentStock === 0 ? 'opacity-20 cursor-not-allowed line-through' : ''} ${selectedSize.label === s.label ? 'bg-white text-black border-white' : 'border-white/10 text-white/40 hover:border-white/30'}`}
                                        >
                                            {s.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* SIDEBAR LOGISTICS SECTION */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="p-6 bg-white/[0.02] border border-white/5 space-y-8 backdrop-blur-sm">
                            <div className="space-y-4 border-b border-white/5 pb-6">
                                <div className="flex items-start gap-3">
                                    <Truck size={16} className="text-brand-volt shrink-0 mt-1" />
                                    <div className="space-y-1">
                                        <p className="text-[12px] font-bold uppercase tracking-wider">Free Shipping</p>
                                        <p className="text-[12px] text-white/40">Orders over LKR 10,000. Est delivery: {getDeliveryEstimate()}</p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => openPolicyModal('returns')}
                                    className="flex items-start gap-3 w-full group text-left"
                                >
                                    <RotateCcw size={16} className="text-brand-volt shrink-0 mt-1" />
                                    <div className="space-y-1 flex-1">
                                        <div className="flex justify-between items-center">
                                            <p className="text-[12px] font-bold uppercase tracking-wider group-hover:text-brand-volt transition-colors">Return & refund policy</p>
                                            <ChevronRight size={14} className="text-white/20 group-hover:text-brand-volt translate-x-0 group-hover:translate-x-1 transition-all" />
                                        </div>
                                        <p className="text-[12px] text-white/40">14-day tactical return enabled</p>
                                    </div>
                                </button>

                                <button
                                    onClick={() => openPolicyModal('security')}
                                    className="flex items-start gap-3 w-full group text-left"
                                >
                                    <ShieldCheck size={16} className="text-brand-volt shrink-0 mt-1" />
                                    <div className="space-y-1 flex-1">
                                        <div className="flex justify-between items-center">
                                            <p className="text-[12px] font-bold uppercase tracking-wider group-hover:text-brand-volt transition-colors">Security & Privacy</p>
                                            <ChevronRight size={14} className="text-white/20 group-hover:text-brand-volt translate-x-0 group-hover:translate-x-1 transition-all" />
                                        </div>
                                        <p className="text-[12px] text-white/40">End-to-end encrypted protocol</p>
                                    </div>
                                </button>
                            </div>

                            <div className="space-y-3">
                                <p className="text-[12px] font-mono text-white/30 uppercase tracking-widest">Quantity</p>
                                <div className="flex items-center w-max border border-white/10">
                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:text-brand-volt transition-colors"><Minus size={14} /></button>
                                    <span className="w-12 text-center font-mono text-sm border-x border-white/10">{quantity}</span>
                                    <button onClick={() => setQuantity(quantity + 1)} className="p-3 hover:text-brand-volt transition-colors"><Plus size={14} /></button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <button
                                    onClick={handleBuyNow}
                                    className="w-full py-5 bg-brand-volt text-black font-black uppercase text-[12px] tracking-widest hover:brightness-110 active:scale-[0.98] transition-all"
                                >
                                    Buy Now
                                </button>
                                <button
                                    onClick={() => {
                                        addToCart({ id: product._id || product.id || "", name: product.name, image: selectedImage, size: selectedSize.label, color: selectedColor.name, quantity: quantity, price: product.price });
                                        toast.success("MANIFEST_UPDATED: ASSET_LOCKED");
                                    }}
                                    className="w-full py-5 border border-white/20 text-white font-black uppercase text-[12px] tracking-widest hover:bg-white hover:text-black transition-all"
                                >
                                    Add to Cart
                                </button>
                            </div>

                            <div className="flex border-t border-white/5 pt-6 gap-2">
                                <button className="flex-1 flex items-center justify-center gap-2 py-3 border border-white/5 text-[12px] font-mono uppercase text-white/40 hover:text-white transition-all">
                                    <Share2 size={14} /> Share
                                </button>
                                <button
                                    onClick={handleWishlist}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 border border-white/5 text-[12px] font-mono uppercase transition-all ${isInWishlist(product._id || product.id || "") ? 'text-brand-volt border-brand-volt/30' : 'text-white/40 hover:text-brand-volt'}`}
                                >
                                    <Heart size={14} className={isInWishlist(product._id || product.id || "") ? 'fill-brand-volt' : ''} /> Wishlist
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* MODAL SECTION */}
                {modalContent && (
                    <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
                        <div
                            className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
                            onClick={() => setModalContent(null)}
                        />
                        <div className="bg-brand-black border border-white/10 p-8 max-w-md w-full space-y-6 shadow-2xl relative z-[301] animate-in zoom-in-95 duration-300">
                            <button
                                onClick={() => setModalContent(null)}
                                className="absolute top-4 right-4 text-white/20 hover:text-brand-volt transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-brand-volt">
                                    <div className="w-10 h-10 border border-brand-volt flex items-center justify-center shadow-[0_0_10px_rgba(223, 7, 21,0.3)]">
                                        <Info size={20} />
                                    </div>
                                    <h3 className="font-black uppercase tracking-widest text-xl italic">{modalContent.title}</h3>
                                </div>

                                <div className="bg-brand-volt/5 border-l-2 border-brand-volt p-4">
                                    <p className="text-brand-volt font-mono text-[12px] uppercase tracking-widest mb-1">Priority Notice:</p>
                                    <p className="text-white font-bold text-sm tracking-wide">{modalContent.highlight}</p>
                                </div>

                                <p className="text-white/60 text-sm leading-relaxed font-mono italic">
                                    {modalContent.desc}
                                </p>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    onClick={() => router.push(modalContent.link)}
                                    className="flex-1 py-4 bg-brand-volt text-black font-black uppercase text-[12px] tracking-[0.2em] hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(223, 7, 21,0.2)]"
                                >
                                    Learn More <ChevronRight size={14} />
                                </button>
                                <button
                                    onClick={() => setModalContent(null)}
                                    className="flex-1 py-4 border border-white/10 text-white font-black uppercase text-[12px] tracking-[0.2em] hover:bg-white hover:text-black transition-all"
                                >
                                    Dismiss
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-32">
                    <header className="mb-12">
                        <span className="font-mono text-[12px] tracking-[0.5em] text-brand-volt uppercase mb-2 block">Tactical_Acquisitions</span>
                        <h2 className="text-3xl font-black italic uppercase">Complete_The_Look</h2>
                    </header>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {relatedProducts.map((p, idx) => (
                            <ProductCard key={p._id || p.id} product={p} index={idx} />
                        ))}
                    </div>
                </div>

                {relatedProducts.length > 0 && (
                    <BundleSection
                        currentProduct={product}
                        bundleProduct={relatedProducts[0]}
                    />
                )}

                <div className="mt-32"><ReviewSection productId={product._id || product.id || ""} /></div>

                <SizeGuide isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
                <FitFinder
                    isOpen={isFitFinderOpen}
                    onClose={() => setIsFitFinderOpen(false)}
                    onResult={(size) => {
                        const found = product.sizes?.find((s) => s.label === size);
                        if (found) setSelectedSize(found);
                    }}
                />
                <StickyAddToCart
                    isVisible={isStickyVisible}
                    product={product}
                    onAdd={() => {
                        addToCart({ id: product._id || product.id || "", name: product.name, image: selectedImage, size: selectedSize.label, color: selectedColor.name, quantity: 1, price: product.price });
                        toast.success("MANIFEST_UPDATED");
                    }}
                />
            </main>
        </div>
    );
}
