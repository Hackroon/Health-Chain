'use server'

import { createClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/supabase/client'
import { findDonorForResource, inMemoryInventoryStore } from '@/lib/data/inventory'
import { revalidatePath } from 'next/cache'
import {
  updateItemQuantityInDb,
  createItemInDb,
  deleteItemFromDb,
  createOrderInDb,
  updateOrderFlagInDb,
  createTransferInDb,
  authorizeTransferInDb,
} from '@/lib/firebase/services'

export interface InMemoryOrder {
  id: string
  hospital_id: string
  vendor_name: string
  package_name: string
  location: string | null
  validity_date: string | null
  vendor_assured: boolean
  item_received: boolean
  document_name: string | null
  status: string
  created_at: string
}

export const inMemoryOrdersStore: InMemoryOrder[] = [
  {
    id: 'ord-1',
    hospital_id: 'demo-phc-001',
    vendor_name: 'MediSupply Co. National Logistics',
    package_name: 'Paracetamol 500mg ×5000 (Oral Stock Refill)',
    location: 'Warehouse B, Sector 12',
    validity_date: '2026-11-30',
    vendor_assured: true,
    item_received: true,
    document_name: 'invoice_2291.pdf',
    status: 'delivered',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'ord-2',
    hospital_id: 'demo-phc-001',
    vendor_name: 'BioCare Distributors',
    package_name: 'Insulin Vials 100IU ×320',
    location: 'Cold Storage, Depot 4',
    validity_date: '2026-09-15',
    vendor_assured: true,
    item_received: false,
    document_name: 'delivery_slip_08.jpg',
    status: 'in_transit',
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'ord-3',
    hospital_id: 'demo-phc-001',
    vendor_name: 'Rapid Aid Logistics',
    package_name: 'Sterile Gauze Bandages ×1200 & IV Sets',
    location: 'PHC Alpha Dock',
    validity_date: '2027-02-01',
    vendor_assured: false,
    item_received: false,
    document_name: null,
    status: 'pending',
    created_at: new Date().toISOString(),
  },
]

export interface InMemoryRequest {
  id: string
  requesting_hospital_id: string
  donor_hospital_id: string | null
  inventory_item_id: string | null
  resource_name: string
  quantity_requested: number
  status: 'pending' | 'authorized' | 'completed'
  urgency: 'critical' | 'normal'
  created_at: string
}

export const inMemoryRequestsStore: InMemoryRequest[] = [
  {
    id: 'req-001',
    requesting_hospital_id: 'demo-phc-001',
    donor_hospital_id: 'phc-donor-002',
    inventory_item_id: 'item-3',
    resource_name: 'Glucose / Blood / Bandages',
    quantity_requested: 50,
    status: 'authorized',
    urgency: 'critical',
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
]

export async function updateInventoryQuantity(itemId: string, quantity: number) {
  const clamped = Math.max(0, Math.round(quantity))

  // Update in-memory store
  const target = inMemoryInventoryStore.find((i) => i.id === itemId)
  if (target) {
    target.current_quantity = clamped
    target.updated_at = new Date().toISOString()
  }

  try {
    await updateItemQuantityInDb(itemId, clamped)
  } catch (err) {
    console.warn('[MedGrid] Firebase updateItemQuantity fallback:', err)
  }

  revalidatePath('/hospital/overview')
  revalidatePath('/hospital/inventory')
  revalidatePath('/hospital/network')
  return { success: true }
}

export async function createInventoryItem(input: {
  name: string
  category: string
  unit: string
  current_quantity: number
  full_capacity: number
}) {
  if (!input.name.trim()) return { error: 'Name is required' }
  if (input.full_capacity <= 0) return { error: 'Full capacity must be greater than 0' }

  const newItem: InventoryItem = {
    id: `item-${Date.now()}`,
    hospital_id: 'demo-phc-001',
    name: input.name.trim(),
    category: input.category.trim() || 'General',
    unit: input.unit.trim() || 'units',
    current_quantity: Math.max(0, input.current_quantity),
    full_capacity: input.full_capacity,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  inMemoryInventoryStore.push(newItem)

  try {
    await createItemInDb(newItem)
  } catch (err) {
    console.warn('[MedGrid] Firebase createItemInDb fallback:', err)
  }

  revalidatePath('/hospital/overview')
  revalidatePath('/hospital/inventory')
  return { success: true }
}

export async function deleteInventoryItem(itemId: string) {
  const index = inMemoryInventoryStore.findIndex((i) => i.id === itemId)
  if (index !== -1) {
    inMemoryInventoryStore.splice(index, 1)
  }

  try {
    await deleteItemFromDb(itemId)
  } catch (err) {
    console.warn('[MedGrid] Firebase deleteItemFromDb fallback:', err)
  }

  revalidatePath('/hospital/overview')
  revalidatePath('/hospital/inventory')
  return { success: true }
}

export async function requestCrossNetworkTransfer(input: {
  resourceName: string
  quantityRequested: number
  inventoryItemId?: string
}) {
  const donor = await findDonorForResource(input.resourceName, 'demo-phc-001')
  const newReqId = `req-${Date.now()}`

  const newRequest: InMemoryRequest = {
    id: newReqId,
    requesting_hospital_id: 'demo-phc-001',
    donor_hospital_id: donor?.donorHospitalId ?? null,
    inventory_item_id: input.inventoryItemId ?? null,
    resource_name: input.resourceName,
    quantity_requested: Math.max(1, input.quantityRequested),
    status: 'pending',
    urgency: 'critical',
    created_at: new Date().toISOString(),
  }

  inMemoryRequestsStore.unshift(newRequest)

  try {
    await createTransferInDb(newRequest)
  } catch (err) {
    console.warn('[MedGrid] Firebase createTransferInDb fallback:', err)
  }

  revalidatePath('/hospital/overview')
  revalidatePath('/hospital/network')
  return { success: true, requestId: newReqId, donor }
}

export async function authorizeResourceTransfer(requestId: string) {
  const target = inMemoryRequestsStore.find((r) => r.id === requestId)
  if (target) {
    target.status = 'authorized'
  }

  try {
    await authorizeTransferInDb(requestId)
  } catch (err) {
    console.warn('[MedGrid] Firebase authorizeTransferInDb fallback:', err)
  }

  revalidatePath('/hospital/overview')
  revalidatePath('/hospital/network')
  return { success: true }
}

export async function updateProfile(input: {
  orgName: string
  contactEmail: string
  contactPhone: string
  location: string
}) {
  if (!input.orgName.trim()) return { error: 'Organization name is required' }

  revalidatePath('/hospital/settings')
  revalidatePath('/hospital/overview')
  return { success: true }
}

export async function createOrder(input: {
  vendorName: string
  packageName: string
  location: string
  validityDate: string
  vendorAssured: boolean
  itemReceived: boolean
  documentName?: string
}) {
  if (!input.packageName.trim()) return { error: 'Package details are required' }

  const newOrder: InMemoryOrder = {
    id: `ord-${Date.now()}`,
    hospital_id: 'demo-phc-001',
    vendor_name: input.vendorName.trim() || 'Unnamed Vendor',
    package_name: input.packageName.trim(),
    location: input.location.trim() || 'PHC Main Store',
    validity_date: input.validityDate || '2026-12-31',
    vendor_assured: input.vendorAssured,
    item_received: input.itemReceived,
    document_name: input.documentName || null,
    status: input.itemReceived ? 'delivered' : 'pending',
    created_at: new Date().toISOString(),
  }

  inMemoryOrdersStore.unshift(newOrder)

  try {
    await createOrderInDb(newOrder)
  } catch (err) {
    console.warn('[MedGrid] Firebase createOrderInDb fallback:', err)
  }

  revalidatePath('/hospital/logistics')
  revalidatePath('/vendor/logistics')
  return { success: true }
}

export async function toggleOrderFlag(
  orderId: string,
  field: 'vendor_assured' | 'item_received',
  value: boolean,
) {
  const target = inMemoryOrdersStore.find((o) => o.id === orderId)
  if (target) {
    target[field] = value
    if (field === 'item_received' && value) {
      target.status = 'delivered'
    }
  }

  try {
    await updateOrderFlagInDb(orderId, field, value)
  } catch (err) {
    console.warn('[MedGrid] Firebase updateOrderFlagInDb fallback:', err)
  }

  revalidatePath('/hospital/logistics')
  revalidatePath('/vendor/logistics')
  return { success: true }
}

