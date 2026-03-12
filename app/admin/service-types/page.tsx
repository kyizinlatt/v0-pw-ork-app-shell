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
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { BTN, FORM_LABELS, FORM_PLACEHOLDERS, EMPTY_STATE } from "@/lib/constants"
import { Plus, Search, MoreHorizontal, Pencil, Trash2, Clock, DollarSign, FileText } from "lucide-react"

type ServiceStatus = "ACTIVE" | "INACTIVE"

interface ServiceType {
  id: string
  code: string
  name: string
  description: string
  slaDays: number
  price: number
  requiresPartner: boolean
  status: ServiceStatus
  casesCount: number
  createdAt: string
}

const INITIAL_SERVICES: ServiceType[] = [
  { id: "1", code: "KS", name: "Kyant Sal", description: "Standard visa processing service", slaDays: 14, price: 3500, requiresPartner: true, status: "ACTIVE", casesCount: 342, createdAt: "Jan 2024" },
  { id: "2", code: "WP", name: "Work Permit", description: "Work permit application and renewal", slaDays: 21, price: 5000, requiresPartner: true, status: "ACTIVE", casesCount: 178, createdAt: "Jan 2024" },
  { id: "3", code: "90D", name: "90-Day Report", description: "90-day stay reporting", slaDays: 7, price: 800, requiresPartner: false, status: "ACTIVE", casesCount: 521, createdAt: "Feb 2024" },
  { id: "4", code: "VISA", name: "Tourist Visa", description: "Tourist visa extension", slaDays: 5, price: 1200, requiresPartner: false, status: "ACTIVE", casesCount: 93, createdAt: "Mar 2024" },
  { id: "5", code: "TM30", name: "TM30 Filing", description: "TM30 landlord notification filing", slaDays: 3, price: 500, requiresPartner: false, status: "INACTIVE", casesCount: 12, createdAt: "Jun 2024" },
]

const emptyForm = {
  code: "", name: "", description: "", slaDays: 14, price: 0, requiresPartner: false, status: "ACTIVE" as ServiceStatus,
}

