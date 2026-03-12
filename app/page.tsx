"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { CasesTable } from "@/components/cases-table"
import { CaseDrawer } from "@/components/case-drawer"
import { StatsCards } from "@/components/stats-cards"
import { CommandPalette } from "@/components/command-palette"
import { CreateCaseModal } from "@/components/create-case-modal"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function Page() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [createCaseOpen, setCreateCaseOpen] = useState(false)
  const { setTheme, theme } = useTheme()

  const handleCaseClick = (caseId: string) => {
    setSelectedCaseId(caseId)
    setDrawerOpen(true)
  }

  const handleCreateCase = () => {
    setCreateCaseOpen(true)
  }

  const handleToggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <div className="flex h-screen bg-background font-sans overflow-hidden">
      <Sidebar
        activeItem="Cases"
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header
          breadcrumb="Cases"
          onMenuClick={() => setMobileMenuOpen(true)}
        />

        <main className="flex-1 overflow-y-auto p-6">
          {/* Page Header */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-foreground">
                Cases
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Manage and track all visa and work permit cases
              </p>
            </div>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={handleCreateCase}
            >
              <Plus className="size-4 mr-2" />
              Create Case
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="mb-6">
            <StatsCards />
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

      {/* Command Palette */}
      <CommandPalette
        onCreateCase={handleCreateCase}
        onToggleTheme={handleToggleTheme}
      />

      {/* Create Case Modal */}
      <CreateCaseModal
        open={createCaseOpen}
        onOpenChange={setCreateCaseOpen}
        onSuccess={() => {
          // Refresh data here if needed
        }}
      />
    </div>
  )
}
