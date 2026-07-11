"use client";

import { useState } from "react";
import { Avatar, AvatarImage } from "../../ui/avatar";
import { Badge } from "../../ui/badge";
import { cn } from "@/lib/utils";
import { useDraggable, useDroppable } from "@dnd-kit/react";
import { Priority } from "@/lib/api/issue";
import IssueDetailDialog from "../../dashboard/comp/IssueDetailDialog";
import { GripVertical } from "lucide-react";

type KanbanCardProps = {
  id: string;
  title: string;
  projectId: string;
  description?: string;
  storyPoint?: number;
  priority?: Priority;
  assigneeId?: string | null;
  columnId: string;
  order: number;
};

function KanbanCard(props: KanbanCardProps) {
  const [isViewDetailOpen, setIsViewDetailOpen] = useState(false);
  
  const { ref: dragRef, isDragging } = useDraggable({
    id: props.id,
    data: { type: "task", ...props },
  });

  const { ref: dropRef, isDropTarget } = useDroppable({
    id: props.id,
    data: { type: "task", columnId: props.columnId, order: props.order },
  });

  const setRefs = (element: HTMLDivElement | null) => {
    dragRef(element);
    dropRef(element);
  };

  const openDetail = () => setIsViewDetailOpen(true);

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={openDetail}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openDetail();
          }
        }}
        ref={setRefs}
        className={cn(
          "duration-200 border-border/70 hover:border-border hover:shadow-xs focus-visible:ring-2 focus-visible:ring-ring cursor-grab w-full min-w-48 p-3 mb-2 flex flex-col bg-card border rounded-lg text-left transition-all relative group select-none outline-none",
          isDragging && "opacity-30 border-dashed bg-muted/20 border-primary/30 shadow-none pointer-events-none",
          isDropTarget && "border-t-2 border-t-primary/70 pt-2.5",
        )}
      >
        <div className="flex justify-between items-start w-full">
          <h4 className="font-medium pr-6 flex-1 text-sm text-foreground leading-snug">{props.title}</h4>
          <div className="opacity-0 group-hover:opacity-100 text-muted-foreground/45 hover:text-muted-foreground cursor-grab shrink-0 p-0.5 rounded hover:bg-muted/65 transition-all absolute top-2.5 right-2.5">
            <GripVertical className="size-3.5" />
          </div>
        </div>
        {props.description && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{props.description}</p>
        )}
        <div className="flex justify-between mt-3 items-center">
          <div>
            {props.priority && (
              <Badge
                variant="outline"
                className={cn(
                  "mr-2 hover:bg-transparent shadow-none border font-normal py-0.5 px-1.5 text-[10px]",
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
              <span className="text-xs text-muted-foreground">
                SP: {props.storyPoint}
              </span>
            )}
          </div>
          <div>
            <Avatar className="size-5">
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

export default KanbanCard;
