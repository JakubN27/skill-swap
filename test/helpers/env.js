export function applyTestEnv() {
  process.env.SUPABASE_URL ??= 'https://example.supabase.co'
  process.env.SUPABASE_SERVICE_KEY ??= 'test-service-role-key'

  // Set a dummy key so the Gemini config instantiates models, then we stub methods
  process.env.GEMINI_API_KEY ??= 'test'

  // TalkJS signature endpoint reads the secret from env
  process.env.TALKJS_SECRET_KEY ??= 'test-talkjs-secret'
  process.env.TALKJS_APP_ID ??= 'test-talkjs-app'
}

