import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './src/models/Product';

dotenv.config({ path: '.env.local' });

async function checkDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI!);
        const count = await Product.countDocuments();
        console.log(`Product count: ${count}`);
        const products = await Product.find();
        console.log('Products:', JSON.stringify(products, null, 2));
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

checkDB();
