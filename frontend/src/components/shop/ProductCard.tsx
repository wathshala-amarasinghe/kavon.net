"use client";
import { motion } from "framer-motion";
import { Plus, Eye, Heart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import toast from "react-hot-toast";

import { Product } from "@/data/products";
import { FormattedPrice } from "@/components/ui/FormattedPrice";

export function ProductCard({ product, index, onQuickView }: { product: Product; index: number; onQuickView?: (p: Product) => void }) {
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const isFavorite = isInWishlist(product.id);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        addToCart({ ...product, quantity: 1, size: 'M' });

        toast.success(`${product.name} ADDED TO CART`, {
            style: {
                borderRadius: '0px',
                background: '#000',
                color: '#df0715',
                border: '1px solid #df0715',
                fontSize: '12px',
                fontFamily: 'monospace',
                fontWeight: 'bold',
                letterSpacing: '0.1em'
            },
        });
    };

    const handleWishlistToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        toggleWishlist({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image
        });

        if (!isFavorite) {
            toast.success("ADDED TO WISHLIST", {
                style: {
                    borderRadius: '0px',
                    background: '#000',
                    color: '#fff',
                    border: '1px solid #fff',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    fontWeight: 'bold',
                    letterSpacing: '0.1em'
                },
            });
        }
    };

    return (
        <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="group">
            <div className="relative aspect-[3/4] bg-brand-surface overflow-hidden border border-white/5 mb-6">
                {/* Image Swap Logic */}
                { }
<img src={product.image} className="absolute inset-0 w-full h-full object-cover grayscale-[20%] group-hover:opacity-0 group-hover:scale-110 transition-all duration-1000 ease-out" alt={product.name} />
                { }
<img src={product.hoverImage} className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-all duration-1000 ease-out scale-110 group-hover:scale-100" alt={`${product.name} back`} />

                <div className="absolute top-4 left-4 z-20 flex flex-col gap-1">
                    <span className="bg-brand-volt text-black text-[11px] font-black px-3 py-1 uppercase tracking-widest">{product.tag}</span>
                </div>

                {product.inStock && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 z-20">
                        <button onClick={handleAddToCart} className="p-4 bg-white text-black hover:bg-brand-volt transition-all"><Plus size={18} /></button>
                        <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); onQuickView?.(product); }} className="p-4 bg-white text-black hover:bg-brand-volt transition-all"><Eye size={18} /></button>
                        <button onClick={handleWishlistToggle} className={`p-4 transition-all ${isFavorite ? 'bg-brand-volt text-black' : 'bg-white text-black hover:bg-brand-volt'}`}>
                            <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
                        </button>
                    </div>
                )}
            </div>
            <h3 className="text-white font-black text-sm tracking-[0.15em] uppercase mb-1.5">{product.name}</h3>
            <div className="text-brand-volt font-mono text-base font-bold italic tracking-wider">
                <FormattedPrice amount={product.price} />
            </div>
        </motion.div>
    );
}