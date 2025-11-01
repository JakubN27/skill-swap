import { GoogleGenerativeAI } from '@google/generative-ai'

const apiKey = process.env.GEMINI_API_KEY

if (!apiKey) {
  throw new Error('Missing GEMINI_API_KEY environment variable')
}

const genAI = new GoogleGenerativeAI(apiKey)

// Text generation model
export const textModel = genAI.getGenerativeModel({ model: 'gemini-pro' })

// Embedding model
export const embeddingModel = genAI.getGenerativeModel({ model: 'embedding-001' })

// Generate embeddings for text
export async function generateEmbedding(text) {
  try {
    const result = await embeddingModel.embedContent(text)
    return result.embedding.values
  } catch (error) {
    console.error('Error generating embedding:', error)
    throw error
  }
}
