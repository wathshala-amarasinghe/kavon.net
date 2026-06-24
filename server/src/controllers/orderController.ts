import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Order from '../models/Order';
import Product from '../models/Product';
import User from '../models/User';

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
        const order = await Order.findById(req.params.id);

        if (order) {
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
export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (order) {
            const oldStatus = order.status;
            order.status = status;
            
            // 1. Handle Delivery (Award Points)
            if (status === 'Delivered' && !order.isDelivered) {
                order.isDelivered = true;
                order.deliveredAt = new Date();
                
                // Increment sales count
                for (const item of order.orderItems) {
                    await Product.findByIdAndUpdate(item.product, { $inc: { salesCount: item.quantity } });
                }

                // Award Points only now
                const user = await User.findById(order.user);
                if (user) {
                    user.loyaltyPoints += (order.loyaltyPointsEarned || 0);
                    await user.save();
                }
            }

            // 2. Handle Cancellation (Restore Stock & Points)
            if (status === 'Cancelled' && oldStatus !== 'Cancelled') {
                // Restore Product Stock
                for (const item of order.orderItems) {
                    const product = await Product.findById(item.product);
                    if (product) {
                        const sizeIndex = product.sizes.findIndex((s: any) => s.label === item.size);
                        if (sizeIndex !== -1) {
                            product.sizes[sizeIndex].stock += item.quantity;
                        }
                        product.stock += item.quantity;
                        await product.save();
                    }
                }

                // Restore User Points if used
                if (order.loyaltyPointsUsed > 0) {
                    const user = await User.findById(order.user);
                    if (user) {
                        user.loyaltyPoints += order.loyaltyPointsUsed;
                        await user.save();
                    }
                }
            }

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
export const updateOrderToDelivered = async (req: AuthRequest, res: Response) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order && !order.isDelivered) {
            order.isDelivered = true;
            order.deliveredAt = new Date();
            order.status = 'Delivered';
            
            // Increment sales count
            for (const item of order.orderItems) {
                await Product.findByIdAndUpdate(item.product, { $inc: { salesCount: item.quantity } });
            }

            // Award Points
            const user = await User.findById(order.user);
            if (user) {
                user.loyaltyPoints += (order.loyaltyPointsEarned || 0);
                await user.save();
            }

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const addOrderItems = async (req: AuthRequest, res: Response) => {
    try {
        const {
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            shippingPrice,
            discountPrice,
            totalPrice,
            pointsUsed
        } = req.body;

        if (orderItems && orderItems.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        // 1. Validate Stock and Decrement
        for (const item of orderItems) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({ message: `Product ${item.name} not found` });
            }

            // Check size-specific stock
            const sizeIndex = product.sizes.findIndex((s: any) => s.label === item.size);
            if (sizeIndex === -1 || product.sizes[sizeIndex].stock < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for ${item.name} (Size: ${item.size})` });
            }

            // Decrement size-specific stock
            product.sizes[sizeIndex].stock -= item.quantity;
            // Also decrement overall stock
            product.stock -= item.quantity;
            
            await product.save();
        }

        // 2. Handle Loyalty Points
        const user = await User.findById(req.user?._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Deduct used points
        if (pointsUsed > 0) {
            if (user.loyaltyPoints < pointsUsed) {
                return res.status(400).json({ message: 'Insufficient loyalty points' });
            }
            user.loyaltyPoints -= pointsUsed;
        }

        // Calculate points to be earned (stored in order, awarded on delivery)
        const pointsEarned = Math.floor(itemsPrice * 0.25);
        
        await user.save();

        // 3. Create Order
        const order = new Order({
            orderItems,
            user: req.user?._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            shippingPrice,
            discountPrice,
            totalPrice,
            loyaltyPointsEarned: pointsEarned,
            loyaltyPointsUsed: pointsUsed || 0,
            status: 'Authorized'
        });

        const createdOrder = await order.save();

        res.status(201).json(createdOrder);
    } catch (error: any) {
        console.error('Order Creation Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req: AuthRequest, res: Response) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');

        if (order) {
            // Check if order belongs to user or if user is admin
            if (order.user._id.toString() !== req.user?._id.toString() && req.user?.role !== 'admin') {
                return res.status(401).json({ message: 'Not authorized to view this order' });
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
        const order = await Order.findById(req.params.id);

        if (order) {
            // Basic security check: Phone number must be provided in query to see details
            const phone = req.query.phone;
            if (!phone || order.shippingAddress.phone !== phone) {
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
        const { trackingNumber, carrier } = req.body;
        const order = await Order.findById(req.params.id);

        if (order) {
            order.trackingNumber = trackingNumber;
            order.carrier = carrier;

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
