import { queryOptions } from "@tanstack/react-query";
import { QueryOptions } from "@/types/query-option";
import { ApiResponse, PaginatedData, PaginationQuery } from "@/lib/api/api";
import { Issue, issueService } from "@/lib/api/issue";


export const issueKeys = {
    all: ['issues'] as const,
    list: (projectId: string, params?: PaginationQuery) =>
        params ? [...issueKeys.all, projectId, params] as const : [...issueKeys.all, projectId] as const,
};

export function createIssueQueryOptions<
    TData = ApiResponse<Issue>
>(params: { projectId: string; issueId: string }, options?: QueryOptions<Issue, TData>) {
    const { projectId, issueId } = params;
    return queryOptions({
        staleTime: 1000 * 60 * 5,
        ...options,
        queryKey: ['issues', projectId, issueId] as const,
        queryFn: () => issueService.getIssueById({ projectId, issueId }),
    });
}

export function createIssuesQueryOptions<
    TData = ApiResponse<PaginatedData<Issue>>
>(
    params: { projectId: string } & PaginationQuery,
    options?: QueryOptions<PaginatedData<Issue>, TData>
) {
    const { projectId, page, limit } = params;
    return queryOptions({
        staleTime: 1000 * 60 * 5,
        ...options,
        queryKey: issueKeys.list(projectId, { page, limit }),
        queryFn: () => issueService.getIssuesByProjectId({ projectId, page, limit }),
    });
}