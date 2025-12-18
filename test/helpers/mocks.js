export function createSupabaseMock({ onQuery, onRpc, auth } = {}) {
  const handlers = {
    onQuery: onQuery ?? (() => ({ data: [], error: null })),
    onRpc: onRpc ?? (() => ({ data: null, error: null })),
    auth: auth ?? {},
  }

  class QueryBuilder {
    constructor(table) {
      this.table = table
      this.op = 'select'
      this.filters = []
      this.payload = undefined
      this.options = {}
    }

    select(columns, options) {
      this.options.columns = columns
      this.options.selectOptions = options
      return this
    }
    insert(payload) {
      this.op = 'insert'
      this.payload = payload
      return this
    }
    update(payload) {
      this.op = 'update'
      this.payload = payload
      return this
    }
    upsert(payload, options) {
      this.op = 'upsert'
      this.payload = payload
      this.options.upsertOptions = options
      return this
    }
    delete() {
      this.op = 'delete'
      return this
    }
    eq(column, value) {
      this.filters.push({ type: 'eq', column, value })
      return this
    }
    neq(column, value) {
      this.filters.push({ type: 'neq', column, value })
      return this
    }
    or(expression) {
      this.filters.push({ type: 'or', expression })
      return this
    }
    in(column, values) {
      this.filters.push({ type: 'in', column, values })
      return this
    }
    order(column, options) {
      this.options.order = { column, options }
      return this
    }
    range(from, to) {
      this.options.range = { from, to }
      return this
    }
    limit(value) {
      this.options.limit = value
      return this
    }
    single() {
      this.options.single = true
      return this
    }
    maybeSingle() {
      this.options.maybeSingle = true
      return this
    }

    async _exec() {
      return handlers.onQuery({
        table: this.table,
        op: this.op,
        filters: this.filters,
        payload: this.payload,
        options: this.options,
      })
    }

    then(resolve, reject) {
      return this._exec().then(resolve, reject)
    }
  }

  const client = {
    from(table) {
      return new QueryBuilder(table)
    },
    rpc(fn, args) {
      return Promise.resolve(handlers.onRpc({ fn, args }))
    },
    auth: {
      signUp: auth?.signUp ?? (async () => ({ data: { user: null, session: null }, error: null })),
      signInWithPassword: auth?.signInWithPassword ?? (async () => ({ data: { user: null, session: null }, error: null })),
      signOut: auth?.signOut ?? (async () => ({ error: null })),
      getUser: auth?.getUser ?? (async () => ({ data: { user: null }, error: null })),
      refreshSession: auth?.refreshSession ?? (async () => ({ data: { session: null }, error: null })),
    },
  }

  return client
}

export async function installSupabaseMock(mock) {
  const mod = await import('../../backend/config/supabase.js')
  const supabase = mod.supabase
  const original = {
    from: supabase.from.bind(supabase),
    rpc: supabase.rpc?.bind?.(supabase),
    auth: supabase.auth,
  }

  supabase.from = mock.from
  supabase.rpc = mock.rpc
  supabase.auth = mock.auth

  return () => {
    supabase.from = original.from
    if (original.rpc) supabase.rpc = original.rpc
    supabase.auth = original.auth
  }
}

export async function installGeminiMock({ generateContent, embedContent } = {}) {
  const mod = await import('../../backend/config/gemini.js')
  const { textModel, embeddingModel } = mod

  const original = {
    generateContent: textModel?.generateContent,
    embedContent: embeddingModel?.embedContent,
  }

  if (textModel) {
    textModel.generateContent =
      generateContent ??
      (async (prompt) => {
        let payload

        if (typeof prompt === 'string' && prompt.includes('Analyze the following user bio and extract skills')) {
          payload = {
            teach_skills: [{ name: 'JavaScript', proficiency: 'advanced', category: 'technical' }],
            learn_skills: [{ name: 'TypeScript', proficiency: 'intermediate', category: 'technical' }],
          }
        } else if (typeof prompt === 'string' && prompt.includes('Create a structured learning plan')) {
          payload = [
            {
              session: 1,
              title: 'Intro',
              topics: ['Basics'],
              exercises: ['Hello world'],
              outcomes: ['Set up environment'],
              difficulty: 'beginner',
            },
          ]
        } else if (typeof prompt === 'string' && prompt.includes('Analyze this learning session')) {
          payload = {
            summary: 'Covered basics',
            achievements: ['Completed an exercise'],
            improvements: ['More practice'],
            motivation: 'Keep going',
            next_steps: ['Try another problem'],
          }
        } else if (typeof prompt === 'string' && prompt.includes('Analyze the following user profile for a skill-sharing platform')) {
          payload = {
            teaching_expertise: 0.7,
            learning_clarity: 0.7,
            profile_quality: 0.8,
            reciprocal_potential: [],
          }
        } else {
          payload = { ok: true }
        }

        return {
          response: {
            text: () => JSON.stringify(payload),
          },
        }
      })
  }

  if (embeddingModel) {
    embeddingModel.embedContent =
      embedContent ??
      (async () => ({
        embedding: { values: [0.1, 0.2, 0.3] },
      }))
  }

  return () => {
    if (textModel && original.generateContent) textModel.generateContent = original.generateContent
    if (embeddingModel && original.embedContent) embeddingModel.embedContent = original.embedContent
  }
}

