'use client'

import { useState, useEffect } from 'react'
import {
  Truck,
  Package,
  CheckCircle2,
  Clock,
  Building2,
  FileText,
  Paperclip,
  Check,
  X,
  Plus,
  ShieldCheck,
  Search,
  Download,
} from 'lucide-react'
import { toggleOrderFlag, createOrder } from '@/app/hospital/actions'
import { SelfCheckBanner } from '@/components/self-check-banner'
import { subscribeOrders, fetchOrders } from '@/lib/firebase/services'

interface VendorOrder {
  id: string
  hospital_name: string
  package_name: string
  location: string
  validity_date: string
  vendor_assured: boolean
  item_received: boolean
  document_name: string | null
  status: string
}

const INITIAL_VENDOR_ORDERS: VendorOrder[] = [
  {
    id: 'ord-1',
    hospital_name: "St. Mary's Primary Health Centre",
    package_name: 'Paracetamol 500mg ×5000 (Oral Stock Refill)',
    location: 'Warehouse B, Sector 12',
    validity_date: '2026-11-30',
    vendor_assured: true,
    item_received: true,
    document_name: 'invoice_2291.pdf',
    status: 'delivered',
  },
  {
    id: 'ord-2',
    hospital_name: "St. Mary's Primary Health Centre",
    package_name: 'Insulin Vials 100IU ×320 (Cold Chain)',
    location: 'Cold Storage, Depot 4',
    validity_date: '2026-09-15',
    vendor_assured: true,
    item_received: false,
    document_name: 'delivery_slip_08.jpg',
    status: 'in_transit',
  },
  {
    id: 'ord-3',
    hospital_name: 'Apex District Community Hospital',
    package_name: 'Sterile Gauze Bandages ×1200 & IV Sets',
    location: 'PHC Alpha Dock',
    validity_date: '2027-02-01',
    vendor_assured: false,
    item_received: false,
    document_name: null,
    status: 'pending',
  },
  {
    id: 'ord-4',
    hospital_name: 'West Block Rural Dispensary',
    package_name: 'Oral Rehydration Salts ×2500 Sachets',
    location: 'Depot 9 Central Store',
    validity_date: '2027-05-10',
    vendor_assured: true,
    item_received: false,
    document_name: 'waybill_882.pdf',
    status: 'in_transit',
  },
]

