import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { rateLimit } from 'express-rate-limit';
import User, { IUser } from '../models/User';
import { protect, admin, AuthRequest } from '../middleware/authMiddleware';
import crypto from 'crypto';
import mongoose from 'mongoose';
import {
    createEmailVerificationChallenge,
    getResendWaitSeconds,
    getVerificationTokenStatus,
    hashVerificationToken,
} from '../utils/emailVerification';
import { trySendVerificationEmail } from '../services/emailService';

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

const isValidEmail = (email: string) =>
    email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const normalizeEmail = (value: unknown) =>
    typeof value === 'string' ? value.trim().toLowerCase() : '';

const createAuthToken = (userId: string) =>
    jwt.sign({ id: userId }, getJwtSecret(), { expiresIn: '7d' });

const toPublicUser = (user: IUser) => ({
    id: user._id,
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    loyaltyPoints: user.loyaltyPoints,
    emailVerified: user.emailVerified !== false,
    emailVerifiedAt: user.emailVerifiedAt,
    shippingAddress: user.shippingAddress,
    avatarUrl: user.avatarUrl,
    avatarPublicId: user.avatarPublicId,
    avatarUpdatedAt: user.avatarUpdatedAt,
});

const registrationLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { message: 'Too many registration attempts. Please try again later.' },
});

const resendVerificationLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: {
        message: 'If an unverified account exists, a verification email will be sent shortly.',
    },
});

const genericResendMessage =
    'If an unverified account exists, a verification email will be sent shortly.';

