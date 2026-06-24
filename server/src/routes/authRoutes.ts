import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { protect, admin, AuthRequest } from '../middleware/authMiddleware';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const normalizedEmail = email.toLowerCase().trim();

        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = new User({ name, email: normalizedEmail, password });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });

        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                loyaltyPoints: user.loyaltyPoints
            }
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const normalizedEmail = email.toLowerCase().trim();

        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                loyaltyPoints: user.loyaltyPoints
            }
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// Get Current User
router.get('/me', protect, async (req: AuthRequest, res) => {
    res.json(req.user);
});

// Update Profile
router.put('/profile', protect, async (req: AuthRequest, res) => {
    try {
        const user = await User.findById(req.user?._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            
            if (req.body.password) {
                user.password = req.body.password;
            }

            if (req.body.shippingAddress) {
                user.shippingAddress = {
                    address: req.body.shippingAddress.address || user.shippingAddress?.address,
                    city: req.body.shippingAddress.city || user.shippingAddress?.city,
                    postalCode: req.body.shippingAddress.postalCode || user.shippingAddress?.postalCode,
                    country: req.body.shippingAddress.country || user.shippingAddress?.country,
                    phone: req.body.shippingAddress.phone || user.shippingAddress?.phone,
                };
            }

            const updatedUser = await user.save();

            const token = jwt.sign({ id: updatedUser._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });

            res.json({
                token,
                user: {
                    id: updatedUser._id,
                    name: updatedUser.name,
                    email: updatedUser.email,
                    role: updatedUser.role,
                    loyaltyPoints: updatedUser.loyaltyPoints,
                    shippingAddress: updatedUser.shippingAddress
                }
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get all users
// @route   GET /api/auth
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Delete user
// @route   DELETE /api/auth/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            if (user.role === 'admin') {
                return res.status(400).json({ message: 'Cannot delete admin user' });
            }
            await user.deleteOne();
            res.json({ message: 'User removed from division' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