export default function ServiceTypesPage() {
  const [services, setServices] = useState<ServiceType[]>(INITIAL_SERVICES)
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState<"ALL" | ServiceStatus>("ALL")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<ServiceType | null>(null)
  const [deletingService, setDeletingService] = useState<ServiceType | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const filtered = services.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.code.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === "ALL" || s.status === filterStatus
    return matchSearch && matchStatus
  })

  function openCreate() {
    setEditingService(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  function openEdit(service: ServiceType) {
    setEditingService(service)
    setForm({
      code: service.code, name: service.name, description: service.description,
      slaDays: service.slaDays, price: service.price,
      requiresPartner: service.requiresPartner, status: service.status,
    })
    setDialogOpen(true)
  }

  function openDelete(service: ServiceType) {
    setDeletingService(service)
    setDeleteDialogOpen(true)
  }

  function handleSave() {
    if (!form.code || !form.name) return
    if (editingService) {
      setServices((prev) => prev.map((s) => s.id === editingService.id ? { ...s, ...form } : s))
    } else {
      const newService: ServiceType = {
        id: String(Date.now()), ...form, casesCount: 0,
        createdAt: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      }
      setServices((prev) => [...prev, newService])
    }
    setDialogOpen(false)
  }

  function handleDelete() {
    if (!deletingService) return
    setServices((prev) => prev.filter((s) => s.id !== deletingService.id))
    setDeleteDialogOpen(false)
    setDeletingService(null)
  }

  return (
    <TooltipProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar mobileOpen={mobileMenuOpen} onMobileClose={() => setMobileMenuOpen(false)} />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header onMobileMenuToggle={() => setMobileMenuOpen((v) => !v)} breadcrumb="Administration / Service Types" />
          <main className="flex-1 overflow-y-auto">
            <div className="p-6 max-w-6xl mx-auto space-y-6">

              {/* Page header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-lg font-semibold text-foreground">Service Types</h1>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {services.filter((s) => s.status === "ACTIVE").length} active services
                  </p>
                </div>
                <Button size="sm" onClick={openCreate} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  <Plus className="size-4 mr-1.5" />
                  {BTN.ADD} Service Type
                </Button>
              </div>

              {/* Toolbar */}
              <div className="flex items-center gap-3">
                <div className="relative max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={FORM_PLACEHOLDERS.SEARCH} className="pl-9 h-9" />
                </div>
                <div className="flex items-center bg-muted/50 rounded-lg p-1">
                  {(["ALL", "ACTIVE", "INACTIVE"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setFilterStatus(s)}
                      className={cn(
                        "h-7 px-3 text-xs font-medium rounded-md transition-all",
                        filterStatus === s ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {s === "ALL" ? "All" : s === "ACTIVE" ? "Active" : "Inactive"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cards grid */}
              {filtered.length === 0 ? (
                <div className="text-center py-16 text-sm text-muted-foreground">{EMPTY_STATE.NO_SERVICE_TYPES}</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filtered.map((service) => (
                    <div
                      key={service.id}
                      className={cn(
                        "border border-border rounded-lg p-4 bg-card space-y-3 hover:shadow-sm transition-shadow",
                        service.status === "INACTIVE" && "opacity-60"
                      )}
                    >
                      {/* Header row */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-semibold text-indigo-600 bg-indigo-50 dark:bg-indigo-950 dark:text-indigo-400 px-2 py-1 rounded">
                            {service.code}
                          </span>
                          <span className={cn(
                            "text-xs font-medium px-2 py-0.5 rounded border",
                            service.status === "ACTIVE"
                              ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800"
                              : "bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-700"
                          )}>
                            {service.status === "ACTIVE" ? "Active" : "Inactive"}
                          </span>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-7 -mr-1">
                              <MoreHorizontal className="size-3.5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-36">
                            <DropdownMenuItem onClick={() => openEdit(service)}>
                              <Pencil className="size-3.5 mr-2" />{BTN.EDIT}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => openDelete(service)} className="text-red-600 focus:text-red-600">
                              <Trash2 className="size-3.5 mr-2" />{BTN.DELETE}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div>
                        <p className="font-medium text-foreground">{service.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{service.description}</p>
                      </div>

                      {/* Stats row */}
                      <div className="flex items-center gap-4 pt-1 border-t border-border">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Clock className="size-3.5" />
                          <span>{service.slaDays}d SLA</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <DollarSign className="size-3.5" />
                          <span>฿{service.price.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <FileText className="size-3.5" />
                          <span>{service.casesCount} cases</span>
                        </div>
                        {service.requiresPartner && (
                          <span className="ml-auto text-xs text-indigo-600 dark:text-indigo-400 font-medium">+ Partner</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>

        {/* Create / Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingService ? "Edit Service Type" : "Add Service Type"}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-2">
              <div className="space-y-1.5">
                <Label htmlFor="s-code">{FORM_LABELS.SERVICE_CODE}</Label>
                <Input id="s-code" value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))} placeholder={FORM_PLACEHOLDERS.SERVICE_CODE} maxLength={8} className="font-mono uppercase" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="s-name">{FORM_LABELS.SERVICE_NAME}</Label>
                <Input id="s-name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder={FORM_PLACEHOLDERS.SERVICE_NAME} />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="s-desc">{FORM_LABELS.SERVICE_DESCRIPTION}</Label>
                <Input id="s-desc" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Brief description" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="s-sla">{FORM_LABELS.SERVICE_SLA_DAYS}</Label>
                <Input id="s-sla" type="number" min={1} value={form.slaDays} onChange={(e) => setForm((f) => ({ ...f, slaDays: Number(e.target.value) }))} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="s-price">{FORM_LABELS.SERVICE_PRICE}</Label>
                <Input id="s-price" type="number" min={0} value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))} />
              </div>
              <div className="space-y-1.5">
                <Label>{FORM_LABELS.SERVICE_STATUS}</Label>
                <div className="flex gap-2">
                  {(["ACTIVE", "INACTIVE"] as ServiceStatus[]).map((s) => (
                    <button key={s} onClick={() => setForm((f) => ({ ...f, status: s }))} className={cn("flex-1 py-2 text-sm font-medium rounded-md border transition-all", form.status === s ? "bg-indigo-600 text-white border-indigo-600" : "border-border text-muted-foreground hover:border-muted-foreground")}>
                      {s === "ACTIVE" ? "Active" : "Inactive"}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Requires Partner</Label>
                <div className="flex gap-2">
                  {([true, false] as const).map((v) => (
                    <button key={String(v)} onClick={() => setForm((f) => ({ ...f, requiresPartner: v }))} className={cn("flex-1 py-2 text-sm font-medium rounded-md border transition-all", form.requiresPartner === v ? "bg-indigo-600 text-white border-indigo-600" : "border-border text-muted-foreground hover:border-muted-foreground")}>
                      {v ? "Yes" : "No"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>{BTN.CANCEL}</Button>
              <Button onClick={handleSave} disabled={!form.code || !form.name} className="bg-indigo-600 hover:bg-indigo-700 text-white">{BTN.SAVE}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirm */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader><DialogTitle>Delete Service Type</DialogTitle></DialogHeader>
            <p className="text-sm text-muted-foreground py-2">
              Are you sure you want to delete <span className="font-medium text-foreground">{deletingService?.name}</span>? This will affect all related cases.
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
