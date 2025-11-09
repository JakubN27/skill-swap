import serverless from 'serverless-http'
import app from './server.js'

const handler = serverless(app)

export default async function (req, res) {
  // Preserve the original URL path for Express routing
  const path = req.url.split('?path=')[1]
  if (path) {
    req.url = `/api/${path.split('&')[0].split('?')[0]}${req.url.includes('?') && !req.url.startsWith('/?path=') ? '?' + req.url.split('?')[1] : ''}`
  }
  return handler(req, res)
}
