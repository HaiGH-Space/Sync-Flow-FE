"use client";

import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";

interface InfiniteScrollSentinelProps {
  onIntersect: () => void;
  isLoading: boolean;
  enabled: boolean;
}

export function InfiniteScrollSentinel({
  onIntersect,
  isLoading,
  enabled,
}: InfiniteScrollSentinelProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onIntersect();
        }
      },
      {
        rootMargin: "100px",
      }
    );

    const currentSentinel = sentinelRef.current;
    if (currentSentinel) {
      observer.observe(currentSentinel);
    }

    return () => {
      if (currentSentinel) {
        observer.unobserve(currentSentinel);
      }
    };
  }, [onIntersect, isLoading, enabled]);

  return (
    <div ref={sentinelRef} className="w-full flex items-center justify-center p-2 min-h-[24px]">
      {isLoading && (
        <Loader2 className="size-4 animate-spin text-muted-foreground" />
      )}
    </div>
  );
}
