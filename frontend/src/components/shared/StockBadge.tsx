"use client";

import { useInventory } from "@/context/InventoryContext";

export function StockBadge({
    productId,
    size,
    fallbackStock = 0,
    minimal = false,
}: {
    productId: string;
    size: string;
    fallbackStock?: number;
    minimal?: boolean;
}) {
    const { checkStock } = useInventory();
    const stock = Math.max(0, checkStock(productId, size) ?? fallbackStock);

    if (stock === 0) {
        return (
            <span className="text-[11px] font-mono text-red-500 uppercase tracking-tighter">
                Sold Out
            </span>
        );
    }

    if (stock < 5) {
        return (
            <span className="text-[11px] font-mono text-orange-500 uppercase tracking-tighter animate-pulse">
                Only {stock} Left
            </span>
        );
    }

    if (minimal) return null;

    return (
        <span className="text-[11px] font-mono text-brand-volt/60 uppercase tracking-tighter">
            {stock} In Stock
        </span>
    );
}
