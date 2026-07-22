import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Wishlist from '../models/Wishlist';
import Product from '../models/Product';
import mongoose from 'mongoose';

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
export const getWishlist = async (req: AuthRequest, res: Response) => {
    try {
        let wishlist = await Wishlist.findOne({ user: req.user?._id }).populate('products');
        
        if (!wishlist) {
            wishlist = await Wishlist.create({ user: req.user?._id, products: [] });
        }
        
        res.json(wishlist.products.filter((p: any) => p !== null));
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Toggle product in wishlist
// @route   POST /api/wishlist/toggle
// @access  Private
export const toggleWishlist = async (req: AuthRequest, res: Response) => {
    try {
        const { productId } = req.body;

        if (!mongoose.isValidObjectId(productId)) {
            return res.status(400).json({ message: 'Invalid product ID' });
        }

        if (!await Product.exists({ _id: productId })) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        let wishlist = await Wishlist.findOne({ user: req.user?._id });
        
        if (!wishlist) {
            wishlist = new Wishlist({ user: req.user?._id, products: [productId] });
        } else {
            const index = wishlist.products.findIndex((id: mongoose.Types.ObjectId) => id.toString() === String(productId));
            if (index > -1) {
                // Remove if exists
                wishlist.products.splice(index, 1);
            } else {
                // Add if not exists
                wishlist.products.push(productId);
            }
        }
        
        await wishlist.save();
        
        // Return the updated populated list
        const updatedWishlist = await Wishlist.findOne({ user: req.user?._id }).populate('products');
        res.json(updatedWishlist?.products.filter((p: any) => p !== null) || []);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
