import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
    user: mongoose.Types.ObjectId;
    userName: string;
    product: mongoose.Types.ObjectId;
    rating: number;
    comment: string;
    image?: string;
    verifiedPurchase: boolean;
    createdAt: Date;
}

const ReviewSchema: Schema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        userName: {
            type: String,
            required: true,
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Product",
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            required: true,
        },
        image: {
            type: String,
        },
        verifiedPurchase: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

ReviewSchema.index({ user: 1, product: 1 }, { unique: true });

export default mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema);
