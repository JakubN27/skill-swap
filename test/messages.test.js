import test from 'node:test'
import assert from 'node:assert/strict'

import { applyTestEnv } from './helpers/env.js'
import { withServer, requestJson } from './helpers/http.js'
import { createSupabaseMock, installSupabaseMock, installGeminiMock } from './helpers/mocks.js'

applyTestEnv()

test('POST /api/messages validates required fields', async () => {
  const restoreSupabase = await installSupabaseMock(createSupabaseMock())
  const restoreGemini = await installGeminiMock()
  const { default: app } = await import('../backend/server.js')

  try {
    await withServer(app, async ({ baseUrl }) => {
      const res = await requestJson(baseUrl, 'POST', '/api/messages', { matchId: 'm1', senderId: 'u1' })
      assert.equal(res.status, 400)
      assert.ok(res.json.error)
    })
  } finally {
    restoreGemini()
    restoreSupabase()
  }
})

test('GET /api/messages/match/:matchId returns messages list', async () => {
  const supabaseMock = createSupabaseMock({
    onQuery: ({ table, op }) => {
      if (table === 'messages' && op === 'select') {
        return { data: [{ id: 'msg1', content: 'hi' }], error: null }
      }
      return { data: [], error: null }
    },
  })
  const restoreSupabase = await installSupabaseMock(supabaseMock)
  const restoreGemini = await installGeminiMock()
  const { default: app } = await import('../backend/server.js')

  try {
    await withServer(app, async ({ baseUrl }) => {
      const res = await requestJson(baseUrl, 'GET', '/api/messages/match/m1?offset=10&limit=5')
      assert.equal(res.status, 200)
      assert.equal(res.json.success, true)
      assert.equal(res.json.count, 1)
    })
  } finally {
    restoreGemini()
    restoreSupabase()
  }
})

