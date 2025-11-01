const statCards = [
  {
    title: 'Active Matches',
    value: '3',
    change: '+2 this week',
    icon: '🤝',
  },
  {
    title: 'Learning Hours',
    value: '12.5',
    change: '+5 since last login',
    icon: '⏱️',
  },
  {
    title: 'Achievement Points',
    value: '860',
    change: 'Next badge unlock at 1000',
    icon: '🏆',
  },
]

const quickActions = [
  'Complete your learning goals',
  'Check in with new matches',
  'Update availability for next week',
]

const upcomingSessions = [
  {
    id: 1,
    partner: 'Amelia Brown',
    focus: 'UI Animation Deep Dive',
    date: 'Today · 4:00 PM',
    status: 'Confirmed',
  },
  {
    id: 2,
    partner: 'Devon Chen',
    focus: 'React Performance Clinic',
    date: 'Tomorrow · 11:30 AM',
    status: 'Pending notes',
  },
]

const progressUpdates = [
  {
    title: 'Skill Legacy Growth',
    description: 'Your React expertise reached 8 mentees this month',
    metric: '+42%',
  },
  {
    title: 'AI Learning Plans',
    description: '3 new personalised practice plans ready for review',
    metric: 'New',
  },
  {
    title: 'Community Streak',
    description: 'You have helped peers for 6 days straight. Keep it up!',
    metric: '🔥 6-day streak',
  },
]

export default function Dashboard() {
  return (
    <div className="px-4 py-10 text-white">
      <div className="mx-auto max-w-7xl space-y-12">
  <section className="rounded-3xl bg-gradient-to-r from-primary-950 via-primary-900 to-primary-700 p-10 text-white shadow-xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-wide text-white/70">Welcome back</p>
              <h1 className="mt-2 text-4xl font-semibold md:text-5xl">Your Skill Exchange HQ</h1>
              <p className="mt-4 max-w-xl text-white/80">
                Track your progress, celebrate wins, and jump back in with your matches. The AI has lined up
                a few suggestions to keep your momentum strong.
              </p>
            </div>
            <div className="grid gap-3 rounded-2xl bg-white/10 p-6 text-sm backdrop-blur md:w-72">
              <div className="flex items-center justify-between">
                <span className="text-white/70">Weekly Impact</span>
                <span className="text-lg font-semibold">+18%</span>
              </div>
              <div className="h-1 rounded-full bg-white/20">
                <div className="h-1 w-3/4 rounded-full bg-white" />
              </div>
              <p className="text-white/80">You are ahead of 82% of learners this week.</p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {statCards.map((card) => (
            <div key={card.title} className="card relative overflow-hidden">
              <span className="absolute -right-4 -top-4 text-6xl opacity-10">{card.icon}</span>
              <div className="flex items-start justify-between">
                <p className="text-sm font-medium text-slate-500">{card.title}</p>
                <span className="text-2xl">{card.icon}</span>
              </div>
              <p className="mt-4 text-4xl font-bold text-slate-900">{card.value}</p>
              <p className="mt-2 text-sm font-medium text-primary-600">{card.change}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="card lg:col-span-2">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-2xl font-semibold text-slate-900">Upcoming Sessions</h2>
              <button className="btn-primary sm:w-auto">Schedule New Session</button>
            </div>
            <div className="mt-6 space-y-4">
              {upcomingSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex flex-col gap-3 rounded-2xl border border-slate-100/80 bg-slate-50/60 p-5 transition hover:border-primary-200 hover:bg-white"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-medium text-primary-600">{session.date}</p>
                      <h3 className="text-lg font-semibold text-slate-900">{session.focus}</h3>
                      <p className="text-sm text-slate-600">With {session.partner}</p>
                    </div>
                    <span className="inline-flex h-8 items-center justify-center rounded-full bg-white px-3 text-sm font-semibold text-primary-600 shadow-sm">
                      {session.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-semibold text-slate-900">Quick Actions</h2>
            <p className="mt-2 text-sm text-slate-500">
              Suggested by the AI to keep your learning loop active.
            </p>
            <div className="mt-6 space-y-3">
              {quickActions.map((action) => (
                <button
                  key={action}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:border-primary-200 hover:bg-white hover:text-primary-700"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="card lg:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-slate-900">Progress Highlights</h2>
              <span className="text-xs font-semibold uppercase tracking-wide text-primary-500">Auto-insights</span>
            </div>
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {progressUpdates.map((item) => (
                <div key={item.title} className="rounded-2xl border border-slate-100 bg-gradient-to-br from-white to-slate-50/80 p-5 shadow-md">
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary-500">{item.metric}</p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-3 text-sm text-slate-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="card bg-gradient-to-br from-primary-50 to-white">
            <h2 className="text-xl font-semibold text-slate-900">Weekly Focus</h2>
            <p className="mt-2 text-sm text-slate-600">
              Keep your streak alive by completing at least two micro-sessions each day.
            </p>
            <div className="mt-6 space-y-4">
              {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                <div key={day} className="flex items-center justify-between rounded-xl bg-white/70 px-4 py-3 text-sm font-medium text-slate-700 shadow-sm">
                  <span>Day {day}</span>
                  <span className={day <= 4 ? 'text-primary-600' : 'text-slate-400'}>{day <= 4 ? 'Completed' : 'Pending'}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
