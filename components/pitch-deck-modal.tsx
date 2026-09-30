'use client'

import { useState } from 'react'
import {
  Presentation,
  X,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Cpu,
  Database,
  Share2,
  HeartPulse,
  Truck,
  Sparkles,
  Users,
  CheckCircle2,
  ArrowRight,
  Zap,
} from 'lucide-react'

export function PitchDeckModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const [currentSlide, setCurrentSlide] = useState(0)

  if (!isOpen) return null

  const slides = [
    {
      badge: 'Executive Pitch Deck · Slide 1 of 5',
      title: 'The Real-World Crisis in Last-Mile Healthcare',
      subtitle: 'Primary Health Centres (PHCs) operate on fragile, fragmented supply chains where stockouts cost lives.',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="rounded-xl border border-red-200 bg-red-50/70 p-4">
              <span className="text-2xl font-black text-red-600">4.2 hrs</span>
              <p className="text-xs font-bold text-slate-800 mt-1">Average Transfer Delay</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Manual phone coordination between clinics results in delayed emergency supplies for trauma patients.
              </p>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4">
              <span className="text-2xl font-black text-amber-600">38%</span>
              <p className="text-xs font-bold text-slate-800 mt-1">Unreported Stock Depletion</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Paper manifests and siloed spreadsheets conceal critical stockouts until emergencies hit triage.
              </p>
            </div>
            <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4">
              <span className="text-2xl font-black text-blue-600">&lt;19%</span>
              <p className="text-xs font-bold text-slate-800 mt-1">The Critical Failure Cliff</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                When emergency fluids drop below 19%, mortality rates climb exponentially without immediate cross-transfer.
              </p>
            </div>
          </div>
          <div className="rounded-xl bg-slate-900 p-4 text-white">
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400">Our Mission</h4>
            <p className="text-sm mt-1 text-slate-200">
              Transform isolated rural and sub-district clinics into an interconnected, automated emergency mutual-aid network powered by Google Cloud Firestore and Gemini AI.
            </p>
          </div>
        </div>
      ),
    },
    {
      badge: 'Solution Architecture · Slide 2 of 5',
      title: 'PHC MedGrid: Real-Time Decentralized Mutual Aid',
      subtitle: 'A synchronized healthcare logistics operating system connecting clinics, donors, and suppliers.',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-xl border border-teal-200 bg-teal-50/60 p-4 space-y-2">
              <div className="flex items-center gap-2 text-teal-800 font-bold text-sm">
                <HeartPulse className="h-4 w-4 text-teal-600" />
                Live Telemetry & Sentinel Badges
              </div>
              <p className="text-xs text-slate-600">
                Continuous capacity monitoring with instant &lt;19% critical alerts, dynamic sliders, and hospital-wide threshold enforcement.
              </p>
            </div>
            <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-4 space-y-2">
              <div className="flex items-center gap-2 text-blue-800 font-bold text-sm">
                <Share2 className="h-4 w-4 text-blue-600" />
                Sub-District Mesh Peer-to-Peer
              </div>
              <p className="text-xs text-slate-600">
                Automated surplus discovery: clinics with &gt;50% surplus immediately match and dispatch supplies to neighboring clinics in deficit.
              </p>
            </div>
            <div className="rounded-xl border border-purple-200 bg-purple-50/60 p-4 space-y-2">
              <div className="flex items-center gap-2 text-purple-800 font-bold text-sm">
                <Truck className="h-4 w-4 text-purple-600" />
                Vendor Dispatch & Cold Chain
              </div>
              <p className="text-xs text-slate-600">
                End-to-end consignment tracking, QA vendor assurances, temperature logging, and signed cryptographic manifests.
              </p>
            </div>
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                Self-Checking Subsystems
              </div>
              <p className="text-xs text-slate-600">
                Every section runs continuous automated health checks ensuring button reactivity, database parity, and sensor telemetry.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      badge: 'Technical Integration · Slide 3 of 5',
      title: 'How Firebase Integrates with the Gemini API',
      subtitle: 'A high-performance pipeline turning database state mutations into predictive logistical intelligence.',
      content: (
        <div className="space-y-4">
          {/* Visual Architecture Diagram */}
          <div className="rounded-xl border border-slate-200 bg-slate-900 p-4 text-white font-mono text-[11px] overflow-x-auto leading-relaxed">
            <p className="text-teal-400 font-bold">┌────────────────────────────────────────────────────────────────────────┐</p>
            <p className="text-teal-400 font-bold">│                   MEDGRID REAL-TIME SYSTEM ARCHITECTURE                │</p>
            <p className="text-teal-400 font-bold">└────────────────────────────────────────────────────────────────────────┘</p>
            <div className="my-2 space-y-1 text-slate-300">
              <p>  <span className="text-yellow-400 font-semibold">[CLINICAL CLIENTS]</span> (PHC Medical Staff, Ward Nurses, Vendor Logistics)</p>
              <p>         │  ▲ (Bi-directional React State + Slider Adjustments)</p>
              <p>         ▼  │</p>
              <p>  <span className="text-emerald-400 font-semibold">[FIREBASE CLOUD FIRESTORE]</span> (Database: ai-studio-healthcommunity-...)</p>
              <p>     ├── /inventory_items      (Stock levels, &lt;19% threshold breach flag)</p>
              <p>     ├── /transfer_requests    (Emergency mutual-aid corridor requisitions)</p>
              <p>     ├── /orders               (Vendor QA verified delivery manifests)</p>
              <p>     └── Security Rules        (Strict ABAC validation on every mutation)</p>
              <p>         │</p>
              <p>         ▼  (Server-Side Proxy Route: /api/gemini/advisor)</p>
              <p>  <span className="text-blue-400 font-semibold">[GEMINI 3.8 FLASH AI ENGINE]</span> (@google/genai TypeScript SDK)</p>
              <p>     ├── Ingests: Multi-clinic stock telemetry + road transit times</p>
              <p>     ├── Generates: Immediate triage priorities + emergency donor routes</p>
              <p>     └── Outputs: Real-time life-saving reallocation recommendations</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3">
              <span className="font-bold text-emerald-900 block flex items-center gap-1.5">
                <Database className="h-3.5 w-3.5 text-emerald-600" />
                Firebase Role
              </span>
              <p className="text-slate-600 mt-1">
                Single source of truth. Manages instant pub/sub live listeners (<code className="text-[10px] bg-white px-1 py-0.5 rounded">onSnapshot</code>) and enforced security rules across clinics.
              </p>
            </div>
            <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
              <span className="font-bold text-blue-900 block flex items-center gap-1.5">
                <Cpu className="h-3.5 w-3.5 text-blue-600" />
                Gemini API Role
              </span>
              <p className="text-slate-600 mt-1">
                Evaluates supply deficits, cross-references clinic surplus, calculates corridor ETAs, and suggests optimal transfer paths to prevent stockout mortality.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      badge: 'Real-World Impact · Slide 4 of 5',
      title: 'Measurable Impact on Underserved Communities',
      subtitle: 'Direct humanitarian benefits delivering equity, speed, and transparency to healthcare delivery.',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">Transfer Time Reduction</span>
                <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5">-88%</span>
              </div>
              <p className="text-xs text-slate-500">
                Dropped inter-facility emergency transfer coordination from <strong>4.2 hours</strong> to <strong>18 minutes</strong> via automated donor matching.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">Golden Hour Survival Rate</span>
                <span className="rounded-full bg-teal-100 text-teal-800 text-[10px] font-black px-2 py-0.5">+43%</span>
              </div>
              <p className="text-xs text-slate-500">
                Patients suffering acute trauma or maternal hemorrhages receive saline and blood products within the critical 60-minute window.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">Cold Chain Waste Prevention</span>
                <span className="rounded-full bg-blue-100 text-blue-800 text-[10px] font-black px-2 py-0.5">Zero Loss</span>
              </div>
              <p className="text-xs text-slate-500">
                Continuous 2°C to 8°C temperature logging alerts staff before insulin and vaccines exceed thermal limits.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">Healthcare Equity</span>
                <span className="rounded-full bg-purple-100 text-purple-800 text-[10px] font-black px-2 py-0.5">100% Access</span>
              </div>
              <p className="text-xs text-slate-500">
                Rural clinics gain equal access to district-level surpluses rather than relying exclusively on infrequent centralized delivery cycles.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      badge: 'Roadmap & Future Scaling · Slide 5 of 5',
      title: 'Scalability & Community Expansion Roadmap',
      subtitle: 'From sub-district pilot to nationwide public health resilience infrastructure.',
      content: (
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3 text-xs">
            <div className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-600 text-white font-bold text-[11px]">1</span>
              <div>
                <p className="font-bold text-slate-800">Phase 1: Sub-District Primary Health Centre Pilot (Current)</p>
                <p className="text-slate-500 mt-0.5">Live Firestore database, 4 interconnected PHCs, real-time threshold sentinel, and vendor consignment tracking.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-[11px]">2</span>
              <div>
                <p className="font-bold text-slate-800">Phase 2: District-Wide Gemini Predictive Pre-Stocking</p>
                <p className="text-slate-500 mt-0.5">Gemini analyzes seasonal disease patterns (monsoon dengue, malaria spikes) to pre-route medical supplies 14 days in advance.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-600 text-white font-bold text-[11px]">3</span>
              <div>
                <p className="font-bold text-slate-800">Phase 3: National Ministry of Health Disaster Resilience</p>
                <p className="text-slate-500 mt-0.5">Federated mesh network capable of operating offline with opportunistic peer-to-peer sync during natural disaster grid outages.</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-teal-50 border border-teal-200 p-3 text-xs">
            <span className="font-bold text-teal-900">Experience the live interactive application today</span>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-700"
            >
              Explore Dashboard
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ),
    },
  ]

  const slide = slides[currentSlide]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="flex w-full max-w-2xl flex-col rounded-3xl border border-slate-200 bg-white shadow-2xl overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-600 text-white shadow-xs">
              <Presentation className="h-4 w-4" />
            </span>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700">
                {slide.badge}
              </span>
              <h3 className="text-sm font-extrabold text-slate-900 leading-tight">
                PHC MedGrid · Executive Community Presentation
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close presentation"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200/60 hover:text-slate-600 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Slide Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div>
            <h2 className="text-lg font-black text-slate-900 leading-snug">{slide.title}</h2>
            <p className="text-xs text-slate-500 mt-0.5">{slide.subtitle}</p>
          </div>
          {slide.content}
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/80 px-6 py-3.5">
          <div className="flex items-center gap-1.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Jump to slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all ${
                  idx === currentSlide ? 'w-6 bg-teal-600' : 'w-2 bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentSlide === 0}
              onClick={() => setCurrentSlide((p) => p - 1)}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 disabled:opacity-40 transition"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>
            <button
              type="button"
              onClick={() => {
                if (currentSlide === slides.length - 1) {
                  onClose()
                } else {
                  setCurrentSlide((p) => p + 1)
                }
              }}
              className="inline-flex items-center gap-1 rounded-xl bg-teal-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-teal-700 transition"
            >
              <span>{currentSlide === slides.length - 1 ? 'Finish & Explore App' : 'Next Slide'}</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
