import { cn } from "@/lib/utils"

export type CaseStatus =
  | "RECEIVE"
  | "CHECKING"
  | "SUBMITTED"
  | "WORKING"
  | "DONE"
  | "PUBLISH"
  | "AWAITING_PICKUP"
  | "DELIVERY"
  | "CLOSED"

export const STATUS_CONFIG = {
  RECEIVE: {
    label: "Received",
    dot: "bg-slate-400",
    badge: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  },
  CHECKING: {
    label: "Checking",
    dot: "bg-blue-400",
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  },
  SUBMITTED: {
    label: "Submitted",
    dot: "bg-indigo-400",
    badge: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300",
  },
  WORKING: {
    label: "Working",
    dot: "bg-orange-400",
    badge: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  },
  DONE: {
    label: "Done",
    dot: "bg-teal-400",
    badge: "bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300",
  },
  PUBLISH: {
    label: "Published",
    dot: "bg-purple-400",
    badge: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  },
  AWAITING_PICKUP: {
    label: "Awaiting Pickup",
    dot: "bg-amber-400",
    badge: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  },
  DELIVERY: {
    label: "Delivery",
    dot: "bg-cyan-400",
    badge: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300",
  },
  CLOSED: {
    label: "Closed",
    dot: "bg-green-400",
    badge: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  },
} as const

interface StatusBadgeProps {
  status: CaseStatus
  size?: "xs" | "sm"
}

export function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status]
  const sizeClasses =
    size === "xs"
      ? "text-xs px-1.5 py-0.5 rounded-md"
      : "text-xs px-2 py-0.5 rounded-md"

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-medium",
        sizeClasses,
        config.badge
      )}
    >
      <span className={cn("size-1.5 rounded-full flex-shrink-0", config.dot)} />
      {config.label}
    </span>
  )
}
