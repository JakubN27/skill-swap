import test from 'node:test'
import assert from 'node:assert/strict'

import { applyTestEnv } from './helpers/env.js'
import { withServer, requestJson } from './helpers/http.js'
import { createSupabaseMock, installSupabaseMock, installGeminiMock } from './helpers/mocks.js'

applyTestEnv()

test('POST /api/skills/extract validates bio', async () => {
  const restoreSupabase = await installSupabaseMock(createSupabaseMock())
  const restoreGemini = await installGeminiMock()
  const { default: app } = await import('../backend/server.js')

  try {
    await withServer(app, async ({ baseUrl }) => {
      const res = await requestJson(baseUrl, 'POST', '/api/skills/extract', { userId: 'u1' })
      assert.equal(res.status, 400)
      assert.ok(res.json.error)
    })
  } finally {
    restoreGemini()
    restoreSupabase()
  }
})

test('POST /api/skills/extract returns skills + embedding dimension', async () => {
  const supabaseMock = createSupabaseMock({
    onQuery: ({ table, op }) => {
      if (table === 'users' && op === 'update') return { data: { id: 'u1' }, error: null }
      return { data: [], error: null }
    },
  })
  const restoreSupabase = await installSupabaseMock(supabaseMock)
  const restoreGemini = await installGeminiMock()
  const { default: app } = await import('../backend/server.js')

  try {
    await withServer(app, async ({ baseUrl }) => {
      const res = await requestJson(baseUrl, 'POST', '/api/skills/extract', { bio: 'I teach JS', userId: 'u1' })
      assert.equal(res.status, 200)
      assert.equal(res.json.success, true)
      assert.ok(res.json.skills)
      assert.equal(res.json.embedding_dimension, 3)
    })
  } finally {
    restoreGemini()
    restoreSupabase()
  }
})

test('POST /api/embeddings/generate validates text', async () => {
  const restoreSupabase = await installSupabaseMock(createSupabaseMock())
  const restoreGemini = await installGeminiMock()
  const { default: app } = await import('../backend/server.js')

  try {
    await withServer(app, async ({ baseUrl }) => {
      const res = await requestJson(baseUrl, 'POST', '/api/embeddings/generate', {})
      assert.equal(res.status, 400)
      assert.ok(res.json.error)
    })
  } finally {
    restoreGemini()
    restoreSupabase()
  }
})

test('POST /api/embeddings/generate returns embedding', async () => {
  const restoreSupabase = await installSupabaseMock(createSupabaseMock())
  const restoreGemini = await installGeminiMock()
  const { default: app } = await import('../backend/server.js')

  try {
    await withServer(app, async ({ baseUrl }) => {
      const res = await requestJson(baseUrl, 'POST', '/api/embeddings/generate', { text: 'hello' })
      assert.equal(res.status, 200)
      assert.equal(res.json.success, true)
      assert.equal(res.json.dimension, 3)
    })
  } finally {
    restoreGemini()
    restoreSupabase()
  }
})

test('POST /api/ai/learning-plan validates required fields', async () => {
  const restoreSupabase = await installSupabaseMock(createSupabaseMock())
  const restoreGemini = await installGeminiMock()
  const { default: app } = await import('../backend/server.js')

  try {
    await withServer(app, async ({ baseUrl }) => {
      const res = await requestJson(baseUrl, 'POST', '/api/ai/learning-plan', { teacherSkills: [] })
      assert.equal(res.status, 400)
      assert.ok(res.json.error)
    })
  } finally {
    restoreGemini()
    restoreSupabase()
  }
})

test('POST /api/ai/learning-plan returns plan', async () => {
  const restoreSupabase = await installSupabaseMock(createSupabaseMock())
  const restoreGemini = await installGeminiMock()
  const { default: app } = await import('../backend/server.js')

  try {
    await withServer(app, async ({ baseUrl }) => {
      const res = await requestJson(baseUrl, 'POST', '/api/ai/learning-plan', {
        teacherSkills: [{ name: 'JS' }],
        learnerGoals: [{ name: 'TS' }],
        sessionCount: 1,
      })
      assert.equal(res.status, 200)
      assert.equal(res.json.success, true)
      assert.equal(res.json.session_count, 1)
      assert.ok(Array.isArray(res.json.plan))
    })
  } finally {
    restoreGemini()
    restoreSupabase()
  }
})

