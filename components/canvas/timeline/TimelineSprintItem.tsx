"use client";

import { memo } from "react";

import { Badge } from "@/components/ui/badge";
import {
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@/components/ui/timeline";
import { cn } from "@/lib/utils";

import type { TimelineSprintItemData } from "./types";

type TimelineSprintItemProps = {
  step: number;
  item: TimelineSprintItemData;
};

function TimelineSprintItem({ step, item }: TimelineSprintItemProps) {
  return (
    <TimelineItem
      step={step}
      className="group-data-[orientation=horizontal]/timeline:mt-0 group-data-[orientation=horizontal]/timeline:min-w-85"
    >
      <TimelineHeader>
        <TimelineSeparator className="group-data-[orientation=horizontal]/timeline:top-8" />
        <TimelineDate className="mb-10">{item.dateLabel}</TimelineDate>
        <TimelineTitle className="text-base">{item.title}</TimelineTitle>
        <TimelineIndicator className="group-data-[orientation=horizontal]/timeline:top-8" />
      </TimelineHeader>

      <TimelineContent className="space-y-3 text-sm text-muted-foreground">
        <div className="flex items-center justify-between gap-2 text-[11px] uppercase tracking-[0.16em]">
          <span>{item.issueCountLabel}</span>
          <span>{item.phaseLabel}</span>
        </div>

        <div className="rounded-xl border border-border/60 bg-muted/25 p-2.5">
          <div className="mb-1.5 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>{item.progressLabel}</span>
            <span>
              {item.progress !== null ? `${Math.round(item.progress)}%` : "-"}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                "h-full rounded-full bg-primary transition-all",
                item.progress === null && "w-0",
              )}
              style={{ width: `${item.progress ?? 0}%` }}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <Badge
              variant={item.statusVariant}
              className={cn(
                item.statusVariant === "default" && "bg-primary/10 text-primary border-primary/20 hover:bg-primary/15 shadow-none",
              )}
            >
              {item.statusLabel}
            </Badge>
            <Badge
              variant={item.phaseVariant}
              className={cn(
                "text-[11px] uppercase tracking-[0.16em]",
                item.phaseVariant === "default" && "bg-primary/10 text-primary border-primary/20 hover:bg-primary/15 shadow-none",
              )}
            >
              {item.phaseLabel}
            </Badge>
          </div>

          {item.issues.length === 0 ? (
            <div className="mt-3 rounded-lg border border-dashed border-border/70 bg-muted/20 p-3 text-sm text-muted-foreground">
              {item.noIssuesLabel}
            </div>
          ) : (
            <ul className="mt-3 space-y-2">
              {item.visibleIssues.map((issue) => (
                <li
                  key={issue.id}
                  className="flex items-start gap-2 rounded-lg border border-border/50 bg-muted/30 px-3 py-1.5 text-sm shadow-sm"
                >
                  <span
                    className={cn(
                      "mt-1 size-1.5 shrink-0 rounded-full",
                      issue.priority === "HIGH"
                        ? "bg-destructive"
                        : issue.priority === "MEDIUM"
                          ? "bg-amber-500"
                          : "bg-emerald-500",
                    )}
                    aria-hidden
                  />
                  <span className="min-w-0 flex-1 truncate text-foreground">
                    #{issue.number} {issue.title}
                  </span>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-2.5 text-[11px] text-muted-foreground">
            <span>{item.statusFooterLabel}</span>
            {item.overflowCount > 0 ? (
              <span>{item.overflowLabel}</span>
            ) : (
              <span>{item.issueCount}</span>
            )}
          </div>
        </div>
      </TimelineContent>
    </TimelineItem>
  );
}

export default memo(TimelineSprintItem);
