'use client'

import { useState } from 'react'
import {
  Activity,
  Thermometer,
  Bed,
  Users,
  Wind,
  Zap,
  CheckCircle2,
  AlertTriangle,
  HeartPulse,
  Clock,
  RotateCcw,
  Sliders,
} from 'lucide-react'
import { SelfCheckBanner } from '@/components/self-check-banner'

export function VitalsDashboard() {
  const [bedOccupancy, setBedOccupancy] = useState(79)
  const [coldChainTemp, setColdChainTemp] = useState(3.8)
  const [oxygenPressure, setOxygenPressure] = useState(98.4)
  const [triageIntake, setTriageIntake] = useState(42)
  const [isCalibrating, setIsCalibrating] = useState(false)

  const handleResetTelemetry = () => {
    setIsCalibrating(true)
    setTimeout(() => {
      setBedOccupancy(79)
      setColdChainTemp(3.8)
      setOxygenPressure(98.4)
      setTriageIntake(42)
      setIsCalibrating(false)
    }, 400)
  }

  return (
    <div className="space-y-6">
      {/* Vitals Telemetry Self-Check */}
      <SelfCheckBanner
        sectionName="Facility Vitals & Telemetry"
        onRunCheck={handleResetTelemetry}
        checks={[
          {
            name: 'Cold Chain Sensor (SENS-CC-04)',
            status: 'passed',
            detail: `Temperature at ${coldChainTemp}°C (Safe range: +2°C to +8°C for insulin & vaccines).`,
          },
          {
            name: 'Oxygen Pressure Transducer',
            status: 'passed',
            detail: `Line pressure at ${oxygenPressure} bar. Automated manifold switch tested nominal.`,
          },
          {
            name: 'Inpatient Bed Sensor Mesh',
            status: 'passed',
            detail: `Load at ${bedOccupancy}% (38/48 beds occupied). Below 85% emergency surge threshold.`,
          },
          {
            name: 'Dual Utility Reserve Link',
            status: 'passed',
            detail: 'Solar battery reserve at 94% with backup generator auto-start primed.',
          },
        ]}
      />

      {/* Overview stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Bed occupancy */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Inpatient Bed Load</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
              <Bed className="h-4 w-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{bedOccupancy}%</span>
            <span className="text-xs font-medium text-amber-600">
              {Math.round((bedOccupancy / 100) * 48)} / 48 beds
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full transition-all ${
                bedOccupancy > 85 ? 'bg-red-500' : 'bg-teal-600'
              }`}
              style={{ width: `${bedOccupancy}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Target: &lt;85%</span>
            <input
              type="range"
              min={20}
              max={100}
              value={bedOccupancy}
              onChange={(e) => setBedOccupancy(Number(e.target.value))}
              className="h-1.5 w-20 cursor-pointer appearance-none rounded-full bg-slate-200 accent-teal-600"
              aria-label="Adjust bed occupancy"
            />
          </div>
        </div>

        {/* Cold Chain Temp */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Cold Chain Integrity</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Thermometer className="h-4 w-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{coldChainTemp.toFixed(1)}°C</span>
            <span
              className={`text-xs font-medium ${
                coldChainTemp >= 2 && coldChainTemp <= 8
                  ? 'text-emerald-600'
                  : 'text-red-600 font-bold'
              }`}
            >
              {coldChainTemp >= 2 && coldChainTemp <= 8 ? 'Optimal Range' : 'Out of Bounds'}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
            <span>Vaccines & Insulin Storage (+2° to +8°C)</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Sensor SENS-CC-04</span>
            <input
              type="range"
              min={1}
              max={12}
              step={0.1}
              value={coldChainTemp}
              onChange={(e) => setColdChainTemp(Number(e.target.value))}
              className="h-1.5 w-20 cursor-pointer appearance-none rounded-full bg-slate-200 accent-blue-600"
              aria-label="Adjust cold chain temperature"
            />
          </div>
        </div>

        {/* Oxygen Manifold */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Oxygen Manifold Line</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <Wind className="h-4 w-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{oxygenPressure.toFixed(1)} bar</span>
            <span className="text-xs font-medium text-emerald-600">Nominal</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all"
              style={{ width: `${oxygenPressure}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Dual backup active</span>
            <input
              type="range"
              min={60}
              max={110}
              step={0.5}
              value={oxygenPressure}
              onChange={(e) => setOxygenPressure(Number(e.target.value))}
              className="h-1.5 w-20 cursor-pointer appearance-none rounded-full bg-slate-200 accent-emerald-600"
              aria-label="Adjust oxygen line pressure"
            />
          </div>
        </div>

        {/* Daily Triage Intake */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Daily Patient Intake</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
              <Users className="h-4 w-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{triageIntake}</span>
            <span className="text-xs font-medium text-purple-600">Patients / shift</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Activity className="h-3.5 w-3.5 text-teal-600 shrink-0" />
            <span>Average turnaround: 24 mins</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Shift A (08:00–16:00)</span>
            <button
              type="button"
              onClick={handleResetTelemetry}
              disabled={isCalibrating}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-600 hover:text-teal-700"
            >
              <RotateCcw className={`h-3 w-3 ${isCalibrating ? 'animate-spin' : ''}`} />
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Clinical Telemetry feeds */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HeartPulse className="h-5 w-5 text-teal-600" />
              <h3 className="text-sm font-bold text-slate-900">Clinical Critical Thresholds</h3>
            </div>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
              Live Monitor
            </span>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
              <div>
                <p className="text-xs font-semibold text-slate-800">Trauma Ward Fluid Reservoirs</p>
                <p className="text-xs text-slate-400">IV Saline 0.9% & Ringer Lactate</p>
              </div>
              <span className="rounded-md bg-amber-100 px-2 py-1 text-xs font-bold text-amber-700">
                14 units remaining
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
              <div>
                <p className="text-xs font-semibold text-slate-800">Sterile Delivery Packs</p>
                <p className="text-xs text-slate-400">Maternity & Neonatal Ward</p>
              </div>
              <span className="rounded-md bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-700">
                42 packs ready
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
              <div>
                <p className="text-xs font-semibold text-slate-800">Antivenom & Rabies Immunoglobulin</p>
                <p className="text-xs text-slate-400">Emergency Protocol Storage</p>
              </div>
              <span className="rounded-md bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-700">
                8 doses locked
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-900">Facility Utilities & Resilience</h3>
            </div>
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
              100% Up
            </span>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
              <div>
                <p className="text-xs font-semibold text-slate-800">Grid Power & Solar Array</p>
                <p className="text-xs text-slate-400">Battery Reserve: 94% (18.2 hrs runtime)</p>
              </div>
              <span className="rounded-md bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-700">
                Active & Stable
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
              <div>
                <p className="text-xs font-semibold text-slate-800">Backup Diesel Generator</p>
                <p className="text-xs text-slate-400">Fuel Tank: 450L (Auto-test passed 2d ago)</p>
              </div>
              <span className="rounded-md bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-700">
                Standby Ready
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
              <div>
                <p className="text-xs font-semibold text-slate-800">Telemetry Satellite Mesh</p>
                <p className="text-xs text-slate-400">Latency: 12ms to Regional Command Center</p>
              </div>
              <span className="rounded-md bg-blue-100 px-2 py-1 text-xs font-bold text-blue-700">
                Connected
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
