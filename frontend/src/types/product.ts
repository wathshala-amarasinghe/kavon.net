export interface CatalogProduct {
    _id?: string;
    id?: string;
    name: string;
    description?: string;
    price: number;
    oldPrice?: number;
    category: string;
    gender?: "Men" | "Women" | "Child" | "Unisex";
    images: string[];
    colors: {
        name: string;
        hex: string;
        img: string;
        stock?: number;
    }[];
    sizes: {
        label: string;
        stock: number;
    }[];
    stock?: number;
    inStock?: boolean;
    image?: string;
    tag?: string;
    rating?: number;
    isNewDrop?: boolean;
    salesCount?: number;
    tacticalDropDateEnd?: string;
    tacticalDropDiscount?: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface CatalogFacets {
    categories: string[];
    genders: string[];
    sizes: string[];
    colors: {
        name: string;
        hex: string;
    }[];
    maxPrice: number;
}
