"use client";

import type { ComponentProps } from "react";
import { useCallback, useRef } from "react";
import { DragDropProvider } from "@dnd-kit/react";
import { useQueryClient } from "@tanstack/react-query";

import type { ApiResponse } from "@/lib/api/api";
import type { Column } from "@/lib/api/column";
import {
  useRebalanceColumnsMutation,
  useUpdateColumnOrderMutation,
} from "@/hooks/mutations/column";
import { getInsertOrder, rebalanceOrders } from "@/lib/ordering";
import { columnKeys } from "@/queries/column";

type DragEndHandler = NonNullable<
  ComponentProps<typeof DragDropProvider>["onDragEnd"]
>;
type DragEndEvent = Parameters<DragEndHandler>[0];

interface UseColumnReorderParams {
  projectId: string;
}

interface UseColumnReorderResult {
  clearPendingColumnUpdates: () => void;
  handleColumnDrop: (event: DragEndEvent) => boolean;
}

export function useColumnReorder({
  projectId,
}: UseColumnReorderParams): UseColumnReorderResult {
  const queryClient = useQueryClient();
  const columnDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const updateColumnMutation = useUpdateColumnOrderMutation(projectId);
  const rebalanceColumnsMutation = useRebalanceColumnsMutation(projectId);

  const clearPendingColumnUpdates = useCallback(() => {
    if (!columnDebounceRef.current) return;
    clearTimeout(columnDebounceRef.current);
    columnDebounceRef.current = null;
  }, []);

  const handleColumnDrop = useCallback(
    (event: DragEndEvent): boolean => {
      const { operation, canceled } = event;
      if (canceled) return false;

      const { source, target } = operation;
      if (!source || !target) return false;

      const sourceType = source.data?.type || "task";
      const targetType = target.data?.type || "column";
      if (!(sourceType === "column" && targetType === "column")) return false;

      const currentCols = queryClient.getQueryData<ApiResponse<Column[]>>(
        columnKeys.list(projectId),
      );
      if (!currentCols) return true;

      const sortedColumns = currentCols.data.toSorted(
        (a, b) => a.order - b.order,
      );
      const sourceIndex = sortedColumns.findIndex(
        (col) => col.id === source.id,
      );
      const targetIndex = sortedColumns.findIndex(
        (col) => col.id === target.id,
      );
      if (sourceIndex === targetIndex) return true;

      const originalOrder = sortedColumns[sourceIndex].order;

      // Optimistic reorder first, then persist with debounce.
      const nextColumns = [...sortedColumns];
      const [moved] = nextColumns.splice(sourceIndex, 1);
      nextColumns.splice(targetIndex, 0, moved);

      const prevColumn = nextColumns[targetIndex - 1];
      const followingColumn = nextColumns[targetIndex + 1];
      const { order: newOrder, requiresRebalance } = getInsertOrder(
        prevColumn?.order,
        followingColumn?.order,
      );

      const optimisticColumns = requiresRebalance
        ? rebalanceOrders(nextColumns)
        : nextColumns.map((col) =>
            col.id === moved.id ? { ...col, order: newOrder } : col,
          );

      queryClient.setQueryData<ApiResponse<Column[]>>(
        columnKeys.list(projectId),
        {
          ...currentCols,
          data: optimisticColumns,
        },
      );

      if (columnDebounceRef.current) clearTimeout(columnDebounceRef.current);
      columnDebounceRef.current = setTimeout(() => {
        if (requiresRebalance) {
          const oldOrderMap = new Map(
            currentCols.data.map((col) => [col.id, col.order]),
          );
          // Single-pass: collect only columns whose order changed to avoid double iteration
          const updates: { id: string; order: number }[] = [];
          for (const col of optimisticColumns) {
            if (oldOrderMap.get(col.id) !== col.order) {
              updates.push({ id: col.id, order: col.order });
            }
          }

          if (updates.length === 0) return;

          rebalanceColumnsMutation.mutate({
            updates,
            previousColumns: currentCols.data,
          });
          return;
        }
        updateColumnMutation.mutate({
          id: source.id as string,
          order: newOrder,
          originalOrder,
        });
      }, 300);

      return true;
    },
    [projectId, queryClient, rebalanceColumnsMutation, updateColumnMutation],
  );

  return { clearPendingColumnUpdates, handleColumnDrop };
}
