import express, { NextFunction, Request, Response } from "express";
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

dotenv.config({ path: ".env.local" });

const app = express();
app.disable("x-powered-by");
app.set("trust proxy", 1);

const allowedOrigins = (
    process.env.CORS_ORIGINS ||
    "http://localhost:3000,http://localhost:3001"
)
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(
    cors({
        origin(origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
                return;
            }

            callback(new Error(`CORS blocked origin: ${origin}`));
        },
        credentials: true,
    })
);

app.use(
    helmet({
        crossOriginResourcePolicy: { policy: "cross-origin" },
    })
);

app.use(express.json());
app.use(morgan("dev"));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 1000,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: {
        message: "PROTOCOL_VIOLATION: TOO_MANY_REQUESTS_FROM_THIS_NODE",
    },
});

app.use("/api/", limiter);

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    skipSuccessfulRequests: true,
    message: { message: "Too many login attempts. Please try again later" },
});

const registrationLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 20,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: { message: "Too many registration attempts. Please try again later" },
});

app.use("/api/auth/login", loginLimiter);
app.use("/api/auth/register", registrationLimiter);

const couponLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    limit: 5,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: {
        message: "ACCESS_DENIED: TOO_MANY_COUPON_ATTEMPTS",
    },
});

app.use("/api/coupons/validate", couponLimiter);

const passwordRecoveryLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: { message: "Too many recovery attempts. Please try again later" },
});

app.use("/api/auth/password", passwordRecoveryLimiter);

const trackingLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: { message: "Too many tracking attempts. Please try again later" },
});

app.use("/api/orders/track", trackingLimiter);

const requireDatabase = async (
    _req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error("Database connection failed:", error);
        res.status(503).json({
            message: "Database connection is temporarily unavailable",
        });
    }
};

// Connect lazily per request. A temporary Atlas failure now returns JSON
// instead of terminating the whole Vercel function.
app.use("/api/upload", requireDatabase, uploadRoutes);
app.use("/api/products", requireDatabase, productRoutes);
app.use("/api/auth", requireDatabase, authRoutes);
app.use("/api/orders", requireDatabase, orderRoutes);
app.use("/api/wishlist", requireDatabase, wishlistRoutes);
app.use("/api/reviews", requireDatabase, reviewRoutes);
app.use("/api/settings", requireDatabase, settingsRoutes);
app.use("/api/campaigns", requireDatabase, campaignRoutes);
app.use("/api/coupons", requireDatabase, couponRoutes);

app.get("/", (_req, res) => {
    res.send("KAVON_API: SYSTEM_ACTIVE");
});

app.use(
    (
        error: Error,
        _req: Request,
        res: Response,
        _next: NextFunction
    ) => {
        const isCorsError = error.message.startsWith("CORS blocked origin:");
        if (isCorsError) {
            console.warn("Blocked request from an unapproved origin");
        } else {
            console.error("Unhandled API error:", error);
        }
        const status = isCorsError ? 403 : 500;
        const message = isCorsError
            ? "Origin is not allowed"
            : process.env.NODE_ENV === "production"
                ? "Internal server error"
                : error.message || "Internal server error";
        res.status(status).json({
            message,
        });
    }
);

export default app;
