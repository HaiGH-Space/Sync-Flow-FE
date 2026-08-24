import { describe, it, expect, vi } from 'vitest'

vi.mock('next/navigation', () => ({
  useParams: () => ({ workspaceId: 'ws-1' }),
}))

vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-query')>()
  return {
    ...actual,
    useInfiniteQuery: () => ({
      data: {
        pages: [
          {
            data: {
              items: [
                { id: 'ws-1', name: 'Workspace 1' },
                { id: 'ws-2', name: 'Workspace 2' },
              ],
            },
          },
        ],
      },
      isPending: false,
      error: null,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    }),
  }
})

import { useCurrentWorkspace } from './use-current-workspace'

describe('useCurrentWorkspace', () => {
  it('returns flattened workspace list and active workspace', () => {
    const { workspaceList, activeWorkspace, workspaceId } = useCurrentWorkspace()
    expect(workspaceId).toBe('ws-1')
    expect(workspaceList).toHaveLength(2)
    expect(activeWorkspace?.name).toBe('Workspace 1')
  })
})
