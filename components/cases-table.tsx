"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { StatusBadge, STATUS_CONFIG, type CaseStatus } from "@/components/status-badge"
import { Button } from "@/components/ui/button"
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight, 
  FolderOpen,
  AlertCircle,
  Building2,
  Users,
} from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// Sample cases data with proper flow structure
const allCases = [
  {
    id: "1",
    caseNumber: "HQ-KS-110326-0001",
    customer: { name: "Win Tun", type: "INDIVIDUAL" as const },
    service: { code: "KS", name: "Kyant Sal" },
    status: "CHECKING" as CaseStatus,
    slaDue: "Mar 25, 2026",
    slaWarning: false,
    assignedPwinStaff: "SRP Admin",
    assignedPartnerStaff: null as string | null,
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
    assignedPwinStaff: "SRP Admin",
    assignedPartnerStaff: "Partner Admin A",
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
    assignedPwinStaff: "SRP Admin",
    assignedPartnerStaff: null,
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
    assignedPwinStaff: "SRP Admin",
    assignedPartnerStaff: null, // Partner not yet assigned
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
    assignedPwinStaff: "SRP Admin",
    assignedPartnerStaff: "Partner Staff B",
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
    assignedPwinStaff: "SRP Admin",
    assignedPartnerStaff: "Partner Admin A",
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
    assignedPwinStaff: "SRP Admin",
    assignedPartnerStaff: "Partner Admin C",
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
    assignedPwinStaff: "SRP Admin",
    assignedPartnerStaff: "Partner Staff B",
    created: "7 Mar 2026",
  },
]

// Status tabs with flow-aware grouping
const statusTabs: { label: string; value: CaseStatus | "ALL" | "PWIN_QUEUE" | "PARTNER_QUEUE"; count?: number; description?: string }[] = [
  { label: "All Cases", value: "ALL", count: 8 },
  { label: "PWIN Queue", value: "PWIN_QUEUE", count: 4, description: "Cases requiring PWIN action" },
  { label: "Partner Queue", value: "PARTNER_QUEUE", count: 2, description: "Cases with Partner" },
]

const columns = [
  "Case #",
  "Customer",
  "Service",
  "Status",
  "SLA Due",
  "PWIN Staff",
  "Partner Staff",
  "Created",
]

interface CasesTableProps {
  onCaseClick?: (caseId: string) => void
  serviceFilter?: string // Filter by service code
}

const ITEMS_PER_PAGE = 10

export function CasesTable({ onCaseClick, serviceFilter }: CasesTableProps) {
  const [activeTab, setActiveTab] = useState<CaseStatus | "ALL" | "PWIN_QUEUE" | "PARTNER_QUEUE">("ALL")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const filteredCases = allCases.filter((c) => {
    // Service filter (from sidebar submenu)
    if (serviceFilter && c.service.code !== serviceFilter) {
      return false
    }

    // Status/queue filter
    let matchesStatus = false
    if (activeTab === "ALL") {
      matchesStatus = true
    } else if (activeTab === "PWIN_QUEUE") {
      // PWIN is responsible: RECEIVE, CHECKING, SUBMITTED (awaiting partner assignment), DONE (review), PUBLISH, AWAITING_PICKUP, DELIVERY
      matchesStatus = ["RECEIVE", "CHECKING", "SUBMITTED", "DONE", "PUBLISH", "AWAITING_PICKUP", "DELIVERY"].includes(c.status)
    } else if (activeTab === "PARTNER_QUEUE") {
      // Partner is working
      matchesStatus = c.status === "WORKING"
    } else {
      matchesStatus = c.status === activeTab
    }

    // Search filter
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

  const handleTabChange = (value: CaseStatus | "ALL" | "PWIN_QUEUE" | "PARTNER_QUEUE") => {
    setActiveTab(value)
    setCurrentPage(1)
  }

  // Check if partner assignment is needed
  const needsPartnerAssignment = (c: typeof allCases[0]) => {
    return c.status === "SUBMITTED" && !c.assignedPartnerStaff
  }

  return (
    <TooltipProvider>
      <div className="space-y-4">
        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Status tabs */}
          <div className="flex items-center bg-muted/50 rounded-lg p-1">
            {statusTabs.map((tab) => (
              <Tooltip key={tab.value}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => handleTabChange(tab.value)}
                    className={cn(
                      "h-8 px-3 text-sm font-medium rounded-md whitespace-nowrap transition-all flex items-center gap-2",
                      activeTab === tab.value
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {tab.value === "PWIN_QUEUE" && <Building2 className="size-3.5" />}
                    {tab.value === "PARTNER_QUEUE" && <Users className="size-3.5" />}
                    {tab.label}
                    {tab.count !== undefined && (
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {tab.count}
                      </span>
                    )}
                  </button>
                </TooltipTrigger>
                {tab.description && (
                  <TooltipContent>
                    <p>{tab.description}</p>
                  </TooltipContent>
                )}
              </Tooltip>
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
                          : serviceFilter
                          ? `No cases for service type "${serviceFilter}".`
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
                    className={cn(
                      "border-b border-border last:border-0 hover:bg-muted/50 transition-colors cursor-pointer",
                      needsPartnerAssignment(c) && "bg-amber-50/50 dark:bg-amber-950/10"
                    )}
                  >
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm text-foreground">{c.caseNumber}</span>
                        {needsPartnerAssignment(c) && (
                          <Tooltip>
                            <TooltipTrigger>
                              <AlertCircle className="size-4 text-amber-500" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Partner assignment required</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">
                          {c.customer.name}
                        </span>
                        <span
                          className={cn(
                            "text-[10px] px-1.5 py-0.5 rounded font-semibold uppercase tracking-wide border",
                            c.customer.type === "INDIVIDUAL"
                              ? "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-700"
                              : "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950 dark:text-sky-400 dark:border-sky-800"
                          )}
                        >
                          {c.customer.type === "INDIVIDUAL" ? "Individual" : "Collective"}
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
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                          <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">
                            {c.assignedPwinStaff?.split(" ").map(n => n[0]).join("") || "?"}
                          </span>
                        </div>
                        <span className="text-sm text-muted-foreground">{c.assignedPwinStaff || "—"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      {c.assignedPartnerStaff ? (
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                            <span className="text-[10px] font-semibold text-orange-600 dark:text-orange-400">
                              {c.assignedPartnerStaff.split(" ").map(n => n[0]).join("")}
                            </span>
                          </div>
                          <span className="text-sm text-muted-foreground">{c.assignedPartnerStaff}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
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
                {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                  const pageNum = i + 1
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="icon"
                      className={cn(
                        "h-8 w-8",
                        currentPage === pageNum && "bg-indigo-600 hover:bg-indigo-700 text-white"
                      )}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  )
                })}
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
    </TooltipProvider>
  )
}
