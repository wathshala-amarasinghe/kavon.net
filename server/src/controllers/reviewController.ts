import { Request, Response } from 'express';
import Review from '../models/Review';
import Product from '../models/Product';
import { AuthRequest } from '../middleware/authMiddleware';

// @desc    Get reviews for a product
// @route   GET /api/reviews/:productId
export const getProductReviews = async (req: Request, res: Response) => {
    try {
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

        const review = await Review.create({
            user: req.user?._id,
            userName: req.user?.name,
            product: productId,
            rating: Number(rating),
            comment,
            image
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
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private/Admin
export const deleteReview = async (req: Request, res: Response) => {
    try {
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
