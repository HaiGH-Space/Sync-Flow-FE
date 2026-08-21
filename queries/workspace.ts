import { infiniteQueryOptions, queryOptions, type InfiniteData } from '@tanstack/react-query'
import type { QueryOptions, CustomInfiniteQueryOptions } from '@/types/query-option'
import type { ApiResponse, PaginatedData, PaginationQuery } from '@/lib/api/api'
import type { Workspace } from '@/lib/api/workspace'
import { workspaceService } from '@/lib/api/workspace'

export const workspaceKeys = {
  all: ['workspaces'] as const,
  list: (params?: PaginationQuery) =>
    params ? [...workspaceKeys.all, 'me', params] as const : [...workspaceKeys.all, 'me'] as const,
  infiniteList: (limit: number, includeTotal?: boolean) =>
    includeTotal !== undefined
      ? [...workspaceKeys.all, 'me', 'infinite', { limit, includeTotal }] as const
      : [...workspaceKeys.all, 'me', 'infinite', { limit }] as const,
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

export function createMyWorkspacesInfiniteQueryOptions<
  TData = InfiniteData<ApiResponse<PaginatedData<Workspace>>>
>(
  params?: { limit?: number; includeTotal?: boolean },
  options?: CustomInfiniteQueryOptions<ApiResponse<PaginatedData<Workspace>>, TData, number>
) {
  const limit = params?.limit ?? 20
  const includeTotal = params?.includeTotal

  return infiniteQueryOptions({
    staleTime: Infinity,
    ...options,
    queryKey: workspaceKeys.infiniteList(limit, includeTotal),
    queryFn: ({ pageParam }) =>
      workspaceService.getMyWorkspace({
        page: pageParam ?? 1,
        limit,
        includeTotal,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const page = Number(lastPage.data.page)
      const limitVal = Number(lastPage.data.limit)
      if (lastPage.data.total !== undefined) {
        const total = Number(lastPage.data.total)
        return page * limitVal < total ? page + 1 : undefined
      }
      const itemsLength = lastPage.data.items?.length ?? 0
      return itemsLength === limitVal ? page + 1 : undefined
    },
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

