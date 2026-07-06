"use client";

import { useCallback, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

import IssueDetailDialog from "@/components/dashboard/comp/IssueDetailDialog";
import { createColumnsQueryOptions } from "@/queries/column";
import { createIssuesQueryOptions } from "@/queries/issue";
import { createWorkspaceMemberProfilesQueryOptions } from "@/queries/workspace-member";
import BacklogError from "./BacklogError";
import BacklogLoading from "./BacklogLoading";
import BacklogTable from "./BacklogTable";
import type { IssueRow } from "./types";
import BacklogEmpty from "./BacklogEmpty";
import { useDashboard } from "@/lib/store/use-dashboard";

type BacklogCanvasProps = {
  projectId: string;
};

export default function BacklogCanvas({ projectId }: BacklogCanvasProps) {
  const tDashboard = useTranslations("dashboard");
  const { workspaceId } = useParams<{ workspaceId?: string }>();
  const selectedSprintId = useDashboard(
    (state) => state.selectedSprintIdByProject[projectId] ?? "all",
  );
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);

  const {
    data: issuesResponse,
    error: issuesError,
    isLoading: isLoadingIssues,
    refetch: refetchIssues,
    isRefetching: isRefetchingIssues,
  } = useQuery(createIssuesQueryOptions({ projectId, limit: 100 }));

  const {
    data: columnsResponse,
    error: columnsError,
    isLoading: isLoadingColumns,
  } = useQuery(createColumnsQueryOptions({ projectId }));

  const { data: memberProfilesResponse } = useQuery(
    createWorkspaceMemberProfilesQueryOptions(
      { workspaceId: workspaceId ?? "" },
      { enabled: !!workspaceId },
    ),
  );

  const columnsById = useMemo(() => {
    const entries = (columnsResponse?.data ?? []).map(
      (column) => [column.id, column.name] as const,
    );
    return new Map(entries);
  }, [columnsResponse?.data]);

  const membersById = useMemo(() => {
    const entries = (memberProfilesResponse?.data ?? []).map(
      (member) => [member.id, member.name] as const,
    );
    return new Map(entries);
  }, [memberProfilesResponse?.data]);

  const doneColumnIds = useMemo(() => {
    const columns = columnsResponse?.data ?? [];
    if (columns.length === 0) return new Set<string>();

    // Single-pass: find the max order and collect ids that have that order
    let maxOrder = -Infinity;
    let ids: string[] = [];
    for (const column of columns) {
      if (column.order > maxOrder) {
        maxOrder = column.order;
        ids = [column.id];
      } else if (column.order === maxOrder) {
        ids.push(column.id);
      }
    }
    return new Set(ids);
  }, [columnsResponse?.data]);

  const unassignedLabel = tDashboard("issue.assignee.unassigned");

  const backlogRows = useMemo<IssueRow[]>(() => {
    const issues = issuesResponse?.data?.items ?? [];
    const filteredBySprint =
      selectedSprintId === "all"
        ? issues
        : issues.filter((issue) => issue.sprintId === selectedSprintId);

    const filtered =
      doneColumnIds.size > 0
        ? filteredBySprint.filter((issue) => !doneColumnIds.has(issue.columnId))
        : filteredBySprint;

    return filtered.map((issue) => ({
      ...issue,
      assigneeName: issue.assigneeId
        ? (membersById.get(issue.assigneeId) ?? unassignedLabel)
        : unassignedLabel,
      statusName: columnsById.get(issue.columnId) ?? "",
    }));
  }, [
    columnsById,
    doneColumnIds,
    issuesResponse?.data,
    membersById,
    selectedSprintId,
    unassignedLabel,
  ]);

  const handleIssueSelect = useCallback((issueId: string) => {
    setSelectedIssueId(issueId);
  }, []);

  const handleDialogOpenChange = useCallback((open: boolean) => {
    if (!open) setSelectedIssueId(null);
  }, []);

  const handleRetry = useCallback(() => {
    refetchIssues();
  }, [refetchIssues]);

  if (isLoadingIssues || isLoadingColumns) {
    return <BacklogLoading />;
  }

  if (issuesError || columnsError) {
    return (
      <BacklogError onRetry={handleRetry} isRetrying={isRefetchingIssues} />
    );
  }

  if (backlogRows.length === 0) {
    return <BacklogEmpty />;
  }

  return (
    <>
      <BacklogTable rows={backlogRows} onIssueSelect={handleIssueSelect} />

      {selectedIssueId && (
        <IssueDetailDialog
          isOpen={!!selectedIssueId}
          openChange={handleDialogOpenChange}
          projectId={projectId}
          issueId={selectedIssueId}
        />
      )}
    </>
  );
}
