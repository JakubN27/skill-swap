import test from 'node:test'
import assert from 'node:assert/strict'

import { applyTestEnv } from './helpers/env.js'
import { withServer, requestJson } from './helpers/http.js'
import { createSupabaseMock, installSupabaseMock, installGeminiMock } from './helpers/mocks.js'

applyTestEnv()

test('GET /api/notifications/:userId returns notifications list', async () => {
  const supabaseMock = createSupabaseMock({
    onQuery: ({ table, op }) => {
      if (table === 'notifications' && op === 'select') {
        return { data: [{ id: 'n1', read: false }], error: null, count: 1 }
      }
      return { data: [], error: null }
    },
  })
  const restoreSupabase = await installSupabaseMock(supabaseMock)
  const restoreGemini = await installGeminiMock()
  const { default: app } = await import('../backend/server.js')

  try {
    await withServer(app, async ({ baseUrl }) => {
      const res = await requestJson(baseUrl, 'GET', '/api/notifications/u1?offset=10&limit=5&unreadOnly=true')
      assert.equal(res.status, 200)
      assert.equal(res.json.success, true)
      assert.equal(res.json.unreadCount, 1)
    })
  } finally {
    restoreGemini()
    restoreSupabase()
  }
})

