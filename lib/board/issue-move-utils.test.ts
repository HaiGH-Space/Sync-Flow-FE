import { describe, expect, it } from "vitest";
import type { ApiResponse, PaginatedData } from "@/lib/api/api";
import { Priority, type Issue } from "@/lib/api/issue";
import {
  calculateNewOrder,
  applyOptimisticIssueMove,
  applyRollbackIssueMove,
} from "./issue-move-utils";

const mockIssues: Issue[] = [
  {
    id: "issue-1",
    number: 1,
    title: "Issue 1",
    description: "",
    priority: Priority.LOW,
    columnId: "col-1",
    order: 1000,
    projectId: "proj-1",
    assigneeId: null,
    reporterId: "user-1",
    sprintId: null,
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01",
  },
  {
    id: "issue-2",
    number: 2,
    title: "Issue 2",
    description: "",
    priority: Priority.MEDIUM,
    columnId: "col-1",
    order: 2000,
    projectId: "proj-1",
    assigneeId: null,
    reporterId: "user-1",
    sprintId: null,
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01",
  },
];

const mockPaginatedData: ApiResponse<PaginatedData<Issue>> = {
  statusCode: 200,
  message: "Success",
  data: {
    items: mockIssues,
    total: 2,
    page: 1,
    limit: 100,
  },
};

describe("issue-move-utils", () => {
  it("should calculate tail order when dropping onto a column target", () => {
    const order = calculateNewOrder({
      targetType: "column",
      targetColumnId: "col-1",
      targetIssues: mockIssues,
      sourceIssueId: "issue-3",
    });
    expect(order).toBe(3000);
  });

  it("should calculate insert order when dropping between two issues", () => {
    const order = calculateNewOrder({
      targetType: "task",
      targetId: "issue-2",
      targetColumnId: "col-1",
      targetIssues: mockIssues,
      sourceIssueId: "issue-3",
    });
    expect(order).toBe(1500);
  });

  it("should apply optimistic issue move to paginated cache data", () => {
    const updated = applyOptimisticIssueMove(
      mockPaginatedData,
      "issue-1",
      "col-2",
      5000,
    );
    expect(updated?.data?.items.find((i) => i.id === "issue-1")).toEqual({
      ...mockIssues[0],
      columnId: "col-2",
      order: 5000,
    });
  });

  it("should apply rollback issue move to paginated cache data on error", () => {
    const movedData = applyOptimisticIssueMove(
      mockPaginatedData,
      "issue-1",
      "col-2",
      5000,
    );
    const rolledBack = applyRollbackIssueMove(
      movedData,
      "issue-1",
      "col-1",
      1000,
    );
    expect(rolledBack?.data?.items.find((i) => i.id === "issue-1")).toEqual({
      ...mockIssues[0],
      columnId: "col-1",
      order: 1000,
    });
  });
});
