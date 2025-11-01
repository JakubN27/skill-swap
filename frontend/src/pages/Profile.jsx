import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import ProfileForm from '../components/ProfileForm'

export default function Profile() {
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState({
    name: '',
    bio: '',
    teach_skills: [],
    learn_skills: []
  })

  useEffect(() => {
    getProfile()
  }, [])

  const getProfile = async () => {
    try {
      setLoading(true)
      if (!supabase) {
        console.error('Supabase not configured')
        return
      }

      const { data: { user } } = await supabase.auth.getUser()

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      if (data) {
        setProfile(data)
      }
    } catch (error) {
      console.error('Error loading profile:', error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!supabase) {
        alert('Supabase not configured')
        return
      }

      const { data: { user } } = await supabase.auth.getUser()

      const { error } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          email: user.email,
          ...profile,
          updated_at: new Date().toISOString()
        })

      if (error) throw error
      alert('Profile updated successfully!')
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading && !profile.name) {
    return <div className="max-w-2xl mx-auto px-4 py-8">Loading...</div>
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
      <div className="space-y-8">
        <ProfileForm />

        {profile.teach_skills?.length > 0 && (
          <div className="card mt-6">
            <h2 className="text-xl font-semibold mb-4">Skills You Can Teach</h2>
            <div className="flex flex-wrap gap-2">
              {profile.teach_skills.map((skill, idx) => (
                <span key={idx} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {profile.learn_skills?.length > 0 && (
          <div className="card mt-6">
            <h2 className="text-xl font-semibold mb-4">Skills You Want to Learn</h2>
            <div className="flex flex-wrap gap-2">
              {profile.learn_skills.map((skill, idx) => (
                <span key={idx} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
