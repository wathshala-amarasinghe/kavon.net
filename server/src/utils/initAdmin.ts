import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';

dotenv.config({ path: '.env.local' });

const initAdmin = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI;
        const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
        const adminPassword = process.env.ADMIN_PASSWORD;
        const adminName = process.env.ADMIN_NAME?.trim() || "Command Center";

        if (!mongoUri || !adminEmail || !adminPassword || adminPassword.length < 12) {
            throw new Error(
                "MONGODB_URI, ADMIN_EMAIL, and an ADMIN_PASSWORD of at least 12 characters are required"
            );
        }

        await mongoose.connect(mongoUri);
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            existingAdmin.role = 'admin';
            await existingAdmin.save();
            console.log("✅ Existing account updated to Administrative clearance.");
        } else {
            const admin = new User({
                name: adminName,
                email: adminEmail,
                password: adminPassword,
                role: 'admin'
            });
            await admin.save();
            console.log("✅ Default Administrative account created.");
        }

        process.exit(0);
    } catch (error) {
        console.error("❌ Auth Initialization Failed:", error);
        process.exit(1);
    }
};

initAdmin();
