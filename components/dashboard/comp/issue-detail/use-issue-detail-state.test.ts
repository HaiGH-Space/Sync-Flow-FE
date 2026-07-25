import { describe, expect, it } from "vitest";
import {
  issueDetailEditableReducer,
  createIssueDetailEditableState,
} from "./use-issue-detail";
import { Priority, type Issue } from "@/lib/api/issue";

const mockIssue: Issue = {
  id: "issue-1",
  number: 1,
  title: "Test Issue",
  description: "Initial description",
  columnId: "col-1",
  order: 1000,
  projectId: "proj-1",
  reporterId: "user-1",
  assigneeId: "user-2",
  sprintId: null,
  priority: Priority.MEDIUM,
  createdAt: "2026-01-01",
  updatedAt: "2026-01-01",
};

describe("issueDetailEditableReducer & state initialization", () => {
  it("should initialize state correctly from an issue", () => {
    const initialState = createIssueDetailEditableState(mockIssue);
    expect(initialState).toEqual({
      description: "Initial description",
      assigneeId: "user-2",
      priority: Priority.MEDIUM,
      newComment: "",
      editingCommentId: null,
      editingCommentContent: "",
      isDeleteIssueDialogOpen: false,
    });
  });

  it("should update description state", () => {
    const state = createIssueDetailEditableState(mockIssue);
    const next = issueDetailEditableReducer(state, {
      type: "descriptionChanged",
      value: "Updated description",
    });
    expect(next.description).toBe("Updated description");
  });

  it("should update assignee state", () => {
    const state = createIssueDetailEditableState(mockIssue);
    const next = issueDetailEditableReducer(state, {
      type: "assigneeChanged",
      value: "user-3",
    });
    expect(next.assigneeId).toBe("user-3");
  });

  it("should update priority state", () => {
    const state = createIssueDetailEditableState(mockIssue);
    const next = issueDetailEditableReducer(state, {
      type: "priorityChanged",
      value: Priority.HIGH,
    });
    expect(next.priority).toBe(Priority.HIGH);
  });

  it("should handle comment editing state transitions", () => {
    const state = createIssueDetailEditableState(mockIssue);
    const editingState = issueDetailEditableReducer(state, {
      type: "startEditingComment",
      commentId: "comment-1",
      content: "Editing content",
    });
    expect(editingState.editingCommentId).toBe("comment-1");
    expect(editingState.editingCommentContent).toBe("Editing content");

    const cancelledState = issueDetailEditableReducer(editingState, {
      type: "cancelEditingComment",
    });
    expect(cancelledState.editingCommentId).toBeNull();
    expect(cancelledState.editingCommentContent).toBe("");
  });

  it("should handle delete issue dialog open/close actions", () => {
    const state = createIssueDetailEditableState(mockIssue);
    const openedState = issueDetailEditableReducer(state, {
      type: "deleteIssueDialogOpened",
    });
    expect(openedState.isDeleteIssueDialogOpen).toBe(true);

    const closedState = issueDetailEditableReducer(openedState, {
      type: "deleteIssueDialogClosed",
    });
    expect(closedState.isDeleteIssueDialogOpen).toBe(false);
  });
});
