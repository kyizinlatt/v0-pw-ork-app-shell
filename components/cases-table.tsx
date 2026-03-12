"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { StatusBadge, type CaseStatus } from "@/components/status-badge"

// Sample cases data
const cases = [
  {
    id: "1",
    caseNumber: "HQ-KS-110326-0001",
    customer: { name: "Win Tun", type: "INDIVIDUAL" as const },
    service: { code: "KS", name: "Kyant Sal" },
    status: "CHECKING" as CaseStatus,
    slaDue: "Mar 25, 2026",
    slaWarning: false,
    assigned: "SRP Admin",
    created: "11 Mar 2026",
  },
  {
    id: "2",
    caseNumber: "HQ-KS-110326-0002",
    customer: { name: "Aung Aung", type: "INDIVIDUAL" as const },
    service: { code: "KS", name: "Kyant Sal" },
    status: "WORKING" as CaseStatus,
    slaDue: "Mar 20, 2026",
    slaWarning: true,
    assigned: "SRP Admin",
    created: "11 Mar 2026",
  },
  {
    id: "3",
    caseNumber: "HQ-KS-110326-0003",
    customer: { name: "Htoo Htoo", type: "INDIVIDUAL" as const },
    service: { code: "KS", name: "Kyant Sal" },
    status: "RECEIVE" as CaseStatus,
    slaDue: null,
    slaWarning: false,
    assigned: "SRP Admin",
    created: "11 Mar 2026",
  },
  {
    id: "4",
    caseNumber: "HQ-WP-110326-0004",
    customer: { name: "Golden Star Co.", type: "COLLECTIVE" as const },
    service: { code: "WP", name: "Work Permit" },
    status: "SUBMITTED" as CaseStatus,
    slaDue: "Mar 28, 2026",
    slaWarning: false,
    assigned: "SRP Admin",
    created: "10 Mar 2026",
  },
  {
    id: "5",
    caseNumber: "HQ-VS-100326-0005",
    customer: { name: "Tun Tun Oo", type: "INDIVIDUAL" as const },
    service: { code: "VS", name: "Visa Extension" },
    status: "DONE" as CaseStatus,
    slaDue: "Mar 15, 2026",
    slaWarning: false,
    assigned: "SRP Admin",
    created: "10 Mar 2026",
  },
]

const statusTabs: { label: string; value: CaseStatus | "ALL" }[] = [
  { label: "All", value: "ALL" },
  { label: "Received", value: "RECEIVE" },
  { label: "Checking", value: "CHECKING" },
  { label: "Submitted", value: "SUBMITTED" },
  { label: "Working", value: "WORKING" },
  { label: "Done", value: "DONE" },
  { label: "Published", value: "PUBLISH" },
  { label: "Awaiting", value: "AWAITING_PICKUP" },
  { label: "Delivery", value: "DELIVERY" },
  { label: "Closed", value: "CLOSED" },
]

const columns = [
  "Case #",
  "Customer",
  "Service",
  "Status",
  "SLA Due",
  "Assigned",
  "Created",
]

interface CasesTableProps {
  onCaseClick?: (caseId: string) => void
}

export function CasesTable({ onCaseClick }: CasesTableProps) {
  const [activeTab, setActiveTab] = useState<CaseStatus | "ALL">("ALL")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredCases = cases.filter((c) => {
    const matchesStatus = activeTab === "ALL" || c.status === activeTab
    const matchesSearch =
      searchQuery === "" ||
      c.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.customer.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Status tabs */}
        <div className="flex items-center gap-1 bg-muted rounded-lg p-1 overflow-x-auto max-w-full">
          {statusTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors",
                activeTab === tab.value
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-52">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {columns.map((col) => (
                <th
                  key={col}
                  className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredCases.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-3 py-16 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <svg
                      className="w-10 h-10 text-muted-foreground mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                      />
                    </svg>
                    <p className="text-sm font-medium text-foreground">No cases found</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Create the first case to get started
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredCases.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => onCaseClick?.(c.id)}
                  className="border-b border-border hover:bg-muted/50 transition-colors cursor-pointer group"
                >
                  <td className="px-3 py-3 font-mono text-sm text-foreground whitespace-nowrap">
                    {c.caseNumber}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">
                        {c.customer.name}
                      </span>
                      <span
                        className={cn(
                          "text-xs px-1.5 py-0.5 rounded",
                          c.customer.type === "INDIVIDUAL"
                            ? "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                            : "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400"
                        )}
                      >
                        {c.customer.type === "INDIVIDUAL" ? "Individual" : "Collective"}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-sm text-muted-foreground whitespace-nowrap">
                    {c.service.code} — {c.service.name}
                  </td>
                  <td className="px-3 py-3">
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    {c.slaDue ? (
                      <span
                        className={cn(
                          "text-sm",
                          c.slaWarning ? "text-amber-600 font-medium" : "text-muted-foreground"
                        )}
                      >
                        {c.slaDue}
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-3 py-3 text-sm text-muted-foreground whitespace-nowrap">
                    {c.assigned}
                  </td>
                  <td className="px-3 py-3 text-sm text-muted-foreground whitespace-nowrap">
                    {c.created}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
