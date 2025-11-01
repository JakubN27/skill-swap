import { supabase } from '../config/supabase.js'

/**
 * Calculate cosine similarity between two vectors
 */
function cosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length) {
    return 0
  }
  
  let dotProduct = 0
  let normA = 0
  let normB = 0
  
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i]
    normA += vecA[i] * vecA[i]
    normB += vecB[i] * vecB[i]
  }
  
  if (normA === 0 || normB === 0) return 0
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}

/**
 * Find reciprocal matches for a user
 * Match users where A can teach what B wants to learn, and vice versa
 */
export async function findMatches(userId, limit = 10) {
  try {
    // Get the user's profile
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (userError) throw userError
    if (!user) throw new Error('User not found')
    
    // Get all other users
    const { data: allUsers, error: usersError } = await supabase
      .from('users')
      .select('*')
      .neq('id', userId)
      .not('embeddings', 'is', null)
    
    if (usersError) throw usersError
    if (!allUsers || allUsers.length === 0) {
      return []
    }
    
    // Calculate reciprocal scores
    const matches = allUsers.map(otherUser => {
      // Score A→B: How well user A can teach what user B wants to learn
      const scoreAtoB = calculateMatchScore(
        user.teach_skills || [],
        otherUser.learn_skills || []
      )
      
      // Score B→A: How well user B can teach what user A wants to learn
      const scoreBtoA = calculateMatchScore(
        otherUser.teach_skills || [],
        user.learn_skills || []
      )
      
      // Reciprocal score (average of both directions)
      const reciprocalScore = (scoreAtoB + scoreBtoA) / 2
      
      // Find mutual skills (skills that match in both directions)
      const mutualSkills = findMutualSkills(user, otherUser)
      
      return {
        user_id: otherUser.id,
        user_name: otherUser.name,
        user_bio: otherUser.bio,
        teach_skills: otherUser.teach_skills,
        learn_skills: otherUser.learn_skills,
        score_a_to_b: scoreAtoB,
        score_b_to_a: scoreBtoA,
        reciprocal_score: reciprocalScore,
        mutual_skills: mutualSkills
      }
    })
    
    // Sort by reciprocal score (highest first)
    matches.sort((a, b) => b.reciprocal_score - a.reciprocal_score)
    
    // Return top matches
    return matches.slice(0, limit)
  } catch (error) {
    console.error('Error finding matches:', error)
    throw error
  }
}

/**
 * Calculate match score between teach skills and learn skills
 */
function calculateMatchScore(teachSkills, learnSkills) {
  if (!teachSkills.length || !learnSkills.length) return 0
  
  let totalScore = 0
  let matchCount = 0
  
  for (const learnSkill of learnSkills) {
    for (const teachSkill of teachSkills) {
      // Exact match
      if (learnSkill.name.toLowerCase() === teachSkill.name.toLowerCase()) {
        totalScore += 1.0
        matchCount++
      }
      // Category match (partial score)
      else if (learnSkill.category === teachSkill.category) {
        totalScore += 0.3
      }
      // Similar skill names (contains)
      else if (
        learnSkill.name.toLowerCase().includes(teachSkill.name.toLowerCase()) ||
        teachSkill.name.toLowerCase().includes(learnSkill.name.toLowerCase())
      ) {
        totalScore += 0.7
        matchCount++
      }
    }
  }
  
  // Normalize score (0-1 range)
  const maxPossibleScore = Math.max(teachSkills.length, learnSkills.length)
  return maxPossibleScore > 0 ? totalScore / maxPossibleScore : 0
}

/**
 * Find skills that match between two users
 */
function findMutualSkills(userA, userB) {
  const mutualSkills = []
  
  // A teaches what B wants to learn
  for (const teachSkill of (userA.teach_skills || [])) {
    for (const learnSkill of (userB.learn_skills || [])) {
      if (teachSkill.name.toLowerCase() === learnSkill.name.toLowerCase()) {
        mutualSkills.push({
          skill: teachSkill.name,
          teacher: userA.name,
          learner: userB.name,
          direction: 'A→B'
        })
      }
    }
  }
  
  // B teaches what A wants to learn
  for (const teachSkill of (userB.teach_skills || [])) {
    for (const learnSkill of (userA.learn_skills || [])) {
      if (teachSkill.name.toLowerCase() === learnSkill.name.toLowerCase()) {
        mutualSkills.push({
          skill: teachSkill.name,
          teacher: userB.name,
          learner: userA.name,
          direction: 'B→A'
        })
      }
    }
  }
  
  return mutualSkills
}

/**
 * Create a match in the database
 */
export async function createMatch(userAId, userBId, score, mutualSkills) {
  try {
    const { data, error } = await supabase
      .from('matches')
      .insert({
        user_a_id: userAId,
        user_b_id: userBId,
        score: score,
        mutual_skills: mutualSkills,
        status: 'pending'
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating match:', error)
    throw error
  }
}

/**
 * Get user's matches
 */
export async function getUserMatches(userId) {
  try {
    const { data, error } = await supabase
      .from('matches')
      .select(`
        *,
        user_a:users!matches_user_a_id_fkey(id, name, bio, teach_skills, learn_skills),
        user_b:users!matches_user_b_id_fkey(id, name, bio, teach_skills, learn_skills)
      `)
      .or(`user_a_id.eq.${userId},user_b_id.eq.${userId}`)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error getting user matches:', error)
    throw error
  }
}
