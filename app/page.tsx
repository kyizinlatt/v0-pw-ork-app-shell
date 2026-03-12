import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { CasesTable } from "@/components/cases-table"

export default function Page() {
  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      <Sidebar activeItem="Cases" />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header breadcrumb="Cases" />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Cases</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Manage and track all support cases
              </p>
            </div>
          </div>
          <CasesTable />
        </main>
      </div>
    </div>
  )
}
