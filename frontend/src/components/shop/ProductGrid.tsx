"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductCard } from "../collections/productCard";

import { Product } from "@/data/products";

interface ProductGridProps {
    products: Product[];
    viewMode: "grid" | "list";
}

export function ProductGrid({ products, viewMode }: ProductGridProps) {
    return (
        <motion.div
            layout
            className={`relative ${viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
                : "flex flex-col gap-6"
            }`}
        >
            <AnimatePresence mode="popLayout">
                {products.map((product, index) => (
                    <ProductCard
                        key={product._id}
                        product={product}
                        index={index}
                        layout={viewMode}
                    />
                ))}
            </AnimatePresence>
        </motion.div>
    );
}