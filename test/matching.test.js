import test from 'node:test'
import assert from 'node:assert/strict'

import { applyTestEnv } from './helpers/env.js'
import { withServer, requestJson } from './helpers/http.js'
import { createSupabaseMock, installSupabaseMock, installGeminiMock } from './helpers/mocks.js'

applyTestEnv()

test('POST /api/matching/create validates required user IDs', async () => {
  const restoreSupabase = await installSupabaseMock(createSupabaseMock())
  const restoreGemini = await installGeminiMock()
  const { default: app } = await import('../backend/server.js')

  try {
    await withServer(app, async ({ baseUrl }) => {
      const res = await requestJson(baseUrl, 'POST', '/api/matching/create', { userAId: 'a' })
      assert.equal(res.status, 400)
      assert.ok(res.json.error)
    })
  } finally {
    restoreGemini()
    restoreSupabase()
  }
})

test('GET /api/matching/find/:userId returns empty list when user profile missing', async () => {
  const supabaseMock = createSupabaseMock({
    onQuery: ({ table, op, options, filters }) => {
      if (table === 'users' && op === 'select' && options.maybeSingle) {
        const isLookingForUser = filters.some((f) => f.type === 'eq' && f.column === 'id' && f.value === 'u1')
        if (isLookingForUser) return { data: null, error: { code: 'PGRST116' } }
      }
      return { data: [], error: null }
    },
  })
  const restoreSupabase = await installSupabaseMock(supabaseMock)
  const restoreGemini = await installGeminiMock()
  const { default: app } = await import('../backend/server.js')

  try {
    await withServer(app, async ({ baseUrl }) => {
      const res = await requestJson(baseUrl, 'GET', '/api/matching/find/u1?limit=5&includeAI=false')
      assert.equal(res.status, 200)
      assert.equal(res.json.success, true)
      assert.equal(res.json.count, 0)
      assert.ok(Array.isArray(res.json.matches))
    })
  } finally {
    restoreGemini()
    restoreSupabase()
  }
})

test('PATCH /api/matching/:matchId/status validates status enum', async () => {
  const restoreSupabase = await installSupabaseMock(createSupabaseMock())
  const restoreGemini = await installGeminiMock()
  const { default: app } = await import('../backend/server.js')

  try {
    await withServer(app, async ({ baseUrl }) => {
      const res = await requestJson(baseUrl, 'PATCH', '/api/matching/m1/status', { status: 'nope' })
      assert.equal(res.status, 400)
      assert.ok(res.json.error)
    })
  } finally {
    restoreGemini()
    restoreSupabase()
  }
})

