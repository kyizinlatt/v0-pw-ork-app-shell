"use client"

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

// Status configuration with flow-accurate labels
// Flow: CUSTOMER → PWIN → PARTNER → PWIN → CUSTOMER (public page)
export const STATUS_CONFIG = {
  RECEIVE: {
    label: "Received",
    description: "Case received from customer, pending initial review",
    dot: "bg-slate-500",
    badge: "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-700",
    owner: "PWIN",
  },
  CHECKING: {
    label: "Checking",
    description: "PWIN reviewing documents and preparing for submission",
    dot: "bg-blue-500",
    badge: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
    owner: "PWIN",
  },
  SUBMITTED: {
    label: "Sent to Partner",
    description: "Case sent to Partner, awaiting Partner assignment",
    dot: "bg-indigo-500",
    badge: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800",
    owner: "PWIN",
  },
  WORKING: {
    label: "Partner Working",
    description: "Partner is processing with Government/Embassy",
    dot: "bg-orange-500",
    badge: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800",
    owner: "PARTNER",
  },
  DONE: {
    label: "Partner Complete",
    description: "Partner completed work, pending PWIN review",
    dot: "bg-teal-500",
    badge: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950 dark:text-teal-300 dark:border-teal-800",
    owner: "PWIN",
  },
  PUBLISH: {
    label: "Published",
    description: "Results published to customer tracking page",
    dot: "bg-violet-500",
    badge: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950 dark:text-violet-300 dark:border-violet-800",
    owner: "PWIN",
  },
  AWAITING_PICKUP: {
    label: "Awaiting Pickup",
    description: "Customer can request final documents",
    dot: "bg-amber-500",
    badge: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
    owner: "PWIN",
  },
  DELIVERY: {
    label: "Delivery",
    description: "Documents being delivered to customer",
    dot: "bg-cyan-500",
    badge: "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950 dark:text-cyan-300 dark:border-cyan-800",
    owner: "PWIN",
  },
  CLOSED: {
    label: "Closed",
    description: "Case completed and closed",
    dot: "bg-green-500",
    badge: "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800",
    owner: "SYSTEM",
  },
} as const

// Get next possible transitions based on current status and user role
export function getAvailableTransitions(
  currentStatus: CaseStatus,
  userOrgType: "PWIN_HQ" | "PWIN_BRANCH" | "PARTNER"
): Array<{
  toStatus: CaseStatus
  action: string
  label: string
  variant: "primary" | "secondary" | "destructive"
  requiresReason?: boolean
  requiresPartnerAssignment?: boolean
}> {
  const isPWIN = userOrgType === "PWIN_HQ" || userOrgType === "PWIN_BRANCH"
  const isPARTNER = userOrgType === "PARTNER"

  switch (currentStatus) {
    case "RECEIVE":
      if (isPWIN) {
        return [
          { toStatus: "CHECKING", action: "ADVANCE", label: "Start Checking", variant: "primary" },
        ]
      }
      return []

    case "CHECKING":
      if (isPWIN) {
        return [
          { toStatus: "SUBMITTED", action: "ADVANCE", label: "Send to Partner", variant: "primary" },
          { toStatus: "DONE", action: "ADVANCE", label: "Complete (No Partner)", variant: "secondary" },
          { toStatus: "CLOSED", action: "REJECT", label: "Reject Case", variant: "destructive", requiresReason: true },
        ]
      }
      return []

    case "SUBMITTED":
      if (isPWIN) {
        return [
          { toStatus: "WORKING", action: "ADVANCE", label: "Confirm Partner Start", variant: "primary", requiresPartnerAssignment: true },
          { toStatus: "CHECKING", action: "ROLLBACK", label: "Return to Checking", variant: "secondary", requiresReason: true },
        ]
      }
      return []

    case "WORKING":
      if (isPARTNER) {
        return [
          { toStatus: "DONE", action: "ADVANCE", label: "Mark as Complete", variant: "primary" },
          { toStatus: "SUBMITTED", action: "ROLLBACK", label: "Return to PWIN", variant: "secondary", requiresReason: true },
          { toStatus: "CHECKING", action: "REJECT", label: "Reject / Block", variant: "destructive", requiresReason: true },
        ]
      }
      if (isPWIN) {
        return [
          { toStatus: "SUBMITTED", action: "ROLLBACK", label: "Recall from Partner", variant: "secondary", requiresReason: true },
        ]
      }
      return []

    case "DONE":
      if (isPWIN) {
        return [
          { toStatus: "PUBLISH", action: "ADVANCE", label: "Review & Publish", variant: "primary" },
          { toStatus: "WORKING", action: "ROLLBACK", label: "Return to Partner", variant: "secondary", requiresReason: true },
        ]
      }
      return []

    case "PUBLISH":
      if (isPWIN) {
        return [
          { toStatus: "AWAITING_PICKUP", action: "ADVANCE", label: "Set Awaiting Pickup", variant: "primary" },
          { toStatus: "DELIVERY", action: "ADVANCE", label: "Start Delivery", variant: "primary" },
          { toStatus: "CLOSED", action: "ADVANCE", label: "Close Case", variant: "secondary" },
          { toStatus: "DONE", action: "ROLLBACK", label: "Unpublish", variant: "secondary", requiresReason: true },
        ]
      }
      return []

    case "AWAITING_PICKUP":
      if (isPWIN) {
        return [
          { toStatus: "SUBMITTED", action: "ADVANCE", label: "Process Final Doc Request", variant: "primary" },
          { toStatus: "CLOSED", action: "ADVANCE", label: "Close (Expired)", variant: "secondary" },
        ]
      }
      return []

    case "DELIVERY":
      if (isPWIN) {
        return [
          { toStatus: "CLOSED", action: "ADVANCE", label: "Confirm Delivered", variant: "primary" },
        ]
      }
      return []

    case "CLOSED":
      if (isPWIN) {
        return [
          { toStatus: "CHECKING", action: "REOPEN", label: "Reopen Case", variant: "secondary", requiresReason: true },
        ]
      }
      return []

    default:
      return []
  }
}

