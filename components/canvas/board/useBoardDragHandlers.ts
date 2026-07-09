'use client'

import type { ComponentProps } from 'react';
import { DragDropProvider } from '@dnd-kit/react';
import { useQueryClient } from '@tanstack/react-query';

import { useColumnReorder } from './useColumnReorder';
import { useIssueMove } from './useIssueMove';

type DragStartHandler = NonNullable<ComponentProps<typeof DragDropProvider>['onDragStart']>;
type DragEndHandler = NonNullable<ComponentProps<typeof DragDropProvider>['onDragEnd']>;

interface UseBoardDragHandlersParams {
    projectId: string;
}

interface UseBoardDragHandlersResult {
    onDragStart: DragStartHandler;
    onDragEnd: DragEndHandler;
}

export function useBoardDragHandlers({ projectId }: UseBoardDragHandlersParams): UseBoardDragHandlersResult {
    const queryClient = useQueryClient();
    const { flushPendingColumnUpdates, handleColumnDrop } = useColumnReorder({ projectId });
    const { flushPendingIssueUpdates, handleTaskDrop } = useIssueMove({ projectId });

    const onDragStart: DragStartHandler = () => {
        flushPendingColumnUpdates();
        flushPendingIssueUpdates();

        // Cancel in-flight requests so stale responses cannot overwrite optimistic cache updates.
        queryClient.cancelQueries({ queryKey: ['issues', projectId] });
        queryClient.cancelQueries({ queryKey: ['columns', projectId] });
    };

    const onDragEnd: DragEndHandler = (event) => {
        if (handleColumnDrop(event)) return;
        handleTaskDrop(event);
    };

    return { onDragStart, onDragEnd };
}
