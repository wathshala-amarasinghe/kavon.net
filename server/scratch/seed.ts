import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    images: { type: [String], required: true },
    colors: [
        {
            name: { type: String, required: true },
            hex: { type: String, required: true },
            img: { type: String, required: true }
        }
    ],
    sizes: [
        {
            label: { type: String, required: true },
            stock: { type: Number, required: true, default: 0 }
        }
    ],
    stock: { type: Number, required: true, default: 0 },
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

const seedProducts = [
    {
        name: 'TECH-WEAR VEST // NEON',
        description: 'High-visibility tactical vest with modular attachments and waterproof lining. Engineered for the modern nomad with a focus on modular utility.',
        price: 28500,
        category: 'Outerwear',
        images: ['/images/new_drops/drop_1.jpeg', '/images/new_drops/drop_1_back.jpeg'],
        colors: [
            { name: 'Volt', hex: '#3fff75', img: '/images/new_drops/drop_1.jpeg' },
            { name: 'Blackout', hex: '#000000', img: '/images/new_drops/drop_1_black.jpeg' }
        ],
        sizes: [
            { label: 'S', stock: 5 },
            { label: 'M', stock: 10 },
            { label: 'L', stock: 2 }
        ],
        stock: 17
    },
    {
        name: 'GRAPHIC TEE // VOID',
        description: 'Oversized heavy cotton tee with high-density archival print. A core silhouette for the KAVON operative.',
        price: 7500,
        category: 'Tops',
        images: ['/images/new_drops/drop_2.jpeg'],
        colors: [
            { name: 'Void Black', hex: '#050505', img: '/images/new_drops/drop_2.jpeg' }
        ],
        sizes: [
            { label: 'S', stock: 20 },
            { label: 'M', stock: 15 },
            { label: 'L', stock: 15 }
        ],
        stock: 50
    },
    {
        name: 'UTILITY SHORTS // MOSS',
        description: 'Multi-pocket tactical shorts engineered for maximum mobility in urban environments.',
        price: 14500,
        category: 'Bottoms',
        images: ['/images/new_drops/drop_3.jpeg'],
        colors: [
            { name: 'Moss Green', hex: '#4A5D23', img: '/images/new_drops/drop_3.jpeg' }
        ],
        sizes: [
            { label: 'M', stock: 12 },
            { label: 'L', stock: 13 }
        ],
        stock: 25
    },
    {
        name: 'WINDBREAKER // GHOST',
        description: 'Ultra-lightweight windbreaker with reflective branding and stowaway hood. Deflect the elements in silence.',
        price: 32000,
        category: 'Outerwear',
        images: ['/images/new_drops/drop_4.jpeg'],
        colors: [
            { name: 'Ghost White', hex: '#F0F0F0', img: '/images/new_drops/drop_4.jpeg' }
        ],
        sizes: [
            { label: 'S', stock: 2 },
            { label: 'M', stock: 4 },
            { label: 'L', stock: 2 }
        ],
        stock: 8
    }
];

async function seed() {
    try {
        console.log('Connecting to:', process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI!);
        console.log('Connected to MongoDB');
        
        await Product.deleteMany({});
        console.log('Cleared existing products');
        
        await Product.insertMany(seedProducts);
        console.log('Successfully seeded database with 4 products');
        
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seed();
