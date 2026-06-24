import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';

dotenv.config({ path: '.env.local' });

const initAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI!);

        const adminEmail = "admin@kavon.net";
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            existingAdmin.role = 'admin';
            await existingAdmin.save();
            console.log("✅ Existing account updated to Administrative clearance.");
        } else {
            const admin = new User({
                name: "Command Center",
                email: adminEmail,
                password: "admin123password",
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
