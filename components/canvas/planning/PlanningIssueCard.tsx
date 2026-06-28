"use client";

import { useState } from "react";
import { useDraggable } from "@dnd-kit/react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Issue } from "@/lib/api/issue";
import { Priority } from "@/lib/api/issue";
import { cn } from "@/lib/utils";
import IssueDetailDialog from "@/components/dashboard/comp/IssueDetailDialog";

type PlanningIssueCardProps = {
  projectId: string;
  issue: Issue;
  priorityLabel: string;
  actionLabel: string;
  onAction: (issue: Issue) => void;
  disabled?: boolean;
  isPending?: boolean;
};

const PlanningIssueCard = function PlanningIssueCard({
  projectId,
  issue,
  priorityLabel,
  actionLabel,
  onAction,
  disabled,
  isPending,
}: PlanningIssueCardProps) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const { ref, isDragging } = useDraggable({
    id: issue.id,
    data: { type: "planning-issue", issue },
  });

  return (
    <>
      <div
        ref={ref}
        className={cn(
          "rounded-lg border border-border/70 bg-card p-3 shadow-sm cursor-grab transition-all hover:border-border hover:shadow-xs focus-visible:ring-2 focus-visible:ring-ring",
          isDragging && "opacity-70 border-dashed",
        )}
      >
        <button
          type="button"
          onClick={() => setIsDetailOpen(true)}
          className="w-full text-left"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-xs text-muted-foreground">
                #{issue.number}
              </div>
              <div className="text-sm font-medium text-foreground line-clamp-2">
                {issue.title}
              </div>
            </div>
            <Badge
              variant="outline"
              className={cn(
                "shrink-0 hover:bg-transparent shadow-none border font-normal py-0.5 px-1.5",
                issue.priority === Priority.HIGH
                  ? "bg-destructive/15 text-destructive border-destructive/20 dark:bg-destructive/20"
                  : issue.priority === Priority.MEDIUM
                    ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20"
                    : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
              )}
            >
              {priorityLabel}
            </Badge>
          </div>
        </button>
        <div className="flex items-center justify-end mt-3">
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={disabled || isPending}
            onClick={(event) => {
              event.stopPropagation();
              onAction(issue);
            }}
          >
            {isPending ? "..." : actionLabel}
          </Button>
        </div>
      </div>

      <IssueDetailDialog
        isOpen={isDetailOpen}
        openChange={setIsDetailOpen}
        projectId={projectId}
        issueId={issue.id}
      />
    </>
  );
};

export default PlanningIssueCard;
