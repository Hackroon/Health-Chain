import { PageHeader } from '@/components/page-header'
import { SettingsManager } from '@/components/settings-manager'
import { getCurrentProfile } from '@/lib/get-current-profile'

export default async function HospitalSettingsPage() {
  const profile = await getCurrentProfile()

  return (
    <>
      <PageHeader
        title="Facility Settings & Profile"
        subtitle="Organization metadata, contact hot-lines, and telemetry alert thresholds"
      />
      <main className="flex-1 px-5 py-6 lg:px-8">
        <SettingsManager
          initialOrgName={profile?.org_name || "St. Mary's Primary Health Centre"}
          initialEmail={profile?.contact_email || 'ops@stmarys-phc.org'}
          initialPhone={profile?.contact_phone || '+1 (555) 234-5678'}
          initialLocation={profile?.location || 'Sub-District Sector 4, North Block'}
        />
      </main>
    </>
  )
}
