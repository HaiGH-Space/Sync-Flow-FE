import { infiniteQueryOptions, queryOptions, type InfiniteData } from '@tanstack/react-query'
import type { QueryOptions, CustomInfiniteQueryOptions } from '@/types/query-option'
import type { ApiResponse, PaginatedData, PaginationQuery } from '@/lib/api/api'
import type { Sprint } from '@/lib/api/sprint'
import { sprintService } from '@/lib/api/sprint'

export const sprintKeys = {
  all: ['sprints'] as const,
  list: (projectId: string, params?: PaginationQuery) =>
    params ? [...sprintKeys.all, projectId, params] as const : [...sprintKeys.all, projectId] as const,
  infiniteList: (projectId: string, limit: number, includeTotal?: boolean) =>
    includeTotal !== undefined
      ? [...sprintKeys.all, projectId, 'infinite', { limit, includeTotal }] as const
      : [...sprintKeys.all, projectId, 'infinite', { limit }] as const,
}

export function createSprintsQueryOptions<
  TData = ApiResponse<PaginatedData<Sprint>>
>(
  params: { projectId: string } & PaginationQuery,
  options?: QueryOptions<PaginatedData<Sprint>, TData>
) {
  const { projectId, page, limit, includeTotal } = params

  return queryOptions({
    staleTime: 1000 * 60 * 5,
    ...options,
    queryKey: sprintKeys.list(projectId, { page, limit, includeTotal }),
    queryFn: () => sprintService.getSprint({ projectId, page, limit, includeTotal }),
  })
}

export function createSprintsInfiniteQueryOptions<
  TData = InfiniteData<ApiResponse<PaginatedData<Sprint>>>
>(
  params: { projectId: string; limit?: number; includeTotal?: boolean },
  options?: CustomInfiniteQueryOptions<ApiResponse<PaginatedData<Sprint>>, TData, number>
) {
  const { projectId, includeTotal } = params
  const limit = params.limit ?? 20

  return infiniteQueryOptions({
    staleTime: 1000 * 60 * 5,
    ...options,
    queryKey: sprintKeys.infiniteList(projectId, limit, includeTotal),
    queryFn: ({ pageParam }) =>
      sprintService.getSprint({
        projectId,
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
