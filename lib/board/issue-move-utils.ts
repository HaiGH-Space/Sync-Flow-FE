import type { ApiResponse, PaginatedData } from "@/lib/api/api";
import type { Issue } from "@/lib/api/issue";
import { getInsertOrder, getTailOrder } from "@/lib/ordering";

export interface CalculateNewOrderParams {
  targetType: string;
  targetId?: string;
  targetColumnId: string;
  targetIssues: Issue[];
  sourceIssueId: string;
}

export function calculateNewOrder({
  targetType,
  targetId,
  targetIssues,
}: CalculateNewOrderParams): number {
  if (targetType === "column" || !targetId) {
    const lastIssue = targetIssues[targetIssues.length - 1];
    return getTailOrder(lastIssue?.order);
  }

  const targetIndex = targetIssues.findIndex((issue) => issue.id === targetId);
  if (targetIndex === -1) {
    const lastIssue = targetIssues[targetIssues.length - 1];
    return getTailOrder(lastIssue?.order);
  }

  const prevIssue = targetIssues[targetIndex - 1];
  const nextIssue = targetIssues[targetIndex];
  return getInsertOrder(prevIssue?.order, nextIssue?.order).order;
}

export function applyOptimisticIssueMove(
  oldData: ApiResponse<PaginatedData<Issue>> | undefined,
  issueId: string,
  targetColumnId: string,
  newOrder: number,
): ApiResponse<PaginatedData<Issue>> | undefined {
  if (!oldData?.data) return oldData;
  return {
    ...oldData,
    data: {
      ...oldData.data,
      items: oldData.data.items.map((issue) =>
        issue.id === issueId
          ? { ...issue, columnId: targetColumnId, order: newOrder }
          : issue,
      ),
    },
  };
}

export function applyRollbackIssueMove(
  oldData: ApiResponse<PaginatedData<Issue>> | undefined,
  issueId: string,
  originalColumnId: string,
  originalOrder: number,
): ApiResponse<PaginatedData<Issue>> | undefined {
  if (!oldData?.data) return oldData;
  return {
    ...oldData,
    data: {
      ...oldData.data,
      items: oldData.data.items.map((issue) =>
        issue.id === issueId
          ? { ...issue, columnId: originalColumnId, order: originalOrder }
          : issue,
      ),
    },
  };
}
