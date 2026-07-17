import { infiniteQueryOptions, queryOptions, type InfiniteData } from '@tanstack/react-query'
import type { QueryOptions, CustomInfiniteQueryOptions } from '@/types/query-option'
import type { ApiResponse, PaginatedData, PaginationQuery } from '@/lib/api/api'
import type { Project } from '@/lib/api/project'
import { projectService } from '@/lib/api/project'

export const projectKeys = {
  all: ['projects'] as const,
  list: (workspaceId: string, params?: PaginationQuery) =>
    params ? [...projectKeys.all, workspaceId, params] as const : [...projectKeys.all, workspaceId] as const,
  infiniteList: (workspaceId: string, limit: number) =>
    [...projectKeys.all, workspaceId, 'infinite', { limit }] as const,
}

export function createProjectsQueryOptions<
  TData = ApiResponse<PaginatedData<Project>>
>(
  params: { workspaceId: string } & PaginationQuery,
  options?: QueryOptions<PaginatedData<Project>, TData>
) {
  const { workspaceId, page, limit } = params

  return queryOptions({
    staleTime: 1000 * 60 * 5,
    ...options,
    queryKey: projectKeys.list(workspaceId, { page, limit }),
    queryFn: () => projectService.getProjectsByWorkspaceId({ workspaceId, page, limit }),
  })
}

export function createProjectsInfiniteQueryOptions<
  TData = InfiniteData<ApiResponse<PaginatedData<Project>>>
>(
  params: { workspaceId: string; limit?: number },
  options?: CustomInfiniteQueryOptions<ApiResponse<PaginatedData<Project>>, TData, number>
) {
  const { workspaceId } = params
  const limit = params.limit ?? 20

  return infiniteQueryOptions({
    staleTime: 1000 * 60 * 5,
    ...options,
    queryKey: projectKeys.infiniteList(workspaceId, limit),
    queryFn: ({ pageParam }) =>
      projectService.getProjectsByWorkspaceId({
        workspaceId,
        page: pageParam ?? 1,
        limit,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const page = Number(lastPage.data.page)
      const limitVal = Number(lastPage.data.limit)
      const total = Number(lastPage.data.total)
      const hasMore = page * limitVal < total
      return hasMore ? page + 1 : undefined
    },
  })
}

