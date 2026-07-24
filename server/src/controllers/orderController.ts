import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Order from '../models/Order';
import Product from '../models/Product';
import User from '../models/User';
import Coupon from '../models/Coupon';
import mongoose from 'mongoose';

class OrderValidationError extends Error {
    statusCode: number;

    constructor(message: string, statusCode = 400) {
        super(message);
        this.statusCode = statusCode;
    }
}

const roundCurrency = (value: number) => Math.round(value * 100) / 100;

const calculateShippingPrice = (
    subtotal: number,
    method: 'standard' | 'express' | 'same-day',
    sector: 'COLOMBO' | 'OUTSTATION'
) => {
    if (method === 'same-day') {
        if (sector !== 'COLOMBO') {
            throw new OrderValidationError('Same-day delivery is available only in Colombo');
        }
        return 2500;
    }

    if (method === 'express') {
        return sector === 'COLOMBO' ? 800 : 1500;
    }

    const threshold = sector === 'COLOMBO' ? 10000 : 15000;
    if (subtotal >= threshold) return 0;
    return sector === 'COLOMBO' ? 350 : 650;
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = async (req: AuthRequest, res: Response) => {
    try {
        const orders = await Order.find({}).populate('user', 'id name').sort({ createdAt: -1 });
        res.json(orders);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private/Admin
export const updateOrderToPaid = async (req: AuthRequest, res: Response) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid order ID' });
        }
        const order = await Order.findById(req.params.id);

        if (order) {
            if (order.isPaid) {
                return res.json(order);
            }
            if (order.status !== 'Authorized') {
                return res.status(400).json({ message: `Cannot verify payment for a ${order.status} order` });
            }
            order.isPaid = true;
            order.paidAt = new Date();
            order.status = 'Processing';

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const statusTransitions: Record<string, string[]> = {
    Authorized: ['Processing', 'Cancelled'],
    Processing: ['Shipped', 'Ready for Pickup', 'Cancelled'],
    Shipped: ['Out for Delivery', 'Delivered', 'Cancelled'],
    'Out for Delivery': ['Delivered', 'Cancelled'],
    'Ready for Pickup': ['Delivered', 'Cancelled'],
    Delivered: ['Refunded'],
    Cancelled: [],
    Refunded: [],
};

const changeOrderStatus = async (req: AuthRequest, res: Response, requestedStatus?: string) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        res.status(400).json({ message: 'Invalid order ID' });
        return;
    }
    const session = await mongoose.startSession();
    try {
        const status = requestedStatus || req.body.status;
        let updatedOrder: any;

        await session.withTransaction(async () => {
            const order: any = await Order.findById(req.params.id).session(session);
            if (!order) throw new OrderValidationError('Order not found', 404);
            if (!statusTransitions[order.status]?.includes(status)) {
                if (order.status === status) {
                    updatedOrder = order;
                    return;
                }
                throw new OrderValidationError(`Cannot change order from ${order.status} to ${status}`);
            }

            const user: any = await User.findById(order.user).session(session);

            if (status === 'Delivered') {
                order.isDelivered = true;
                order.deliveredAt = new Date();
                if (order.paymentMethod === 'cod') {
                    order.isPaid = true;
                    order.paidAt = new Date();
                }

                for (const item of order.orderItems) {
                    await Product.findByIdAndUpdate(
                        item.product,
                        { $inc: { salesCount: item.quantity } },
                        { session }
                    );
                }

                if (user) {
                    user.loyaltyPoints += (order.loyaltyPointsEarned || 0);
                    await user.save({ session });
                }
            }

            if (status === 'Cancelled') {
                for (const item of order.orderItems) {
                    const product: any = await Product.findById(item.product).session(session);
                    if (product) {
                        const sizeIndex = product.sizes.findIndex((s: any) => s.label === item.size);
                        if (sizeIndex !== -1) {
                            product.sizes[sizeIndex].stock += item.quantity;
                        }
                        product.stock += item.quantity;
                        await product.save({ session });
                    }
                }

                if (user && order.loyaltyPointsUsed > 0) {
                    user.loyaltyPoints += order.loyaltyPointsUsed;
                    await user.save({ session });
                }

                if (order.couponCode) {
                    await Coupon.findOneAndUpdate(
                        { code: order.couponCode, usageCount: { $gt: 0 } },
                        { $inc: { usageCount: -1 } },
                        { session }
                    );
                }
            }

            if (status === 'Refunded') {
                for (const item of order.orderItems) {
                    const product: any = await Product.findById(item.product).session(session);
                    if (product) {
                        product.salesCount = Math.max(0, Number(product.salesCount || 0) - item.quantity);
                        await product.save({ session });
                    }
                }

                if (user) {
                    user.loyaltyPoints = Math.max(
                        0,
                        user.loyaltyPoints - (order.loyaltyPointsEarned || 0) + (order.loyaltyPointsUsed || 0)
                    );
                    await user.save({ session });
                }

                if (order.couponCode) {
                    await Coupon.findOneAndUpdate(
                        { code: order.couponCode, usageCount: { $gt: 0 } },
                        { $inc: { usageCount: -1 } },
                        { session }
                    );
                }
            }

            order.status = status;
            updatedOrder = await order.save({ session });
        });

        res.json(updatedOrder);
    } catch (error: any) {
        res.status(error.statusCode || 500).json({ message: error.message || 'Status update failed' });
    } finally {
        await session.endSession();
    }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
    await changeOrderStatus(req, res);
};

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
export const updateOrderToDelivered = async (req: AuthRequest, res: Response) => {
    await changeOrderStatus(req, res, 'Delivered');
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const addOrderItems = async (req: AuthRequest, res: Response) => {
    const session = await mongoose.startSession();

    try {
        const {
            orderItems,
            shippingAddress,
            paymentMethod,
            deliveryMethod = 'standard',
            deliverySector = 'OUTSTATION',
            couponCode,
            pointsUsed = 0,
        } = req.body;

        if (!Array.isArray(orderItems) || orderItems.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        const requiredAddressFields = ['fullName', 'address', 'city', 'postalCode', 'country', 'phone'];
        if (!shippingAddress || requiredAddressFields.some((field) => !String(shippingAddress[field] || '').trim())) {
            return res.status(400).json({ message: 'Complete shipping address is required' });
        }
        if (
            requiredAddressFields.some((field) => String(shippingAddress[field]).trim().length > 200) ||
            String(shippingAddress.secondaryPhone || '').trim().length > 30
        ) {
            return res.status(400).json({ message: 'Shipping address contains an invalid field' });
        }

        if (String(shippingAddress.country).trim().toLowerCase() !== 'sri lanka') {
            return res.status(400).json({ message: 'Online delivery is currently available only within Sri Lanka' });
        }

        if (paymentMethod !== 'cod') {
            return res.status(400).json({ message: 'Card payments are not available yet' });
        }

        if (!['standard', 'express', 'same-day'].includes(deliveryMethod)) {
            return res.status(400).json({ message: 'Invalid delivery method' });
        }

        if (!['COLOMBO', 'OUTSTATION'].includes(deliverySector)) {
            return res.status(400).json({ message: 'Invalid delivery sector' });
        }

        let createdOrder: any;

        await session.withTransaction(async () => {
            const user = await User.findById(req.user?._id).session(session);
            if (!user) throw new OrderValidationError('User not found', 404);

            const productIds = [...new Set(orderItems.map((item: any) => String(item.product || '')))];
            if (productIds.some((id) => !mongoose.isValidObjectId(id))) {
                throw new OrderValidationError('One or more product IDs are invalid');
            }

            const products = await Product.find({ _id: { $in: productIds } }).session(session);
            const productMap = new Map(products.map((product: any) => [product._id.toString(), product]));
            const stockRequirements = new Map<string, number>();

            for (const item of orderItems) {
                const product = productMap.get(String(item.product));
                const quantity = Number(item.quantity);
                const size = String(item.size || '').trim();

                if (!product) throw new OrderValidationError(`Product ${item.name || ''} not found`, 404);
                if (!Number.isInteger(quantity) || quantity <= 0 || quantity > 20) {
                    throw new OrderValidationError(`Invalid quantity for ${product.name}`);
                }
                if (!size) throw new OrderValidationError(`Select a size for ${product.name}`);

                const key = `${product._id}:${size}`;
                stockRequirements.set(key, (stockRequirements.get(key) || 0) + quantity);
            }

            for (const [key, quantity] of stockRequirements) {
                const [productId, size] = key.split(':');
                const product = productMap.get(productId);
                const sizeOption = product?.sizes.find((entry: any) => entry.label === size);
                if (!product || !sizeOption || Number(sizeOption.stock) < quantity || Number(product.stock) < quantity) {
                    throw new OrderValidationError(`Insufficient stock for ${product?.name || 'product'} (Size: ${size})`);
                }
            }

            const bundledProductIds = new Set(
                orderItems.filter((item: any) => item.isBundle).map((item: any) => String(item.product))
            );
            const bundleEligible = bundledProductIds.size >= 2;

            const authoritativeItems = orderItems.map((item: any) => {
                const product: any = productMap.get(String(item.product));
                const quantity = Number(item.quantity);
                const selectedColor = product.colors.some((color: any) => color.name === item.color)
                    ? item.color
                    : product.colors[0]?.name || 'Default';
                const unitPrice = item.isBundle && bundleEligible
                    ? roundCurrency(Number(product.price) * 0.9)
                    : Number(product.price);

                return {
                    product: product._id,
                    name: product.name,
                    quantity,
                    image: product.images[0],
                    price: unitPrice,
                    size: String(item.size),
                    color: selectedColor,
                    isBundle: Boolean(item.isBundle && bundleEligible),
                };
            });

            const itemsPrice = roundCurrency(
                authoritativeItems.reduce((total: number, item: any) => total + item.price * item.quantity, 0)
            );

            let coupon: any = null;
            let couponDiscount = 0;
            const normalizedCouponCode = typeof couponCode === 'string' ? couponCode.trim().toUpperCase() : '';
            if (normalizedCouponCode) {
                coupon = await Coupon.findOne({ code: normalizedCouponCode, isActive: true }).session(session);
                if (!coupon) throw new OrderValidationError('Invalid promotion code');
                if (new Date() > coupon.expiryDate) throw new OrderValidationError('Promotion code has expired');
                if (coupon.usageLimit > 0 && coupon.usageCount >= coupon.usageLimit) {
                    throw new OrderValidationError('Promotion code usage limit reached');
                }
                if (itemsPrice < coupon.minOrderAmount) {
                    throw new OrderValidationError(`Minimum order amount is LKR ${coupon.minOrderAmount}`);
                }

                couponDiscount = coupon.discountType === 'Percentage'
                    ? itemsPrice * Math.min(100, Math.max(0, coupon.discountValue)) / 100
                    : Math.min(itemsPrice, Math.max(0, coupon.discountValue));
                couponDiscount = roundCurrency(couponDiscount);
            }

            const requestedPoints = Number(pointsUsed) || 0;
            if (![0, 1000].includes(requestedPoints)) {
                throw new OrderValidationError('Invalid loyalty points request');
            }
            if (requestedPoints > user.loyaltyPoints) {
                throw new OrderValidationError('Insufficient loyalty points');
            }

            const pointsDiscount = requestedPoints === 1000
                ? roundCurrency((itemsPrice - couponDiscount) * 0.05)
                : 0;
            const shippingPrice = calculateShippingPrice(itemsPrice, deliveryMethod, deliverySector);
            const discountPrice = roundCurrency(couponDiscount + pointsDiscount);
            const totalPrice = roundCurrency(Math.max(0, itemsPrice - discountPrice + shippingPrice));
            const pointsEarned = Math.floor(itemsPrice * 0.25);

            for (const [key, quantity] of stockRequirements) {
                const [productId, size] = key.split(':');
                const product: any = productMap.get(productId);
                const sizeOption = product.sizes.find((entry: any) => entry.label === size);
                sizeOption.stock -= quantity;
                product.stock -= quantity;
                await product.save({ session });
            }

            if (requestedPoints > 0) {
                user.loyaltyPoints -= requestedPoints;
                await user.save({ session });
            }

            if (coupon) {
                coupon.usageCount += 1;
                await coupon.save({ session });
            }

            const [order] = await Order.create([{
                orderItems: authoritativeItems,
                user: req.user?._id,
                shippingAddress: {
                    fullName: String(shippingAddress.fullName).trim(),
                    address: String(shippingAddress.address).trim(),
                    city: String(shippingAddress.city).trim(),
                    postalCode: String(shippingAddress.postalCode).trim(),
                    country: 'Sri Lanka',
                    phone: String(shippingAddress.phone).trim(),
                    secondaryPhone: String(shippingAddress.secondaryPhone || '').trim(),
                },
                paymentMethod,
                deliveryMethod,
                deliverySector,
                couponCode: normalizedCouponCode || undefined,
                itemsPrice,
                shippingPrice,
                discountPrice,
                totalPrice,
                loyaltyPointsEarned: pointsEarned,
                loyaltyPointsUsed: requestedPoints,
                status: 'Authorized',
            }], { session });

            createdOrder = order;
        });

        res.status(201).json(createdOrder);
    } catch (error: any) {
        console.error('Order Creation Error:', error);
        res.status(error.statusCode || 500).json({ message: error.message || 'Order creation failed' });
    } finally {
        await session.endSession();
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req: AuthRequest, res: Response) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid order ID' });
        }
        const order = await Order.findById(req.params.id).populate('user', 'name email');

        if (order) {
            // Check if order belongs to user or if user is admin
            const ownerId = (order.user as any)?._id || order.user;
            if (ownerId?.toString() !== req.user?._id.toString() && req.user?.role !== 'admin') {
                return res.status(403).json({ message: 'You do not have access to this order' });
            }
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req: AuthRequest, res: Response) => {
    try {
        const orders = await Order.find({ user: req.user?._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get order by ID for public tracking
// @route   GET /api/orders/track/:id
export const getOrderForTracking = async (req: Request, res: Response) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid order ID' });
        }
        const order = await Order.findById(req.params.id);

        if (order) {
            // Basic security check: Phone number must be provided in query to see details
            const phone = typeof req.query.phone === 'string' ? req.query.phone.replace(/\D/g, '') : '';
            const orderPhone = order.shippingAddress.phone.replace(/\D/g, '');
            if (!phone || orderPhone !== phone) {
                return res.status(401).json({ message: 'UNAUTHORIZED: Phone number mismatch' });
            }

            res.json({
                _id: order._id,
                status: order.status,
                shippingAddress: {
                    city: order.shippingAddress.city
                },
                createdAt: order.createdAt,
                updatedAt: order.updatedAt
            });
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order tracking info
// @route   PUT /api/orders/:id/tracking
// @access  Private/Admin
export const updateOrderTracking = async (req: AuthRequest, res: Response) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid order ID' });
        }
        const { trackingNumber, carrier } = req.body;
        if (
            (trackingNumber !== undefined && (typeof trackingNumber !== 'string' || trackingNumber.length > 100)) ||
            (carrier !== undefined && (typeof carrier !== 'string' || carrier.length > 100))
        ) {
            return res.status(400).json({ message: 'Tracking number and carrier must be below 100 characters' });
        }
        const order = await Order.findById(req.params.id);

        if (order) {
            order.trackingNumber = typeof trackingNumber === 'string' ? trackingNumber.trim() : order.trackingNumber;
            order.carrier = typeof carrier === 'string' ? carrier.trim() : order.carrier;

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
