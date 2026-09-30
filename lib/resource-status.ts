export type ResourceLevel = "critical" | "warning" | "ok"

export const CRITICAL_THRESHOLD_PERCENT = 19
export const WARNING_THRESHOLD_PERCENT = 24

export function isItemCriticalLevel(value: number): boolean {
  return value < CRITICAL_THRESHOLD_PERCENT
}

export interface StatusStyle {
  level: ResourceLevel
  badge: string
  /** classes for the card container */
  card: string
  /** classes for the badge pill */
  pill: string
  /** hex used for the circular progress stroke */
  stroke: string
  /** classes for the progress fill (horizontal bars) */
  bar: string
  /** classes for the accent text */
  accent: string
}

export function getResourceStatus(value: number): StatusStyle {
  if (value < 19) {
    return {
      level: "critical",
      badge: "🚨 Critical Shortage (Lowest/Need)",
      card: "bg-red-50 text-red-700 border-red-200",
      pill: "bg-red-100 text-red-700 border border-red-200",
      stroke: "#dc2626",
      bar: "bg-red-500",
      accent: "text-red-700",
    }
  }

  if (value <= 24) {
    return {
      level: "warning",
      badge: "⚠️ Warning: Trigger Network Share",
      card: "bg-amber-50 text-amber-700 border-amber-200",
      pill: "bg-amber-100 text-amber-700 border border-amber-200",
      stroke: "#d97706",
      bar: "bg-amber-500",
      accent: "text-amber-700",
    }
  }

  return {
    level: "ok",
    badge: "✅ Satisfactory",
    card: "bg-emerald-50 text-emerald-700 border-emerald-200",
    pill: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    stroke: "#059669",
    bar: "bg-emerald-500",
    accent: "text-emerald-700",
  }
}
