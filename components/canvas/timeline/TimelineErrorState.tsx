"use client";


import { CircleAlert, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

type TimelineErrorStateProps = {
  title: string;
  loadingLabel: string;
  retryLabel: string;
  onRetry: () => void;
  isRetrying: boolean;
};

function TimelineErrorState({
  title,
  loadingLabel,
  retryLabel,
  onRetry,
  isRetrying,
}: TimelineErrorStateProps) {
  return (
    <div className="flex h-full items-center justify-center px-4">
      <div className="w-full max-w-lg text-center">
        <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <CircleAlert className="size-6" />
        </div>
        <p className="text-base font-semibold text-foreground">{title}</p>
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          disabled={isRetrying}
          className="mt-4 cursor-pointer min-w-30"
        >
          {isRetrying ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="size-3.5 animate-spin" />
              {loadingLabel}
            </span>
          ) : (
            retryLabel
          )}
        </Button>
      </div>
    </div>
  );
}

export default TimelineErrorState;
