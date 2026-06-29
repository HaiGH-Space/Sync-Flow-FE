"use client";
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import DeleteConfirmModal from "@/components/dashboard/comp/DeleteConfirmModal";
import { useTranslations } from "next-intl";
import type { Issue } from "@/lib/api/issue";
import type { Comment } from "@/lib/api/comment";
import type { UserProfile } from "@/lib/api/user";
import type { Priority as PriorityType } from "@/lib/api/issue";
import { IssueDescriptionSection } from "./IssueDescriptionSection";
import { IssueCommentsSection } from "./IssueCommentsSection";
import { IssueSidebarSection } from "./IssueSidebarSection";
import { type IssueDetailEditableState, type IssueDetailEditableAction } from "./use-issue-detail";

interface IssueDetailEditableContentProps {
  issue: Issue;
  assigneeOptions: Array<{ value: string; label: string }>;
  reporterName: string;
  statusName: string;
  currentUser?: UserProfile;
  comments: Comment[];
  memberById: Map<string, UserProfile>;
  mutationState: {
    isUpdating: boolean;
    isCreatingComment: boolean;
    isDeletingComment: boolean;
    deletingCommentId: string | null;
    isUpdatingComment: boolean;
    updatingCommentId: string | null;
    isDeletingIssue: boolean;
  };
  state: IssueDetailEditableState;
  dispatch: React.Dispatch<IssueDetailEditableAction>;
  submitComment: () => void;
  onSave: (values: {
    description: string;
    assigneeId: string | null;
    priority: PriorityType;
  }) => void;
  onDeleteIssue: () => void;
  onUpdateComment: (commentId: string, content: string) => void;
  onDeleteComment: (commentId: string) => void;
  priorityOptions: ReadonlyArray<{ value: PriorityType; label: string }>;
  priorityLabel: string;
  formatDate: (value: string | number | Date) => string;
  isDirty: boolean;
}

export function IssueDetailEditableContent({
  issue,
  assigneeOptions,
  reporterName,
  statusName,
  currentUser,
  comments,
  memberById,
  mutationState,
  state,
  dispatch,
  submitComment,
  onSave,
  onDeleteIssue,
  onUpdateComment,
  onDeleteComment,
  priorityOptions,
  priorityLabel,
  formatDate,
  isDirty,
}: IssueDetailEditableContentProps) {
  const tDashboard = useTranslations("dashboard");

  const {
    isUpdating,
    isCreatingComment,
    isDeletingComment,
    deletingCommentId,
    isUpdatingComment,
    updatingCommentId,
    isDeletingIssue,
  } = mutationState;

  const normalizedAssigneeId =
    state.assigneeId === "UNASSIGNED" ? null : state.assigneeId;

  const canSubmitComment =
    !!state.newComment.trim() && !!currentUser?.id && !isCreatingComment;

  return (
    <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-[3fr_1fr] gap-8 py-4">
      <ScrollArea className="min-h-0 pr-4">
        <div className="space-y-8 pb-1">
          <IssueDescriptionSection
            value={state.description}
            onChange={(next) =>
              dispatch({ type: "descriptionChanged", value: next })
            }
          />

          <Separator />

          <IssueCommentsSection
            comments={comments}
            currentUser={currentUser}
            memberById={memberById}
            formatDate={formatDate}
            newComment={state.newComment}
            commentState={{
              canSubmit: canSubmitComment,
              isCreating: isCreatingComment,
              isDeleting: isDeletingComment,
              deletingCommentId,
              isUpdating: isUpdatingComment,
              updatingCommentId,
            }}
            editingCommentId={state.editingCommentId}
            editingCommentContent={state.editingCommentContent}
            onNewCommentChange={(next) =>
              dispatch({ type: "newCommentChanged", value: next })
            }
            onSubmit={submitComment}
            onStartEditing={(commentId, content) =>
              dispatch({ type: "startEditingComment", commentId, content })
            }
            onCancelEditing={() => dispatch({ type: "cancelEditingComment" })}
            onEditingValueChange={(commentId, content) =>
              dispatch({ type: "startEditingComment", commentId, content })
            }
            onDelete={onDeleteComment}
            onUpdate={onUpdateComment}
          />
        </div>
      </ScrollArea>

      <IssueSidebarSection
        statusName={statusName}
        assigneeOptions={assigneeOptions}
        assigneeId={state.assigneeId}
        onAssigneeChange={(value) =>
          dispatch({ type: "assigneeChanged", value })
        }
        priority={state.priority}
        priorityOptions={priorityOptions}
        priorityLabel={priorityLabel}
        onPriorityChange={(value) =>
          dispatch({ type: "priorityChanged", value })
        }
        isDirty={isDirty}
        isUpdating={isUpdating}
        isDeletingIssue={isDeletingIssue}
        onSave={() =>
          onSave({
            description: state.description,
            assigneeId: normalizedAssigneeId,
            priority: state.priority,
          })
        }
        onDeleteClick={() => dispatch({ type: "deleteIssueDialogOpened" })}
        deleteModal={
          <DeleteConfirmModal
            isOpen={state.isDeleteIssueDialogOpen}
            isLoading={isDeletingIssue}
            title={tDashboard("issue.delete.title", { title: issue.title })}
            description={tDashboard("issue.delete.description")}
            onClose={(open) =>
              dispatch({
                type: open
                  ? "deleteIssueDialogOpened"
                  : "deleteIssueDialogClosed",
              })
            }
            onConfirm={() => {
              onDeleteIssue();
              dispatch({ type: "deleteIssueDialogClosed" });
            }}
          />
        }
        reporterName={reporterName}
        createdAt={issue.createdAt}
        updatedAt={issue.updatedAt}
        formatDate={formatDate}
      />
    </div>
  );
}
