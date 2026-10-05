import mongoose from "mongoose";
import User from "../models/User";

type MongooseCache = {
    connection: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
};

const globalWithMongoose = globalThis as typeof globalThis & {
    __kavonMongoose?: MongooseCache;
};

const cache = globalWithMongoose.__kavonMongoose ?? {
    connection: null,
    promise: null,
};

globalWithMongoose.__kavonMongoose = cache;

export const connectDB = async (): Promise<typeof mongoose> => {
    if (cache.connection && mongoose.connection.readyState === 1) {
        return cache.connection;
    }

    const uri = process.env.MONGODB_URI;
    if (!uri) {
        throw new Error("MONGODB_URI is not defined in environment variables");
    }

    if (!cache.promise) {
        cache.promise = mongoose
            .connect(uri, {
                serverSelectionTimeoutMS: 5000,
                maxPoolSize: 10,
            })
            .then(async (connection) => {
                await User.updateMany(
                    { emailVerified: { $exists: false } },
                    { $set: { emailVerified: true, emailVerifiedAt: new Date() } }
                );
                console.log(`MongoDB connected: ${connection.connection.host}`);
                return connection;
            })
            .catch((error) => {
                // Allow a later request to retry after a temporary Atlas/network failure.
                cache.promise = null;
                throw error;
            });
    }

    cache.connection = await cache.promise;
    return cache.connection;
};
