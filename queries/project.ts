import { queryOptions } from '@tanstack/react-query'
import type { QueryOptions } from '@/types/query-option'
import type { ApiResponse, PaginatedData, PaginationQuery } from '@/lib/api/api'
import type { Project } from '@/lib/api/project'
import { projectService } from '@/lib/api/project'

export const projectKeys = {
  all: ['projects'] as const,
  list: (workspaceId: string, params?: PaginationQuery) =>
    params ? [...projectKeys.all, workspaceId, params] as const : [...projectKeys.all, workspaceId] as const,
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
