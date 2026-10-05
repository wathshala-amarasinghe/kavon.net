export const PRODUCT_CATEGORIES = [
    'Oversized',
    'T-Shirts',
    'Hoodies',
    'Tops',
    'Bottoms',
    'Outerwear',
    'Essentials',
    'Streetwear',
    'Limited Edition',
    'Accessories',
] as const;

export const COLLECTION_NAV_LINKS = [
    { name: 'Shop All', href: '/shop' },
    { name: 'New Drops', href: '/shop?isNewDrop=true' },
    ...PRODUCT_CATEGORIES.map((category) => ({
        name: category,
        href: `/shop?category=${encodeURIComponent(category)}`,
    })),
    { name: 'Best Sellers', href: '/shop?isBestSeller=true' },
];
