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
    createdAt: Date;
    updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        category: {
            type: String,
            required: true,
            enum: PRODUCT_CATEGORIES,
            trim: true,
        },
        gender: { type: String, enum: ['Men', 'Women', 'Child', 'Unisex'], default: 'Unisex' },
        images: { type: [String], required: true },
        colors: { type: [{ name: String, hex: String, img: String }], default: [] },
        sizes: { type: [{ label: String, stock: Number }], default: [] },
        stock: { type: Number, required: true, default: 0 },
        isNewDrop: { type: Boolean, default: true },
        salesCount: { type: Number, default: 0 },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
