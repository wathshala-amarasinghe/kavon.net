import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import { connectDB } from "./config/db";
import productRoutes from "./routes/productRoutes";
import authRoutes from "./routes/authRoutes";
import orderRoutes from "./routes/orderRoutes";
import wishlistRoutes from "./routes/wishlistRoutes";
import reviewRoutes from "./routes/reviewRoutes";
import settingsRoutes from "./routes/settingsRoutes";
import uploadRoutes from "./routes/uploadRoutes";
import campaignRoutes from "./routes/campaignRoutes";
import couponRoutes from "./routes/couponRoutes";
import path from "path";

dotenv.config({ path: ".env.local" });

const app = express();

app.use(cors());
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(express.json());
app.use(morgan('dev'));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 1000,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { message: "PROTOCOL_VIOLATION: TOO_MANY_REQUESTS_FROM_THIS_NODE" }
});

app.use("/api/", limiter);

const couponLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    limit: 5, // Limit each IP to 5 coupon validation attempts per window
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { message: "ACCESS_DENIED: TOO_MANY_COUPON_ATTEMPTS" }
});

app.use("/api/coupons/validate", couponLimiter);

// Serve uploads directory statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

connectDB();

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/coupons", couponRoutes);

app.get("/", (req, res) => {
    res.send("KAVON_API: SYSTEM_ACTIVE");
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
