'use client'

import type { ComponentProps } from 'react';
import { useRef, useEffect } from 'react';
import { DragDropProvider } from '@dnd-kit/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { ApiResponse, PaginatedData } from '@/lib/api/api';
import { issueService } from '@/lib/api/issue';
import type { Issue } from '@/lib/api/issue';
import { issueKeys } from '@/queries/issue';
import { getTailOrder, getInsertOrder } from '@/lib/ordering';

type DragEndHandler = NonNullable<ComponentProps<typeof DragDropProvider>['onDragEnd']>;
type DragEndEvent = Parameters<DragEndHandler>[0];

interface UseIssueMoveParams {
    projectId: string;
}

interface UseIssueMoveResult {
    flushPendingIssueUpdates: () => void;
    handleTaskDrop: (event: DragEndEvent) => boolean;
}

export function useIssueMove({ projectId }: UseIssueMoveParams): UseIssueMoveResult {
    const queryClient = useQueryClient();
    const issueDebounceMap = useRef<Map<string, ReturnType<typeof setTimeout>> | null>(null);
    const getDebounceMap = () => {
        if (!issueDebounceMap.current) {
            issueDebounceMap.current = new Map();
        }
        return issueDebounceMap.current;
    };
    const issuePendingUpdates = useRef<Map<string, () => void> | null>(null);
    const getPendingUpdates = () => {
        if (!issuePendingUpdates.current) {
            issuePendingUpdates.current = new Map();
        }
        return issuePendingUpdates.current;
    };

    const flushPendingIssueUpdates = () => {
        getPendingUpdates().forEach((runUpdate) => runUpdate());
    };

    const flushRef = useRef(flushPendingIssueUpdates);
    useEffect(() => {
        flushRef.current = flushPendingIssueUpdates;
    });

    useEffect(() => {
        return () => {
            flushRef.current();
        };
    }, []);

    const { mutate: updateIssue } = useMutation({
        mutationFn: ({ issueId, columnId, order }: { issueId: string; columnId: string; originalColumnId: string; originalOrder: number; order: number }) =>
            issueService.updateIssue({ projectId, issueId, issueData: { columnId, order } }),
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: issueKeys.list(projectId) });
        },
        onSuccess: (updatedIssue) => {
            queryClient.setQueryData<ApiResponse<PaginatedData<Issue>>>(issueKeys.list(projectId, { limit: 1000 }), (old) => {
                if (!old?.data) return old;
                return {
                    ...old,
                    data: {
                        ...old.data,
                        items: old.data.items.map((issue) => (issue.id === updatedIssue.data.id ? updatedIssue.data : issue)),
                    }
                };
            });
        },
        onError: (_err, vars) => {
            queryClient.setQueryData<ApiResponse<PaginatedData<Issue>>>(issueKeys.list(projectId, { limit: 1000 }), (old) => {
                if (!old?.data) return old;
                return {
                    ...old,
                    data: {
                        ...old.data,
                        items: old.data.items.map((issue) =>
                            issue.id === vars.issueId ? { ...issue, columnId: vars.originalColumnId, order: vars.originalOrder } : issue,
                        ),
                    }
                };
            });
        },
    });


    const handleTaskDrop = (event: DragEndEvent): boolean => {
        const { operation, canceled } = event;
        if (canceled) return false;

        const { source, target } = operation;
        if (!source || !target) return false;

        const sourceType = source.data?.type || 'task';
        if (sourceType !== 'task') return false;

        const targetType = target.data?.type || 'column';
        const targetColumnId = targetType === 'column' ? target.id : target.data?.columnId;
        if (!targetColumnId) return true;

        flushPendingIssueUpdates();

        const currentIssues = queryClient.getQueryData<ApiResponse<PaginatedData<Issue>>>(issueKeys.list(projectId, { limit: 1000 }));
        if (!currentIssues?.data?.items) return true;

        const issueId = source.id as string;
        const originalColumn = currentIssues.data.items.find((issue) => issue.id === issueId);
        const originalColumnId = originalColumn?.columnId ?? '';
        const originalOrder = originalColumn?.order ?? 0;

        // Get issues currently in the target column (excluding the one being moved)
        const targetIssues = currentIssues.data.items
            .filter((issue) => issue.columnId === targetColumnId && issue.id !== issueId)
            .toSorted((a, b) => a.order - b.order);

        let newOrder: number;
        if (targetType === 'column') {
            const lastIssue = targetIssues[targetIssues.length - 1];
            newOrder = getTailOrder(lastIssue?.order);
        } else {
            const targetIssueId = target.id as string;
            const targetIndex = targetIssues.findIndex((issue) => issue.id === targetIssueId);
            if (targetIndex === -1) {
                const lastIssue = targetIssues[targetIssues.length - 1];
                newOrder = getTailOrder(lastIssue?.order);
            } else {
                const prevIssue = targetIssues[targetIndex - 1];
                const nextIssue = targetIssues[targetIndex];
                const insertResult = getInsertOrder(prevIssue?.order, nextIssue?.order);
                newOrder = insertResult.order;
            }
        }

        // Optimistically move the card before persisting.
        queryClient.setQueryData<ApiResponse<PaginatedData<Issue>>>(issueKeys.list(projectId, { limit: 1000 }), {
            ...currentIssues,
            data: {
                ...currentIssues.data,
                items: currentIssues.data.items.map((issue) =>
                    issue.id === issueId ? { ...issue, columnId: targetColumnId as string, order: newOrder } : issue,
                ),
            }
        });

        const debounceMap = getDebounceMap();
        const pendingUpdates = getPendingUpdates();
        const existing = debounceMap.get(issueId);
        if (existing) {
            clearTimeout(existing);
            debounceMap.delete(issueId);
            pendingUpdates.delete(issueId);
        }

        const runUpdate = () => {
            pendingUpdates.delete(issueId);
            const timer = debounceMap.get(issueId);
            if (timer) {
                clearTimeout(timer);
                debounceMap.delete(issueId);
            }
            updateIssue({
                issueId,
                columnId: targetColumnId as string,
                originalColumnId,
                originalOrder,
                order: newOrder,
            });
        };

        pendingUpdates.set(issueId, runUpdate);
        debounceMap.set(
            issueId,
            setTimeout(runUpdate, 300),
        );

        return true;
    };

    return { flushPendingIssueUpdates, handleTaskDrop };
}
