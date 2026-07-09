"use client";



import { Skeleton } from "@/components/ui/skeleton";

function TimelineLoadingState() {
  return (
    <div className="flex h-full flex-col gap-4">
      <Skeleton className="h-32 rounded-2xl border border-border/70" />
      <Skeleton className="min-h-105 flex-1 rounded-2xl border border-border/70" />
    </div>
  );
}

export default TimelineLoadingState;
