export interface Product {
    id: string;
    _id?: string;
    name: string;
    price: number;
    oldPrice?: number;
    category: string;
    image: string;
    images: string[];
    hoverImage?: string;
    tag: string;
    inStock: boolean;
    createdAt: string; // Required for Newest sorting
    rating: number;    // Required for Popular sorting
    sizes: { label: string; stock: number; }[];
    colors: {
        name: string;
        hex: string;
        img: string;
        stock: number;
    }[];
}

export const products: Product[] = [
    {
        id: "vyr-001",
        name: "OVERSIZED TEE // V1",
        price: 7500,
        oldPrice: 18000,
        category: "Oversized",
        image: "/images/products/product_7.jpeg",
        images: ["/images/products/product_7.jpeg", "/images/products/product_2.jpeg"],
        tag: "NEW",
        inStock: true,
        createdAt: "2026-04-01",
        rating: 4.8,
        sizes: [
            { label: "S", stock: 5 },
            { label: "M", stock: 12 },
            { label: "L", stock: 0 },
            { label: "XL", stock: 8 }
        ],
        colors: [
            { name: "Phantom Black", hex: "#000000", img: "/images/products/product_7.jpeg", stock: 10 },
            { name: "Volt Green", hex: "#df0715", img: "/images/products/product_2.jpeg", stock: 5 }
        ]
    },
    {
        id: "vyr-002",
        name: "VOID HOODIE // ARCHIVE",
        price: 12500,
        oldPrice: 28000,
        category: "Limited Edition",
        image: "/images/products/product_8.jpeg",
        images: ["/images/products/product_8.jpeg", "/images/products/product_1.jpeg"],
        tag: "LIMITED",
        inStock: true,
        createdAt: "2026-03-15",
        rating: 4.9,
        sizes: [
            { label: "M", stock: 3 },
            { label: "L", stock: 0 }
        ],
        colors: [
            { name: "Deep Charcoal", hex: "#1a1a1a", img: "/images/products/product_8.jpeg", stock: 3 }
        ]
    },
    {
        id: "vyr-003",
        name: "Japanese Cherry Blossom Calligraphy Print Oversized T-Shirt",
        price: 7500,
        oldPrice: 25000,
        category: "Streetwear",
        image: "/images/products/product_7.jpeg",
        images: ["/images/products/product_7.jpeg", "/images/products/product_2.jpeg", "/images/products/product_8.jpeg", "/images/products/product_1.jpeg", "/images/products/product_3.jpeg"],
        tag: "NEW",
        inStock: true,
        createdAt: "2026-04-05",
        rating: 4.5,
        sizes: [
            { label: "S", stock: 5 },
            { label: "M", stock: 12 },
            { label: "L", stock: 0 },
            { label: "XL", stock: 8 },
            { label: "XXL", stock: 3 }
        ],
        colors: [
            { name: "Phantom Black", hex: "#000000", img: "/images/products/product_7.jpeg", stock: 12 },
            { name: "Slate Grey", hex: "#4a4a4a", img: "/images/products/product_2.jpeg", stock: 8 },
            { name: "Crimson Red", hex: "#8b0000", img: "/images/products/product_8.jpeg", stock: 15 }
        ]
    }
];
