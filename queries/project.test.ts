import { describe, it, expect, vi, beforeEach } from 'vitest'
import { projectKeys, createProjectsInfiniteQueryOptions } from './project'
import { projectService } from '@/lib/api/project'

vi.mock('@/lib/api/project', () => {
  return {
    projectService: {
      getProjectsByWorkspaceId: vi.fn(),
    },
  }
})

describe('project infinite query options', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('generates the correct infinite list key', () => {
    expect(projectKeys.infiniteList('ws-123', 20)).toEqual(['projects', 'ws-123', 'infinite', { limit: 20 }])
  })

  it('returns options with correct getNextPageParam and queryFn', async () => {
    const options = createProjectsInfiniteQueryOptions({ workspaceId: 'ws-123', limit: 20 })
    expect(options.queryKey).toEqual(['projects', 'ws-123', 'infinite', { limit: 20 }])
    
    const mockResponse = {
      statusCode: 200,
      message: 'success',
      data: { items: [], total: 50, page: 1, limit: 20 }
    }
    vi.mocked(projectService.getProjectsByWorkspaceId).mockResolvedValue(mockResponse)

    const result = await options.queryFn!(
      { pageParam: 1, queryKey: options.queryKey, meta: undefined, signal: new AbortController().signal } as unknown as Parameters<NonNullable<typeof options.queryFn>>[0]
    )
    expect(result).toBe(mockResponse)
    expect(projectService.getProjectsByWorkspaceId).toHaveBeenCalledWith({ workspaceId: 'ws-123', page: 1, limit: 20 })

    const nextPage = options.getNextPageParam(mockResponse, [mockResponse], 1, [1])
    expect(nextPage).toBe(2)
  })
})
