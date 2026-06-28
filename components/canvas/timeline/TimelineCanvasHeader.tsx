"use client";

import { memo } from "react";
import { CheckCircle2, Clock3 } from "lucide-react";

import { Badge } from "@/components/ui/badge";

type TimelineCanvasHeaderProps = {
  timelineLabel: string;
  title: string;
  subtitle: string;
  activeLabel: string;
  activeCount: number;
  upcomingLabel: string;
  upcomingCount: number;
  completedLabel: string;
  completedCount: number;
};

function TimelineCanvasHeader({
  timelineLabel,
  title,
  subtitle,
  activeLabel,
  activeCount,
  upcomingLabel,
  upcomingCount,
  completedLabel,
  completedCount,
}: TimelineCanvasHeaderProps) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card px-4 py-3 shadow-sm">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-3 py-0.5 text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
            <Clock3 className="size-3.5" />
            {timelineLabel}
          </div>
          <div className="space-y-1.5">
            <h2 className="text-xl font-semibold text-foreground">{title}</h2>
            <p className="max-w-2xl text-sm leading-5 text-muted-foreground">
              {subtitle}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-start justify-start gap-2 lg:justify-end">
          <Badge variant="outline" className="gap-1.5 text-[11px] bg-primary/10 text-primary border-primary/20 hover:bg-primary/15 shadow-none">
            <CheckCircle2 className="size-3.5" />
            {activeLabel}: {activeCount}
          </Badge>
          <Badge variant="outline" className="text-[11px]">
            {upcomingLabel}: {upcomingCount}
          </Badge>
          <Badge variant="secondary" className="text-[11px]">
            {completedLabel}: {completedCount}
          </Badge>
        </div>
      </div>
    </div>
  );
}

export default memo(TimelineCanvasHeader);
