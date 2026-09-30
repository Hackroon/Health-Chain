import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  orderBy,
  Unsubscribe,
} from 'firebase/firestore'
import { db } from './config'
import { handleFirestoreError, OperationType } from './errors'
import type { InventoryItem } from '@/lib/types/inventory'
import type { InMemoryOrder, InMemoryRequest } from '@/app/hospital/actions'

const INVENTORY_COLLECTION = 'inventory_items'
const ORDERS_COLLECTION = 'orders'
const TRANSFERS_COLLECTION = 'transfer_requests'
const PROFILES_COLLECTION = 'profiles'

export const DEFAULT_INVENTORY_ITEMS: InventoryItem[] = [
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

export const DEFAULT_ORDERS: InMemoryOrder[] = [
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

export const DEFAULT_TRANSFERS: InMemoryRequest[] = [
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

// ==================== INVENTORY SERVICES ====================

export async function fetchInventoryItems(hospitalId: string = 'demo-phc-001'): Promise<InventoryItem[]> {
  try {
    const q = query(collection(db, INVENTORY_COLLECTION), where('hospital_id', '==', hospitalId))
    const snapshot = await getDocs(q)
    if (!snapshot.empty) {
      return snapshot.docs.map((d) => d.data() as InventoryItem)
    }

    // Seed initial items if empty
    for (const item of DEFAULT_INVENTORY_ITEMS) {
      await setDoc(doc(db, INVENTORY_COLLECTION, item.id), item)
    }
    return DEFAULT_INVENTORY_ITEMS
  } catch (error) {
    try {
      handleFirestoreError(error, OperationType.GET, INVENTORY_COLLECTION)
    } catch {
      // Return default items as resilient fallback
      return DEFAULT_INVENTORY_ITEMS
    }
    return DEFAULT_INVENTORY_ITEMS
  }
}

export function subscribeInventoryItems(
  hospitalId: string,
  onUpdate: (items: InventoryItem[]) => void
): Unsubscribe {
  const path = INVENTORY_COLLECTION
  try {
    const q = query(collection(db, path), where('hospital_id', '==', hospitalId))
    return onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          onUpdate(DEFAULT_INVENTORY_ITEMS)
          return
        }
        const items = snapshot.docs.map((d) => d.data() as InventoryItem)
        onUpdate(items)
      },
      (error) => {
        console.warn('Realtime inventory subscription note:', error.message)
        onUpdate(DEFAULT_INVENTORY_ITEMS)
      }
    )
  } catch (err) {
    console.warn('Fallback inventory subscription:', err)
    onUpdate(DEFAULT_INVENTORY_ITEMS)
    return () => {}
  }
}

export async function updateItemQuantityInDb(itemId: string, quantity: number): Promise<void> {
  const path = `${INVENTORY_COLLECTION}/${itemId}`
  try {
    const itemRef = doc(db, INVENTORY_COLLECTION, itemId)
    await updateDoc(itemRef, {
      current_quantity: Math.max(0, Math.round(quantity)),
      updated_at: new Date().toISOString(),
    })
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path)
  }
}

export async function createItemInDb(item: InventoryItem): Promise<void> {
  const path = `${INVENTORY_COLLECTION}/${item.id}`
  try {
    await setDoc(doc(db, INVENTORY_COLLECTION, item.id), item)
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path)
  }
}

export async function deleteItemFromDb(itemId: string): Promise<void> {
  const path = `${INVENTORY_COLLECTION}/${itemId}`
  try {
    await deleteDoc(doc(db, INVENTORY_COLLECTION, itemId))
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path)
  }
}

// ==================== ORDERS SERVICES ====================

export async function fetchOrders(): Promise<InMemoryOrder[]> {
  try {
    const q = query(collection(db, ORDERS_COLLECTION))
    const snapshot = await getDocs(q)
    if (!snapshot.empty) {
      return snapshot.docs.map((d) => d.data() as InMemoryOrder)
    }

    // Seed initial orders
    for (const ord of DEFAULT_ORDERS) {
      await setDoc(doc(db, ORDERS_COLLECTION, ord.id), ord)
    }
    return DEFAULT_ORDERS
  } catch (error) {
    try {
      handleFirestoreError(error, OperationType.GET, ORDERS_COLLECTION)
    } catch {
      return DEFAULT_ORDERS
    }
    return DEFAULT_ORDERS
  }
}

export function subscribeOrders(onUpdate: (orders: InMemoryOrder[]) => void): Unsubscribe {
  try {
    const q = query(collection(db, ORDERS_COLLECTION))
    return onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          onUpdate(DEFAULT_ORDERS)
          return
        }
        const orders = snapshot.docs.map((d) => d.data() as InMemoryOrder)
        onUpdate(orders)
      },
      (error) => {
        console.warn('Realtime orders subscription note:', error.message)
        onUpdate(DEFAULT_ORDERS)
      }
    )
  } catch (err) {
    onUpdate(DEFAULT_ORDERS)
    return () => {}
  }
}

export async function createOrderInDb(order: InMemoryOrder): Promise<void> {
  const path = `${ORDERS_COLLECTION}/${order.id}`
  try {
    await setDoc(doc(db, ORDERS_COLLECTION, order.id), order)
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path)
  }
}

export async function updateOrderFlagInDb(
  orderId: string,
  field: 'vendor_assured' | 'item_received',
  value: boolean
): Promise<void> {
  const path = `${ORDERS_COLLECTION}/${orderId}`
  try {
    const updates: Record<string, any> = { [field]: value }
    if (field === 'item_received' && value) {
      updates.status = 'delivered'
    }
    await updateDoc(doc(db, ORDERS_COLLECTION, orderId), updates)
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path)
  }
}

// ==================== TRANSFERS SERVICES ====================

export async function fetchTransfers(): Promise<InMemoryRequest[]> {
  try {
    const q = query(collection(db, TRANSFERS_COLLECTION))
    const snapshot = await getDocs(q)
    if (!snapshot.empty) {
      return snapshot.docs.map((d) => d.data() as InMemoryRequest)
    }

    for (const req of DEFAULT_TRANSFERS) {
      await setDoc(doc(db, TRANSFERS_COLLECTION, req.id), req)
    }
    return DEFAULT_TRANSFERS
  } catch (error) {
    try {
      handleFirestoreError(error, OperationType.GET, TRANSFERS_COLLECTION)
    } catch {
      return DEFAULT_TRANSFERS
    }
    return DEFAULT_TRANSFERS
  }
}

export function subscribeTransfers(onUpdate: (transfers: InMemoryRequest[]) => void): Unsubscribe {
  try {
    const q = query(collection(db, TRANSFERS_COLLECTION))
    return onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          onUpdate(DEFAULT_TRANSFERS)
          return
        }
        const requests = snapshot.docs.map((d) => d.data() as InMemoryRequest)
        onUpdate(requests)
      },
      (error) => {
        console.warn('Realtime transfers subscription note:', error.message)
        onUpdate(DEFAULT_TRANSFERS)
      }
    )
  } catch (err) {
    onUpdate(DEFAULT_TRANSFERS)
    return () => {}
  }
}

export async function createTransferInDb(request: InMemoryRequest): Promise<void> {
  const path = `${TRANSFERS_COLLECTION}/${request.id}`
  try {
    await setDoc(doc(db, TRANSFERS_COLLECTION, request.id), request)
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path)
  }
}

export async function authorizeTransferInDb(requestId: string): Promise<void> {
  const path = `${TRANSFERS_COLLECTION}/${requestId}`
  try {
    await updateDoc(doc(db, TRANSFERS_COLLECTION, requestId), { status: 'authorized' })
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path)
  }
}
