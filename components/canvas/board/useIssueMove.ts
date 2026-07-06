'use client'

import type { ComponentProps } from 'react';
import { useCallback, useRef, useEffect } from 'react';
import { DragDropProvider } from '@dnd-kit/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { ApiResponse, PaginatedData } from '@/lib/api/api';
import { issueService } from '@/lib/api/issue';
import type { Issue } from '@/lib/api/issue';
import { issueKeys } from '@/queries/issue';

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

    const flushPendingIssueUpdates = useCallback(() => {
        getPendingUpdates().forEach((runUpdate) => runUpdate());
    }, []);

    useEffect(() => {
        return () => {
            flushPendingIssueUpdates();
        };
    }, [flushPendingIssueUpdates]);

    const { mutate: updateIssue } = useMutation({
        mutationFn: ({ issueId, columnId }: { issueId: string; columnId: string; originalColumnId: string }) =>
            issueService.updateIssue({ projectId, issueId, issueData: { columnId } }),
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: issueKeys.list(projectId) });
        },
        onSuccess: (updatedIssue) => {
            queryClient.setQueryData<ApiResponse<PaginatedData<Issue>>>(issueKeys.list(projectId, { limit: 100 }), (old) => {
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
            queryClient.setQueryData<ApiResponse<PaginatedData<Issue>>>(issueKeys.list(projectId, { limit: 100 }), (old) => {
                if (!old?.data) return old;
                return {
                    ...old,
                    data: {
                        ...old.data,
                        items: old.data.items.map((issue) =>
                            issue.id === vars.issueId ? { ...issue, columnId: vars.originalColumnId } : issue,
                        ),
                    }
                };
            });
        },
    });


    const handleTaskDrop = useCallback(
        (event: DragEndEvent): boolean => {
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

            const currentIssues = queryClient.getQueryData<ApiResponse<PaginatedData<Issue>>>(issueKeys.list(projectId, { limit: 100 }));
            if (!currentIssues?.data?.items) return true;

            const issueId = source.id as string;
            const originalColumnId = currentIssues.data.items.find((issue) => issue.id === issueId)?.columnId ?? '';

            // Optimistically move the card before persisting.
            queryClient.setQueryData<ApiResponse<PaginatedData<Issue>>>(issueKeys.list(projectId, { limit: 100 }), {
                ...currentIssues,
                data: {
                    ...currentIssues.data,
                    items: currentIssues.data.items.map((issue) =>
                        issue.id === issueId ? { ...issue, columnId: targetColumnId as string } : issue,
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
                });
            };

            pendingUpdates.set(issueId, runUpdate);
            debounceMap.set(
                issueId,
                setTimeout(runUpdate, 300),
            );

            return true;
        },
        [projectId, queryClient, updateIssue, flushPendingIssueUpdates],
    );

    return { flushPendingIssueUpdates, handleTaskDrop };
}
