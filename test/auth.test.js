import test from 'node:test'
import assert from 'node:assert/strict'

import { applyTestEnv } from './helpers/env.js'
import { withServer, requestJson } from './helpers/http.js'
import { createSupabaseMock, installSupabaseMock, installGeminiMock } from './helpers/mocks.js'

applyTestEnv()

test('POST /api/auth/signup validates required fields', async () => {
  const restoreSupabase = await installSupabaseMock(createSupabaseMock())
  const restoreGemini = await installGeminiMock()
  const { default: app } = await import('../backend/server.js')

  try {
    await withServer(app, async ({ baseUrl }) => {
      const res = await requestJson(baseUrl, 'POST', '/api/auth/signup', { email: '' })
      assert.equal(res.status, 400)
      assert.ok(res.json.error)
    })
  } finally {
    restoreGemini()
    restoreSupabase()
  }
})

test('POST /api/auth/signup creates auth user and profile', async () => {
  const supabaseMock = createSupabaseMock({
    auth: {
      signUp: async () => ({
        data: { user: { id: 'u1', email: 'a@b.com' }, session: { access_token: 't' } },
        error: null,
      }),
    },
    onQuery: ({ table, op }) => {
      if (table === 'users' && op === 'insert') return { data: { id: 'u1' }, error: null }
      return { data: [], error: null }
    },
  })
  const restoreSupabase = await installSupabaseMock(supabaseMock)
  const restoreGemini = await installGeminiMock()
  const { default: app } = await import('../backend/server.js')

  try {
    await withServer(app, async ({ baseUrl }) => {
      const res = await requestJson(baseUrl, 'POST', '/api/auth/signup', {
        email: 'a@b.com',
        password: 'pw',
        name: 'A',
        bio: 'Hello',
      })
      assert.equal(res.status, 200)
      assert.equal(res.json.success, true)
      assert.equal(res.json.user.id, 'u1')
    })
  } finally {
    restoreGemini()
    restoreSupabase()
  }
})

test('POST /api/auth/login returns 400 when missing credentials', async () => {
  const restoreSupabase = await installSupabaseMock(createSupabaseMock())
  const restoreGemini = await installGeminiMock()
  const { default: app } = await import('../backend/server.js')

  try {
    await withServer(app, async ({ baseUrl }) => {
      const res = await requestJson(baseUrl, 'POST', '/api/auth/login', { email: 'a@b.com' })
      assert.equal(res.status, 400)
      assert.ok(res.json.error)
    })
  } finally {
    restoreGemini()
    restoreSupabase()
  }
})

test('POST /api/auth/login returns session on success', async () => {
  const supabaseMock = createSupabaseMock({
    auth: {
      signInWithPassword: async () => ({
        data: { user: { id: 'u1' }, session: { access_token: 't' } },
        error: null,
      }),
    },
  })
  const restoreSupabase = await installSupabaseMock(supabaseMock)
  const restoreGemini = await installGeminiMock()
  const { default: app } = await import('../backend/server.js')

  try {
    await withServer(app, async ({ baseUrl }) => {
      const res = await requestJson(baseUrl, 'POST', '/api/auth/login', { email: 'a@b.com', password: 'pw' })
      assert.equal(res.status, 200)
      assert.equal(res.json.success, true)
      assert.ok(res.json.session)
    })
  } finally {
    restoreGemini()
    restoreSupabase()
  }
})

test('GET /api/auth/session returns null without auth header', async () => {
  const restoreSupabase = await installSupabaseMock(createSupabaseMock())
  const restoreGemini = await installGeminiMock()
  const { default: app } = await import('../backend/server.js')

  try {
    await withServer(app, async ({ baseUrl }) => {
      const res = await requestJson(baseUrl, 'GET', '/api/auth/session')
      assert.equal(res.status, 200)
      assert.equal(res.json.session, null)
      assert.equal(res.json.user, null)
    })
  } finally {
    restoreGemini()
    restoreSupabase()
  }
})

