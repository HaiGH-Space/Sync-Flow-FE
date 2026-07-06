"use client";

import { useState } from "react";
import { DragDropProvider } from "@dnd-kit/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { createIssuesQueryOptions, issueKeys } from "@/queries/issue";
import { createSprintsQueryOptions } from "@/queries/sprint";
import { useDashboard } from "@/lib/store/use-dashboard";
import { useUpdateIssue } from "@/hooks/mutations/issue";
import type { Issue } from "@/lib/api/issue";
import type { ApiResponse, PaginatedData } from "@/lib/api/api";
import PlanningIssuesColumn from "./PlanningIssuesColumn";

type PlanningCanvasProps = {
  projectId: string;
};

export default function PlanningCanvas({ projectId }: PlanningCanvasProps) {
  const tDashboard = useTranslations("dashboard");
  const selectedSprintId = useDashboard(
    (state) => state.selectedSprintIdByProject[projectId] ?? "all",
  );
  const { mutate: updateIssue, isPending } = useUpdateIssue(projectId);
  const [pendingIssueId, setPendingIssueId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const {
    data: issuesResponse,
    isLoading,
    error,
  } = useQuery(createIssuesQueryOptions({ projectId, limit: 100 }));

  const { data: sprintsResponse } = useQuery(
    createSprintsQueryOptions({ projectId, limit: 100 }, { enabled: !!projectId }),
  );

  const issues = issuesResponse?.data?.items ?? [];
  const selectedSprint =
    sprintsResponse?.data?.items?.find((sprint) => sprint.id === selectedSprintId) ??
    null;

  const isSprintSelected = selectedSprintId !== "all" && !!selectedSprint;

  const unassignedIssues = issues
    .filter((issue) => !issue.sprintId)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  const selectedSprintIssues = issues
    .filter((issue) => issue.sprintId === selectedSprintId)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  const getPriorityLabel = (priority: Issue["priority"]) => {
    if (priority === "HIGH") return tDashboard("issue.priority.high");
    if (priority === "MEDIUM") return tDashboard("issue.priority.medium");
    return tDashboard("issue.priority.low");
  };

  const handleMoveIssue = (issueId: string, sprintId: string | null) => {
    setPendingIssueId(issueId);
    const previousIssues = queryClient.getQueryData<ApiResponse<PaginatedData<Issue>>>(
      issueKeys.list(projectId, { limit: 100 }),
    );
    if (previousIssues?.data?.items) {
      queryClient.setQueryData<ApiResponse<PaginatedData<Issue>>>(issueKeys.list(projectId, { limit: 100 }), {
        ...previousIssues,
        data: {
          ...previousIssues.data,
          items: previousIssues.data.items.map((issue) =>
            issue.id === issueId ? { ...issue, sprintId } : issue,
          ),
        }
      });
    }
    updateIssue(
      { projectId, issueId, issueData: { sprintId } },
      {
        onSuccess: () => {
          toast.success(tDashboard("issue.toast.updated"));
        },
        onError: () => {
          if (previousIssues) {
            queryClient.setQueryData(issueKeys.list(projectId, { limit: 100 }), previousIssues);
          }
          toast.error(tDashboard("issue.toast.updateFailed"));
        },
        onSettled: () => {
          setPendingIssueId(null);
        },
      },
    );
  };

  const handleAssignToSprint = (issue: Issue) => {
    if (!isSprintSelected) return;
    handleMoveIssue(issue.id, selectedSprintId);
  };

  const handleRemoveFromSprint = (issue: Issue) => {
    handleMoveIssue(issue.id, null);
  };

  const handleDragEnd: React.ComponentProps<
    typeof DragDropProvider
  >["onDragEnd"] = (event) => {
    const { operation, canceled } = event;
    if (canceled) return;

    const { source, target } = operation;
    if (!source || !target) return;

    if (source.data?.type !== "planning-issue") return;
    if (target.data?.type !== "planning-column") return;

    const issue = source.data?.issue as Issue | undefined;
    if (!issue) return;

    const targetSprintId = target.data?.sprintId ?? null;
    if (issue.sprintId === targetSprintId) return;

    if (targetSprintId && !isSprintSelected) return;
    handleMoveIssue(issue.id, targetSprintId);
  };

  if (isLoading) {
    return (
      <div className="text-sm text-muted-foreground">
        {tDashboard("planning.loading")}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-destructive">
        {tDashboard("planning.error")}
      </div>
    );
  }

  return (
    <DragDropProvider onDragEnd={handleDragEnd}>
      <div className="grid h-full grid-cols-1 gap-6 lg:grid-cols-2">
        <PlanningIssuesColumn
          projectId={projectId}
          title={tDashboard("planning.unassignedTitle")}
          subtitle={tDashboard("planning.unassignedHint")}
          count={unassignedIssues.length}
          emptyText={tDashboard("planning.emptyUnassigned")}
          issues={unassignedIssues}
          actionLabel={tDashboard("planning.moveToSprint")}
          onAction={handleAssignToSprint}
          getPriorityLabel={getPriorityLabel}
          droppableId="planning-unassigned"
          dropData={{ type: "planning-column", sprintId: null }}
          disabled={!isSprintSelected}
          pendingIssueId={isPending ? pendingIssueId : null}
          footer={
            !isSprintSelected ? (
              <div className="rounded-lg border border-border/60 bg-muted/30 p-4 text-xs text-muted-foreground">
                {tDashboard("planning.selectSprintHint")}
              </div>
            ) : null
          }
        />

        <PlanningIssuesColumn
          projectId={projectId}
          title={tDashboard("planning.sprintTitle")}
          subtitle={
            isSprintSelected
              ? (selectedSprint?.name ?? "")
              : tDashboard("planning.sprintNotSelected")
          }
          subtitleTone={isSprintSelected ? "default" : "warning"}
          count={selectedSprintIssues.length}
          emptyText={tDashboard("planning.emptySprint")}
          issues={selectedSprintIssues}
          actionLabel={tDashboard("planning.removeFromSprint")}
          onAction={handleRemoveFromSprint}
          getPriorityLabel={getPriorityLabel}
          droppableId="planning-sprint"
          dropData={{
            type: "planning-column",
            sprintId: isSprintSelected ? selectedSprintId : null,
          }}
          dropDisabled={!isSprintSelected}
          disabled={!isSprintSelected}
          pendingIssueId={isPending ? pendingIssueId : null}
        />
      </div>
    </DragDropProvider>
  );
}
