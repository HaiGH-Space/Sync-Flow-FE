"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import DropdownMenuUD from "@/components/shared/DropdownMenuUD";
import { type Comment } from "@/lib/api/comment";
import { type UserProfile } from "@/lib/api/user";
import { useTranslations } from "next-intl";

type IssueCommentItemProps = {
  comment: Comment;
  memberById: Map<string, UserProfile>;
  currentUser: UserProfile | undefined;
  formatDate: (value: string | number | Date) => string;
  isDeleting: boolean;
  isUpdating: boolean;
  isEditing: boolean;
  editingValue: string;
  onStartEditing: (commentId: string, content: string) => void;
  onCancelEditing: () => void;
  onEditingValueChange: (commentId: string, content: string) => void;
  onDelete: (commentId: string) => void;
  onUpdate: (commentId: string, content: string) => void;
};

export function IssueCommentItem({
  comment,
  memberById,
  currentUser,
  formatDate,
  isDeleting,
  isUpdating,
  isEditing,
  editingValue,
  onStartEditing,
  onCancelEditing,
  onEditingValueChange,
  onDelete,
  onUpdate,
}: IssueCommentItemProps) {
  const tDashboard = useTranslations("dashboard");

  const member = memberById.get(comment.userId);
  const isOwnComment = comment.userId === currentUser?.id;
  const commenterName =
    comment.userId === currentUser?.id
      ? tDashboard("issue.assignee.me", {
          name: currentUser?.name ?? "",
        })
      : (member?.name ?? comment.userId);

  return (
    <div className="flex gap-3 rounded-lg border p-3 bg-muted/20">
      <Avatar className="size-8">
        <AvatarImage src={member?.image} />
        <AvatarFallback>{commenterName.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium">{commenterName}</p>
          <div className="flex items-center gap-1">
            <p className="text-xs text-muted-foreground">
              {isDeleting
                ? tDashboard("issue.detail.commentDeleting")
                : isUpdating
                  ? tDashboard("issue.detail.commentUpdating")
                  : formatDate(comment.createdAt)}
            </p>
            {isOwnComment && !isEditing ? (
              <DropdownMenuUD
                onEdit={() => onStartEditing(comment.id, comment.content)}
                onDelete={() => onDelete(comment.id)}
              />
            ) : null}
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-2">
            <textarea
              aria-label={`Edit comment by ${commenterName}`}
              className="w-full min-h-20 rounded-md border bg-muted/30 p-3 text-sm text-foreground/80 leading-relaxed outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              value={editingValue}
              onChange={(e) => onEditingValueChange(comment.id, e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onCancelEditing}
              >
                {tDashboard("issue.detail.commentCancel")}
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={!editingValue.trim() || isUpdating}
                onClick={() => onUpdate(comment.id, editingValue.trim())}
              >
                {isUpdating
                  ? tDashboard("issue.detail.commentUpdating")
                  : tDashboard("issue.detail.commentUpdate")}
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-foreground/90 whitespace-pre-wrap wrap-break-word">
            {comment.content}
          </p>
        )}

        {isOwnComment && isEditing ? (
          <div className="flex justify-end">
            <span className="text-[11px] text-muted-foreground">
              {tDashboard("issue.detail.commentEditing")}
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
