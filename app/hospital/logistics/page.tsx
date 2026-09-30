import { PageHeader } from '@/components/page-header'
import { LogisticsSheet } from '@/components/logistics-sheet'

export default function HospitalLogisticsPage() {
  return (
    <>
      <PageHeader
        title="Logistics & Order Storage"
        subtitle="Vendor orders, delivery tracking, and verification documentation"
      />
      <main className="flex-1 px-5 py-6 lg:px-8">
        <LogisticsSheet />
      </main>
    </>
  )
}
