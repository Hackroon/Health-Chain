export interface InventoryItem {
  id: string
  hospital_id: string
  name: string
  category: string
  unit: string
  current_quantity: number
  full_capacity: number
  updated_at: string
  created_at: string
}

export function percentageOf(item: InventoryItem): number {
  if (item.full_capacity <= 0) return 0
  return Math.max(0, Math.min(100, (item.current_quantity / item.full_capacity) * 100))
}