interface StatusBadgeProps {
  status: CaseStatus
  size?: "xs" | "sm" | "md"
  showOwner?: boolean
  showDot?: boolean
}

export function StatusBadge({ status, size = "sm", showOwner = false, showDot = true }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status]
  const sizeClasses = {
    xs: "text-[10px] px-1.5 py-0.5 rounded",
    sm: "text-xs px-2 py-1 rounded",
    md: "text-sm px-2.5 py-1 rounded",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-medium border",
        sizeClasses[size],
        config.badge
      )}
      title={config.description}
    >
      {showDot && (
        <span className={cn("size-1.5 rounded-full flex-shrink-0", config.dot)} />
      )}
      {config.label}
      {showOwner && (
        <span className="text-[9px] opacity-60 ml-1">({config.owner})</span>
      )}
    </span>
  )
}

// Flow indicator component showing the case journey
export function StatusFlow({ currentStatus }: { currentStatus: CaseStatus }) {
  const stages = [
    { statuses: ["RECEIVE", "CHECKING"], label: "PWIN Review", owner: "PWIN" },
    { statuses: ["SUBMITTED", "WORKING"], label: "Partner Process", owner: "PARTNER" },
    { statuses: ["DONE", "PUBLISH"], label: "PWIN Finalize", owner: "PWIN" },
    { statuses: ["AWAITING_PICKUP", "DELIVERY", "CLOSED"], label: "Complete", owner: "CUSTOMER" },
  ]

  const currentStageIndex = stages.findIndex((stage) =>
    stage.statuses.includes(currentStatus)
  )

  return (
    <div className="flex items-center gap-1 text-xs">
      {stages.map((stage, index) => {
        const isActive = index === currentStageIndex
        const isComplete = index < currentStageIndex
        const isClosed = currentStatus === "CLOSED"

        return (
          <div key={stage.label} className="flex items-center">
            <div
              className={cn(
                "px-2 py-1 rounded-md font-medium transition-colors",
                isActive && "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300",
                isComplete && "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
                !isActive && !isComplete && "bg-muted text-muted-foreground"
              )}
            >
              {stage.label}
            </div>
            {index < stages.length - 1 && (
              <div
                className={cn(
                  "w-4 h-0.5 mx-1",
                  isComplete ? "bg-green-400" : "bg-border"
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
