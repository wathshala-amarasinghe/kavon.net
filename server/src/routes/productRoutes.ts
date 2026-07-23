import express from "express";
import mongoose from "mongoose";
import Product from "../models/Product";
import { protect, admin } from "../middleware/authMiddleware";

const router = express.Router();

const normalizeProductPayload = (body: any) => {
    const sizes = Array.isArray(body.sizes)
        ? body.sizes.map((size: any) => ({
            label: String(size.label || '').trim().toUpperCase(),
            stock: Math.max(0, Number(size.stock) || 0),
        })).filter((size: any) => size.label)
        : [];
    const images = Array.isArray(body.images)
        ? body.images.map((image: any) => String(image || '').trim()).filter(Boolean)
        : [];
    const submittedColors = Array.isArray(body.colors)
        ? body.colors.map((color: any) => ({
            name: String(color.name || '').trim() || 'Default',
            hex: String(color.hex || '').trim() || '#000000',
            img: String(color.img || '').trim(),
        })).filter((color: any) => color.name)
        : [];
    const colors = submittedColors.length > 0
        ? submittedColors
        : [{ name: 'Default', hex: '#000000', img: '' }];

    return {
        name: String(body.name || '').trim(),
        description: String(body.description || '').trim(),
        price: Number(body.price),
        category: String(body.category || '').trim(),
        gender: String(body.gender || 'Unisex'),
        images,
        colors,
        sizes,
        stock: sizes.reduce((total: number, size: any) => total + size.stock, 0),
        isNewDrop: body.isNewDrop !== false,
    };
};

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
router.post("/", protect, admin, async (req, res) => {
    try {
        const product = await Product.create(normalizeProductPayload(req.body));
        res.status(201).json(product);
    } catch (error: any) {
        console.error("Product creation failed:", error);

        if (error?.name === "ValidationError") {
            res.status(400).json({
                message: Object.values(error.errors)
                    .map((item: any) => item.message)
                    .join(", "),
            });
            return;
        }

        if (error?.code === 11000) {
            res.status(409).json({ message: "A product with these details already exists" });
            return;
        }

        res.status(500).json({
            message: error?.message || "Failed to create product",
        });
    }
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
router.put("/:id", protect, admin, async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }
        const product = await Product.findByIdAndUpdate(req.params.id, normalizeProductPayload(req.body), {
            new: true,
            runValidators: true,
        });
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error: any) {
        console.error("Product update failed:", error);

        if (error?.name === "ValidationError") {
            res.status(400).json({
                message: Object.values(error.errors)
                    .map((item: any) => item.message)
                    .join(", "),
            });
            return;
        }

        res.status(500).json({
            message: error?.message || "Failed to update product",
        });
    }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
router.delete("/:id", protect, admin, async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }
        const product = await Product.findByIdAndDelete(req.params.id);
        if (product) {
            res.json({ message: "Product removed from manifest" });
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Failed to delete product" });
    }
});

