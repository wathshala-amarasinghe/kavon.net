"use client";

import { products } from "@/data/products";

export function useAIAssistant() {
    const analyzeAndSearch = (input: string) => {
        const query = input.toLowerCase();

        // 1. INTENT DETECTION (FAQ)
        if (query.includes("shipping") || query.includes("delivery")) {
            return {
                type: 'faq',
                content: "We ship all orders via secure carriers. Domestic delivery takes 1-3 days, while international shipping takes 7-14 days.",
                found: true
            };
        }
        if (query.includes("return") || query.includes("exchange") || query.includes("refund")) {
            return {
                type: 'faq',
                content: "You can return or exchange any unworn items within 14 days of purchase. Just contact us at support@kavon.com to start the process.",
                found: true
            };
        }
        if (query.includes("size") || query.includes("fit")) {
            return {
                type: 'faq',
                content: "Most of our items are designed with an oversized fit. If you prefer a more standard look, we recommend ordering one size smaller than your usual choice.",
                found: true
            };
        }

        // 2. EXTRACTION PROTOCOL (Enhanced)
        const colors = ["black", "white", "grey", "gray", "volt", "crimson", "blue", "olive", "sand", "charcoal"];
        const categories = ["oversized", "hoodie", "pant", "streetwear", "limited", "shirt", "tee", "cargo", "jacket", "accessory"];

        const detectedColor = colors.find(c => query.includes(c));
        const detectedCategory = categories.find(cat => query.includes(cat));
        const priceMatch = query.match(/(?:under|below|less than|max|budget)\s?(\d+)/);
        const maxPrice = priceMatch ? parseInt(priceMatch[1]) : null;

        // 3. FILTER ENGINE (Fixed Logic)
        const results = products.filter(p => {
            const matchColor = detectedColor ? p.colors.some(c => c.name.toLowerCase().includes(detectedColor)) : true;
            const matchCategory = detectedCategory ? p.category.toLowerCase().includes(detectedCategory) : true;
            const matchPrice = maxPrice ? p.price <= maxPrice : true;

            // Search by name logic: 
            // If we didn't detect a specific category, check if the query matches the product name or tags
            // We exclude detected colors from the name search to avoid redundant matches
            const nameSearchTerm = query.replace(detectedColor || "", "").trim();
            const matchName = nameSearchTerm ? (
                p.name.toLowerCase().includes(nameSearchTerm) || 
                p.category.toLowerCase().includes(nameSearchTerm) ||
                p.tag?.toLowerCase().includes(nameSearchTerm)
            ) : true;

            return matchColor && matchCategory && matchPrice && matchName;
        });

        return {
            type: 'search',
            results: results.slice(0, 3), // Limit to top 3 for chat UI
            found: results.length > 0
        };
    };

    return { analyzeAndSearch };
}