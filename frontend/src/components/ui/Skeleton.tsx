"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "tactical";
}

export function Skeleton({ className, variant = "default", ...props }: SkeletonProps) {
    return (
        <div
            className={cn(
                "relative overflow-hidden bg-white/[0.05]",
                variant === "tactical" && "border border-white/5",
                "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/[0.03] before:to-transparent",
                className
            )}
            {...props}
        >
            {variant === "tactical" && (
                <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(transparent_0%,_rgba(223, 7, 21,0.5)_50%,_transparent_100%)] bg-[length:100%_4px] animate-scanline" />
            )}
        </div>
    );
}

export function ProductSkeleton() {
    return (
        <div className="space-y-6">
            <Skeleton className="aspect-[3/4] w-full" variant="tactical" />
            <div className="space-y-3">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
            </div>
        </div>
    );
}
