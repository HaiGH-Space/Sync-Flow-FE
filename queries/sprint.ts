import { queryOptions } from '@tanstack/react-query'
import type { QueryOptions } from '@/types/query-option'
import type { ApiResponse, PaginatedData, PaginationQuery } from '@/lib/api/api'
import type { Sprint } from '@/lib/api/sprint'
import { sprintService } from '@/lib/api/sprint'

export const sprintKeys = {
  all: ['sprints'] as const,
  list: (projectId: string, params?: PaginationQuery) =>
    params ? [...sprintKeys.all, projectId, params] as const : [...sprintKeys.all, projectId] as const,
}

export function createSprintsQueryOptions<
  TData = ApiResponse<PaginatedData<Sprint>>
>(
  params: { projectId: string } & PaginationQuery,
  options?: QueryOptions<PaginatedData<Sprint>, TData>
) {
  const { projectId, page, limit } = params

  return queryOptions({
    staleTime: 1000 * 60 * 5,
    ...options,
    queryKey: sprintKeys.list(projectId, { page, limit }),
    queryFn: () => sprintService.getSprint({ projectId, page, limit }),
  })
}
