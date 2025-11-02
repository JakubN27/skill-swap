import { supabase } from '../config/supabase.js'

/**
 * Get user's network up to specified depth
 * Only fetches necessary data for network visualization
 */
export async function getUserNetwork(userId, depth = 2) {
  try {
    console.log('[NetworkService] Getting connections for user:', userId);
    
    // Get direct connections first
    const { data: directConnections, error: directError } = await supabase
      .from('matches')
      .select(`
        id,
        user_a_id,
        user_b_id,
        user_a:users!matches_user_a_id_fkey (
          id,
          name
        ),
        user_b:users!matches_user_b_id_fkey (
          id,
          name
        )
      `)
      .or(`user_a_id.eq.${userId},user_b_id.eq.${userId})`);

    if (directError) {
      console.error('[NetworkService] Error fetching direct connections:', directError);
      throw directError;
    }

    const connections = directConnections.map(match => ({
      connection_id: match.id,
      user_a_id: match.user_a_id,
      user_b_id: match.user_b_id,
      user_a_name: match.user_a?.name || 'Anonymous',
      user_b_name: match.user_b?.name || 'Anonymous',
      depth: 1
    }));

    // If depth > 1, get secondary connections
    if (depth > 1) {
      const connectedUserIds = new Set(
        directConnections.flatMap(match => [match.user_a_id, match.user_b_id])
      );
      connectedUserIds.delete(userId);

      for (const connectedId of connectedUserIds) {
        const { data: secondaryData, error: secondaryError } = await supabase
          .from('matches')
          .select(`
            id,
            user_a_id,
            user_b_id,
            user_a:users!matches_user_a_id_fkey (
              id,
              name
            ),
            user_b:users!matches_user_b_id_fkey (
              id,
              name
            )
          `)
          .or(`user_a_id.eq.${connectedId},user_b_id.eq.${connectedId})`);

        if (secondaryError) {
          console.error('[NetworkService] Error fetching secondary connections:', secondaryError);
          continue;
        }

        connections.push(...secondaryData.map(match => ({
          connection_id: match.id,
          user_a_id: match.user_a_id,
          user_b_id: match.user_b_id,
          user_a_name: match.user_a?.name || 'Anonymous',
          user_b_name: match.user_b?.name || 'Anonymous',
          depth: 2
        })));
      }
    }

    console.log('[NetworkService] Successfully retrieved connections:', {
      total: connections.length,
      firstDegree: connections.filter(c => c.depth === 1).length,
      secondDegree: connections.filter(c => c.depth === 2).length
    });

    return connections;
  } catch (error) {
    console.error('[NetworkService] Error:', error);
    throw error;
  }
}