"use client";
import { useState } from "react";
import {
  DragDropProvider,
  DragOverlay,
  PointerSensor,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/react";
import { PointerActivationConstraints } from "@dnd-kit/dom";
import { useQuery } from "@tanstack/react-query";
import { createColumnsQueryOptions } from "@/queries/column";
import { useTranslations } from "next-intl";
import { useBoardDragHandlers } from "./useBoardDragHandlers";
import KanbanColumn from "./KanbanColumn";
import KanbanCard from "./KanbanCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CircleAlert, Inbox, Loader2 } from "lucide-react";
import DeleteConfirmModal from "@/components/dashboard/comp/DeleteConfirmModal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useDeleteColumnMutation,
  useUpdateColumnMutation,
} from "@/hooks/mutations/column";
import { toast } from "sonner";
import { Priority } from "@/lib/api/issue";

interface DraggedTaskData {
  id: string;
  type: "task";
  title: string;
  projectId: string;
  description?: string;
  storyPoint?: number;
  priority?: Priority;
  assigneeId?: string | null;
  columnId: string;
  order: number;
}

interface DraggedColumnData {
  id: string;
  type: "column";
  name: string;
}

type DraggedData = DraggedTaskData | DraggedColumnData;

interface BoardCanvasProps {
  projectId: string;
}
export default function BoardCanvas({ projectId }: BoardCanvasProps) {
  const tDashboard = useTranslations("dashboard");
  const tCommon = useTranslations("common");
  const { onDragStart, onDragEnd } = useBoardDragHandlers({ projectId });
  const [activeType, setActiveType] = useState<"task" | "column" | null>(null);
  const [activeData, setActiveData] = useState<DraggedData | null>(null);

  const handleDragStart: DragStartEvent = (event, manager) => {
    const { source } = event.operation;
    if (source) {
      setActiveType(source.data?.type as "task" | "column" | null);
      setActiveData(source.data as DraggedData | null);
    }
    onDragStart(event, manager);
  };

  const handleDragEnd: DragEndEvent = (event, manager) => {
    setActiveType(null);
    setActiveData(null);
    onDragEnd(event, manager);
  };

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState<string | null>(null);
  const [columnName, setColumnName] = useState("");
  const deleteColumnMutation = useDeleteColumnMutation(projectId);
  const updateColumnMutation = useUpdateColumnMutation(projectId);

  const {
    data: columns,
    error: errorColumns,
    isLoading: isLoadingColumns,
    refetch: refetchColumns,
    isRefetching,
  } = useQuery(createColumnsQueryOptions({ projectId }));

  const columnsData = columns?.data ?? [];

  const selectedColumn =
    columnsData.find((item) => item.id === selectedColumnId) ?? null;

  const selectedColumnName = selectedColumn?.name ?? "";

  const handleDeleteColumn = (columnId: string) => {
    setSelectedColumnId(columnId);
    setIsDeleteDialogOpen(true);
  };

  const handleEditColumn = (columnId: string) => {
    const column = columnsData.find((item) => item.id === columnId) ?? null;
    setSelectedColumnId(columnId);
    setColumnName(column?.name ?? "");
    setIsEditDialogOpen(true);
  };

  const closeDeleteDialog = (open: boolean) => {
    setIsDeleteDialogOpen(open);
    if (!open) {
      setSelectedColumnId(null);
    }
  };

  const closeEditDialog = (open: boolean) => {
    setIsEditDialogOpen(open);
    if (!open) {
      setSelectedColumnId(null);
      setColumnName("");
    }
  };

  if (isLoadingColumns) {
    return (
      <div className="w-full h-full flex flex-row gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton
            key={`board-column-skeleton-${index}`}
            className="min-w-52 flex-1 bg-muted/40 rounded-lg p-3 space-y-3"
          ></Skeleton>
        ))}
      </div>
    );
  }

  if (errorColumns) {
    return (
      <div className="w-full h-full flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center">
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <CircleAlert className="size-6" />
          </div>
          <p className="text-base font-semibold text-foreground">
            {tDashboard("board.errorLoadingColumns")}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {tDashboard("board.errorHint")}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetchColumns()}
            disabled={isRefetching}
            className="mt-4 cursor-pointer min-w-30"
          >
            {isRefetching ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="size-3.5 animate-spin" />
                {tCommon("status.loading")}
              </span>
            ) : (
              tCommon("actions.retry")
            )}
          </Button>
        </div>
      </div>
    );
  }

  const DndProvider = DragDropProvider as unknown as React.ComponentType<{ children?: React.ReactNode; sensors?: unknown; onDragStart?: unknown; onDragOver?: unknown; onDragEnd?: unknown }>;

  return (
    <>
      <div className="w-full h-full">
        <DndProvider
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          sensors={[
            PointerSensor.configure({
              activationConstraints(event) {
                if (event.pointerType === "touch") {
                  return [
                    new PointerActivationConstraints.Delay({
                      value: 150,
                      tolerance: 10,
                    }),
                  ];
                }
                return [
                  new PointerActivationConstraints.Distance({ value: 3 }),
                ];
              },
            }),
          ]}
        >
          <div className="flex flex-row gap-4 w-full h-full">
            {columnsData.length > 0 ? (
              columnsData.map((col) => (
                <KanbanColumn
                  projectId={projectId}
                  key={col.id}
                  id={col.id}
                  columnId={col.id}
                  name={col.name}
                  actionDeleteColumn={handleDeleteColumn}
                  actionEditColumn={handleEditColumn}
                />
              ))
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="max-w-lg w-full text-center px-4">
                  <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <Inbox className="size-6" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {tDashboard("board.empty")}
                  </p>
                </div>
              </div>
            )}
          </div>
          <DragOverlay
            dropAnimation={{
              duration: 180,
              easing: "cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {activeType === "task" &&
              activeData &&
              activeData.type === "task" && (
                <div className="w-[280px] rotate-2 scale-[1.03] pointer-events-none opacity-90 shadow-xl transition-transform duration-100 ease-out">
                  <KanbanCard
                    projectId={projectId}
                    id={activeData.id}
                    title={activeData.title}
                    priority={activeData.priority}
                    storyPoint={activeData.storyPoint}
                    description={activeData.description}
                    assigneeId={activeData.assigneeId}
                    columnId={activeData.columnId}
                    order={activeData.order}
                  />
                </div>
              )}
            {activeType === "column" &&
              activeData &&
              activeData.type === "column" && (
                <div className="w-[260px] rotate-1 scale-[1.01] pointer-events-none opacity-95 shadow-xl h-full max-h-[700px] transition-transform duration-100 ease-out">
                  <div className="bg-muted border border-border/80 rounded-lg p-3 w-full h-full flex flex-col min-h-[500px]">
                    <div className="flex items-center justify-between p-3 border-b border-border/60">
                      <h3 className="text-lg font-medium text-foreground">
                        {activeData.name}
                      </h3>
                    </div>
                  </div>
                </div>
              )}
          </DragOverlay>
        </DndProvider>
      </div>

      <DeleteConfirmModal
        isOpen={isDeleteDialogOpen}
        isLoading={deleteColumnMutation.isPending}
        title={tDashboard("board.column.delete.title", {
          name: selectedColumnName,
        })}
        description={tDashboard("board.column.delete.description")}
        onConfirm={() => {
          if (!selectedColumn) return;

          deleteColumnMutation.mutate(
            { id: selectedColumn.id },
            {
              onSuccess: () => {
                toast.success(tDashboard("board.column.delete.success"));
                closeDeleteDialog(false);
              },
            },
          );
        }}
        onClose={closeDeleteDialog}
      />

      <Dialog open={isEditDialogOpen} onOpenChange={closeEditDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{tDashboard("board.column.edit.title")}</DialogTitle>
            <DialogDescription>
              {tDashboard("board.column.edit.description")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="column-name">
              {tDashboard("board.column.edit.nameLabel")}
            </Label>
            <Input
              id="column-name"
              value={columnName}
              onChange={(e) => setColumnName(e.target.value)}
              placeholder={tDashboard("board.column.edit.namePlaceholder")}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => closeEditDialog(false)}>
              {tCommon("actions.cancel")}
            </Button>
            <Button
              disabled={!columnName.trim() || updateColumnMutation.isPending}
              onClick={() => {
                if (!selectedColumn) return;

                updateColumnMutation.mutate(
                  { id: selectedColumn.id, name: columnName.trim() },
                  {
                    onSuccess: () => {
                      toast.success(tDashboard("board.column.edit.success"));
                      closeEditDialog(false);
                    },
                  },
                );
              }}
            >
              {updateColumnMutation.isPending
                ? tCommon("status.updating")
                : tCommon("actions.confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
