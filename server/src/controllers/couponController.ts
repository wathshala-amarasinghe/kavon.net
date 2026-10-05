import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Coupon from '../models/Coupon';
import mongoose from 'mongoose';

const normalizeCoupon = (body: any) => {
    const code = typeof body.code === 'string' ? body.code.trim().toUpperCase() : '';
    const discountType = body.discountType;
    const discountValue = Number(body.discountValue);
    const expiryDate = new Date(body.expiryDate);
    const usageLimit = Number(body.usageLimit || 0);
    const minOrderAmount = Number(body.minOrderAmount || 0);

    if (!/^[A-Z0-9_-]{3,32}$/.test(code)) {
        throw new Error('Coupon code must be 3-32 letters, numbers, hyphens, or underscores');
    }
    if (!['Percentage', 'Fixed'].includes(discountType)) {
        throw new Error('Invalid discount type');
    }
    if (!Number.isFinite(discountValue) || discountValue <= 0) {
        throw new Error('Discount value must be greater than zero');
    }
    if (discountType === 'Percentage' && discountValue > 100) {
        throw new Error('Percentage discount cannot exceed 100');
    }
    if (Number.isNaN(expiryDate.getTime())) {
        throw new Error('A valid expiry date is required');
    }
    if (!Number.isInteger(usageLimit) || usageLimit < 0) {
        throw new Error('Usage limit must be a non-negative whole number');
    }
    if (!Number.isFinite(minOrderAmount) || minOrderAmount < 0) {
        throw new Error('Minimum order amount must be non-negative');
    }

    return {
        code,
        discountType,
        discountValue,
        expiryDate,
        usageLimit,
        minOrderAmount,
        isActive: body.isActive !== false,
    };
};

export const getCoupons = async (req: AuthRequest, res: Response) => {
    try {
        const coupons = await Coupon.find({}).sort({ createdAt: -1 });
        res.json(coupons);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const createCoupon = async (req: AuthRequest, res: Response) => {
    try {
        const coupon = new Coupon(normalizeCoupon(req.body));
        const createdCoupon = await coupon.save();
        res.status(201).json(createdCoupon);
    } catch (error: any) {
        if (error?.code === 11000) {
            return res.status(409).json({ message: 'Coupon code already exists' });
        }
        res.status(400).json({ message: error.message });
    }
};

export const updateCoupon = async (req: AuthRequest, res: Response) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid coupon ID' });
        }
        const coupon = await Coupon.findById(req.params.id);
        if (coupon) {
            Object.assign(coupon, normalizeCoupon(req.body));
            const updatedCoupon = await coupon.save();
            res.json(updatedCoupon);
        } else {
            res.status(404).json({ message: 'Coupon not found' });
        }
    } catch (error: any) {
        if (error?.code === 11000) {
            return res.status(409).json({ message: 'Coupon code already exists' });
        }
        res.status(400).json({ message: error.message });
    }
};

export const deleteCoupon = async (req: AuthRequest, res: Response) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid coupon ID' });
        }
        const coupon = await Coupon.findById(req.params.id);
        if (coupon) {
            await coupon.deleteOne();
            res.json({ message: 'Coupon removed' });
        } else {
            res.status(404).json({ message: 'Coupon not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const validateCoupon = async (req: Request, res: Response) => {
    try {
        const { code, amount } = req.body;
        const normalizedCode = typeof code === 'string' ? code.trim().toUpperCase() : '';
        const orderAmount = Number(amount);

        if (!normalizedCode || !Number.isFinite(orderAmount) || orderAmount < 0) {
            return res.status(400).json({ message: 'Promotion code and valid order amount are required' });
        }

        const coupon = await Coupon.findOne({ code: normalizedCode, isActive: true });

        if (!coupon) {
            return res.status(404).json({ message: 'INVALID_CODE: Access denied' });
        }

        if (new Date() > coupon.expiryDate) {
            return res.status(400).json({ message: 'EXPIRED_CODE: Timeline exceeded' });
        }

        if (coupon.usageLimit > 0 && coupon.usageCount >= coupon.usageLimit) {
            return res.status(400).json({ message: 'LIMIT_REACHED: Quota exhausted' });
        }

        if (orderAmount < coupon.minOrderAmount) {
            return res.status(400).json({ message: `MINIMUM_VALUATION: LKR ${coupon.minOrderAmount} required` });
        }

        res.json({
            code: coupon.code,
            discountType: coupon.discountType,
            discountValue: coupon.discountValue,
            minOrderAmount: coupon.minOrderAmount,
            expiryDate: coupon.expiryDate,
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
