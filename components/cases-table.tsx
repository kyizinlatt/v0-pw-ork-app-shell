"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { StatusBadge, type CaseStatus } from "@/components/status-badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, FolderOpen } from "lucide-react"

// Sample cases data
const allCases = [
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
  {
    id: "6",
    caseNumber: "HQ-KS-090326-0006",
    customer: { name: "Mya Mya", type: "INDIVIDUAL" as const },
    service: { code: "KS", name: "Kyant Sal" },
    status: "PUBLISH" as CaseStatus,
    slaDue: "Mar 12, 2026",
    slaWarning: false,
    assigned: "SRP Admin",
    created: "9 Mar 2026",
  },
  {
    id: "7",
    caseNumber: "HQ-WP-080326-0007",
    customer: { name: "Blue Ocean Ltd.", type: "COLLECTIVE" as const },
    service: { code: "WP", name: "Work Permit" },
    status: "CLOSED" as CaseStatus,
    slaDue: "Mar 10, 2026",
    slaWarning: false,
    assigned: "SRP Admin",
    created: "8 Mar 2026",
  },
  {
    id: "8",
    caseNumber: "HQ-VS-070326-0008",
    customer: { name: "Kyaw Kyaw", type: "INDIVIDUAL" as const },
    service: { code: "VS", name: "Visa Extension" },
    status: "AWAITING_PICKUP" as CaseStatus,
    slaDue: "Mar 14, 2026",
    slaWarning: false,
    assigned: "SRP Admin",
    created: "7 Mar 2026",
  },
]

const statusTabs: { label: string; value: CaseStatus | "ALL"; count?: number }[] = [
  { label: "All", value: "ALL", count: 8 },
  { label: "Received", value: "RECEIVE", count: 1 },
  { label: "Checking", value: "CHECKING", count: 1 },
  { label: "Submitted", value: "SUBMITTED", count: 1 },
  { label: "Working", value: "WORKING", count: 1 },
  { label: "Done", value: "DONE", count: 1 },
  { label: "Published", value: "PUBLISH", count: 1 },
  { label: "Awaiting", value: "AWAITING_PICKUP", count: 1 },
  { label: "Closed", value: "CLOSED", count: 1 },
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

const ITEMS_PER_PAGE = 5

export function CasesTable({ onCaseClick }: CasesTableProps) {
  const [activeTab, setActiveTab] = useState<CaseStatus | "ALL">("ALL")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const filteredCases = allCases.filter((c) => {
    const matchesStatus = activeTab === "ALL" || c.status === activeTab
    const matchesSearch =
      searchQuery === "" ||
      c.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.customer.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const totalPages = Math.ceil(filteredCases.length / ITEMS_PER_PAGE)
  const paginatedCases = filteredCases.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const handleTabChange = (value: CaseStatus | "ALL") => {
    setActiveTab(value)
    setCurrentPage(1)
  }

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Status tabs */}
        <div className="flex items-center gap-1 bg-muted rounded-lg p-1 overflow-x-auto max-w-full">
          {statusTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => handleTabChange(tab.value)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors flex items-center gap-1.5",
                activeTab === tab.value
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span
                  className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded-full",
                    activeTab === tab.value
                      ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300"
                      : "bg-muted-foreground/20"
                  )}
                >
                  {tab.count}
                </span>
              )}
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
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
            className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {columns.map((col) => (
                <th
                  key={col}
                  className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedCases.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-16 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                      <FolderOpen className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium text-foreground">No cases found</p>
                    <p className="mt-1 text-sm text-muted-foreground max-w-sm">
                      {searchQuery
                        ? `No cases match "${searchQuery}". Try a different search term.`
                        : "Create the first case to get started"}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedCases.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => onCaseClick?.(c.id)}
                  className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <td className="px-4 py-3.5 font-mono text-sm text-foreground whitespace-nowrap">
                    {c.caseNumber}
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">
                        {c.customer.name}
                      </span>
                      <span
                        className={cn(
                          "text-xs px-1.5 py-0.5 rounded font-medium",
                          c.customer.type === "INDIVIDUAL"
                            ? "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                            : "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-400"
                        )}
                      >
                        {c.customer.type === "INDIVIDUAL" ? "IND" : "COL"}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-muted-foreground whitespace-nowrap">
                    <span className="font-medium text-foreground">{c.service.code}</span>
                    <span className="text-muted-foreground"> — {c.service.name}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    {c.slaDue ? (
                      <span
                        className={cn(
                          "text-sm",
                          c.slaWarning ? "text-amber-600 font-semibold" : "text-muted-foreground"
                        )}
                      >
                        {c.slaDue}
                        {c.slaWarning && (
                          <span className="ml-1.5 inline-block w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                        )}
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-sm text-muted-foreground whitespace-nowrap">
                    {c.assigned}
                  </td>
                  <td className="px-4 py-3.5 text-sm text-muted-foreground whitespace-nowrap">
                    {c.created}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredCases.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
            {Math.min(currentPage * ITEMS_PER_PAGE, filteredCases.length)} of{" "}
            {filteredCases.length} results
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-1 mx-2">
              {[...Array(totalPages)].map((_, i) => (
                <Button
                  key={i}
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  size="icon"
                  className={cn(
                    "h-8 w-8",
                    currentPage === i + 1 && "bg-indigo-600 hover:bg-indigo-700 text-white"
                  )}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
