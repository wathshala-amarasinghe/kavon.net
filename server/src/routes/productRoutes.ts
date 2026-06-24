import express from "express";
import Product from "../models/Product";
import { protect, admin } from "../middleware/authMiddleware";

const router = express.Router();

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
router.post("/", protect, admin, async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: "Failed to create product" });
    }
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
router.put("/:id", protect, admin, async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Failed to update product" });
    }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
router.delete("/:id", protect, admin, async (req, res) => {
    try {
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
            isBestSeller
        } = req.query;

        const query: any = {};

        // 1. Search Logic
        if (q) {
            query.name = { $regex: q, $options: "i" };
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
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        // 4. Attribute Filtering (Sizes & Colors)
        if (sizes) {
            const sizeList = (sizes as string).split(",");
            query["sizes.label"] = { $in: sizeList };
        }

        if (colors) {
            const colorList = (colors as string).split(",");
            query["colors.name"] = { $in: colorList };
        }

        if (isNewDrop === 'true') {
            query.isNewDrop = true;
        }

        if (isBestSeller === 'true') {
            query.salesCount = { $gt: 0 }; // Temporarily lowering to show items easily
        }

        // 4. Sorting Logic
        let sortQuery: any = { createdAt: -1 };
        if (sort === "price_asc") sortQuery = { price: 1 };
        else if (sort === "price_desc") sortQuery = { price: -1 };
        else if (sort === "popular") sortQuery = { rating: -1 };

        // 5. Execution with Pagination
        const skip = (Number(page) - 1) * Number(limit);
        
        const products = await Product.find(query)
            .sort(sortQuery)
            .skip(skip)
            .limit(Number(limit));

        const total = await Product.countDocuments(query);

        res.json({
            products,
            total,
            page: Number(page),
            pages: Math.ceil(total / Number(limit))
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