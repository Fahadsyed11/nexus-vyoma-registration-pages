import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
    throw new Error(
        "Please define the MONGODB_URI environment variable"
    );
}

interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

declare global {
    var mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongoose ?? {
    conn: null,
    promise: null,
};

global.mongoose = cached;

export async function connectToDatabase(): Promise<typeof mongoose> {
    // 1. Connection already exists
    if (cached.conn) {
        console.log("Using existing MongoDB connection");
        return cached.conn;
    }

    // 2. Connection is currently being created
    if (cached.promise) {
        cached.conn = await cached.promise;
        return cached.conn;
    }

    // 3. Create a new connection
    cached.promise = mongoose.connect(MONGODB_URI);

    try {
        cached.conn = await cached.promise;

        console.log("Connected to MongoDB");

        return cached.conn;
    } catch (error) {
        // Connection failed, so allow another attempt later
        cached.promise = null;

        console.error("Failed to connect to MongoDB:", error);

        throw new Error("Failed to connect to MongoDB");
    }
}