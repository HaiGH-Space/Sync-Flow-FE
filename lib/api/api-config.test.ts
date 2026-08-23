import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { getBackendUrl, resolveApiUrl, getWebSocketUrl, DEFAULT_API_URL, API_PREFIX } from './api-config'

describe('api-config', () => {
  const originalEnv = process.env

  beforeEach(() => {
    vi.resetModules()
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  describe('getBackendUrl', () => {
    it('uses INTERNAL_API_URL during SSR when defined', () => {
      process.env.INTERNAL_API_URL = 'http://internal-backend:8000'
      process.env.NEXT_PUBLIC_API_URL = 'http://public-backend:8000'
      expect(getBackendUrl()).toBe('http://internal-backend:8000')
    })

    it('falls back to NEXT_PUBLIC_API_URL when INTERNAL_API_URL is not set', () => {
      delete process.env.INTERNAL_API_URL
      process.env.NEXT_PUBLIC_API_URL = 'http://public-backend:8000'
      expect(getBackendUrl()).toBe('http://public-backend:8000')
    })

    it('falls back to DEFAULT_API_URL when no env vars are set', () => {
      delete process.env.INTERNAL_API_URL
      delete process.env.NEXT_PUBLIC_API_URL
      expect(getBackendUrl()).toBe(DEFAULT_API_URL)
    })
  })

  describe('resolveApiUrl', () => {
    it('returns relative path with API_PREFIX on the client', () => {
      const originalWindow = globalThis.window
      try {
        globalThis.window = {} as unknown as Window & typeof globalThis
        const result = resolveApiUrl('/workspaces')
        expect(result).toBe(`${API_PREFIX}/workspaces`)
      } finally {
        globalThis.window = originalWindow
      }
    })

    it('returns direct backend URL on the server', () => {
      process.env.INTERNAL_API_URL = 'http://internal-backend:8000'
      const result = resolveApiUrl('/workspaces')
      expect(result).toBe('http://internal-backend:8000/workspaces')
    })

    it('returns intact absolute http/https URLs', () => {
      expect(resolveApiUrl('https://example.com/api')).toBe('https://example.com/api')
    })
  })

  describe('getWebSocketUrl', () => {
    it('resolves chat websocket endpoint cleanly', () => {
      process.env.NEXT_PUBLIC_API_URL = 'http://localhost:8000/'
      expect(getWebSocketUrl('chat')).toBe('http://localhost:8000/chat')
    })
  })
})
