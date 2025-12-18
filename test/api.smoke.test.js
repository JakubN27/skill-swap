import test from 'node:test'
import assert from 'node:assert/strict'
import http from 'node:http'

function getJson(url) {
  return new Promise((resolve, reject) => {
    const req = http.get(url, (res) => {
      let data = ''
      res.setEncoding('utf8')
      res.on('data', (chunk) => (data += chunk))
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode || 0,
            json: JSON.parse(data),
          })
        } catch (err) {
          reject(err)
        }
      })
    })
    req.on('error', reject)
  })
}

test('GET /health returns ok', async () => {
  process.env.SUPABASE_URL ??= 'https://example.supabase.co'
  process.env.SUPABASE_SERVICE_KEY ??= 'test-service-role-key'
  const { default: app } = await import('../backend/server.js')
  const server = app.listen(0)
  try {
    const { port } = server.address()
    const res = await getJson(`http://127.0.0.1:${port}/health`)
    assert.equal(res.status, 200)
    assert.equal(res.json.status, 'ok')
  } finally {
    await new Promise((resolve) => server.close(resolve))
  }
})

test('GET / returns basic API metadata', async () => {
  process.env.SUPABASE_URL ??= 'https://example.supabase.co'
  process.env.SUPABASE_SERVICE_KEY ??= 'test-service-role-key'
  const { default: app } = await import('../backend/server.js')
  const server = app.listen(0)
  try {
    const { port } = server.address()
    const res = await getJson(`http://127.0.0.1:${port}/`)
    assert.equal(res.status, 200)
    assert.equal(res.json.name, 'SkillSwap API')
    assert.ok(res.json.endpoints)
  } finally {
    await new Promise((resolve) => server.close(resolve))
  }
})
