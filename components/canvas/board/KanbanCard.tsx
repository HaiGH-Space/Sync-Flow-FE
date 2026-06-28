"use client";
import { memo, useState } from "react";
import { Avatar, AvatarImage } from "../../ui/avatar";
import { Badge } from "../../ui/badge";
import { cn } from "@/lib/utils";
import { useDraggable } from "@dnd-kit/react";
import { Priority } from "@/lib/api/issue";
import IssueDetailDialog from "../../dashboard/comp/IssueDetailDialog";

type KanbanCardProps = {
  id: string;
  title: string;
  projectId: string;
  description?: string;
  storyPoint?: number;
  priority?: Priority;
  assigneeId?: string | null;
};

function KanbanCard(props: KanbanCardProps) {
  const [isViewDetailOpen, setIsViewDetailOpen] = useState(false);
  const { ref, isDragging } = useDraggable({
    id: props.id,
    data: { type: "task", ...props },
  });
  const openDetail = () => setIsViewDetailOpen(true);
  // Keyboard handled by native button element; no custom handler needed.

  return (
    <>
      <button
        type="button"
        onClick={openDetail}
        ref={ref}
        className={cn(
          "duration-200 border-border/70 hover:border-border hover:shadow-xs focus-visible:ring-2 focus-visible:ring-ring cursor-grab w-full min-w-48 p-3 mb-2 flex flex-col bg-card border rounded-lg text-left transition-all",
          isDragging && "opacity-90 border-dashed",
        )}
      >
        <div className="flex justify-between">
          <h4 className="font-medium">{props.title}</h4>
        </div>
        {props.description && (
          <p className="text-sm text-muted-foreground">{props.description}</p>
        )}
        <div className="flex justify-between mt-2">
          <div>
            {props.priority && (
              <Badge
                variant="outline"
                className={cn(
                  "mr-2 hover:bg-transparent shadow-none border font-normal py-0.5 px-1.5",
                  props.priority === Priority.HIGH
                    ? "bg-destructive/15 text-destructive border-destructive/20 dark:bg-destructive/20"
                    : props.priority === Priority.MEDIUM
                      ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20"
                      : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
                )}
              >
                {props.priority.charAt(0).toUpperCase() +
                  props.priority.slice(1)}
              </Badge>
            )}
            {props.storyPoint && (
              <span className="text-sm text-muted-foreground">
                SP: {props.storyPoint}
              </span>
            )}
          </div>
          <div>
            <Avatar className="size-6">
              <AvatarImage src="https://github.com/shadcn.png" />
            </Avatar>
          </div>
        </div>
      </button>
      <IssueDetailDialog
        isOpen={isViewDetailOpen}
        openChange={setIsViewDetailOpen}
        projectId={props.projectId}
        issueId={props.id}
      />
    </>
  );
}

export default memo(KanbanCard);
