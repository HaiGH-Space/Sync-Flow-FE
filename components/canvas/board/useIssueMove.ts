'use client'

import type { ComponentProps } from 'react';
import { useCallback, useRef, useEffect } from 'react';
import { DragDropProvider } from '@dnd-kit/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { ApiResponse } from '@/lib/api/api';
import { issueService } from '@/lib/api/issue';
import type { Issue } from '@/lib/api/issue';

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
    const issueDebounceMap = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
    const issuePendingUpdates = useRef<Map<string, () => void>>(new Map());

    const flushPendingIssueUpdates = useCallback(() => {
        issuePendingUpdates.current.forEach((runUpdate) => runUpdate());
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
            await queryClient.cancelQueries({ queryKey: ['issues', projectId] });
        },
        onSuccess: (updatedIssue) => {
            queryClient.setQueryData<ApiResponse<Issue[]>>(['issues', projectId], (old) => {
                if (!old) return old;
                return {
                    ...old,
                    data: old.data.map((issue) => (issue.id === updatedIssue.data.id ? updatedIssue.data : issue)),
                };
            });
        },
        onError: (_err, vars) => {
            queryClient.setQueryData<ApiResponse<Issue[]>>(['issues', projectId], (old) => {
                if (!old) return old;
                return {
                    ...old,
                    data: old.data.map((issue) =>
                        issue.id === vars.issueId ? { ...issue, columnId: vars.originalColumnId } : issue,
                    ),
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

            const currentIssues = queryClient.getQueryData<ApiResponse<Issue[]>>(['issues', projectId]);
            if (!currentIssues) return true;

            const issueId = source.id as string;
            const originalColumnId = currentIssues.data.find((issue) => issue.id === issueId)?.columnId ?? '';

            // Optimistically move the card before persisting.
            queryClient.setQueryData<ApiResponse<Issue[]>>(['issues', projectId], {
                ...currentIssues,
                data: currentIssues.data.map((issue) =>
                    issue.id === issueId ? { ...issue, columnId: targetColumnId as string } : issue,
                ),
            });

            const existing = issueDebounceMap.current.get(issueId);
            if (existing) {
                clearTimeout(existing);
                issueDebounceMap.current.delete(issueId);
                issuePendingUpdates.current.delete(issueId);
            }

            const runUpdate = () => {
                issuePendingUpdates.current.delete(issueId);
                const timer = issueDebounceMap.current.get(issueId);
                if (timer) {
                    clearTimeout(timer);
                    issueDebounceMap.current.delete(issueId);
                }
                updateIssue({
                    issueId,
                    columnId: targetColumnId as string,
                    originalColumnId,
                });
            };

            issuePendingUpdates.current.set(issueId, runUpdate);
            issueDebounceMap.current.set(
                issueId,
                setTimeout(runUpdate, 300),
            );

            return true;
        },
        [projectId, queryClient, updateIssue, flushPendingIssueUpdates],
    );

    return { flushPendingIssueUpdates, handleTaskDrop };
}
