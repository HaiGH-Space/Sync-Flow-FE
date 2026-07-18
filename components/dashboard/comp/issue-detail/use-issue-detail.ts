import { useReducer, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { useProfile } from "@/hooks/use-profile";
import { createIssueQueryOptions } from "@/queries/issue";
import { createWorkspaceMemberProfilesQueryOptions } from "@/queries/workspace-member";
import { createColumnsQueryOptions } from "@/queries/column";
import { createCommentsQueryOptions } from "@/queries/comment";
import { useUpdateIssue, useDeleteIssue } from "@/hooks/mutations/issue";
import { useCreateComment, useDeleteComment, useUpdateComment } from "@/hooks/mutations/comment";
import { createDateFormatter } from "@/lib/format-date";
import { Priority, type Priority as PriorityType, type Issue } from "@/lib/api/issue";

interface UseIssueDetailProps {
  projectId: string;
  issueId: string;
  isOpen: boolean;
  openChange: (open: boolean) => void;
}

export type IssueDetailEditableState = {
  description: string;
  assigneeId: string;
  priority: PriorityType;
  newComment: string;
  editingCommentId: string | null;
  editingCommentContent: string;
  isDeleteIssueDialogOpen: boolean;
};

export type IssueDetailEditableAction =
  | { type: "descriptionChanged"; value: string }
  | { type: "assigneeChanged"; value: string }
  | { type: "priorityChanged"; value: PriorityType }
  | { type: "newCommentChanged"; value: string }
  | { type: "startEditingComment"; commentId: string; content: string }
  | { type: "cancelEditingComment" }
  | { type: "deleteIssueDialogOpened" }
  | { type: "deleteIssueDialogClosed" };

function createIssueDetailEditableState(
  issue: Issue,
): IssueDetailEditableState {
  return {
    description: issue.description ?? "",
    assigneeId: issue.assigneeId ?? "UNASSIGNED",
    priority: issue.priority,
    newComment: "",
    editingCommentId: null,
    editingCommentContent: "",
    isDeleteIssueDialogOpen: false,
  };
}

function issueDetailEditableReducer(
  state: IssueDetailEditableState,
  action: IssueDetailEditableAction,
): IssueDetailEditableState {
  switch (action.type) {
    case "descriptionChanged":
      return { ...state, description: action.value };
    case "assigneeChanged":
      return { ...state, assigneeId: action.value };
    case "priorityChanged":
      return { ...state, priority: action.value };
    case "newCommentChanged":
      return { ...state, newComment: action.value };
    case "startEditingComment":
      return {
        ...state,
        editingCommentId: action.commentId,
        editingCommentContent: action.content,
      };
    case "cancelEditingComment":
      return { ...state, editingCommentId: null, editingCommentContent: "" };
    case "deleteIssueDialogOpened":
      return { ...state, isDeleteIssueDialogOpen: true };
    case "deleteIssueDialogClosed":
      return { ...state, isDeleteIssueDialogOpen: false };
    default:
      return state;
  }
}

export function useIssueDetail({ projectId, issueId, isOpen, openChange }: UseIssueDetailProps) {
  const tDashboard = useTranslations("dashboard");
  const { data: profile } = useProfile();
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);
  const [updatingCommentId, setUpdatingCommentId] = useState<string | null>(null);
  const params = useParams<{ workspaceId: string }>();
  const workspaceId = params.workspaceId;
  const locale = useLocale();

  const {
    data: issue,
    isLoading,
    isError,
  } = useQuery(
    createIssueQueryOptions(
      { projectId, issueId },
      {
        enabled: !!issueId && isOpen,
        select: (response) => response.data,
      },
    ),
  );

  const { data: memberProfilesResponse } = useQuery(
    createWorkspaceMemberProfilesQueryOptions(
      { workspaceId },
      {
        enabled: !!workspaceId && isOpen,
      },
    ),
  );

  const { data: columnsResponse } = useQuery(
    createColumnsQueryOptions(
      { projectId },
      {
        enabled: !!projectId && isOpen,
      },
    ),
  );

  const { data: comments = [] } = useQuery(
    createCommentsQueryOptions(
      { issueId },
      {
        enabled: !!issueId && isOpen,
        select: (response) => response.data,
      },
    ),
  );

  const { mutate: updateIssue, isPending: isUpdating } = useUpdateIssue(projectId);
  const { mutate: deleteIssue, isPending: isDeletingIssue } = useDeleteIssue(projectId);
  const { mutate: createComment, isPending: isCreatingComment } = useCreateComment(issueId);
  const { mutate: deleteComment, isPending: isDeletingComment } = useDeleteComment(issueId);
  const { mutate: updateComment, isPending: isUpdatingComment } = useUpdateComment(issueId);

  const [state, dispatch] = useReducer(
    issueDetailEditableReducer,
    issue,
    (initialIssue) => {
      if (!initialIssue) {
        return {
          description: "",
          assigneeId: "UNASSIGNED",
          priority: Priority.LOW,
          newComment: "",
          editingCommentId: null,
          editingCommentContent: "",
          isDeleteIssueDialogOpen: false,
        };
      }
      return createIssueDetailEditableState(initialIssue);
    }
  );

  const members = memberProfilesResponse?.data ?? [];
  const assigneeOptions = [
    { value: "UNASSIGNED", label: tDashboard("issue.assignee.unassigned") },
    ...members.map((member) => ({
      value: member.id,
      label:
        profile?.id === member.id
          ? tDashboard("issue.assignee.me", { name: member.name })
          : member.name,
    })),
  ];

  const memberNameById = new Map(
    (memberProfilesResponse?.data ?? []).map(
      (member) => [member.id, member.name] as const,
    )
  );

  const memberById = new Map(
    (memberProfilesResponse?.data ?? []).map(
      (member) => [member.id, member] as const,
    )
  );

  const columnNameById = new Map(
    (columnsResponse?.data ?? []).map(
      (column) => [column.id, column.name] as const,
    )
  );

  const formatDate = createDateFormatter(locale, {
    hour: "2-digit",
    minute: "2-digit",
  });

  const priorityOptions = [
    { value: Priority.LOW, label: tDashboard("issue.priority.low") },
    { value: Priority.MEDIUM, label: tDashboard("issue.priority.medium") },
    { value: Priority.HIGH, label: tDashboard("issue.priority.high") },
  ] as const;

  const priorityLabel =
    priorityOptions.find((option) => option.value === state.priority)?.label ??
    state.priority;

  const normalizedAssigneeId =
    state.assigneeId === "UNASSIGNED" ? null : state.assigneeId;

  const canSubmitComment =
    !!state.newComment.trim() && !!profile?.id && !isCreatingComment;

  const submitComment = () => {
    if (!canSubmitComment) return;
    onCreateComment(state.newComment.trim());
    dispatch({ type: "newCommentChanged", value: "" });
  };

  const isDirty =
    issue ? (
      state.description !== (issue.description ?? "") ||
      normalizedAssigneeId !== (issue.assigneeId ?? null) ||
      state.priority !== issue.priority
    ) : false;

  const onSave = (values: {
    description: string;
    assigneeId: string | null;
    priority: PriorityType;
  }) => {
    if (!issue) return;
    updateIssue(
      {
        projectId,
        issueId: issue.id,
        issueData: values,
      },
      {
        onSuccess: () => {
          toast.success(tDashboard("issue.toast.updated"));
        },
        onError: () => {
          toast.error(tDashboard("issue.toast.updateFailed"));
        },
      },
    );
  };

  const onDeleteIssue = () => {
    if (!issue) return;
    deleteIssue(
      {
        projectId,
        issueId: issue.id,
      },
      {
        onSuccess: () => {
          toast.success(tDashboard("issue.toast.deleted"));
          openChange(false);
        },
        onError: () => {
          toast.error(tDashboard("issue.toast.deleteFailed"));
        },
      },
    );
  };

  const onUpdateComment = (commentId: string, content: string) => {
    if (!issue) return;
    setUpdatingCommentId(commentId);
    updateComment(
      {
        issueId: issue.id,
        commentId,
        data: { content },
      },
      {
        onSuccess: () => {
          toast.success(tDashboard("issue.toast.commentUpdated"));
        },
        onError: () => {
          toast.error(tDashboard("issue.toast.commentUpdateFailed"));
        },
        onSettled: () => {
          setUpdatingCommentId(null);
        },
      },
    );
  };

  const onDeleteComment = (commentId: string) => {
    if (!issue) return;
    setDeletingCommentId(commentId);
    deleteComment(
      {
        issueId: issue.id,
        commentId,
      },
      {
        onSuccess: () => {
          toast.success(tDashboard("issue.toast.commentDeleted"));
        },
        onError: () => {
          toast.error(tDashboard("issue.toast.commentDeleteFailed"));
        },
        onSettled: () => {
          setDeletingCommentId(null);
        },
      },
    );
  };

  const onCreateComment = (content: string) => {
    if (!issue) return;
    if (!profile?.id) {
      toast.error(tDashboard("issue.toast.commentCreateFailed"));
      return;
    }
    createComment(
      {
        issueId: issue.id,
        data: {
          content,
          userId: profile.id,
        },
      },
      {
        onSuccess: () => {
          toast.success(tDashboard("issue.toast.commentCreated"));
        },
        onError: () => {
          toast.error(tDashboard("issue.toast.commentCreateFailed"));
        },
      },
    );
  };

  return {
    issue,
    isLoading,
    isError,
    comments,
    assigneeOptions,
    memberById,
    memberNameById,
    columnNameById,
    formatDate,
    state,
    currentUser: profile,
    priorityOptions,
    priorityLabel,
    canSubmitComment,
    isDirty,
    mutationState: {
      isUpdating,
      isCreatingComment,
      isDeletingComment,
      deletingCommentId,
      isUpdatingComment,
      updatingCommentId,
      isDeletingIssue,
    },
    dispatch,
    submitComment,
    onSave,
    onDeleteIssue,
    onUpdateComment,
    onDeleteComment,
    onCreateComment,
  };
}
