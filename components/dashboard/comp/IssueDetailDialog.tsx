"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { useIssueDetail } from "./issue-detail/use-issue-detail";
import { IssueDetailEditableContent } from "./issue-detail/IssueDetailEditableContent";
import { IssueDetailSkeleton } from "./issue-detail/IssueDetailSkeleton";

interface IssueDetailDialogProps {
  isOpen: boolean;
  openChange: (open: boolean) => void;
  projectId: string;
  issueId: string;
}

export default function IssueDetailDialog({
  isOpen,
  openChange,
  projectId,
  issueId,
}: IssueDetailDialogProps) {
  const tDashboard = useTranslations("dashboard");

  const {
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
    currentUser,
    priorityOptions,
    priorityLabel,
    isDirty,
    mutationState,
    dispatch,
    submitComment,
    onSave,
    onDeleteIssue,
    onUpdateComment,
    onDeleteComment,
  } = useIssueDetail({ projectId, issueId, isOpen, openChange });

  return (
    <Dialog open={isOpen} onOpenChange={openChange}>
      <DialogContent className="w-[95vw] md:w-[85vw] max-w-[95vw] md:max-w-[85vw] max-h-[90vh] overflow-hidden flex flex-col">
        {isLoading ? (
          <>
            <DialogTitle className="sr-only">
              {tDashboard("issue.detail.loadingTitle")}
            </DialogTitle>
            <IssueDetailSkeleton />
          </>
        ) : isError || !issue ? (
          <>
            <DialogTitle className="sr-only">
              {tDashboard("issue.detail.errorTitle")}
            </DialogTitle>
            <DialogDescription className="sr-only">
              {tDashboard("issue.detail.errorDescription")}
            </DialogDescription>
            <IssueDetailSkeleton />
          </>
        ) : (
          <>
            <DialogHeader className="px-1">
              <DialogTitle className="text-2xl font-semibold">
                {tDashboard("issue.detail.dialogTitle", {
                  number: String(issue.number),
                  title: issue.title,
                })}
              </DialogTitle>
            </DialogHeader>

            <IssueDetailEditableContent
              key={issue.id}
              issue={issue}
              assigneeOptions={assigneeOptions}
              reporterName={
                memberNameById.get(issue.reporterId) ?? issue.reporterId
              }
              statusName={columnNameById.get(issue.columnId) ?? issue.columnId}
              currentUser={currentUser}
              comments={comments}
              memberById={memberById}
              mutationState={mutationState}
              state={state}
              dispatch={dispatch}
              submitComment={submitComment}
              onSave={onSave}
              onDeleteIssue={onDeleteIssue}
              onUpdateComment={onUpdateComment}
              onDeleteComment={onDeleteComment}
              priorityOptions={priorityOptions}
              priorityLabel={priorityLabel}
              formatDate={formatDate}
              isDirty={isDirty}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
