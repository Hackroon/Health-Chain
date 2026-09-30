'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Activity,
  LayoutDashboard,
  Boxes,
  Share2,
  Truck,
  Settings,
  HeartPulse,
  Building2,
  LogOut,
  Menu,
  X,
  ArrowRightLeft,
  CheckCircle2,
  Presentation,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { auth } from '@/lib/firebase/config'
import { PitchDeckModal } from '@/components/pitch-deck-modal'

interface NavItem {
  label: string
  href: string
  icon: LucideIcon
}

const hospitalNav: NavItem[] = [
  { label: 'Overview', href: '/hospital/overview', icon: LayoutDashboard },
  { label: 'Inventory', href: '/hospital/inventory', icon: Boxes },
  { label: 'Network Share', href: '/hospital/network', icon: Share2 },
  { label: 'Logistics', href: '/hospital/logistics', icon: Truck },
  { label: 'Vitals', href: '/hospital/vitals', icon: Activity },
  { label: 'Settings', href: '/hospital/settings', icon: Settings },
]

const vendorNav: NavItem[] = [
  { label: 'Overview', href: '/vendor/overview', icon: LayoutDashboard },
  { label: 'Logistics', href: '/vendor/logistics', icon: Truck },
  { label: 'Settings', href: '/vendor/settings', icon: Settings },
]

interface SidebarProps {
  role: 'hospital' | 'vendor'
  orgName: string
  location?: string | null
}

export function Sidebar({ role, orgName, location }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const nav = role === 'vendor' ? vendorNav : hospitalNav
  const RoleIcon = role === 'vendor' ? Building2 : HeartPulse

  async function handleSignOut() {
    try {
      await auth.signOut()
    } catch (err) {
      console.warn('Sign out notice:', err)
    }
    router.push('/auth/login')
    router.refresh()
  }

  const handleRoleSwitch = () => {
    const nextRole = role === 'hospital' ? 'vendor' : 'hospital'
    document.cookie = `medgrid_role=${nextRole}; path=/; max-age=31536000`
    router.push(nextRole === 'vendor' ? '/vendor/overview' : '/hospital/overview')
    router.refresh()
    setMobileOpen(false)
  }

  return (
    <>
      {/* Mobile Top Header */}
      <div className="lg:hidden flex items-center justify-between border-b border-slate-200 bg-white/95 px-4 py-3 sticky top-0 z-30 backdrop-blur">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-white shadow-xs">
            <RoleIcon className="h-4 w-4" aria-hidden />
          </span>
          <div>
            <p className="text-xs font-bold leading-tight text-slate-900">PHC MedGrid</p>
            <p className="text-[10px] text-slate-500">
              {role === 'vendor' ? 'Vendor Logistics Portal' : 'Hospital Node'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRoleSwitch}
            className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 transition"
          >
            {role === 'hospital' ? 'Vendor Portal' : 'Hospital Node'}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-100 transition"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer / Dropdown */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[53px] bottom-0 z-40 bg-slate-900/40 backdrop-blur-xs flex flex-col">
          <div className="bg-white border-b border-slate-200 p-4 shadow-xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <p className="text-xs font-bold text-slate-900">{orgName}</p>
                <p className="text-[11px] text-slate-400">{location || 'Primary Health Node'}</p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Sync
              </span>
            </div>

            <nav className="flex flex-col gap-1">
              {nav.map(({ label, href, icon: Icon }) => {
                const isActive = pathname === href || pathname.startsWith(`${href}/`)
                return (
                  <Link
                    key={label}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors ${
                      isActive
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="h-4 w-4" aria-hidden />
                    <span>{label}</span>
                  </Link>
                )
              })}
            </nav>

            <div className="pt-3 border-t border-slate-100 space-y-2">
              <button
                type="button"
                onClick={handleRoleSwitch}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-100 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-200 transition"
              >
                <ArrowRightLeft className="h-3.5 w-3.5" />
                Switch to {role === 'hospital' ? 'Vendor Portal' : 'Hospital Node'}
              </button>
              <button
                type="button"
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-2 rounded-xl py-2 text-xs font-medium text-slate-500 hover:text-red-600 transition"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign out
              </button>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      {/* Desktop Persistent Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white/80 px-4 py-6 backdrop-blur lg:flex">
        <div className="mb-8 flex items-center gap-3 px-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm">
            <RoleIcon className="h-6 w-6" aria-hidden />
          </span>
          <div>
            <p className="text-sm font-bold leading-tight text-slate-800">PHC MedGrid</p>
            <p className="text-xs text-slate-400">
              {role === 'vendor' ? 'Vendor Portal' : 'Resource Optimizer'}
            </p>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto pr-1">
          {nav.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(`${href}/`)
            return (
              <Link
                key={label}
                href={href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-teal-50 text-teal-700 font-semibold'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <Icon className="h-5 w-5" aria-hidden />
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 mt-auto">
          <p className="truncate text-xs font-semibold text-slate-700">{orgName}</p>
          <p className="mt-0.5 truncate text-xs text-slate-400">
            {location || (role === 'vendor' ? 'Supplier network' : 'Coverage node')}
          </p>
          <div className="mt-3 flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            <span className="text-xs text-slate-500">Live sync active</span>
          </div>
          <button
            type="button"
            onClick={handleRoleSwitch}
            className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-100 hover:text-teal-700 transition"
          >
            Switch to {role === 'hospital' ? 'Vendor Portal' : 'Hospital Node'}
          </button>
          <button
            type="button"
            onClick={handleSignOut}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium text-slate-500 transition-colors hover:bg-white hover:text-red-600"
          >
            <LogOut className="h-3.5 w-3.5" aria-hidden />
            Sign out
          </button>
        </div>
      </aside>
    </>
  )
}