// @desc    Get all products with filtering, searching, and pagination
// @route   GET /api/products
router.get("/", async (req, res) => {
    try {
        const { 
            category, 
            gender, 
            q, 
            minPrice, 
            maxPrice, 
            sort, 
            page = 1, 
            limit = 15, 
            sizes, 
            colors,
            isNewDrop,
            isBestSeller,
            inStock
        } = req.query;

        const query: any = {};

        // 1. Search Logic
        if (q) {
            query.name = { $regex: escapeRegex(String(q).slice(0, 100)), $options: "i" };
        }

        // 2. Category Filter
        if (category && category !== "All") {
            query.category = category;
        }

        // 2.1 Gender Filter
        if (gender && gender !== "All") {
            query.gender = gender;
        }

        // 3. Price Filter
        if (minPrice || maxPrice) {
            query.price = {};
            const parsedMinPrice = Number(minPrice);
            const parsedMaxPrice = Number(maxPrice);
            if (minPrice && Number.isFinite(parsedMinPrice)) query.price.$gte = Math.max(0, parsedMinPrice);
            if (maxPrice && Number.isFinite(parsedMaxPrice)) query.price.$lte = Math.max(0, parsedMaxPrice);
            if (Object.keys(query.price).length === 0) delete query.price;
        }

        // 4. Attribute Filtering (Sizes & Colors)
        if (sizes) {
            const sizeList = String(sizes).split(",").map((size) => size.trim().toUpperCase()).filter(Boolean);
            if (sizeList.length > 0) {
                query.sizes = {
                    $elemMatch: {
                        label: { $in: sizeList },
                        stock: { $gt: 0 },
                    },
                };
            }
        }

        if (colors) {
            const colorList = String(colors).split(",").map((color) => color.trim()).filter(Boolean);
            if (colorList.length > 0) query["colors.name"] = { $in: colorList };
        }

        if (isNewDrop === 'true') {
            query.isNewDrop = true;
        }

        if (isBestSeller === 'true') {
            query.salesCount = { $gt: 0 }; // Temporarily lowering to show items easily
        }

        if (inStock === 'true') {
            query.sizes = query.sizes || { $elemMatch: { stock: { $gt: 0 } } };
        }

        // 4. Sorting Logic
        let sortQuery: any = isBestSeller === 'true'
            ? { salesCount: -1, createdAt: -1 }
            : { createdAt: -1 };
        if (sort === "price_asc") sortQuery = { price: 1 };
        else if (sort === "price_desc") sortQuery = { price: -1 };
        else if (sort === "popular") sortQuery = { salesCount: -1, rating: -1 };

        // 5. Execution with Pagination
        const parsedPage = Math.max(1, Number(page) || 1);
        const parsedLimit = Math.min(100, Math.max(1, Number(limit) || 15));
        const skip = (parsedPage - 1) * parsedLimit;
        
        const [products, total, facetResult] = await Promise.all([
            Product.find(query)
                .sort(sortQuery)
                .skip(skip)
                .limit(parsedLimit),
            Product.countDocuments(query),
            Product.aggregate([{
                $facet: {
                    categories: [
                        { $match: { category: { $type: "string", $ne: "" } } },
                        { $group: { _id: "$category" } },
                        { $sort: { _id: 1 } },
                    ],
                    genders: [
                        { $match: { gender: { $type: "string", $ne: "" } } },
                        { $group: { _id: "$gender" } },
                        { $sort: { _id: 1 } },
                    ],
                    sizes: [
                        { $unwind: "$sizes" },
                        { $match: { "sizes.label": { $type: "string", $ne: "" }, "sizes.stock": { $gt: 0 } } },
                        { $group: { _id: "$sizes.label" } },
                        { $sort: { _id: 1 } },
                    ],
                    colors: [
                        { $unwind: "$colors" },
                        { $match: { "colors.name": { $type: "string", $ne: "" } } },
                        { $group: { _id: "$colors.name", hex: { $first: "$colors.hex" } } },
                        { $sort: { _id: 1 } },
                    ],
                    price: [
                        { $group: { _id: null, max: { $max: "$price" } } },
                    ],
                },
            }]),
        ]);
        const facetData = facetResult[0] || {};
        const catalogMaxPrice = Number(facetData.price?.[0]?.max) || 0;

        res.json({
            products,
            total,
            page: parsedPage,
            pages: Math.ceil(total / parsedLimit),
            facets: {
                categories: (facetData.categories || []).map((item: any) => item._id),
                genders: (facetData.genders || []).map((item: any) => item._id),
                sizes: (facetData.sizes || []).map((item: any) => item._id),
                colors: (facetData.colors || []).map((item: any) => ({
                    name: item._id,
                    hex: item.hex || "#000000",
                })),
                maxPrice: Math.max(1000, Math.ceil(catalogMaxPrice / 1000) * 1000),
            },
        });
    } catch (error) {
        console.error("Database fetch error:", error);
        res.status(500).json({
            message: "Failed to fetch products",
            error: (error as Error).message
        });
    }
});

// @desc    Get single product by ID
// @route   GET /api/products/:id
router.get("/:id", async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch product" });
    }
});

export default router;
