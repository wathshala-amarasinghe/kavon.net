import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Coupon from '../models/Coupon';

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
        const coupon = new Coupon(req.body);
        const createdCoupon = await coupon.save();
        res.status(201).json(createdCoupon);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const updateCoupon = async (req: AuthRequest, res: Response) => {
    try {
        const coupon = await Coupon.findById(req.params.id);
        if (coupon) {
            Object.assign(coupon, req.body);
            const updatedCoupon = await coupon.save();
            res.json(updatedCoupon);
        } else {
            res.status(404).json({ message: 'Coupon not found' });
        }
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteCoupon = async (req: AuthRequest, res: Response) => {
    try {
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
        const coupon = await Coupon.findOne({ code, isActive: true });

        if (!coupon) {
            return res.status(404).json({ message: 'INVALID_CODE: Access denied' });
        }

        if (new Date() > coupon.expiryDate) {
            return res.status(400).json({ message: 'EXPIRED_CODE: Timeline exceeded' });
        }

        if (coupon.usageLimit > 0 && coupon.usageCount >= coupon.usageLimit) {
            return res.status(400).json({ message: 'LIMIT_REACHED: Quota exhausted' });
        }

        if (amount < coupon.minOrderAmount) {
            return res.status(400).json({ message: `MINIMUM_VALUATION: LKR ${coupon.minOrderAmount} required` });
        }

        res.json(coupon);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
