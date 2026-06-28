"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import TimelineCanvasHeader from "./TimelineCanvasHeader";
import TimelineEmptyState from "./TimelineEmptyState";
import TimelineErrorState from "./TimelineErrorState";
import TimelineLoadingState from "./TimelineLoadingState";
import TimelineSprintRail from "./TimelineSprintRail";
import { useTimelineCanvasModel } from "./useTimelineCanvasModel";

type TimelineCanvasProps = {
  projectId: string;
};

export default function TimelineCanvas({ projectId }: TimelineCanvasProps) {
  const model = useTimelineCanvasModel(projectId);

  if (model.isLoading) return <TimelineLoadingState />;

  if (model.error) {
    return (
      <TimelineErrorState
        title={model.errorState.title}
        loadingLabel={model.errorState.loadingLabel}
        retryLabel={model.errorState.retryLabel}
        onRetry={model.handleRetry}
        isRetrying={model.isRetrying}
      />
    );
  }

  if (model.items.length === 0) {
    return <TimelineEmptyState {...model.emptyState} />;
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 overflow-hidden">
      <TimelineCanvasHeader {...model.header} />
      <ScrollArea className="w-full flex-1 min-h-0 rounded-2xl border border-border/70 bg-card shadow-sm">
        <div className="px-4 py-5 pr-6">
          <TimelineSprintRail
            activeStep={model.activeStep}
            items={model.items}
          />
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