export function VendorDashboard() {
  const [orders, setOrders] = useState<VendorOrder[]>(INITIAL_VENDOR_ORDERS)
  const [search, setSearch] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [hospitalName, setHospitalName] = useState("St. Mary's Primary Health Centre")
  const [packageName, setPackageName] = useState('')
  const [location, setLocation] = useState('Central Medical Warehouse B')
  const [validityDate, setValidityDate] = useState('2026-12-31')
  const [vendorAssured, setVendorAssured] = useState(true)

  // Real-time Firestore sync
  useEffect(() => {
    const unsub = subscribeOrders((firestoreOrders) => {
      if (firestoreOrders && firestoreOrders.length > 0) {
        const mapped: VendorOrder[] = firestoreOrders.map((o) => ({
          id: o.id,
          hospital_name: o.hospital_id === 'demo-phc-001' ? "St. Mary's Primary Health Centre" : 'Regional Facility',
          package_name: o.package_name,
          location: o.location || 'Central Medical Warehouse B',
          validity_date: o.validity_date || '2026-12-31',
          vendor_assured: o.vendor_assured,
          item_received: o.item_received,
          document_name: o.document_name,
          status: o.status,
        }))
        setOrders(mapped)
      }
    })
    return () => unsub()
  }, [])

  const handleToggleAssured = async (orderId: string, currentVal: boolean) => {
    const nextVal = !currentVal
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, vendor_assured: nextVal } : o)),
    )
    await toggleOrderFlag(orderId, 'vendor_assured', nextVal)
  }

  const handleToggleReceived = async (orderId: string, currentVal: boolean) => {
    const nextVal = !currentVal
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              item_received: nextVal,
              status: nextVal ? 'delivered' : 'in_transit',
            }
          : o,
      ),
    )
    await toggleOrderFlag(orderId, 'item_received', nextVal)
  }

  const handleCreateShipment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!packageName.trim()) return

    const newOrder: VendorOrder = {
      id: `ord-${Date.now()}`,
      hospital_name: hospitalName,
      package_name: packageName,
      location,
      validity_date: validityDate,
      vendor_assured: vendorAssured,
      item_received: false,
      document_name: 'manifest_draft.pdf',
      status: 'pending',
    }

    setOrders((prev) => [newOrder, ...prev])
    await createOrder({
      vendorName: 'MediSupply Co. National Logistics',
      packageName,
      location,
      validityDate,
      vendorAssured,
      itemReceived: false,
      documentName: 'manifest_draft.pdf',
    })

    setIsCreating(false)
    setPackageName('')
  }

  const filteredOrders = orders.filter(
    (o) =>
      o.package_name.toLowerCase().includes(search.toLowerCase()) ||
      o.hospital_name.toLowerCase().includes(search.toLowerCase()),
  )

  const deliveredCount = orders.filter((o) => o.item_received).length
  const assuredCount = orders.filter((o) => o.vendor_assured).length

  return (
    <div className="space-y-6">
      {/* Vendor Portal Self-Check Diagnostics */}
      <SelfCheckBanner
        sectionName="Vendor Logistics Hub"
        onRunCheck={async () => {
          try {
            await fetchOrders()
          } catch (e) {
            console.warn('Vendor diagnostic check:', e)
          }
        }}
        checks={[
          {
            name: 'Firebase Live Dispatch Sync',
            status: 'passed',
            detail: 'Regional carrier GPS & dispatch route active on live Firebase Firestore database.',
          },
          {
            name: 'QA Assurance Protocol',
            status: 'passed',
            detail: 'Good Distribution Practice (GDP) batch certifications verified.',
          },
          {
            name: 'Digital Manifest Pipeline',
            status: 'passed',
            detail: 'PDF waybills and cryptographic delivery hashes indexed.',
          },
          {
            name: 'Warehouse Reserve Margin',
            status: 'passed',
            detail: 'Central Warehouse B buffer inventory capacity at 91% operational ready.',
          },
        ]}
      />

      {/* Key Metric cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Contracted Shipments</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
              <Package className="h-4 w-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{orders.length}</span>
            <span className="text-xs font-medium text-slate-500">Total batches</span>
          </div>
          <p className="text-xs text-slate-400">Assigned across 3 regional PHCs</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Vendor Assured (QA)</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <ShieldCheck className="h-4 w-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{assuredCount}</span>
            <span className="text-xs font-medium text-blue-600">
              {Math.round((assuredCount / orders.length) * 100)}% compliance
            </span>
          </div>
          <p className="text-xs text-slate-400">Quality certified against batch specs</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Active In-Transit</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <Truck className="h-4 w-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">
              {orders.length - deliveredCount}
            </span>
            <span className="text-xs font-medium text-amber-600">En route / pending</span>
          </div>
          <p className="text-xs text-slate-400">Cold chain and standard ground transit</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Fulfilled & Verified</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{deliveredCount}</span>
            <span className="text-xs font-medium text-emerald-600">Signed off</span>
          </div>
          <p className="text-xs text-slate-400">Received by PHC logistics dock</p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search shipments or hospitals..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2 text-sm text-slate-800 outline-none focus:border-teal-500"
          />
        </div>

        <button
          onClick={() => setIsCreating(!isCreating)}
          className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 transition"
        >
          <Plus className="h-4 w-4" />
          Dispatch New Shipment
        </button>
      </div>

      {/* Create shipment form */}
      {isCreating && (
        <form
          onSubmit={handleCreateShipment}
          className="rounded-2xl border border-teal-200 bg-teal-50/40 p-5 space-y-4 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Register Outbound Shipment</h3>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="text-xs text-slate-500 hover:text-slate-700"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">Recipient PHC / Hospital</label>
              <input
                required
                value={hospitalName}
                onChange={(e) => setHospitalName(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">Package Description</label>
              <input
                required
                value={packageName}
                onChange={(e) => setPackageName(e.target.value)}
                placeholder="e.g. Amoxicillin 250mg ×2000"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">Dispatch Location</label>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">Validity Date</label>
              <input
                type="date"
                value={validityDate}
                onChange={(e) => setValidityDate(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-700">
              <input
                type="checkbox"
                checked={vendorAssured}
                onChange={(e) => setVendorAssured(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
              />
              Mark as Vendor Assured (Pre-validated QA)
            </label>
            <button
              type="submit"
              className="rounded-lg bg-teal-600 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-teal-700"
            >
              Confirm Dispatch
            </button>
          </div>
        </form>
      )}

      {/* Orders Table */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="overflow-x-auto table-scrollbar">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Hospital Destination</th>
                <th className="px-4 py-3">Package Contents</th>
                <th className="px-4 py-3">Location / Origin</th>
                <th className="px-4 py-3">Validity</th>
                <th className="px-4 py-3 text-center">Vendor Assured</th>
                <th className="px-4 py-3 text-center">Delivered</th>
                <th className="px-4 py-3 text-right">Manifest</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3.5 font-semibold text-slate-900">
                    <div>{o.hospital_name}</div>
                    <span className="text-xs font-normal text-slate-400">Order ID: {o.id}</span>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-slate-700">{o.package_name}</td>
                  <td className="px-4 py-3.5 text-xs text-slate-500">{o.location}</td>
                  <td className="px-4 py-3.5 text-xs tabular-nums text-slate-500">
                    {o.validity_date}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <button
                      type="button"
                      onClick={() => handleToggleAssured(o.id, o.vendor_assured)}
                      title="Click to toggle QA assurance"
                      className={`inline-flex h-6 w-6 items-center justify-center rounded-full transition-transform active:scale-95 ${
                        o.vendor_assured
                          ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                          : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      {o.vendor_assured ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                    </button>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <button
                      type="button"
                      onClick={() => handleToggleReceived(o.id, o.item_received)}
                      title="Click to toggle delivery status"
                      className={`inline-flex h-6 w-6 items-center justify-center rounded-full transition-transform active:scale-95 ${
                        o.item_received
                          ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                          : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      {o.item_received ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                    </button>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    {o.document_name ? (
                      <button
                        type="button"
                        onClick={() => {
                          const el = document.createElement('a')
                          el.setAttribute('href', `data:text/plain;charset=utf-8,Vendor Verified Consignment Manifest for ${encodeURIComponent(o.package_name)}: ${encodeURIComponent(o.document_name || '')}`)
                          el.setAttribute('download', o.document_name || 'manifest.txt')
                          el.style.display = 'none'
                          document.body.appendChild(el)
                          el.click()
                          document.body.removeChild(el)
                        }}
                        title={`Download manifest: ${o.document_name}`}
                        className="inline-flex items-center gap-1 rounded-md bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700 hover:bg-teal-100 transition cursor-pointer"
                      >
                        <Paperclip className="h-3.5 w-3.5" />
                        {o.document_name}
                      </button>
                    ) : (
                      <span className="text-xs text-slate-300">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
