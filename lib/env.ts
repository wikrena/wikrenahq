/**
 * Environment variable validation.
 * Called once at app startup — fails fast with a clear error
 * rather than mysterious runtime failures.
 */

const required = {
  NEXT_PUBLIC_SUPABASE_URL:      process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY:     process.env.SUPABASE_SERVICE_ROLE_KEY,
}

const optional = {
  ANTHROPIC_API_KEY:             process.env.ANTHROPIC_API_KEY,
  JUDGE0_API_KEY:                process.env.JUDGE0_API_KEY,
  PAYSTACK_SECRET_KEY:           process.env.PAYSTACK_SECRET_KEY,
  NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
  RESEND_API_KEY:                process.env.RESEND_API_KEY,
  NEXT_PUBLIC_APP_URL:           process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_SITE_URL:          process.env.NEXT_PUBLIC_SITE_URL,
  UPSTASH_REDIS_REST_URL:        process.env.UPSTASH_REDIS_REST_URL,
  UPSTASH_REDIS_REST_TOKEN:      process.env.UPSTASH_REDIS_REST_TOKEN,
  CRON_SECRET:                   process.env.CRON_SECRET,
}

export function validateEnv() {
  const missing: string[] = []

  for (const [key, value] of Object.entries(required)) {
    if (!value || value.trim() === "") {
      missing.push(key)
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `\n\n❌ Missing required environment variables:\n` +
      missing.map(k => `   - ${k}`).join("\n") +
      `\n\nAdd these to your .env file (local) or Vercel Environment Variables (production).\n`
    )
  }
}

export function getEnv() {
  return {
    supabaseUrl:          required.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseAnonKey:      required.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    serviceRoleKey:       required.SUPABASE_SERVICE_ROLE_KEY!,
    anthropicKey:         optional.ANTHROPIC_API_KEY     ?? null,
    judge0Key:            optional.JUDGE0_API_KEY        ?? null,
    paystackSecretKey:    optional.PAYSTACK_SECRET_KEY   ?? null,
    resendKey:            optional.RESEND_API_KEY        ?? null,
    appUrl:               optional.NEXT_PUBLIC_SITE_URL
                       ?? optional.NEXT_PUBLIC_APP_URL
                       ?? "https://academy.wikrena.com",
  }
}

// Feature flags — derived from env
// If the key is missing, the feature is silently disabled rather than crashing
export const features = {
  wrenAi:    !!optional.ANTHROPIC_API_KEY,
  codeRun:   !!optional.JUDGE0_API_KEY,
  payments:  !!optional.PAYSTACK_SECRET_KEY,
  email:     !!optional.RESEND_API_KEY,
  cache:     !!optional.UPSTASH_REDIS_REST_URL,
}
