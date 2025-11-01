import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const profileTips = [
  'Mention recent projects so the AI can surface mentors in the same lane.',
  'List specific topics you enjoy teaching - people love clarity.',
  'Be honest about your learning edges. Reciprocal matches rely on it.',
]

export default function Profile() {
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState({
    name: '',
    bio: '',
    teach_skills: [],
    learn_skills: [],
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
      if (!user) {
        return
      }

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      if (data) {
        setProfile((prev) => ({
          ...prev,
          ...data,
          teach_skills: data.teach_skills || [],
          learn_skills: data.learn_skills || [],
        }))
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
      if (!user) {
        alert('User session expired. Please sign in again.')
        return
      }

      const { error } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          email: user.email,
          ...profile,
          updated_at: new Date().toISOString(),
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
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="rounded-2xl border border-slate-100 bg-white px-6 py-4 text-sm font-medium text-slate-600 shadow">
          Loading profile...
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-10 text-white">
      <div className="mx-auto max-w-5xl space-y-10">
        <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-primary-950 via-primary-900 to-primary-700 p-10 text-white shadow-xl">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm uppercase tracking-[0.35em] text-white/70">Profile hub</p>
              <h1 className="mt-4 text-4xl font-semibold md:text-5xl">Craft your SkillSwap identity</h1>
              <p className="mt-6 text-white/80">
                Share what lights you up, highlight your strengths, and tell the AI what you want to learn next.
                The richer your story, the sharper your matches.
              </p>
            </div>
            <div className="rounded-2xl bg-white/10 p-6 backdrop-blur-sm">
              <p className="text-sm text-white/80">Profile completeness</p>
              <p className="mt-2 text-4xl font-semibold">78%</p>
              <div className="mt-4 h-2 rounded-full bg-white/20">
                <div className="h-2 w-3/4 rounded-full bg-white" />
              </div>
              <p className="mt-4 text-xs uppercase tracking-wide text-white/70">
                Tip: Add more detail to your bio for sharper AI skill extraction.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <form onSubmit={handleSubmit} className="card space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Your story</h2>
                <p className="mt-1 text-sm text-slate-500">What should the community know about you?</p>
              </div>
              <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold uppercase text-primary-600">
                AI powered
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">Name</label>
                <input
                  type="text"
                  className="input"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  placeholder="How should others call you?"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">Bio</label>
                <textarea
                  className="input min-h-[140px]"
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  placeholder="Share your background, what you love teaching, and what you are eager to learn."
                  required
                />
                <p className="mt-2 text-xs text-slate-500">
                  The AI reads this to extract skills and recommend brilliant matches.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-slate-500">Updated {new Date().toLocaleDateString()}</p>
              <button type="submit" className="btn-primary sm:w-auto" disabled={loading}>
                {loading ? 'Saving...' : 'Save profile'}
              </button>
            </div>
          </form>

          <aside className="card space-y-5">
            <h2 className="text-xl font-semibold text-slate-900">Profile tips</h2>
            <ul className="space-y-4 text-sm text-slate-600">
              {profileTips.map((tip) => (
                <li key={tip}>- {tip}</li>
              ))}
            </ul>
            <button className="btn-secondary w-full text-sm">Preview public profile</button>
          </aside>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="card bg-gradient-to-br from-primary-50 to-white">
            <h2 className="text-xl font-semibold text-slate-900">Skills you can teach</h2>
            <p className="mt-1 text-sm text-slate-500">These come straight from your bio. Add more detail to expand the list.</p>
            {profile.teach_skills?.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {profile.teach_skills.map((skill, idx) => (
                  <span
                    key={`${skill}-${idx}`}
                    className="rounded-full bg-primary-100 px-3 py-1 text-sm font-semibold text-primary-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-dashed border-primary-200 bg-primary-50/40 p-6 text-sm text-primary-700">
                Share what you love teaching so the AI can highlight your expertise.
              </div>
            )}
          </div>

          <div className="card bg-gradient-to-br from-white to-slate-50">
            <h2 className="text-xl font-semibold text-slate-900">Skills you want to learn</h2>
            <p className="mt-1 text-sm text-slate-500">Let the AI know what to prioritise when pairing you up.</p>
            {profile.learn_skills?.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {profile.learn_skills.map((skill, idx) => (
                  <span
                    key={`${skill}-${idx}`}
                    className="rounded-full bg-slate-200 px-3 py-1 text-sm font-semibold text-slate-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
                Tell us what you are exploring next so we can introduce mentors who are a few steps ahead.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
