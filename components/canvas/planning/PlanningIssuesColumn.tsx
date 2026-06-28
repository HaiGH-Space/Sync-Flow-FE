"use client";

import type { ReactNode } from "react";
import { useDroppable } from "@dnd-kit/react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { Issue } from "@/lib/api/issue";
import PlanningIssueCard from "./PlanningIssueCard";

type PlanningIssuesColumnProps = {
  projectId: string;
  title: string;
  subtitle: string;
  count: number;
  emptyText: string;
  issues: Issue[];
  actionLabel: string;
  onAction: (issue: Issue) => void;
  getPriorityLabel: (priority: Issue["priority"]) => string;
  droppableId: string;
  dropData: { type: "planning-column"; sprintId: string | null };
  dropDisabled?: boolean;
  disabled?: boolean;
  pendingIssueId?: string | null;
  footer?: ReactNode;
  subtitleTone?: "default" | "warning";
};

const PlanningIssuesColumn = function PlanningIssuesColumn({
  projectId,
  title,
  subtitle,
  count,
  emptyText,
  issues,
  actionLabel,
  onAction,
  getPriorityLabel,
  droppableId,
  dropData,
  dropDisabled,
  disabled,
  pendingIssueId,
  footer,
  subtitleTone = "default",
}: PlanningIssuesColumnProps) {
  const { ref: dropRef, isDropTarget } = useDroppable({
    id: droppableId,
    data: dropData,
    disabled: dropDisabled,
  });

  return (
    <section
      ref={dropRef}
      className={cn(
        "flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-border/40 bg-muted/30 p-3 transition-all",
        isDropTarget ? "bg-muted/60 ring-2 ring-primary/40" : "bg-muted/30",
      )}
    >
      <div className="flex shrink-0 items-center justify-between gap-3 pb-2">
        <div>
          <h2 className="text-base font-semibold">{title}</h2>
          <p
            className={cn(
              "text-xs",
              subtitleTone === "warning"
                ? "text-destructive"
                : "text-muted-foreground",
            )}
          >
            {subtitle}
          </p>
        </div>
        <span className="text-xs text-muted-foreground">{count}</span>
      </div>

      <ScrollArea className="min-h-0 flex-1 rounded-lg">
        <div className="space-y-3 pr-1">
          {issues.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border/70 p-6 text-sm text-muted-foreground">
              {emptyText}
            </div>
          ) : (
            issues.map((issue) => (
              <PlanningIssueCard
                key={issue.id}
                projectId={projectId}
                issue={issue}
                priorityLabel={getPriorityLabel(issue.priority)}
                actionLabel={actionLabel}
                onAction={onAction}
                disabled={disabled}
                isPending={Boolean(
                  pendingIssueId && pendingIssueId === issue.id,
                )}
              />
            ))
          )}
        </div>
      </ScrollArea>

      {footer}
    </section>
  );
};

export default PlanningIssuesColumn;
