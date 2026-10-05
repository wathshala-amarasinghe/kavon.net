import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Standard Tailwind class merger
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
<<<<<<< HEAD
 * Splits text into parts based on search query for highlighting
=======
 * Highlighting Engine: Splits text into parts based on search query
>>>>>>> 0046e567ddbf60b0a1c0c1c6fa8ee5d2dd390c70
 */
export function getHighlightedParts(text: string, query: string) {
    if (!query.trim()) return [{ text, isMatch: false }];

    // Escape special characters in query for Regex
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedQuery})`, 'gi');
    const parts = text.split(regex);

    return parts.map(part => ({
        text: part,
        isMatch: part.toLocaleLowerCase() === query.trim().toLocaleLowerCase()
    }));
}

/**
<<<<<<< HEAD
 * Ensures absolute URLs for Next.js Image component
=======
 * Image URL Resolver: Ensures absolute URLs for Next.js Image component
>>>>>>> 0046e567ddbf60b0a1c0c1c6fa8ee5d2dd390c70
 */
export function getImageUrl(url: string | undefined | null) {
    if (!url) return "/logo/logo-1.png";
    if (url.startsWith('http')) return url;
    
    const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL;
    const backendUrl = (
        process.env.NEXT_PUBLIC_BACKEND_URL ||
        configuredApiUrl?.replace(/\/api\/?$/, '') ||
<<<<<<< HEAD
        (process.env.NODE_ENV === 'development' ? "http://localhost:5000" : "")
=======
        "http://localhost:5000"
>>>>>>> 0046e567ddbf60b0a1c0c1c6fa8ee5d2dd390c70
    ).replace(/\/$/, '');
    
    if (url.startsWith('/uploads')) {
        return `${backendUrl}${url}`;
    }
    
    if (url.startsWith('uploads')) {
        return `${backendUrl}/${url}`;
    }

    return url;
}
