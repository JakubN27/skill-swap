import express from 'express'
import { findMatches, createMatch, getUserMatches } from '../services/matchingService.js'

export const matchingRouter = express.Router()

/**
 * GET /api/matching/find/:userId
 * Find potential matches for a user
 */
matchingRouter.get('/find/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    const limit = parseInt(req.query.limit) || 10
    
    const matches = await findMatches(userId, limit)
    
    res.json({
      success: true,
      count: matches.length,
      matches
    })
  } catch (error) {
    console.error('Matching error:', error)
    res.status(500).json({ error: error.message })
  }
})

/**
 * POST /api/matching/create
 * Create a match between two users
 */
matchingRouter.post('/create', async (req, res) => {
  try {
    const { userAId, userBId, score, mutualSkills } = req.body
    
    if (!userAId || !userBId) {
      return res.status(400).json({ error: 'Both user IDs are required' })
    }
    
    const match = await createMatch(userAId, userBId, score, mutualSkills)
    
    res.json({
      success: true,
      match
    })
  } catch (error) {
    console.error('Create match error:', error)
    res.status(500).json({ error: error.message })
  }
})

/**
 * GET /api/matching/user/:userId
 * Get all matches for a user
 */
matchingRouter.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    
    const matches = await getUserMatches(userId)
    
    res.json({
      success: true,
      count: matches.length,
      matches
    })
  } catch (error) {
    console.error('Get matches error:', error)
    res.status(500).json({ error: error.message })
  }
})

/**
 * PATCH /api/matching/:matchId/status
 * Update match status
 */
matchingRouter.patch('/:matchId/status', async (req, res) => {
  try {
    const { matchId } = req.params
    const { status } = req.body
    
    if (!['pending', 'active', 'completed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' })
    }
    
    const { data, error } = await supabase
      .from('matches')
      .update({ status })
      .eq('id', matchId)
      .select()
      .single()
    
    if (error) throw error
    
    res.json({ success: true, match: data })
  } catch (error) {
    console.error('Update match status error:', error)
    res.status(500).json({ error: error.message })
  }
})
