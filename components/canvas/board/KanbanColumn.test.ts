import { describe, it, expect } from "vitest";
import { filterAndSortColumnTasks } from "./KanbanColumn";
import type { ApiResponse, PaginatedData } from "@/lib/api/api";
import type { Issue } from "@/lib/api/issue";
import { Priority } from "@/lib/api/issue";

describe("filterAndSortColumnTasks", () => {
  const mockApiResponse: ApiResponse<PaginatedData<Issue>> = {
    statusCode: 200,
    message: "OK",
    data: {
      items: [
        {
          id: "issue-1",
          number: 1,
          title: "Task 1",
          columnId: "col-1",
          sprintId: "sprint-1",
          order: 2000,
          priority: Priority.LOW,
          projectId: "p1",
          reporterId: "u1",
          assigneeId: null,
          description: "",
          createdAt: "2026-01-01",
          updatedAt: "2026-01-01",
        },
        {
          id: "issue-2",
          number: 2,
          title: "Task 2",
          columnId: "col-1",
          sprintId: "sprint-2",
          order: 1000,
          priority: Priority.HIGH,
          projectId: "p1",
          reporterId: "u1",
          assigneeId: null,
          description: "",
          createdAt: "2026-01-01",
          updatedAt: "2026-01-01",
        },
        {
          id: "issue-3",
          number: 3,
          title: "Task 3",
          columnId: "col-2",
          sprintId: "sprint-1",
          order: 1500,
          priority: Priority.MEDIUM,
          projectId: "p1",
          reporterId: "u1",
          assigneeId: null,
          description: "",
          createdAt: "2026-01-01",
          updatedAt: "2026-01-01",
        },
      ],
      total: 3,
      page: 1,
      limit: 100,
    },
  };

  it("should filter tasks by columnId and sort by order ascending when sprint is 'all'", () => {
    const tasks = filterAndSortColumnTasks(mockApiResponse, "col-1", "all");
    expect(tasks).toHaveLength(2);
    expect(tasks[0].id).toBe("issue-2"); // order 1000
    expect(tasks[1].id).toBe("issue-1"); // order 2000
  });

  it("should filter tasks by both columnId and selectedSprintId", () => {
    const tasks = filterAndSortColumnTasks(mockApiResponse, "col-1", "sprint-1");
    expect(tasks).toHaveLength(1);
    expect(tasks[0].id).toBe("issue-1");
  });

  it("should return empty array if response data is empty or undefined", () => {
    expect(filterAndSortColumnTasks(undefined, "col-1")).toEqual([]);
  });
});
