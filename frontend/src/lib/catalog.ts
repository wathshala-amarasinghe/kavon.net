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
    { name: 'Oversized', href: '/shop?category=Oversized' },
    { name: 'T-Shirts', href: '/shop?category=T-Shirts' },
    { name: 'Hoodies', href: '/shop?category=Hoodies' },
    { name: 'Essentials', href: '/shop?category=Essentials' },
    { name: 'Limited Edition', href: '/shop?category=Limited%20Edition' },
    { name: 'Accessories', href: '/shop?category=Accessories' },
    { name: 'Best Sellers', href: '/shop?isBestSeller=true' },
] as const;

