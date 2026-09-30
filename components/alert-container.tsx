'use client'

import { useState } from 'react'
import { MapPin, Radio, ArrowRightLeft, Check, Loader2 } from 'lucide-react'
import {
  requestCrossNetworkTransfer,
  authorizeResourceTransfer,
} from '@/app/hospital/actions'

interface DonorInfo {
  orgName: string
  location: string | null
  percentage: number
}

interface AlertContainerProps {
  active: boolean
  shortageLabels: string[]
  primaryResourceName?: string | null
  donor?: DonorInfo | null
}

export function AlertContainer({
  active,
  shortageLabels,
  primaryResourceName,
  donor,
}: AlertContainerProps) {
  const [status, setStatus] = useState<'idle' | 'requesting' | 'authorized'>('idle')
  const [error, setError] = useState<string | null>(null)

  async function handleAuthorize() {
    if (!primaryResourceName) return
    setStatus('requesting')
    setError(null)

    const result = await requestCrossNetworkTransfer({
      resourceName: primaryResourceName,
      quantityRequested: 50,
    })

    if (result.error) {
      setError(result.error)
      setStatus('idle')
      return
    }

    if (result.requestId) {
      await authorizeResourceTransfer(result.requestId)
    }

    setStatus('authorized')
  }

  if (!active) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-700">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/70 shadow-sm">
          <Check className="h-5 w-5" aria-hidden />
        </span>
        <div>
          <p className="text-sm font-semibold">Network stable</p>
          <p className="text-xs opacity-70">
            All monitored resources are at or above the 25% safe threshold.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-red-200 bg-red-50 shadow-sm">
      <div className="flex items-center gap-3 border-b border-red-200 bg-red-100/60 px-5 py-4">
        <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-white/70 shadow-sm">
          <Radio className="h-5 w-5 text-red-600" aria-hidden />
          <span className="absolute right-1 top-1 h-2 w-2 animate-ping rounded-full bg-red-500" />
        </span>
        <div>
          <h2 className="text-sm font-bold text-red-800">
            Cross-Network Automated Resource Request
          </h2>
          <p className="text-xs text-red-700/80">
            {shortageLabels.length > 0
              ? `Low: ${shortageLabels.join(', ')}`
              : 'Threshold breach detected'}
          </p>
        </div>
      </div>

      <div className="space-y-4 px-5 py-4">
        <p className="text-sm text-red-700">
          Your facility is experiencing a shortage. Checking local coverage
          network for available donors...
        </p>

        {donor ? (
          <div className="flex flex-col gap-3 rounded-xl border border-red-200 bg-white/70 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600">
                <MapPin className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-800">{donor.orgName}</p>
                <p className="text-xs text-slate-500">
                  {primaryResourceName}: {Math.round(donor.percentage)}% ·{' '}
                  <span className="font-medium text-slate-700">
                    {donor.location || 'Nearby node'}
                  </span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAuthorize}
              disabled={status !== 'idle'}
              className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold shadow-sm transition-colors ${
                status === 'authorized'
                  ? 'cursor-default bg-emerald-600 text-white'
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              {status === 'authorized' ? (
                <>
                  <Check className="h-4 w-4" aria-hidden />
                  Transfer Authorized
                </>
              ) : status === 'requesting' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  Authorizing...
                </>
              ) : (
                <>
                  <ArrowRightLeft className="h-4 w-4" aria-hidden />
                  Authorize Resource Transfer
                </>
              )}
            </button>
          </div>
        ) : (
          <p className="rounded-xl border border-red-200 bg-white/70 p-4 text-sm text-slate-500">
            No donor with surplus capacity found in the network for{' '}
            {primaryResourceName || 'this resource'} right now.
          </p>
        )}

        {error && <p className="text-sm text-red-700">{error}</p>}
      </div>
    </div>
  )
}
