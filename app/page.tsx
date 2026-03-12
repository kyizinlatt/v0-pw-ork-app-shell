"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { CasesTable } from "@/components/cases-table"
import { CaseDrawer } from "@/components/case-drawer"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function Page() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null)

  const handleCaseClick = (caseId: string) => {
    setSelectedCaseId(caseId)
    setDrawerOpen(true)
  }

  return (
    <div className="flex h-screen bg-background font-sans overflow-hidden">
      <Sidebar activeItem="Cases" />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header breadcrumb="Cases" />

        <main className="flex-1 overflow-y-auto p-6">
          {/* Page Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-foreground">
                Cases
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Manage and track all visa and work permit cases
              </p>
            </div>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
              <Plus className="size-4 mr-2" />
              Create Case
            </Button>
          </div>

          {/* Cases Table */}
          <CasesTable onCaseClick={handleCaseClick} />
        </main>
      </div>

      {/* Case Drawer */}
      <CaseDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        caseId={selectedCaseId}
      />
    </div>
  )
}
