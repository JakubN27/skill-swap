const recommendedMatches = [
  {
    id: 1,
    name: 'Sasha Lee',
    role: 'Product Designer at Loop',
    compatibility: '92% match',
    bio: 'Ready to trade Figma prototyping secrets for advanced React animation patterns.',
    teach: ['Figma Prototyping', 'Design Systems'],
    learn: ['React Transitions'],
    status: 'Suggested today',
  },
  {
    id: 2,
    name: 'Mateo Alvarez',
    role: 'Full-stack Developer at FlowAI',
    compatibility: '88% match',
    bio: 'Wants to polish storytelling presentation while sharing backend scaling tips.',
    teach: ['Node Scaling', 'Supabase Auth'],
    learn: ['Tech Storytelling'],
    status: 'Active 2h ago',
  },
]

const pendingInvites = [
  {
    id: 3,
    name: 'Priya Raman',
    focus: 'Design critique swap',
    sent: 'Sent 3 days ago',
  },
  {
    id: 4,
    name: 'Jonah Smith',
    focus: 'Accessibility deep dive',
    sent: 'Sent 1 day ago',
  },
]

export default function Matches() {
  return (
    <div className="px-4 py-10 text-white">
      <div className="mx-auto max-w-6xl space-y-10">
        <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-primary-950 via-primary-900 to-primary-700 p-10 text-white shadow-xl">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm uppercase tracking-[0.3em] text-white/70">Smart matching</p>
              <h1 className="mt-4 text-4xl font-semibold md:text-5xl">Find partners who accelerate your growth</h1>
              <p className="mt-6 text-white/80">
                The AI looks at your goals, availability, and reciprocal value so every connection feels like a natural
                collaboration.
              </p>
            </div>
            <div className="grid gap-4 rounded-2xl bg-white/10 p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/70">New matches this week</span>
                <span className="text-lg font-semibold">+5</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/70">Response rate</span>
                <span className="text-lg font-semibold">96%</span>
              </div>
              <button className="btn-primary mt-2">Refresh Matches</button>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Recommended for you</h2>
              <p className="text-sm text-slate-500">Curated connections based on what you can teach and want to learn.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              {['All', 'High match', 'New', 'Available this week'].map((filter) => (
                <button
                  key={filter}
                  className={`rounded-full border px-4 py-1.5 transition ${
                    filter === 'High match'
                      ? 'border-primary-200 bg-primary-50 text-primary-700'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-primary-200 hover:text-primary-600'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {recommendedMatches.map((match) => (
              <div key={match.id} className="card flex h-full flex-col gap-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">{match.name}</h3>
                    <p className="text-sm font-medium text-primary-600">{match.compatibility}</p>
                    <p className="mt-1 text-sm text-slate-500">{match.role}</p>
                  </div>
                  <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold uppercase text-primary-600">
                    {match.status}
                  </span>
                </div>
                <p className="text-sm text-slate-600">{match.bio}</p>
                <div className="flex flex-wrap gap-2">
                  {match.teach.map((skill) => (
                    <span key={skill} className="rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-700">
                      {skill}
                    </span>
                  ))}
                  {match.learn.map((skill) => (
                    <span key={skill} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      Wants {skill}
                    </span>
                  ))}
                </div>
                <div className="mt-auto flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-slate-500">Strength: Reciprocal pairing with shared availability</p>
                  <div className="flex gap-2">
                    <button className="btn-secondary text-sm">Preview Profile</button>
                    <button className="btn-primary text-sm">Send Invite</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="card lg:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-slate-900">Pending invites</h2>
              <button className="text-sm font-semibold text-primary-600 hover:text-primary-700">Manage invites</button>
            </div>
            {pendingInvites.length === 0 ? (
              <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-10 text-center">
                <div className="text-4xl">📬</div>
                <p className="mt-3 text-base font-semibold text-slate-700">You are all caught up!</p>
                <p className="mt-1 text-sm text-slate-500">No pending invitations. The AI will nudge you when responses arrive.</p>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {pendingInvites.map((invite) => (
                  <div key={invite.id} className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-medium text-primary-600">{invite.focus}</p>
                      <p className="text-base font-semibold text-slate-900">{invite.name}</p>
                      <p className="text-sm text-slate-500">{invite.sent}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="btn-secondary text-sm">Send reminder</button>
                      <button className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200">Cancel</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card bg-gradient-to-br from-white to-primary-50/60">
            <h2 className="text-xl font-semibold text-slate-900">Matching tips</h2>
            <ul className="mt-4 space-y-4 text-sm text-slate-600">
              <li>
                - Update your learning goals so the AI knows what to look for this week.
              </li>
              <li>
                - Add availability blocks to auto-schedule micro sessions when a match responds.
              </li>
              <li>
                - Share notes after each session - the AI boosts you to mentors who value reflection.
              </li>
            </ul>
            <button className="btn-primary mt-6 w-full text-sm">Tune Matching Preferences</button>
          </div>
        </section>
      </div>
    </div>
  )
}
