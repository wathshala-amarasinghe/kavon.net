import mongoose, { Schema, Document } from "mongoose";
import { PRODUCT_CATEGORIES } from "../constants/catalog";

export interface IProduct extends Document {
    name: string;
    description: string;
    price: number;
    category: string;
    images: string[];
    colors: { name: string; hex: string; img: string }[];
    sizes: { label: string; stock: number }[];
    stock: number;
    isNewDrop: boolean;
    salesCount: number;
    rating: number;
    numReviews: number;
    createdAt: Date;
    updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        description: { type: String, required: true, trim: true },
        price: { type: Number, required: true, min: 0.01 },
        category: {
            type: String,
            required: true,
            enum: PRODUCT_CATEGORIES,
            trim: true,
        },
        gender: { type: String, enum: ['Men', 'Women', 'Child', 'Unisex'], default: 'Unisex' },
        images: {
            type: [String],
            required: true,
            validate: {
                validator: (images: string[]) => Array.isArray(images) && images.length > 0,
                message: 'At least one product image is required',
            },
        },
        colors: { type: [{ name: String, hex: String, img: String }], default: [] },
        sizes: { type: [{ label: String, stock: { type: Number, min: 0, default: 0 } }], default: [] },
        stock: { type: Number, required: true, min: 0, default: 0 },
        isNewDrop: { type: Boolean, default: true },
        salesCount: { type: Number, min: 0, default: 0 },
        rating: { type: Number, min: 0, max: 5, default: 0 },
        numReviews: { type: Number, min: 0, default: 0 },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
