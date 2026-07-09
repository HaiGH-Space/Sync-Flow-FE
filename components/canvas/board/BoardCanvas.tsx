'use client'
import { useState } from "react"
import { DragDropProvider } from "@dnd-kit/react";
import { useQuery } from "@tanstack/react-query";
import { createColumnsQueryOptions } from "@/queries/column";
import { useTranslations } from "next-intl";
import { useBoardDragHandlers } from "./useBoardDragHandlers";
import KanbanColumn from "./KanbanColumn";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CircleAlert, Inbox, Loader2 } from "lucide-react";
import DeleteConfirmModal from "@/components/dashboard/comp/DeleteConfirmModal";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDeleteColumnMutation, useUpdateColumnMutation } from "@/hooks/mutations/column";
import { toast } from "sonner";


interface BoardCanvasProps {
    projectId: string
}
export default function BoardCanvas({ projectId }: BoardCanvasProps) {
    const tDashboard = useTranslations('dashboard');
    const tCommon = useTranslations('common');
    const { onDragStart, onDragEnd } = useBoardDragHandlers({ projectId });
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedColumnId, setSelectedColumnId] = useState<string | null>(null);
    const [columnName, setColumnName] = useState('');
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

    const selectedColumn = columnsData.find((item) => item.id === selectedColumnId) ?? null;

    const selectedColumnName = selectedColumn?.name ?? '';

    const handleDeleteColumn = (columnId: string) => {
        setSelectedColumnId(columnId);
        setIsDeleteDialogOpen(true);
    };

    const handleEditColumn = (columnId: string) => {
        const column = columnsData.find((item) => item.id === columnId) ?? null;
        setSelectedColumnId(columnId);
        setColumnName(column?.name ?? '');
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
            setColumnName('');
        }
    };

    if (isLoadingColumns) {
        return (
            <div className="w-full h-full flex flex-row gap-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton key={`board-column-skeleton-${index}`} className="min-w-52 flex-1 bg-muted/40 rounded-lg p-3 space-y-3">
                    </Skeleton>
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
                    <p className="text-base font-semibold text-foreground">{tDashboard('board.errorLoadingColumns')}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{tDashboard('board.errorHint')}</p>
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
                                {tCommon('status.loading')}
                            </span>
                        ) : (
                            tCommon('actions.retry')
                        )}
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="w-full h-full">
                <DragDropProvider
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
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
                                    <p className="text-sm text-muted-foreground">{tDashboard('board.empty')}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </DragDropProvider>
            </div>

            <DeleteConfirmModal
                isOpen={isDeleteDialogOpen}
                isLoading={deleteColumnMutation.isPending}
                title={tDashboard('board.column.delete.title', { name: selectedColumnName })}
                description={tDashboard('board.column.delete.description')}
                onConfirm={() => {
                    if (!selectedColumn) return;

                    deleteColumnMutation.mutate(
                        { id: selectedColumn.id },
                        {
                            onSuccess: () => {
                                toast.success(tDashboard('board.column.delete.success'));
                                closeDeleteDialog(false);
                            },
                        }
                    );
                }}
                onClose={closeDeleteDialog}
            />

            <Dialog open={isEditDialogOpen} onOpenChange={closeEditDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{tDashboard('board.column.edit.title')}</DialogTitle>
                        <DialogDescription>{tDashboard('board.column.edit.description')}</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-2">
                        <Label htmlFor="column-name">{tDashboard('board.column.edit.nameLabel')}</Label>
                        <Input
                            id="column-name"
                            value={columnName}
                            onChange={(e) => setColumnName(e.target.value)}
                            placeholder={tDashboard('board.column.edit.namePlaceholder')}
                        />
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => closeEditDialog(false)}>
                            {tCommon('actions.cancel')}
                        </Button>
                        <Button
                            disabled={!columnName.trim() || updateColumnMutation.isPending}
                            onClick={() => {
                                if (!selectedColumn) return;

                                updateColumnMutation.mutate(
                                    { id: selectedColumn.id, name: columnName.trim() },
                                    {
                                        onSuccess: () => {
                                            toast.success(tDashboard('board.column.edit.success'));
                                            closeEditDialog(false);
                                        },
                                    }
                                );
                            }}
                        >
                            {updateColumnMutation.isPending ? tCommon('status.updating') : tCommon('actions.confirm')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
