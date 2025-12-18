import test from 'node:test'
import assert from 'node:assert/strict'

import { applyTestEnv } from './helpers/env.js'
import { withServer, requestJson } from './helpers/http.js'
import { createSupabaseMock, installSupabaseMock, installGeminiMock } from './helpers/mocks.js'

applyTestEnv()

test('GET /health returns ok', async () => {
  const restoreSupabase = await installSupabaseMock(createSupabaseMock())
  const restoreGemini = await installGeminiMock()
  const { default: app } = await import('../backend/server.js')

  try {
    await withServer(app, async ({ baseUrl }) => {
      const res = await requestJson(baseUrl, 'GET', '/health')
      assert.equal(res.status, 200)
      assert.equal(res.json.status, 'ok')
    })
  } finally {
    restoreGemini()
    restoreSupabase()
  }
})

test('GET / returns API metadata', async () => {
  const restoreSupabase = await installSupabaseMock(createSupabaseMock())
  const restoreGemini = await installGeminiMock()
  const { default: app } = await import('../backend/server.js')

  try {
    await withServer(app, async ({ baseUrl }) => {
      const res = await requestJson(baseUrl, 'GET', '/')
      assert.equal(res.status, 200)
      assert.equal(res.json.name, 'SkillSwap API')
      assert.ok(res.json.endpoints)
    })
  } finally {
    restoreGemini()
    restoreSupabase()
  }
})

test('Unknown route returns 404 JSON', async () => {
  const restoreSupabase = await installSupabaseMock(createSupabaseMock())
  const restoreGemini = await installGeminiMock()
  const { default: app } = await import('../backend/server.js')

  try {
    await withServer(app, async ({ baseUrl }) => {
      const res = await requestJson(baseUrl, 'GET', '/does-not-exist')
      assert.equal(res.status, 404)
      assert.equal(res.json.error, 'Endpoint not found')
    })
  } finally {
    restoreGemini()
    restoreSupabase()
  }
})

