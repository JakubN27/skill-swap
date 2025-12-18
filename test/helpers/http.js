export async function withServer(app, fn) {
  const server = app.listen(0)
  try {
    const address = server.address()
    const port = typeof address === 'string' ? 80 : address.port
    const baseUrl = `http://127.0.0.1:${port}`
    return await fn({ baseUrl })
  } finally {
    await new Promise((resolve) => server.close(resolve))
  }
}

export async function requestJson(baseUrl, method, path, body, headers = {}) {
  const res = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      ...(body ? { 'content-type': 'application/json' } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  const text = await res.text()
  let json
  try {
    json = text ? JSON.parse(text) : null
  } catch {
    json = { raw: text }
  }

  return { status: res.status, json }
}

