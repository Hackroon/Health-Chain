import { PageHeader } from '@/components/page-header'
import { VendorDashboard } from '@/components/vendor-dashboard'

export default function VendorOverviewPage() {
  return (
    <>
      <PageHeader
        title="Vendor Dispatch & Logistics Portal"
        subtitle="Assigned PHC orders, delivery validation, and quality assurance"
      />
      <main className="flex-1 px-5 py-6 lg:px-8">
        <VendorDashboard />
      </main>
    </>
  )
}
