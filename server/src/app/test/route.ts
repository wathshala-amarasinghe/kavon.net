import { Request, Response } from "express";
import { connectDB } from "@/lib/db";

export const GET = async (req: Request, res: Response) => {
    try {
        await connectDB();

        res.status(200).json({
            success: true,
            message: "MongoDB Connected Successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Database Connection Failed",
            error: error instanceof Error ? error.message : error,
        });
    }
};