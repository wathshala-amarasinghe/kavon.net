import mongoose, { Schema, Document } from "mongoose";

export interface IOrderItem {
    product: mongoose.Types.ObjectId;
    name: string;
    quantity: number;
    image: string;
    price: number;
    size: string;
    color: string;
    isBundle?: boolean;
}

export interface IOrder extends Document {
    user: mongoose.Types.ObjectId;
    orderItems: IOrderItem[];
    shippingAddress: {
        fullName: string;
        address: string;
        city: string;
        postalCode: string;
        country: string;
        phone: string;
        secondaryPhone?: string;
    };
    paymentMethod: string;
    deliveryMethod: 'standard' | 'express' | 'same-day';
    deliverySector: 'COLOMBO' | 'OUTSTATION';
    couponCode?: string;
    paymentResult?: {
        id: string;
        status: string;
        update_time: string;
        email_address: string;
    };
    itemsPrice: number;
    shippingPrice: number;
    discountPrice: number;
    totalPrice: number;
    isPaid: boolean;
    paidAt?: Date;
    isDelivered: boolean;
    deliveredAt?: Date;
    status: 'Authorized' | 'Processing' | 'Shipped' | 'Out for Delivery' | 'Ready for Pickup' | 'Delivered' | 'Cancelled' | 'Refunded';
    loyaltyPointsEarned: number;
    loyaltyPointsUsed: number;
    trackingNumber?: string;
    carrier?: string;
}

const OrderSchema: Schema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        orderItems: [
            {
                name: { type: String, required: true },
                quantity: { type: Number, required: true },
                image: { type: String, required: true },
                price: { type: Number, required: true },
                size: { type: String, required: true },
                color: { type: String, required: true },
                isBundle: { type: Boolean, default: false },
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    ref: "Product",
                },
            },
        ],
        shippingAddress: {
            fullName: { type: String, default: 'Customer' },
            address: { type: String, required: true },
            city: { type: String, required: true },
            postalCode: { type: String, required: true },
            country: { type: String, required: true },
            phone: { type: String, required: true },
            secondaryPhone: { type: String },
        },
        paymentMethod: {
            type: String,
            // Keep legacy card orders editable; new card orders are rejected by the controller
            // until a real payment gateway is connected.
            enum: ['cod', 'card'],
            required: true,
        },
        deliveryMethod: {
            type: String,
            enum: ['standard', 'express', 'same-day'],
            required: true,
            default: 'standard',
        },
        deliverySector: {
            type: String,
            enum: ['COLOMBO', 'OUTSTATION'],
            required: true,
            default: 'OUTSTATION',
        },
        couponCode: { type: String, uppercase: true, trim: true },
        paymentResult: {
            id: { type: String },
            status: { type: String },
            update_time: { type: String },
            email_address: { type: String },
        },
        itemsPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        shippingPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        discountPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        totalPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        isPaid: {
            type: Boolean,
            required: true,
            default: false,
        },
        paidAt: {
            type: Date,
        },
        isDelivered: {
            type: Boolean,
            required: true,
            default: false,
        },
        deliveredAt: {
            type: Date,
        },
    status: {
      type: String,
      required: true,
      enum: ['Authorized', 'Processing', 'Shipped', 'Out for Delivery', 'Ready for Pickup', 'Delivered', 'Cancelled', 'Refunded'],
      default: 'Authorized'
    },
        loyaltyPointsEarned: {
            type: Number,
            default: 0
        },
        loyaltyPointsUsed: {
            type: Number,
            default: 0
        },
        trackingNumber: { type: String },
        carrier: { type: String }
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
