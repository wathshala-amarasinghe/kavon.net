import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Wishlist from '../models/Wishlist';

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
        
        let wishlist = await Wishlist.findOne({ user: req.user?._id });
        
        if (!wishlist) {
            wishlist = new Wishlist({ user: req.user?._id, products: [productId] });
        } else {
            const index = wishlist.products.indexOf(productId);
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
