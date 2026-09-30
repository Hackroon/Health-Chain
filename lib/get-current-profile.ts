import { createClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/supabase/client'
import { cookies } from 'next/headers'

export interface Profile {
  id: string
  role: 'hospital' | 'vendor'
  org_name: string
  contact_email: string | null
  contact_phone: string | null
  location: string | null
  created_at: string
}

const DEFAULT_HOSPITAL_PROFILE: Profile = {
  id: 'demo-phc-001',
  role: 'hospital',
  org_name: "St. Mary's Primary Health Centre",
  contact_email: 'ops@stmarys-phc.org',
  contact_phone: '+1 (555) 234-5678',
  location: 'Sub-District Sector 4, North Block',
  created_at: new Date().toISOString(),
}

const DEFAULT_VENDOR_PROFILE: Profile = {
  id: 'demo-vendor-001',
  role: 'vendor',
  org_name: 'MediSupply Co. National Logistics',
  contact_email: 'logistics@medisupply.org',
  contact_phone: '+1 (555) 890-1234',
  location: 'Regional Medical Warehouse B, Sector 12',
  created_at: new Date().toISOString(),
}

/**
 * Fetches the current authenticated user's profile row.
 * Returns a fallback profile in development/preview when Supabase is not configured.
 */
export async function getCurrentProfile(): Promise<Profile | null> {
  const cookieStore = await cookies()
  const demoRole = cookieStore.get('medgrid_role')?.value as 'hospital' | 'vendor' | undefined

  if (!isSupabaseConfigured()) {
    if (demoRole === 'vendor') {
      return DEFAULT_VENDOR_PROFILE
    }
    return DEFAULT_HOSPITAL_PROFILE
  }

  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      if (demoRole === 'vendor') return DEFAULT_VENDOR_PROFILE
      if (demoRole === 'hospital') return DEFAULT_HOSPITAL_PROFILE
      return DEFAULT_HOSPITAL_PROFILE
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('id, role, org_name, contact_email, contact_phone, location, created_at')
      .eq('id', user.id)
      .single()

    return (profile as Profile) ?? DEFAULT_HOSPITAL_PROFILE
  } catch (err) {
    console.warn('[MedGrid] Supabase session retrieval fallback:', err)
    return demoRole === 'vendor' ? DEFAULT_VENDOR_PROFILE : DEFAULT_HOSPITAL_PROFILE
  }
}
