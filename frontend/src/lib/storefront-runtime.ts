import type { CatalogProduct } from '@/types/product';

export interface RuntimeCartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    size: string;
    image: string;
    color?: string;
    isBundle?: boolean;
}

export interface RuntimeWishlistItem {
    id: string;
    _id?: string;
    name: string;
    price: number;
    image: string;
    images?: string[];
    sizes?: CatalogProduct['sizes'];
    colors?: CatalogProduct['colors'];
    stock?: number;
    size?: string;
}

const asRecord = (value: unknown): Record<string, unknown> | null => (
    value !== null && typeof value === 'object' ? value as Record<string, unknown> : null
);

export const getProductId = (product: Pick<CatalogProduct, '_id' | 'id'>) => (
    String(product._id || product.id || '').trim()
);

export const getProductImage = (
    product: Pick<CatalogProduct, 'images' | 'image'>
) => String(product.images?.find(Boolean) || product.image || '').trim();

export const getFirstAvailableSize = (
    product: Pick<CatalogProduct, 'sizes'>
) => product.sizes?.find((size) => Number(size.stock) > 0)?.label || null;

export const isProductAvailable = (
    product: Pick<CatalogProduct, 'sizes' | 'stock' | 'inStock'>
) => {
    const sizedStock = product.sizes?.reduce(
        (total, size) => total + Math.max(0, Number(size.stock) || 0),
        0
    );
    const availableStock = product.sizes?.length
        ? sizedStock
        : Number(product.stock) || 0;

    return product.inStock !== false
        && Number(availableStock) > 0
        && Boolean(getFirstAvailableSize(product));
};

export const normalizeCartItems = (value: unknown): RuntimeCartItem[] => {
    if (!Array.isArray(value)) return [];

    return value.slice(0, 100).flatMap((entry) => {
        const item = asRecord(entry);
        if (!item) return [];

        const id = String(item.id || '').trim();
        const name = String(item.name || '').trim();
        const size = String(item.size || '').trim().toUpperCase();
        const image = String(item.image || '').trim();
        const price = Number(item.price);
        const quantity = Math.min(20, Math.max(1, Math.trunc(Number(item.quantity) || 1)));
        const color = String(item.color || '').trim() || undefined;

        if (!id || !name || !size || !Number.isFinite(price) || price < 0) return [];

        return [{
            id,
            name,
            size,
            image,
            price,
            quantity,
            color,
            isBundle: Boolean(item.isBundle),
        }];
    });
};

export const normalizeWishlistItem = (value: unknown): RuntimeWishlistItem | null => {
    const item = asRecord(value);
    if (!item) return null;

    const id = String(item._id || item.id || '').trim();
    const name = String(item.name || '').trim();
    const price = Number(item.price);
    const images = Array.isArray(item.images)
        ? item.images.map((image) => String(image || '').trim()).filter(Boolean)
        : [];
    const image = String(item.image || images[0] || '').trim();

    if (!id || !name || !Number.isFinite(price) || price < 0) return null;

    const normalized: RuntimeWishlistItem = {
        id,
        name,
        price,
        image,
        images,
    };

    if (String(item._id || '').trim()) normalized._id = String(item._id);
    if (Array.isArray(item.sizes)) normalized.sizes = item.sizes as CatalogProduct['sizes'];
    if (Array.isArray(item.colors)) normalized.colors = item.colors as CatalogProduct['colors'];
    if (Number.isFinite(Number(item.stock))) normalized.stock = Number(item.stock);
    if (String(item.size || '').trim()) normalized.size = String(item.size).trim().toUpperCase();

    return normalized;
};

export const normalizeWishlistItems = (value: unknown): RuntimeWishlistItem[] => (
    Array.isArray(value)
        ? value.map(normalizeWishlistItem).filter((item): item is RuntimeWishlistItem => item !== null)
        : []
);

export const sameCartLine = (
    left: Pick<RuntimeCartItem, 'id' | 'size' | 'color' | 'isBundle'>,
    right: Pick<RuntimeCartItem, 'id' | 'size' | 'color' | 'isBundle'>
) => left.id === right.id
    && left.size === right.size
    && (left.color || 'Default') === (right.color || 'Default')
    && Boolean(left.isBundle) === Boolean(right.isBundle);

export const cartsAreEqual = (left: RuntimeCartItem[], right: RuntimeCartItem[]) => (
    JSON.stringify(left) === JSON.stringify(right)
);

export const getSafeRedirect = (value: string | null | undefined, fallback = '/') => {
    if (!value) return fallback;

    const candidate = value.trim().startsWith('/') ? value.trim() : `/${value.trim()}`;
    if (
        candidate === '/'
        || candidate.startsWith('//')
        || candidate.includes('\\')
        || /^[a-z][a-z\d+.-]*:/i.test(candidate.slice(1))
    ) {
        return fallback;
    }

    return candidate;
};
