import test from 'node:test'
import assert from 'node:assert/strict'

import { applyTestEnv } from './helpers/env.js'
import { withServer, requestJson } from './helpers/http.js'
import { createSupabaseMock, installSupabaseMock, installGeminiMock } from './helpers/mocks.js'

applyTestEnv()

test('GET /api/users/health returns 200 on successful DB probe', async () => {
  const supabaseMock = createSupabaseMock({
    onQuery: ({ table, op }) => {
      if (table === 'users' && op === 'select') return { data: [{ count: 1 }], error: null }
      return { data: [], error: null }
    },
  })
  const restoreSupabase = await installSupabaseMock(supabaseMock)
  const restoreGemini = await installGeminiMock()
  const { default: app } = await import('../backend/server.js')

  try {
    await withServer(app, async ({ baseUrl }) => {
      const res = await requestJson(baseUrl, 'GET', '/api/users/health')
      assert.equal(res.status, 200)
      assert.equal(res.json.success, true)
    })
  } finally {
    restoreGemini()
    restoreSupabase()
  }
})

test('GET /api/users/:userId returns default structure when profile missing', async () => {
  const supabaseMock = createSupabaseMock({
    onQuery: ({ table, op, options }) => {
      if (table === 'users' && op === 'select' && options.single) {
        return { data: null, error: { code: 'PGRST116' } }
      }
      return { data: [], error: null }
    },
  })
  const restoreSupabase = await installSupabaseMock(supabaseMock)
  const restoreGemini = await installGeminiMock()
  const { default: app } = await import('../backend/server.js')

  try {
    await withServer(app, async ({ baseUrl }) => {
      const res = await requestJson(baseUrl, 'GET', '/api/users/u-missing')
      assert.equal(res.status, 200)
      assert.equal(res.json.success, true)
      assert.equal(res.json.data.id, 'u-missing')
      assert.ok(Array.isArray(res.json.data.teach_skills))
    })
  } finally {
    restoreGemini()
    restoreSupabase()
  }
})

test('POST /api/users validates required fields', async () => {
  const restoreSupabase = await installSupabaseMock(createSupabaseMock())
  const restoreGemini = await installGeminiMock()
  const { default: app } = await import('../backend/server.js')

  try {
    await withServer(app, async ({ baseUrl }) => {
      const res = await requestJson(baseUrl, 'POST', '/api/users', { email: 'a@b.com' })
      assert.equal(res.status, 400)
      assert.ok(res.json.error)
    })
  } finally {
    restoreGemini()
    restoreSupabase()
  }
})

test('PUT /api/users/:userId upserts profile fields', async () => {
  const supabaseMock = createSupabaseMock({
    onQuery: ({ table, op }) => {
      if (table === 'users' && op === 'upsert') {
        return { data: { id: 'u1', name: 'New' }, error: null }
      }
      return { data: [], error: null }
    },
  })
  const restoreSupabase = await installSupabaseMock(supabaseMock)
  const restoreGemini = await installGeminiMock()
  const { default: app } = await import('../backend/server.js')

  try {
    await withServer(app, async ({ baseUrl }) => {
      const res = await requestJson(baseUrl, 'PUT', '/api/users/u1', { name: 'New' })
      assert.equal(res.status, 200)
      assert.equal(res.json.success, true)
      assert.equal(res.json.data.id, 'u1')
    })
  } finally {
    restoreGemini()
    restoreSupabase()
  }
})

