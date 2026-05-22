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
  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openDetail();
    }
  };

  return (
    <>
      <div
        onClick={openDetail}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        ref={ref}
        className={cn(
          "duration-200 hover:border-primary cursor-grab w-full min-w-48 p-3 mb-2 flex flex-col bg-card border rounded-lg",
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
                className={cn(
                  "mr-2",
                  props.priority === Priority.HIGH
                    ? "bg-red-900 text-red-300"
                    : props.priority === Priority.MEDIUM
                      ? "bg-yellow-900 text-yellow-300"
                      : "bg-green-900 text-green-300",
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
      </div>
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
