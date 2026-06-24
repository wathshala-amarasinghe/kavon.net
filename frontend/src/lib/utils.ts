import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Standard Tailwind class merger
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Highlighting Engine: Splits text into parts based on search query
 */
export function getHighlightedParts(text: string, query: string) {
    if (!query.trim()) return [{ text, isMatch: false }];

    // Escape special characters in query for Regex
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedQuery})`, 'gi');
    const parts = text.split(regex);

    return parts.map(part => ({
        text: part,
        isMatch: regex.test(part)
    }));
}

/**
 * Image URL Resolver: Ensures absolute URLs for Next.js Image component
 */
export function getImageUrl(url: string | undefined | null) {
    if (!url) return "/img/Logo-1.jpeg";
    if (url.startsWith('http')) return url;
    
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
    
    if (url.startsWith('/uploads')) {
        return `${backendUrl}${url}`;
    }
    
    if (url.startsWith('uploads')) {
        return `${backendUrl}/${url}`;
    }

    return url;
}