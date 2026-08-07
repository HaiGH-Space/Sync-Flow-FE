import { describe, it, expect, vi, beforeEach } from 'vitest'
import { QueryFunctionContext } from '@tanstack/react-query'
import {
  channelKeys,
  createChannelsQueryOptions,
} from './channel'
import {
  channelService,
  ChannelType,
  ChannelVisibility,
} from '@/lib/api/channel'

vi.mock('@/lib/api/channel', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/api/channel')>()
  return {
    ...actual,
    channelService: {
      getChannelsByProjectId: vi.fn(),
      createChannel: vi.fn(),
    },
  }
})

describe('channel query options', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('channelKeys', () => {
    it('generates the correct base keys', () => {
      expect(channelKeys.all).toEqual(['channels'])
    })

    it('generates the correct list key with projectId', () => {
      expect(channelKeys.list('proj-123')).toEqual(['channels', 'proj-123'])
    })
  })

  describe('createChannelsQueryOptions', () => {
    it('returns options with correct queryKey and queryFn', async () => {
      const options = createChannelsQueryOptions({ projectId: 'proj-123' })

      expect(options.queryKey).toEqual(['channels', 'proj-123'])
      expect(options.staleTime).toBe(1000 * 60 * 5)

      const mockResponse = {
        statusCode: 200,
        message: 'success',
        data: [
          {
            id: 'ch-1',
            name: 'General',
            type: ChannelType.GROUP,
            visibility: ChannelVisibility.PUBLIC,
            projectId: 'proj-123',
            createdAt: '2026-08-07T00:00:00Z',
            updatedAt: '2026-08-07T00:00:00Z',
            members: [
              {
                id: 'cm-1',
                channelId: 'ch-1',
                userId: 'usr-1',
                joinedAt: '2026-08-07T00:00:00Z',
                lastReadAt: '2026-08-07T00:00:00Z',
              },
            ],
          },
        ],
      }
      vi.mocked(channelService.getChannelsByProjectId).mockResolvedValue(mockResponse)

      expect(options.queryFn).toBeDefined()
      const result = await options.queryFn!({ queryKey: options.queryKey, meta: undefined } as unknown as QueryFunctionContext)
      expect(result).toBe(mockResponse)
      expect(channelService.getChannelsByProjectId).toHaveBeenCalledWith('proj-123')
    })
  })
})
