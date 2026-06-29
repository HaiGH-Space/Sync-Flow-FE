"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export function IssueDetailSkeleton() {
  return (
    <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-[3fr_1fr] gap-8 py-4">
      <div className="space-y-8">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-40 w-full" />
        </div>
        <Separator />
        <div className="space-y-4">
          <Skeleton className="h-4 w-32" />
          <div className="flex gap-3">
            <Skeleton className="size-8 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-20 w-full" />
              <div className="flex justify-end">
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
          </div>
          <div className="space-y-3">
            {[1, 2].map((item) => (
              <div key={item} className="flex gap-3 rounded-lg border p-3">
                <Skeleton className="size-8 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between gap-2">
                    <Skeleton className="h-4 w-30" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="space-y-6">
        {[1, 2, 3].map((item) => (
          <div key={item} className="space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-8 w-full" />
          </div>
        ))}
        <Separator />
        <Skeleton className="h-9 w-full" />
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    </div>
  );
}
