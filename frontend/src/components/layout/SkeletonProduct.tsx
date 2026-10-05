import { Skeleton } from "../ui/Skeleton";

export function SkeletonProduct() {
    return (
        <div className="space-y-6">
            <Skeleton className="aspect-[3/4] w-full" variant="tactical" />
            <div className="space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </div>
        </div>
    );
}