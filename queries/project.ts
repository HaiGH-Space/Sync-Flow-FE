import { infiniteQueryOptions, queryOptions, type InfiniteData } from '@tanstack/react-query'
import type { QueryOptions, CustomInfiniteQueryOptions } from '@/types/query-option'
import type { ApiResponse, PaginatedData, PaginationQuery } from '@/lib/api/api'
import type { Project } from '@/lib/api/project'
import { projectService } from '@/lib/api/project'

export const projectKeys = {
  all: ['projects'] as const,
  list: (workspaceId: string, params?: PaginationQuery) =>
    params ? [...projectKeys.all, workspaceId, params] as const : [...projectKeys.all, workspaceId] as const,
  infiniteList: (workspaceId: string, limit: number, includeTotal?: boolean) =>
    includeTotal !== undefined
      ? [...projectKeys.all, workspaceId, 'infinite', { limit, includeTotal }] as const
      : [...projectKeys.all, workspaceId, 'infinite', { limit }] as const,
}

export function createProjectsQueryOptions<
  TData = ApiResponse<PaginatedData<Project>>
>(
  params: { workspaceId: string } & PaginationQuery,
  options?: QueryOptions<PaginatedData<Project>, TData>
) {
  const { workspaceId, page, limit, includeTotal } = params

  return queryOptions({
    staleTime: 1000 * 60 * 5,
    ...options,
    queryKey: projectKeys.list(workspaceId, { page, limit, includeTotal }),
    queryFn: () => projectService.getProjectsByWorkspaceId({ workspaceId, page, limit, includeTotal }),
  })
}

export function createProjectsInfiniteQueryOptions<
  TData = InfiniteData<ApiResponse<PaginatedData<Project>>>
>(
  params: { workspaceId: string; limit?: number; includeTotal?: boolean },
  options?: CustomInfiniteQueryOptions<ApiResponse<PaginatedData<Project>>, TData, number>
) {
  const { workspaceId, includeTotal } = params
  const limit = params.limit ?? 20

  return infiniteQueryOptions({
    staleTime: 1000 * 60 * 5,
    ...options,
    queryKey: projectKeys.infiniteList(workspaceId, limit, includeTotal),
    queryFn: ({ pageParam }) =>
      projectService.getProjectsByWorkspaceId({
        workspaceId,
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

