import { createClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/supabase/client'
import { InventoryItem, percentageOf } from '@/lib/types/inventory'
import { fetchInventoryItems } from '@/lib/firebase/services'

export type { InventoryItem }
export { percentageOf }

export const inMemoryInventoryStore: InventoryItem[] = [
  {
    id: 'item-1',
    hospital_id: 'demo-phc-001',
    name: 'Tablets Inventory',
    category: 'Oral medication stock',
    unit: 'units',
    current_quantity: 62,
    full_capacity: 100,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'item-2',
    hospital_id: 'demo-phc-001',
    name: 'Injection Beds Availability',
    category: 'Treatment capacity',
    unit: 'beds',
    current_quantity: 21,
    full_capacity: 100,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'item-3',
    hospital_id: 'demo-phc-001',
    name: 'Glucose / Blood / Bandages',
    category: 'Critical fluids & consumables',
    unit: 'units',
    current_quantity: 14,
    full_capacity: 100,
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export async function getInventoryItems(hospitalId: string = 'demo-phc-001'): Promise<InventoryItem[]> {
  try {
    const firestoreItems = await fetchInventoryItems(hospitalId)
    if (firestoreItems && firestoreItems.length > 0) {
      return firestoreItems
    }
  } catch (err) {
    console.warn('[MedGrid] Firebase fetch inventory fallback:', err)
  }

  return inMemoryInventoryStore
}

/** Finds another hospital with surplus (>= 50%) of a resource matching by name, for cross-network donation. */
export async function findDonorForResource(
  resourceName: string,
  excludeHospitalId: string,
): Promise<{ donorHospitalId: string; orgName: string; location: string | null; percentage: number } | null> {
  if (!isSupabaseConfigured()) {
    // Provide a smart mock donor when in demo mode
    return {
      donorHospitalId: 'phc-donor-002',
      orgName: 'Apex District Community Hospital',
      location: 'Sector 7 Hub (8.2 km away)',
      percentage: 84,
    }
  }

  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('inventory_items')
      .select('hospital_id, current_quantity, full_capacity, profiles!inventory_items_hospital_id_fkey(org_name, location)')
      .eq('name', resourceName)
      .neq('hospital_id', excludeHospitalId)

    if (error || !data) {
      console.warn('[MedGrid] findDonorForResource error:', error?.message)
      return {
        donorHospitalId: 'phc-donor-002',
        orgName: 'Apex District Community Hospital',
        location: 'Sector 7 Hub (8.2 km away)',
        percentage: 84,
      }
    }

    for (const row of data as unknown as {
      hospital_id: string
      current_quantity: number
      full_capacity: number
      profiles: { org_name: string; location: string | null } | null
    }[]) {
      const pct = row.full_capacity > 0 ? (row.current_quantity / row.full_capacity) * 100 : 0
      if (pct >= 50 && row.profiles) {
        return {
          donorHospitalId: row.hospital_id,
          orgName: row.profiles.org_name,
          location: row.profiles.location,
          percentage: pct,
        }
      }
    }
  } catch {
    return {
      donorHospitalId: 'phc-donor-002',
      orgName: 'Apex District Community Hospital',
      location: 'Sector 7 Hub (8.2 km away)',
      percentage: 84,
    }
  }

  return null
}
