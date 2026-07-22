import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { protect, admin, AuthRequest } from '../middleware/authMiddleware';
import crypto from 'crypto';

const router = express.Router();

const getJwtSecret = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('Server authentication is not configured');
    }
    return secret;
};

const hashRecoveryValue = (value: string) =>
    crypto.createHmac('sha256', getJwtSecret()).update(value).digest('hex');

const sendRecoveryCode = async (email: string, code: string) => {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            service_id: process.env.EMAILJS_SERVICE_ID || 'service_8m8xecf',
            template_id: process.env.EMAILJS_RECOVERY_TEMPLATE_ID || 'template_vdoyytn',
            user_id: process.env.EMAILJS_PUBLIC_KEY || 'iwawzuJjOqQ-hGU2_',
            template_params: {
                to_email: email,
                verification_code: code,
            },
        }),
    });

    if (!response.ok) {
        throw new Error('Recovery email could not be sent');
    }
};

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (typeof name !== 'string' || !name.trim()) {
            return res.status(400).json({ message: 'Name is required' });
        }

        if (typeof email !== 'string' || !email.trim()) {
            return res.status(400).json({ message: 'A valid email is required' });
        }

        if (typeof password !== 'string' || password.length < 8) {
            return res.status(400).json({ message: 'Password must contain at least 8 characters' });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = new User({ name: name.trim(), email: normalizedEmail, password });
        await user.save();

        const token = jwt.sign({ id: user._id }, getJwtSecret(), { expiresIn: '7d' });

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

        if (typeof email !== 'string' || typeof password !== 'string') {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const user = await User.findOne({ email: normalizedEmail }).select('+password');
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, getJwtSecret(), { expiresIn: '7d' });

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

// Request an expiring password recovery code.
router.post('/password/forgot', async (req, res) => {
    try {
        const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
        if (!email) return res.status(400).json({ message: 'Email is required' });

        const user: any = await User.findOne({ email }).select(
            '+passwordResetCodeHash +passwordResetExpires +passwordResetAttempts +passwordResetTokenHash'
        );

        // Return the same response for unknown emails to prevent account discovery.
        if (!user) {
            return res.json({ message: 'If the account exists, a recovery code has been sent' });
        }

        const code = crypto.randomInt(100000, 1000000).toString();
        user.passwordResetCodeHash = hashRecoveryValue(code);
        user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
        user.passwordResetAttempts = 0;
        user.passwordResetTokenHash = undefined;
        await user.save();

        try {
            await sendRecoveryCode(user.email, code);
        } catch (error) {
            user.passwordResetCodeHash = undefined;
            user.passwordResetExpires = undefined;
            await user.save();
            throw error;
        }

        res.json({ message: 'If the account exists, a recovery code has been sent' });
    } catch (error: any) {
        res.status(503).json({ message: error.message || 'Recovery service is temporarily unavailable' });
    }
});

// Verify a recovery code and issue a short-lived one-time reset token.
router.post('/password/verify', async (req, res) => {
    try {
        const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
        const code = typeof req.body.code === 'string' ? req.body.code.trim() : '';
        const user: any = await User.findOne({ email }).select(
            '+passwordResetCodeHash +passwordResetExpires +passwordResetAttempts +passwordResetTokenHash'
        );

        if (!user?.passwordResetCodeHash || !user.passwordResetExpires || user.passwordResetExpires < new Date()) {
            return res.status(400).json({ message: 'Recovery code is invalid or expired' });
        }

        if ((user.passwordResetAttempts || 0) >= 5) {
            return res.status(429).json({ message: 'Too many invalid attempts. Request a new code' });
        }

        const submittedHash = hashRecoveryValue(code);
        const isValid = crypto.timingSafeEqual(
            Buffer.from(submittedHash, 'hex'),
            Buffer.from(user.passwordResetCodeHash, 'hex')
        );

        if (!isValid) {
            user.passwordResetAttempts = (user.passwordResetAttempts || 0) + 1;
            await user.save();
            return res.status(400).json({ message: 'Recovery code is invalid or expired' });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        user.passwordResetTokenHash = hashRecoveryValue(resetToken);
        user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000);
        user.passwordResetCodeHash = undefined;
        user.passwordResetAttempts = 0;
        await user.save();

        res.json({ resetToken });
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Recovery verification failed' });
    }
});

// Apply a verified password reset token.
router.post('/password/reset', async (req, res) => {
    try {
        const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
        const token = typeof req.body.token === 'string' ? req.body.token.trim() : '';
        const password = typeof req.body.password === 'string' ? req.body.password : '';

        if (password.length < 8) {
            return res.status(400).json({ message: 'Password must contain at least 8 characters' });
        }

        const user: any = await User.findOne({ email }).select(
            '+passwordResetCodeHash +passwordResetExpires +passwordResetAttempts +passwordResetTokenHash'
        );

        if (
            !user?.passwordResetTokenHash ||
            !user.passwordResetExpires ||
            user.passwordResetExpires < new Date() ||
            hashRecoveryValue(token) !== user.passwordResetTokenHash
        ) {
            return res.status(400).json({ message: 'Reset link is invalid or expired' });
        }

        user.password = password;
        user.passwordResetCodeHash = undefined;
        user.passwordResetTokenHash = undefined;
        user.passwordResetExpires = undefined;
        user.passwordResetAttempts = 0;
        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Password reset failed' });
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
            const nextName = typeof req.body.name === 'string' ? req.body.name.trim() : user.name;
            const nextEmail = typeof req.body.email === 'string'
                ? req.body.email.trim().toLowerCase()
                : user.email;

            if (!nextName || !nextEmail) {
                return res.status(400).json({ message: 'Name and email are required' });
            }

            if (req.body.password && (typeof req.body.password !== 'string' || req.body.password.length < 8)) {
                return res.status(400).json({ message: 'Password must contain at least 8 characters' });
            }

            const duplicateEmail = await User.exists({ email: nextEmail, _id: { $ne: user._id } });
            if (duplicateEmail) {
                return res.status(409).json({ message: 'Email is already in use' });
            }

            user.name = nextName;
            user.email = nextEmail;
            
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

            const token = jwt.sign({ id: updatedUser._id }, getJwtSecret(), { expiresIn: '7d' });

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

// @desc    Update a user's role
// @route   PUT /api/auth/:id/role
// @access  Private/Admin
router.put('/:id/role', protect, admin, async (req: AuthRequest, res) => {
    try {
        const { role } = req.body;

        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Role must be either user or admin' });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (req.user?._id.toString() === user._id.toString() && role !== 'admin') {
            return res.status(400).json({ message: 'You cannot remove your own admin access' });
        }

        if (user.role === 'admin' && role === 'user') {
            const adminCount = await User.countDocuments({ role: 'admin' });
            if (adminCount <= 1) {
                return res.status(400).json({ message: 'At least one admin account is required' });
            }
        }

        user.role = role;
        await user.save();

        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            loyaltyPoints: user.loyaltyPoints,
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Failed to update user role' });
    }
});

export default router;
