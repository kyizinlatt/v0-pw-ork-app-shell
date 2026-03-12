"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { BTN, FORM_LABELS, FORM_PLACEHOLDERS, EMPTY_STATE } from "@/lib/constants"
import { Plus, Search, MoreHorizontal, Pencil, Trash2, MapPin, Building2, AlertCircle } from "lucide-react"

type BranchStatus = "ACTIVE" | "INACTIVE"

interface Branch {
  id: string
  code: string
  name: string
  location: string
  status: BranchStatus
  staffCount: number
  casesCount: number
  createdAt: string
}

const INITIAL_BRANCHES: Branch[] = [
  { id: "1", code: "HQ", name: "Bangkok Headquarters", location: "Bangkok, Thailand", status: "ACTIVE", staffCount: 12, casesCount: 342, createdAt: "Jan 2024" },
  { id: "2", code: "KS", name: "Kyant Sal Branch", location: "Chiang Mai, Thailand", status: "ACTIVE", staffCount: 6, casesCount: 178, createdAt: "Mar 2024" },
  { id: "3", code: "BKK", name: "Bangkok South", location: "Samut Prakan, Thailand", status: "ACTIVE", staffCount: 4, casesCount: 91, createdAt: "Jun 2024" },
  { id: "4", code: "CM2", name: "Chiang Mai 2", location: "Chiang Mai, Thailand", status: "INACTIVE", staffCount: 0, casesCount: 23, createdAt: "Sep 2024" },
]

const emptyForm = { code: "", name: "", location: "", status: "ACTIVE" as BranchStatus }

export default function BranchesPage() {
  const [branches, setBranches] = useState<Branch[]>(INITIAL_BRANCHES)
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null)
  const [deletingBranch, setDeletingBranch] = useState<Branch | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const filtered = branches.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.code.toLowerCase().includes(search.toLowerCase()) ||
      b.location.toLowerCase().includes(search.toLowerCase())
  )

  function openCreate() {
    setEditingBranch(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  function openEdit(branch: Branch) {
    setEditingBranch(branch)
    setForm({ code: branch.code, name: branch.name, location: branch.location, status: branch.status })
    setDialogOpen(true)
  }

  function openDelete(branch: Branch) {
    setDeletingBranch(branch)
    setDeleteDialogOpen(true)
  }

  function handleSave() {
    if (!form.code || !form.name) return
    if (editingBranch) {
      setBranches((prev) =>
        prev.map((b) => b.id === editingBranch.id ? { ...b, ...form } : b)
      )
    } else {
      const newBranch: Branch = {
        id: String(Date.now()),
        ...form,
        staffCount: 0,
        casesCount: 0,
        createdAt: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      }
      setBranches((prev) => [...prev, newBranch])
    }
    setDialogOpen(false)
  }

  function handleDelete() {
    if (!deletingBranch) return
    setBranches((prev) => prev.filter((b) => b.id !== deletingBranch.id))
    setDeleteDialogOpen(false)
    setDeletingBranch(null)
  }

  return (
    <TooltipProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar mobileOpen={mobileMenuOpen} onMobileClose={() => setMobileMenuOpen(false)} />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header onMobileMenuToggle={() => setMobileMenuOpen((v) => !v)} breadcrumb="Administration / Branches" />
          <main className="flex-1 overflow-y-auto">
            <div className="p-6 max-w-5xl mx-auto space-y-6">

              {/* Page header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-lg font-semibold text-foreground">Branches</h1>
                  <p className="text-sm text-muted-foreground mt-0.5">{branches.length} branches total</p>
                </div>
                <Button size="sm" onClick={openCreate} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  <Plus className="size-4 mr-1.5" />
                  {BTN.ADD} Branch
                </Button>
              </div>

              {/* Search */}
              <div className="relative max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={FORM_PLACEHOLDERS.SEARCH}
                  className="pl-9 h-9"
                />
              </div>

              {/* Table */}
              <div className="border border-border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Code</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Name</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Location</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Staff</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Cases</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Created</th>
                      <th className="px-4 py-3 w-10" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-4 py-12 text-center text-sm text-muted-foreground">
                          {EMPTY_STATE.NO_BRANCHES}
                        </td>
                      </tr>
                    ) : (
                      filtered.map((branch) => (
                        <tr key={branch.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-3">
                            <span className="font-mono text-xs font-semibold text-indigo-600 bg-indigo-50 dark:bg-indigo-950 dark:text-indigo-400 px-2 py-1 rounded">
                              {branch.code}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-medium text-foreground">{branch.name}</td>
                          <td className="px-4 py-3 text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                              <MapPin className="size-3.5 text-muted-foreground/60" />
                              {branch.location}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground tabular-nums">{branch.staffCount}</td>
                          <td className="px-4 py-3 text-muted-foreground tabular-nums">{branch.casesCount}</td>
                          <td className="px-4 py-3">
                            <span className={cn(
                              "inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded border",
                              branch.status === "ACTIVE"
                                ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800"
                                : "bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-700"
                            )}>
                              <span className={cn("size-1.5 rounded-full", branch.status === "ACTIVE" ? "bg-green-500" : "bg-slate-400")} />
                              {branch.status === "ACTIVE" ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground text-xs">{branch.createdAt}</td>
                          <td className="px-4 py-3">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="size-8">
                                  <MoreHorizontal className="size-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-40">
                                <DropdownMenuItem onClick={() => openEdit(branch)}>
                                  <Pencil className="size-3.5 mr-2" />
                                  {BTN.EDIT}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => openDelete(branch)}
                                  className="text-red-600 focus:text-red-600"
                                >
                                  <Trash2 className="size-3.5 mr-2" />
                                  {BTN.DELETE}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>

        {/* Create / Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editingBranch ? "Edit Branch" : "Add Branch"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label htmlFor="code">{FORM_LABELS.BRANCH_CODE}</Label>
                <Input
                  id="code"
                  value={form.code}
                  onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
                  placeholder={FORM_PLACEHOLDERS.BRANCH_CODE}
                  maxLength={8}
                  className="font-mono uppercase"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="name">{FORM_LABELS.BRANCH_NAME}</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder={FORM_PLACEHOLDERS.BRANCH_NAME}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="location">{FORM_LABELS.BRANCH_LOCATION}</Label>
                <Input
                  id="location"
                  value={form.location}
                  onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                  placeholder="e.g. Bangkok, Thailand"
                />
              </div>
              <div className="space-y-1.5">
                <Label>{FORM_LABELS.BRANCH_STATUS}</Label>
                <div className="flex gap-2">
                  {(["ACTIVE", "INACTIVE"] as BranchStatus[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => setForm((f) => ({ ...f, status: s }))}
                      className={cn(
                        "flex-1 py-2 text-sm font-medium rounded-md border transition-all",
                        form.status === s
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "border-border text-muted-foreground hover:border-muted-foreground"
                      )}
                    >
                      {s === "ACTIVE" ? "Active" : "Inactive"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>{BTN.CANCEL}</Button>
              <Button onClick={handleSave} disabled={!form.code || !form.name} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                {BTN.SAVE}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirm */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Delete Branch</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground py-2">
              Are you sure you want to delete <span className="font-medium text-foreground">{deletingBranch?.name}</span>? This cannot be undone.
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>{BTN.CANCEL}</Button>
              <Button variant="destructive" onClick={handleDelete}>{BTN.DELETE}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  )
}
