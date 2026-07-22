import mongoose, { Schema, Document } from 'mongoose';

export interface ICoupon extends Document {
    code: string;
    discountType: 'Percentage' | 'Fixed';
    discountValue: number;
    expiryDate: Date;
    usageLimit: number;
    usageCount: number;
    minOrderAmount: number;
    isActive: boolean;
}

const CouponSchema: Schema = new Schema(
    {
        code: { type: String, required: true, unique: true, uppercase: true },
        discountType: { 
            type: String, 
            enum: ['Percentage', 'Fixed'], 
            default: 'Percentage' 
        },
        discountValue: { type: Number, required: true, min: 0 },
        expiryDate: { type: Date, required: true },
        usageLimit: { type: Number, default: 0, min: 0 }, // 0 for unlimited
        usageCount: { type: Number, default: 0, min: 0 },
        minOrderAmount: { type: Number, default: 0, min: 0 },
        isActive: { type: Boolean, default: true }
    },
    { timestamps: true }
);

export default mongoose.models.Coupon || mongoose.model<ICoupon>('Coupon', CouponSchema);
