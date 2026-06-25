import { Skeleton } from "@/components/ui/skeleton";

export const ProfileCardSkeleton = () => {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 flex flex-col gap-6 relative">
      {/* Top Section: Image and Info */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Profile Image Skeleton */}
        <Skeleton className="w-24 h-24 md:w-28 md:h-28 rounded-xl" />

        {/* Title and Tags Skeleton */}
        <div className="flex flex-col gap-4 flex-1">
          <Skeleton className="h-8 w-64 md:h-9" />

          {/* Tags Pills Skeleton */}
          <div className="flex flex-wrap gap-2 md:gap-3">
            <Skeleton className="h-7 w-24 rounded-full" />
            <Skeleton className="h-7 w-28 rounded-full" />
            <Skeleton className="h-7 w-32 rounded-full" />
            <Skeleton className="h-7 w-24 rounded-full" />
          </div>
        </div>
      </div>

      {/* Bottom Section: Description and Button */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-5 w-full max-w-[80%]" />
          <Skeleton className="h-5 w-3/4 max-w-[60%]" />
          <Skeleton className="h-5 w-1/2 max-w-[40%]" />
        </div>

        {/* Button Skeleton */}
        <div className="md:absolute md:bottom-8 md:right-8 flex justify-end">
          <Skeleton className="h-12 w-32 rounded-full" />
        </div>
      </div>
    </div>
  );
};
