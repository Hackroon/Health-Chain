import { PageHeader } from '@/components/page-header'
import { SettingsManager } from '@/components/settings-manager'

export default function VendorSettingsPage() {
  return (
    <>
      <PageHeader
        title="Vendor Organization Profile & Preferences"
        subtitle="Logistics contact details, warehouse routing, and dispatch configurations"
      />
      <main className="flex-1 px-5 py-6 lg:px-8">
        <SettingsManager
          initialOrgName="MediSupply Co. National Logistics"
          initialEmail="logistics@medisupply.org"
          initialPhone="+1 (555) 890-1234"
          initialLocation="Regional Medical Warehouse B, Sector 12"
        />
      </main>
    </>
  )
}
