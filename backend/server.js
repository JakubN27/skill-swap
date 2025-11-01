import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { skillExtractionRouter } from './routes/skillExtraction.js'
import { matchingRouter } from './routes/matching.js'
import { embeddingsRouter } from './routes/embeddings.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'SkillSwap API is running' })
})

// Routes
app.use('/api/skills', skillExtractionRouter)
app.use('/api/matching', matchingRouter)
app.use('/api/embeddings', embeddingsRouter)

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong!' })
})

app.listen(PORT, () => {
  console.log(`🚀 SkillSwap API running on http://localhost:${PORT}`)
})
