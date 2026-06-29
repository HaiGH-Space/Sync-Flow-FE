"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { type Comment } from "@/lib/api/comment";
import { type UserProfile } from "@/lib/api/user";
import { useTranslations } from "next-intl";
import { IssueCommentItem } from "./IssueCommentItem";

type IssueCommentsSectionProps = {
  comments: Comment[];
  currentUser: UserProfile | undefined;
  memberById: Map<string, UserProfile>;
  formatDate: (value: string | number | Date) => string;
  newComment: string;
  commentState: {
    canSubmit: boolean;
    isCreating: boolean;
    isDeleting: boolean;
    deletingCommentId: string | null;
    isUpdating: boolean;
    updatingCommentId: string | null;
  };
  editingCommentId: string | null;
  editingCommentContent: string;
  onNewCommentChange: (next: string) => void;
  onSubmit: () => void;
  onStartEditing: (commentId: string, content: string) => void;
  onCancelEditing: () => void;
  onEditingValueChange: (commentId: string, content: string) => void;
  onDelete: (commentId: string) => void;
  onUpdate: (commentId: string, content: string) => void;
};

export function IssueCommentsSection({
  comments,
  currentUser,
  memberById,
  formatDate,
  newComment,
  commentState,
  editingCommentId,
  editingCommentContent,
  onNewCommentChange,
  onSubmit,
  onStartEditing,
  onCancelEditing,
  onEditingValueChange,
  onDelete,
  onUpdate,
}: IssueCommentsSectionProps) {
  const tDashboard = useTranslations("dashboard");

  return (
    <div className="space-y-4">
      <h3 id="issue-comments-label" className="font-medium">
        {tDashboard("issue.detail.commentsLabel")}
      </h3>

      <div className="flex gap-3">
        <Avatar className="size-8">
          <AvatarImage src={currentUser?.image} />
          <AvatarFallback>
            {(currentUser?.name ?? "U").charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-2">
          <textarea
            aria-labelledby="issue-comments-label"
            className="w-full min-h-20 rounded-md border bg-muted/30 p-3 text-sm text-foreground/80 leading-relaxed outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            placeholder={tDashboard("issue.detail.commentPlaceholder")}
            value={newComment}
            onChange={(e) => onNewCommentChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSubmit();
              }
            }}
          />

          <div className="flex justify-end">
            <Button
              size="sm"
              disabled={!commentState.canSubmit}
              onClick={onSubmit}
            >
              {commentState.isCreating
                ? tDashboard("issue.detail.commentSubmitting")
                : tDashboard("issue.detail.commentSubmit")}
            </Button>
          </div>
        </div>
      </div>

      {comments.length > 0 ? (
        <div className="space-y-3">
          {comments.map((comment) => (
            <IssueCommentItem
              key={comment.id}
              comment={comment}
              memberById={memberById}
              currentUser={currentUser}
              formatDate={formatDate}
              isDeleting={
                commentState.isDeleting &&
                commentState.deletingCommentId === comment.id
              }
              isUpdating={
                commentState.isUpdating &&
                commentState.updatingCommentId === comment.id
              }
              isEditing={editingCommentId === comment.id}
              editingValue={editingCommentContent}
              onStartEditing={onStartEditing}
              onCancelEditing={onCancelEditing}
              onEditingValueChange={onEditingValueChange}
              onDelete={onDelete}
              onUpdate={(commentId, content) => {
                onUpdate(commentId, content);
                onCancelEditing();
              }}
            />
          ))}
        </div>
      ) : (
        <div className="flex justify-center py-8 border-dashed border-2 rounded-lg">
          <p className="text-sm text-muted-foreground">
            {tDashboard("issue.detail.noComments")}
          </p>
        </div>
      )}
    </div>
  );
}
