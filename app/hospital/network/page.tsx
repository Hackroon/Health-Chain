import { PageHeader } from '@/components/page-header'
import { NetworkManager } from '@/components/network-manager'

export default function HospitalNetworkPage() {
  return (
    <>
      <PageHeader
        title="Network Share & Mesh Coordination"
        subtitle="Inter-facility resource sharing, surplus routing, and donor dispatch"
      />
      <main className="flex-1 px-5 py-6 lg:px-8">
        <NetworkManager />
      </main>
    </>
  )
}
