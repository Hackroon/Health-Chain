import { createBrowserClient } from '@supabase/ssr'

export function isValidSupabaseUrl(url?: string): boolean {
  if (!url || typeof url !== 'string') return false
  if (url.includes('placeholder')) return false
  if (!url.startsWith('http://') && !url.startsWith('https://')) return false
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  return isValidSupabaseUrl(url) && !!anonKey && !anonKey.includes('placeholder')
}

export function createClient() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const url = isValidSupabaseUrl(rawUrl) ? rawUrl! : 'https://placeholder.supabase.co'
  const anonKey = rawKey && !rawKey.includes('placeholder') ? rawKey : 'placeholder-anon-key'

  return createBrowserClient(
    url,
    anonKey,
    {
      cookieOptions: { secure: process.env.NODE_ENV === 'production' },
    },
  )
}
