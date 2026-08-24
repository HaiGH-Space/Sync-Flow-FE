import { describe, it, expect } from 'vitest'
import { sprintKeys, createSprintsInfiniteQueryOptions } from './sprint'

describe('sprint query options', () => {
  it('generates infinite list query keys correctly', () => {
    const key = sprintKeys.infiniteList('proj-123', 20, false)
    expect(key).toEqual(['sprints', 'proj-123', 'infinite', { limit: 20, includeTotal: false }])
  })

  it('configures infinite query options correctly', () => {
    const options = createSprintsInfiniteQueryOptions({ projectId: 'proj-123', limit: 20 })
    expect(options.initialPageParam).toBe(1)
    expect(options.queryKey).toEqual(sprintKeys.infiniteList('proj-123', 20, undefined))
  })
})
