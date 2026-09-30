import { PageHeader } from '@/components/page-header'
import { OverviewDashboard } from '@/components/overview-dashboard'
import { getInventoryItems, findDonorForResource } from '@/lib/data/inventory'
import { getCurrentProfile } from '@/lib/get-current-profile'

export default async function HospitalOverviewPage() {
  const profile = await getCurrentProfile()
  const hospitalId = profile?.id || 'demo-phc-001'
  const items = await getInventoryItems(hospitalId)
  const donor = await findDonorForResource('Glucose / Blood / Bandages', hospitalId)

  return (
    <>
      <PageHeader
        title="Resource Optimization Dashboard"
        subtitle="Primary Health Centre logistics network · real-time tracking"
      />
      <main className="flex-1 px-5 py-6 lg:px-8 scrollbar-none overflow-x-hidden">
        <OverviewDashboard initialItems={items} donorInfo={donor} />
      </main>
    </>
  )
}
