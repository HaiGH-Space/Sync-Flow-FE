import { queryOptions } from '@tanstack/react-query'
import type { QueryOptions } from '@/types/query-option'
import type { ApiResponse, PaginatedData, PaginationQuery } from '@/lib/api/api'
import type { Workspace } from '@/lib/api/workspace'
import { workspaceService } from '@/lib/api/workspace'

export const workspaceKeys = {
  all: ['workspaces'] as const,
  list: (params?: PaginationQuery) =>
    params ? [...workspaceKeys.all, 'me', params] as const : [...workspaceKeys.all, 'me'] as const,
  detail: (workspaceId: string) => [...workspaceKeys.all, workspaceId] as const,
}

export function createMyWorkspacesQueryOptions<
  TData = ApiResponse<PaginatedData<Workspace>>
>(
  params?: PaginationQuery,
  options?: QueryOptions<PaginatedData<Workspace>, TData>
) {
  return queryOptions({
    staleTime: Infinity,
    ...options,
    queryKey: workspaceKeys.list(params),
    queryFn: () => workspaceService.getMyWorkspace(params),
  })
}

export function createWorkspaceDetailQueryOptions<
  TData = ApiResponse<Workspace>
>(params: { workspaceId: string }, options?: QueryOptions<Workspace, TData>) {
  const { workspaceId } = params

  return queryOptions({
    staleTime: 1000 * 60 * 5,
    ...options,
    queryKey: workspaceKeys.detail(workspaceId),
    queryFn: () => workspaceService.getWorkspaceById(workspaceId),
  })
}
