"use client";

import React from 'react';

interface SkeletonProps {
    className?: string;
}

export const SkeletonLoader = ({ className = "" }: SkeletonProps) => {
    return (
        <div className={`skeleton rounded-none ${className}`} />
    );
};

export const ProductSkeleton = () => {
    return (
        <div className="flex flex-col gap-4">
            <SkeletonLoader className="aspect-[3/4] w-full" />
            <div className="flex flex-col gap-2">
                <SkeletonLoader className="h-6 w-3/4" />
                <SkeletonLoader className="h-4 w-1/2" />
                <div className="flex justify-between items-center mt-2">
                    <SkeletonLoader className="h-8 w-1/4" />
                    <SkeletonLoader className="h-8 w-1/3" />
                </div>
            </div>
        </div>
    );
};
