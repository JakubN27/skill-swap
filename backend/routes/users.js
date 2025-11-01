import express from 'express'
import { supabase } from '../config/supabase.js'
import { extractSkills } from '../services/aiService.js'
import { generateEmbedding } from '../config/gemini.js'

export const usersRouter = express.Router()

/**
 * GET /api/users
 * Get all users (for admin or matching)
 */
usersRouter.get('/', async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query

    const { data, error, count } = await supabase
      .from('users')
      .select('id, name, bio, teach_skills, learn_skills', { count: 'exact' })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1)

    if (error) throw error

    res.json({
      success: true,
      users: data || [],
      count: data?.length || 0,
      total: count
    })
  } catch (error) {
    console.error('Get users error:', error)
    res.status(500).json({ error: error.message })
  }
})

/**
 * GET /api/users/:userId
 * Get user profile by ID
 */
usersRouter.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error

    if (!data) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json({
      success: true,
      user: data
    })
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({ error: error.message })
  }
})

/**
 * PUT /api/users/:userId
 * Update user profile
 */
usersRouter.put('/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    const { name, bio, teach_skills, learn_skills } = req.body

    const updateData = {}
    if (name !== undefined) updateData.name = name
    if (bio !== undefined) updateData.bio = bio
    if (teach_skills !== undefined) updateData.teach_skills = teach_skills
    if (learn_skills !== undefined) updateData.learn_skills = learn_skills

    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error

    res.json({
      success: true,
      user: data
    })
  } catch (error) {
    console.error('Update user error:', error)
    res.status(500).json({ error: error.message })
  }
})

/**
 * POST /api/users/:userId/extract-skills
 * Extract skills from bio using AI and update user profile
 */
usersRouter.post('/:userId/extract-skills', async (req, res) => {
  try {
    const { userId } = req.params
    const { bio } = req.body

    if (!bio) {
      return res.status(400).json({ error: 'Bio is required' })
    }

    // Extract skills using AI
    const skills = await extractSkills(bio)

    // Generate embedding for the bio
    const embedding = await generateEmbedding(bio)

    // Update user profile
    const { data, error } = await supabase
      .from('users')
      .update({
        bio,
        teach_skills: skills.teach_skills,
        learn_skills: skills.learn_skills,
        embeddings: embedding
      })
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error

    res.json({
      success: true,
      user: data,
      extracted_skills: {
        teach: skills.teach_skills,
        learn: skills.learn_skills
      }
    })
  } catch (error) {
    console.error('Extract skills error:', error)
    res.status(500).json({ error: error.message })
  }
})

/**
 * GET /api/users/:userId/stats
 * Get user statistics
 */
usersRouter.get('/:userId/stats', async (req, res) => {
  try {
    const { userId } = req.params

    // Get active matches count
    const { data: matches, error: matchesError } = await supabase
      .from('matches')
      .select('*')
      .or(`user_a_id.eq.${userId},user_b_id.eq.${userId}`)
      .eq('status', 'active')

    if (matchesError) throw matchesError

    // Get total points
    const { data: achievements, error: achievementsError } = await supabase
      .from('achievements')
      .select('points')
      .eq('user_id', userId)

    if (achievementsError) throw achievementsError

    const totalPoints = achievements?.reduce((sum, a) => sum + (a.points || 0), 0) || 0

    // Get sessions count
    const { data: sessions, error: sessionsError } = await supabase
      .from('sessions')
      .select('id')
      .in('match_id', matches?.map(m => m.id) || [])

    if (sessionsError) throw sessionsError

    res.json({
      success: true,
      stats: {
        active_matches: matches?.length || 0,
        total_points: totalPoints,
        sessions_completed: sessions?.length || 0,
        badges_earned: achievements?.length || 0
      }
    })
  } catch (error) {
    console.error('Get stats error:', error)
    res.status(500).json({ error: error.message })
  }
})

/**
 * DELETE /api/users/:userId
 * Delete a user
 */
usersRouter.delete('/:userId', async (req, res) => {
  try {
    const { userId } = req.params

    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId)

    if (error) throw error

    res.json({
      success: true,
      message: 'User deleted successfully'
    })
  } catch (error) {
    console.error('Delete user error:', error)
    res.status(500).json({ error: error.message })
  }
})

