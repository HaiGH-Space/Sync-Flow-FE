"use client";
import { memo, useCallback } from "react";
import { ScrollArea } from "../../ui/scroll-area";
import KanbanCard from "./KanbanCard";
import { useDraggable, useDroppable } from "@dnd-kit/react";
import { cn } from "@/lib/utils";
import CreateIssueModal from "../../dashboard/comp/CreateIssueModal";
import { Issue } from "@/lib/api/issue";
import { useQuery } from "@tanstack/react-query";
import type { ApiResponse } from "@/lib/api/api";
import { createIssuesQueryOptions } from "@/queries/issue";
import DropdownMenuUD from "@/components/shared/DropdownMenuUD";
import { useDashboard } from "@/lib/store/use-dashboard";
type ColumnProps = {
  id: string;
  name: string;
  columnId: string;
  projectId: string;
  actionDeleteColumn: (columnId: string) => void;
  actionEditColumn: (columnId: string) => void;
};

export type TaskProps = Pick<
  Issue,
  "id" | "columnId" | "title" | "priority" | "description" | "assigneeId"
>;

function KanbanColumn(props: ColumnProps) {
  const selectedSprintId = useDashboard(
    (state) => state.selectedSprintIdByProject[props.projectId] ?? "all",
  );

  // Each column subscribes to the shared cache with a stable per-column selector.
  // TanStack Query v5 structural sharing means only the two columns whose task
  // lists actually changed will receive a new reference → React.memo blocks
  // re-renders for every other column.
  const selectColumnTasks = useCallback(
    (data: ApiResponse<Issue[]>): TaskProps[] =>
      data.data.filter((issue) => {
        const matchColumn = issue.columnId === props.columnId;
        const matchSprint =
          selectedSprintId === "all" || issue.sprintId === selectedSprintId;
        return matchColumn && matchSprint;
      }),
    [props.columnId, selectedSprintId],
  );

  const { data: tasks = [] } = useQuery(
    createIssuesQueryOptions(
      { projectId: props.projectId },
      {
        select: selectColumnTasks,
      },
    ),
  );
  const { ref: dropRef, isDropTarget } = useDroppable({
    id: props.id,
    data: { type: "column" },
  });

  const { ref: dragRef, isDragging } = useDraggable({
    id: props.id,
    data: { type: "column" },
  });
  return (
    <div
      ref={dropRef}
      className={cn(
        "min-w-52 flex flex-col flex-1 bg-muted/30 rounded-lg duration-200",
        isDropTarget ? "bg-muted/60 ring-2 ring-primary/40" : "bg-muted/30",
        isDragging && "opacity-50 border-dashed border-2 border-primary",
      )}
    >
      {/* Header */}
      <div ref={dragRef} className="flex items-center justify-between p-3">
        <h3 className="text-lg font-medium">{props.name}</h3>
        <div className="flex gap-2">
          <CreateIssueModal
            columnId={props.columnId}
            projectId={props.projectId}
          />
          <DropdownMenuUD
            onEdit={() => props.actionEditColumn(props.columnId)}
            onDelete={() => props.actionDeleteColumn(props.columnId)}
          />
        </div>
      </div>
      {/* Task List */}
      <ScrollArea className="flex-1 min-h-0 px-3">
        <div>
          {tasks.map((task) => (
            <KanbanCard
              projectId={props.projectId}
              key={task.id}
              id={task.id}
              title={task.title}
              priority={task.priority}
              storyPoint={undefined}
              description={task.description}
              assigneeId={task.assigneeId}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

export default memo(KanbanColumn);
