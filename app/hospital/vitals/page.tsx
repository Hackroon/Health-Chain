import { PageHeader } from '@/components/page-header'
import { VitalsDashboard } from '@/components/vitals-dashboard'

export default function HospitalVitalsPage() {
  return (
    <>
      <PageHeader
        title="Facility Vitals & Telemetry"
        subtitle="Live clinical capacity, cold chain monitoring, oxygen pressure, and utilities"
      />
      <main className="flex-1 px-5 py-6 lg:px-8">
        <VitalsDashboard />
      </main>
    </>
  )
}