const genericExistingRegistrationResponse = (name: string, email: string) => ({
    message:
        'If this email is eligible, check the inbox for account verification instructions.',
    requiresEmailVerification: true,
    emailSent: false,
    user: {
        name,
        email,
        role: 'user',
        loyaltyPoints: 0,
        emailVerified: false,
    },
});

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
router.post('/register', registrationLimiter, async (req: Request, res: Response) => {
    const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
    const email = normalizeEmail(req.body.email);
    const password = typeof req.body.password === 'string' ? req.body.password : '';
    const marketingEmailConsent = req.body.marketingEmailConsent === true;

    try {
        if (name.length < 2 || name.length > 100) {
            return res.status(400).json({ message: 'Please enter a valid name.' });
        }
        if (!isValidEmail(email)) {
            return res.status(400).json({ message: 'Please enter a valid email address.' });
        }
        if (password.length < 8 || password.length > 128) {
            return res.status(400).json({
                message: 'Password must contain between 8 and 128 characters.',
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(201).json(genericExistingRegistrationResponse(name, email));
        }

        const challenge = createEmailVerificationChallenge();
        const user = new User({
            name,
            email,
            password,
            emailVerified: false,
            emailVerificationTokenHash: challenge.tokenHash,
            emailVerificationExpiresAt: challenge.expiresAt,
            verificationEmailLastSentAt: challenge.issuedAt,
            marketingEmailConsent,
            marketingConsentAt: marketingEmailConsent ? new Date() : undefined,
            marketingConsentSource: marketingEmailConsent ? 'registration' : undefined,
        });
        await user.save();

        const emailSent = await trySendVerificationEmail({
            recipientEmail: user.email,
            recipientName: user.name,
            token: challenge.token,
        });
        if (!emailSent) {
            user.verificationEmailLastSentAt = undefined;
            try {
                await user.save();
            } catch {
                // The account and verification challenge are already stored.
            }
        }

        return res.status(201).json({
            message: emailSent
                ? 'Account created. Check your email to verify your account.'
                : 'Account created, but the verification email could not be sent. Please request a new email.',
            requiresEmailVerification: true,
            emailSent,
            user: toPublicUser(user),
        });
    } catch (error: unknown) {
        if (
            typeof error === 'object' &&
            error !== null &&
            'code' in error &&
            error.code === 11000
        ) {
            return res.status(201).json(genericExistingRegistrationResponse(name, email));
        }
        return res.status(500).json({ message: 'Unable to create account right now.' });
    }
});

// Verify a single-use email token.
router.post('/verify-email', async (req: Request, res: Response) => {
    try {
        const token = typeof req.body.token === 'string' ? req.body.token.trim() : '';
        if (!/^[a-f0-9]{64}$/i.test(token)) {
            return res.status(400).json({
                code: 'VERIFICATION_INVALID',
                message: 'This verification link is invalid.',
            });
        }

        const tokenHash = hashVerificationToken(token);
        const user = await User.findOne({
            emailVerificationTokenHash: tokenHash,
        }).select(
            '+emailVerificationTokenHash +emailVerificationExpiresAt +verificationEmailLastSentAt'
        );

        if (!user) {
            return res.status(400).json({
                code: 'VERIFICATION_INVALID',
                message: 'This verification link is invalid or has already been used.',
            });
        }

        const status = getVerificationTokenStatus({
            suppliedToken: token,
            storedTokenHash: user.emailVerificationTokenHash,
            expiresAt: user.emailVerificationExpiresAt,
            emailVerified: user.emailVerified,
        });

        if (status === 'expired') {
            return res.status(410).json({
                code: 'VERIFICATION_EXPIRED',
                message: 'This verification link has expired.',
            });
        }
        if (status !== 'valid') {
            return res.status(400).json({
                code: 'VERIFICATION_INVALID',
                message: 'This verification link is invalid or has already been used.',
            });
        }

        user.emailVerified = true;
        user.emailVerifiedAt = new Date();
        user.emailVerificationTokenHash = undefined;
        user.emailVerificationExpiresAt = undefined;
        user.verificationEmailLastSentAt = undefined;
        await user.save();

        return res.json({
            message: 'Your email has been verified. You can now sign in.',
        });
    } catch {
        return res.status(500).json({ message: 'Unable to verify email right now.' });
    }
});

// Requesting a resend never reveals whether the email exists or is verified.
router.post(
    '/resend-verification',
    resendVerificationLimiter,
    async (req: Request, res: Response) => {
        try {
            const email = normalizeEmail(req.body.email);
            if (!isValidEmail(email)) {
                return res.json({ message: genericResendMessage });
            }

            const user = await User.findOne({ email }).select(
                '+emailVerificationTokenHash +emailVerificationExpiresAt +verificationEmailLastSentAt'
            );

            if (!user || user.emailVerified !== false) {
                return res.json({ message: genericResendMessage });
            }

            if (getResendWaitSeconds(user.verificationEmailLastSentAt) > 0) {
                return res.json({ message: genericResendMessage });
            }

            const challenge = createEmailVerificationChallenge();
            user.emailVerificationTokenHash = challenge.tokenHash;
            user.emailVerificationExpiresAt = challenge.expiresAt;
            user.verificationEmailLastSentAt = challenge.issuedAt;
            await user.save();

            const emailSent = await trySendVerificationEmail({
                recipientEmail: user.email,
                recipientName: user.name,
                token: challenge.token,
            });
            if (!emailSent) {
                user.verificationEmailLastSentAt = undefined;
                try {
                    await user.save();
                } catch {
                    // Preserve the generic response and allow later recovery.
                }
            }

            return res.json({ message: genericResendMessage });
        } catch {
            return res.json({ message: genericResendMessage });
        }
    }
);

// Login
router.post('/login', async (req: Request, res: Response) => {
    try {
        const email = normalizeEmail(req.body.email);
        const password = typeof req.body.password === 'string' ? req.body.password : '';

        if (!isValidEmail(email) || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        if (user.emailVerified === false) {
            return res.status(403).json({ 
                message: 'Please verify your email address before signing in.',
                requiresEmailVerification: true
            });
        }

        const token = createAuthToken(user._id.toString());
        return res.json({ token, user: toPublicUser(user) });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// Request an expiring password recovery code.
router.post('/password/forgot', async (req, res) => {
    try {
        const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
        if (!isValidEmail(email)) return res.status(400).json({ message: 'A valid email is required' });

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
router.get('/me', protect, async (req: AuthRequest, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Not authorized.' });
    }
    return res.json(toPublicUser(req.user));
});

// Update Profile
router.put('/profile', protect, async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findById(req.user?._id).select(
            '+emailVerificationTokenHash +emailVerificationExpiresAt +verificationEmailLastSentAt'
        );
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const nextName = typeof req.body.name === 'string' ? req.body.name.trim() : user.name;
        const nextEmail = req.body.email !== undefined
            ? normalizeEmail(req.body.email)
            : user.email;

        if (!nextName || nextName.length > 100 || !isValidEmail(nextEmail)) {
            return res.status(400).json({ message: 'Enter a valid name and email address' });
        }

        if (
            req.body.password !== undefined
            && (typeof req.body.password !== 'string' || req.body.password.length < 8)
        ) {
            return res.status(400).json({ message: 'Password must contain at least 8 characters' });
        }

        const duplicateEmail = await User.exists({
            email: nextEmail,
            _id: { $ne: user._id },
        });
        if (duplicateEmail) {
            return res.status(409).json({ message: 'Email is already in use' });
        }

        user.name = nextName;
        let newEmailChallenge: ReturnType<typeof createEmailVerificationChallenge> | null = null;
        if (nextEmail !== user.email) {
            newEmailChallenge = createEmailVerificationChallenge();
            user.email = nextEmail;
            user.emailVerified = false;
            user.emailVerifiedAt = undefined;
            user.emailVerificationTokenHash = newEmailChallenge.tokenHash;
            user.emailVerificationExpiresAt = newEmailChallenge.expiresAt;
            user.verificationEmailLastSentAt = newEmailChallenge.issuedAt;
        }

        if (req.body.password) {
            user.password = req.body.password;
        }

        if (req.body.shippingAddress) {
            const shippingAddress = req.body.shippingAddress;
            const addressValues = ['address', 'city', 'postalCode', 'phone']
                .map((field) => String(shippingAddress[field] || '').trim());
            if (
                addressValues.some((value) => !value || value.length > 200) ||
                String(shippingAddress.country || '').trim().toLowerCase() !== 'sri lanka'
            ) {
                return res.status(400).json({ message: 'Enter a complete Sri Lankan shipping address' });
            }
            user.shippingAddress = {
                address: addressValues[0],
                city: addressValues[1],
                postalCode: addressValues[2],
                country: 'Sri Lanka',
                phone: addressValues[3],
            };
        }

        if (req.body.marketingEmailConsent !== undefined) {
            user.marketingEmailConsent = req.body.marketingEmailConsent === true;
            if (user.marketingEmailConsent) {
                user.emailSuppressed = false;
                user.marketingConsentAt = new Date();
                user.marketingConsentSource = 'profile';
            } else {
                user.emailUnsubscribedAt = new Date();
            }
        }

        const updatedUser = await user.save();

        if (newEmailChallenge) {
            const emailSent = await trySendVerificationEmail({
                recipientEmail: updatedUser.email,
                recipientName: updatedUser.name,
                token: newEmailChallenge.token,
            });
            if (!emailSent) {
                updatedUser.verificationEmailLastSentAt = undefined;
                try {
                    await updatedUser.save();
                } catch {
                    // The changed address remains unverified and can request a resend.
                }
            }
        }

        return res.json({
            token: createAuthToken(updatedUser._id.toString()),
            user: toPublicUser(updatedUser),
        });
    } catch (error: unknown) {
        if (
            typeof error === 'object' &&
            error !== null &&
            'code' in error &&
            error.code === 11000
        ) {
            return res.status(409).json({ message: 'Email is already in use' });
        }
        return res.status(500).json({ message: 'Unable to update profile right now.' });
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
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
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

        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

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

// Unsubscribe
router.post('/unsubscribe', async (req: Request, res: Response) => {
    try {
        const email = normalizeEmail(req.body.email);
        const token = req.body.token; // HMAC token for security
        
        if (!isValidEmail(email)) {
            return res.status(400).json({ message: 'Invalid email' });
        }
        
        const expectedToken = crypto.createHmac('sha256', getJwtSecret()).update(`unsubscribe:${email}`).digest('hex');
        if (token !== expectedToken) {
            return res.status(401).json({ message: 'Invalid or expired unsubscribe token' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            // Silently succeed for non-existent users
            return res.json({ message: 'Unsubscribed successfully' });
        }

        user.marketingEmailConsent = false;
        user.emailUnsubscribedAt = new Date();
        user.emailSuppressed = true;
        await user.save();

        res.json({ message: 'Unsubscribed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to process unsubscribe request' });
    }
});

export default router;
