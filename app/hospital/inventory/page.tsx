import { PageHeader } from '@/components/page-header'
import { InventoryManager } from '@/components/inventory-manager'
import { getInventoryItems } from '@/lib/data/inventory'
import { getCurrentProfile } from '@/lib/get-current-profile'

export default async function HospitalInventoryPage() {
  const profile = await getCurrentProfile()
  const hospitalId = profile?.id || 'demo-phc-001'
  const items = await getInventoryItems(hospitalId)

  return (
    <>
      <PageHeader
        title="Inventory Catalog & Capacity"
        subtitle="Manage stock items, track depletion, and configure threshold signals"
      />
      <main className="flex-1 px-5 py-6 lg:px-8">
        <InventoryManager initialItems={items} />
      </main>
    </>
  )
}
