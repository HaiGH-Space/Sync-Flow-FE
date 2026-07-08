import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  workspaceKeys,
  createMyWorkspacesQueryOptions,
  createWorkspaceDetailQueryOptions,
} from './workspace'
import { workspaceService } from '@/lib/api/workspace'

vi.mock('@/lib/api/workspace', () => {
  return {
    workspaceService: {
      getMyWorkspace: vi.fn(),
      getWorkspaceById: vi.fn(),
    },
  }
})

describe('workspace query options', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('workspaceKeys', () => {
    it('generates the correct base keys', () => {
      expect(workspaceKeys.all).toEqual(['workspaces'])
    })

    it('generates the correct list key without params', () => {
      expect(workspaceKeys.list()).toEqual(['workspaces', 'me'])
    })

    it('generates the correct list key with params', () => {
      const params = { page: 1, limit: 10 }
      expect(workspaceKeys.list(params)).toEqual(['workspaces', 'me', params])
    })

    it('generates the correct detail key', () => {
      expect(workspaceKeys.detail('ws-123')).toEqual(['workspaces', 'ws-123'])
    })
  })

  describe('createMyWorkspacesQueryOptions', () => {
    it('returns options with correct queryKey and queryFn', async () => {
      const params = { page: 2, limit: 20 }
      const options = createMyWorkspacesQueryOptions(params)

      expect(options.queryKey).toEqual(['workspaces', 'me', params])
      expect(options.staleTime).toBe(Infinity)

      // Mock queryFn response
      const mockResponse = { data: { items: [], total: 0, page: 2, limit: 20 }, message: 'success' }
      vi.mocked(workspaceService.getMyWorkspace).mockResolvedValue(mockResponse)

      const result = await options.queryFn()
      expect(result).toBe(mockResponse)
      expect(workspaceService.getMyWorkspace).toHaveBeenCalledWith(params)
    })
  })

  describe('createWorkspaceDetailQueryOptions', () => {
    it('returns options with correct queryKey and queryFn', async () => {
      const options = createWorkspaceDetailQueryOptions({ workspaceId: 'ws-456' })

      expect(options.queryKey).toEqual(['workspaces', 'ws-456'])
      expect(options.staleTime).toBe(1000 * 60 * 5)

      // Mock queryFn response
      const mockResponse = { data: { id: 'ws-456', name: 'Test WS', urlSlug: 'test', ownerId: '1', createdAt: '', updatedAt: '' }, message: 'success' }
      vi.mocked(workspaceService.getWorkspaceById).mockResolvedValue(mockResponse)

      const result = await options.queryFn()
      expect(result).toBe(mockResponse)
      expect(workspaceService.getWorkspaceById).toHaveBeenCalledWith('ws-456')
    })
  })
})
