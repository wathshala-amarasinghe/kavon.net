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
        name: { type: String, required: true, trim: true, maxlength: 150 },
        description: { type: String, required: true, trim: true, maxlength: 5000 },
        price: { type: Number, required: true, min: 0.01, max: 100000000 },
        category: {
            type: String,
            required: true,
            enum: PRODUCT_CATEGORIES,
            trim: true,
        },
        gender: { type: String, enum: ['Men', 'Women', 'Child', 'Unisex'], default: 'Unisex' },
        images: {
            type: [{ type: String, maxlength: 2048 }],
            required: true,
            validate: {
                validator: (images: string[]) => Array.isArray(images) && images.length > 0 && images.length <= 10,
                message: 'Add between 1 and 10 product images',
            },
        },
        colors: {
            type: [{
                name: { type: String, maxlength: 60 },
                hex: { type: String, match: /^#[0-9a-fA-F]{6}$/ },
                img: { type: String, maxlength: 2048 },
            }],
            default: [],
        },
        sizes: {
            type: [{
                label: { type: String, maxlength: 20 },
                stock: { type: Number, min: 0, max: 100000, default: 0 },
            }],
            validate: {
                validator: (sizes: unknown[]) => Array.isArray(sizes) && sizes.length > 0 && sizes.length <= 20,
                message: 'Add between 1 and 20 sizes',
            },
            default: [],
        },
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
