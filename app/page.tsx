import { redirect } from 'next/navigation'
import { getCurrentProfile } from '@/lib/get-current-profile'

export default async function RootPage() {
  const profile = await getCurrentProfile()

  if (!profile) {
    redirect('/auth/login')
  }

  redirect(profile.role === 'vendor' ? '/vendor/overview' : '/hospital/overview')
}
