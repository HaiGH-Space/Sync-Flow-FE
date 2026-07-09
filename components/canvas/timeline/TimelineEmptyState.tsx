"use client";


import { CalendarRange } from "lucide-react";

import { Badge } from "@/components/ui/badge";

type TimelineEmptyStateProps = {
  title: string;
  hint: string;
  unscheduledIssuesLabel: string;
  unscheduledIssuesCount: number;
  totalSprintsLabel: string;
};

function TimelineEmptyState({
  title,
  hint,
  unscheduledIssuesLabel,
  unscheduledIssuesCount,
  totalSprintsLabel,
}: TimelineEmptyStateProps) {
  return (
    <div className="flex h-full items-center justify-center px-4">
      <div className="w-full max-w-2xl rounded-2xl border border-border/70 bg-card/80 p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <CalendarRange className="size-6" />
        </div>
        <p className="text-base font-semibold text-foreground">{title}</p>
        <p className="mt-2 text-sm text-muted-foreground">{hint}</p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
          <Badge variant="outline">
            {unscheduledIssuesLabel}: {unscheduledIssuesCount}
          </Badge>
          <Badge variant="secondary">{totalSprintsLabel}: 0</Badge>
        </div>
      </div>
    </div>
  );
}

export default TimelineEmptyState;
