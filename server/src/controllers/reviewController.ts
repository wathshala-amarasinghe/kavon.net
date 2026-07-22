import { Request, Response } from 'express';
import Review from '../models/Review';
import Product from '../models/Product';
import { AuthRequest } from '../middleware/authMiddleware';
import Order from '../models/Order';
import mongoose from 'mongoose';

// @desc    Get reviews for a product
// @route   GET /api/reviews/:productId
export const getProductReviews = async (req: Request, res: Response) => {
    try {
        if (!mongoose.isValidObjectId(req.params.productId)) {
            return res.status(400).json({ message: 'Invalid product ID' });
        }
        const reviews = await Review.find({ product: req.params.productId }).sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req: AuthRequest, res: Response) => {
    try {
        const { productId, rating, comment, image } = req.body;

        if (!mongoose.isValidObjectId(productId)) {
            return res.status(400).json({ message: 'Invalid product ID' });
        }

        const numericRating = Number(rating);
        const cleanComment = typeof comment === 'string' ? comment.trim() : '';
        if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }
        if (cleanComment.length < 3 || cleanComment.length > 1000) {
            return res.status(400).json({ message: 'Review must contain 3 to 1000 characters' });
        }

        const hasDeliveredPurchase = await Order.exists({
            user: req.user?._id,
            status: 'Delivered',
            'orderItems.product': productId,
        });
        if (!hasDeliveredPurchase) {
            return res.status(403).json({ message: 'Only customers with a delivered order can review this product' });
        }

        const existingReview = await Review.findOne({ user: req.user?._id, product: productId });
        if (existingReview) {
            return res.status(409).json({ message: 'You have already reviewed this product' });
        }

        const review = await Review.create({
            user: req.user?._id,
            userName: req.user?.name,
            product: productId,
            rating: numericRating,
            comment: cleanComment,
            image: typeof image === 'string' && image.startsWith('https://') ? image : undefined,
            verifiedPurchase: true,
        });

        // Update Product Rating
        const productReviews = await Review.find({ product: productId });
        const numReviews = productReviews.length;
        const ratingSum = productReviews.reduce((acc, item) => item.rating + acc, 0);
        const avgRating = ratingSum / numReviews;

        await Product.findByIdAndUpdate(productId, {
            rating: avgRating,
            numReviews: numReviews
        });

        res.status(201).json(review);
    } catch (error: any) {
        if (error?.code === 11000) {
            return res.status(409).json({ message: 'You have already reviewed this product' });
        }
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private/Admin
export const deleteReview = async (req: Request, res: Response) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid review ID' });
        }
        const review = await Review.findById(req.params.id);

        if (review) {
            const productId = review.product;
            await review.deleteOne();

            // Recalculate Product Rating
            const productReviews = await Review.find({ product: productId });
            const numReviews = productReviews.length;
            const ratingSum = productReviews.reduce((acc, item) => item.rating + acc, 0);
            const avgRating = numReviews > 0 ? ratingSum / numReviews : 0;

            await Product.findByIdAndUpdate(productId, {
                rating: avgRating,
                numReviews: numReviews
            });

            res.json({ message: 'Intelligence report removed' });
        } else {
            res.status(404).json({ message: 'Review not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
