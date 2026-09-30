import { PageHeader } from '@/components/page-header'
import { LogisticsSheet } from '@/components/logistics-sheet'

export default function VendorLogisticsPage() {
  return (
    <>
      <PageHeader
        title="Vendor Order Logistics & Manifests"
        subtitle="Upload delivery proof, mark items received, and track supply shipments"
      />
      <main className="flex-1 px-5 py-6 lg:px-8">
        <LogisticsSheet />
      </main>
    </>
  )
}
