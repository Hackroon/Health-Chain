"use client"

import type { LucideIcon } from "lucide-react"
import { getResourceStatus } from "@/lib/resource-status"
import { CircularProgress } from "@/components/circular-progress"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

interface ResourceCardProps {
  title: string
  subtitle: string
  value: number
  icon: LucideIcon
  onChange?: (value: number) => void
  showSlider?: boolean
}

export function ResourceCard({
  title,
  subtitle,
  value,
  icon: Icon,
  onChange,
  showSlider = false,
}: ResourceCardProps) {
  const status = getResourceStatus(value)

  return (
    <div
      className={`flex flex-col rounded-2xl border p-5 shadow-sm ring-1 ring-black/[0.02] transition-colors duration-500 ${status.card}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/70 shadow-sm">
            <Icon className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <h3 className="text-sm font-semibold leading-tight">{title}</h3>
            <p className="text-xs opacity-70">{subtitle}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-5">
        <CircularProgress value={value} stroke={status.stroke} />
        <div className="min-w-0 flex-1">
          {/* horizontal progress bar */}
          <div className="mb-3">
            <div className="mb-1 flex items-center justify-between text-xs font-medium">
              <span className="opacity-70">Stock level</span>
              <span className="tabular-nums">{Math.round(value)}%</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/60">
              <div
                className={`h-full rounded-full transition-all duration-500 ${status.bar}`}
                style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
              />
            </div>
          </div>
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold leading-none ${status.pill}`}
          >
            {status.badge}
          </span>
        </div>
      </div>

      {showSlider && onChange ? (
        /* editable stock level when explicitly enabled */
        <div className="mt-5 border-t border-current/10 pt-4">
          <label className="mb-2 flex items-center justify-between text-[11px] font-medium uppercase tracking-wide opacity-70">
            <span>Adjust stock level</span>
            <span className="tabular-nums">{Math.round(value)}%</span>
          </label>
          <input
            type="range"
            min={0}
            max={100}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            aria-label={`Adjust ${title} percentage`}
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/70 accent-current"
            style={{ accentColor: status.stroke }}
          />
        </div>
      ) : (
        /* clean overview telemetry footer without scroll/slider bar */
        <div className="mt-5 flex items-center justify-between border-t border-current/10 pt-3 text-xs opacity-75">
          <span>Safe baseline: 19%</span>
          <Link
            href="/hospital/inventory"
            className="inline-flex items-center gap-1 font-medium hover:underline hover:opacity-100 transition"
          >
            Manage item
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
      )}
    </div>
  )
}
