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
import { Plus, Search, MoreHorizontal, Pencil, Trash2, Phone, Mail, Users, FileText } from "lucide-react"

type PartnerStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED"

interface Partner {
  id: string
  code: string
  name: string
  contactPerson: string
  phone: string
  email: string
  status: PartnerStatus
  activeCases: number
  totalCases: number
  slaRate: number
  createdAt: string
}

const INITIAL_PARTNERS: Partner[] = [
  { id: "1", code: "PTR001", name: "Embassy Express Co.", contactPerson: "Somchai W.", phone: "+66 81 234 5678", email: "somchai@embassyexpress.th", status: "ACTIVE", activeCases: 24, totalCases: 312, slaRate: 96, createdAt: "Jan 2024" },
  { id: "2", code: "PTR002", name: "Visa Plus Ltd.", contactPerson: "Malee P.", phone: "+66 89 876 5432", email: "malee@visaplus.th", status: "ACTIVE", activeCases: 18, totalCases: 187, slaRate: 94, createdAt: "Feb 2024" },
  { id: "3", code: "PTR003", name: "Royal Document Services", contactPerson: "Anan K.", phone: "+66 82 111 2233", email: "anan@royaldoc.th", status: "ACTIVE", activeCases: 7, totalCases: 98, slaRate: 99, createdAt: "Apr 2024" },
  { id: "4", code: "PTR004", name: "Fast Track Visa", contactPerson: "Niran T.", phone: "+66 86 555 7788", email: "niran@fasttrackvisa.th", status: "SUSPENDED", activeCases: 0, totalCases: 45, slaRate: 78, createdAt: "Jul 2024" },
]

const emptyForm = {
  code: "", name: "", contactPerson: "", phone: "", email: "", status: "ACTIVE" as PartnerStatus,
}

const STATUS_STYLE: Record<PartnerStatus, string> = {
  ACTIVE: "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800",
  INACTIVE: "bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-700",
  SUSPENDED: "bg-red-50 text-red-600 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-800",
}

const STATUS_DOT: Record<PartnerStatus, string> = {
  ACTIVE: "bg-green-500",
  INACTIVE: "bg-slate-400",
  SUSPENDED: "bg-red-500",
}

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>(INITIAL_PARTNERS)
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState<"ALL" | PartnerStatus>("ALL")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null)
  const [deletingPartner, setDeletingPartner] = useState<Partner | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const filtered = partners.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase()) ||
      p.contactPerson.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === "ALL" || p.status === filterStatus
    return matchSearch && matchStatus
  })

  function openCreate() {
    setEditingPartner(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  function openEdit(partner: Partner) {
    setEditingPartner(partner)
    setForm({ code: partner.code, name: partner.name, contactPerson: partner.contactPerson, phone: partner.phone, email: partner.email, status: partner.status })
    setDialogOpen(true)
  }

  function openDelete(partner: Partner) {
    setDeletingPartner(partner)
    setDeleteDialogOpen(true)
  }

  function handleSave() {
    if (!form.code || !form.name) return
    if (editingPartner) {
      setPartners((prev) => prev.map((p) => p.id === editingPartner.id ? { ...p, ...form } : p))
    } else {
      const newPartner: Partner = {
        id: String(Date.now()), ...form, activeCases: 0, totalCases: 0, slaRate: 100,
        createdAt: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      }
      setPartners((prev) => [...prev, newPartner])
    }
    setDialogOpen(false)
  }

  function handleDelete() {
    if (!deletingPartner) return
    setPartners((prev) => prev.filter((p) => p.id !== deletingPartner.id))
    setDeleteDialogOpen(false)
    setDeletingPartner(null)
  }

  return (
    <TooltipProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar mobileOpen={mobileMenuOpen} onMobileClose={() => setMobileMenuOpen(false)} />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header onMobileMenuToggle={() => setMobileMenuOpen((v) => !v)} breadcrumb="Administration / Partners" />
          <main className="flex-1 overflow-y-auto">
            <div className="p-6 max-w-6xl mx-auto space-y-6">

              {/* Page header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-lg font-semibold text-foreground">Partners</h1>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {partners.filter((p) => p.status === "ACTIVE").length} active partners
                  </p>
                </div>
                <Button size="sm" onClick={openCreate} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  <Plus className="size-4 mr-1.5" />
                  {BTN.ADD} Partner
                </Button>
              </div>

              {/* Toolbar */}
              <div className="flex items-center gap-3">
                <div className="relative max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={FORM_PLACEHOLDERS.SEARCH} className="pl-9 h-9" />
                </div>
                <div className="flex items-center bg-muted/50 rounded-lg p-1">
                  {(["ALL", "ACTIVE", "INACTIVE", "SUSPENDED"] as const).map((s) => (
                    <button key={s} onClick={() => setFilterStatus(s)} className={cn("h-7 px-3 text-xs font-medium rounded-md transition-all", filterStatus === s ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>
                      {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table */}
              <div className="border border-border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Code</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Name</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Contact</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Active Cases</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Total Cases</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">SLA Rate</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</th>
                      <th className="px-4 py-3 w-10" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-4 py-12 text-center text-sm text-muted-foreground">{EMPTY_STATE.NO_PARTNERS}</td>
                      </tr>
                    ) : (
                      filtered.map((partner) => (
                        <tr key={partner.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-3">
                            <span className="font-mono text-xs font-semibold text-indigo-600 bg-indigo-50 dark:bg-indigo-950 dark:text-indigo-400 px-2 py-1 rounded">
                              {partner.code}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <p className="font-medium text-foreground">{partner.name}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{partner.email}</p>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-foreground">{partner.contactPerson}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{partner.phone}</p>
                          </td>
                          <td className="px-4 py-3 tabular-nums">
                            <span className={cn("font-medium", partner.activeCases > 0 ? "text-foreground" : "text-muted-foreground")}>
                              {partner.activeCases}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground tabular-nums">{partner.totalCases}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                                <div
                                  className={cn("h-full rounded-full", partner.slaRate >= 95 ? "bg-green-500" : partner.slaRate >= 85 ? "bg-amber-500" : "bg-red-500")}
                                  style={{ width: `${partner.slaRate}%` }}
                                />
                              </div>
                              <span className={cn("text-xs font-medium tabular-nums", partner.slaRate >= 95 ? "text-green-600" : partner.slaRate >= 85 ? "text-amber-600" : "text-red-600")}>
                                {partner.slaRate}%
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded border", STATUS_STYLE[partner.status])}>
                              <span className={cn("size-1.5 rounded-full", STATUS_DOT[partner.status])} />
                              {partner.status.charAt(0) + partner.status.slice(1).toLowerCase()}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="size-8">
                                  <MoreHorizontal className="size-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-40">
                                <DropdownMenuItem onClick={() => openEdit(partner)}>
                                  <Pencil className="size-3.5 mr-2" />{BTN.EDIT}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => openDelete(partner)} className="text-red-600 focus:text-red-600">
                                  <Trash2 className="size-3.5 mr-2" />{BTN.DELETE}
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
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingPartner ? "Edit Partner" : "Add Partner"}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-2">
              <div className="space-y-1.5">
                <Label>{FORM_LABELS.PARTNER_CODE}</Label>
                <Input value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))} placeholder={FORM_PLACEHOLDERS.PARTNER_CODE} maxLength={10} className="font-mono uppercase" />
              </div>
              <div className="space-y-1.5">
                <Label>{FORM_LABELS.PARTNER_NAME}</Label>
                <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Company name" />
              </div>
              <div className="space-y-1.5">
                <Label>{FORM_LABELS.PARTNER_CONTACT}</Label>
                <Input value={form.contactPerson} onChange={(e) => setForm((f) => ({ ...f, contactPerson: e.target.value }))} placeholder="Contact person name" />
              </div>
              <div className="space-y-1.5">
                <Label>{FORM_LABELS.PARTNER_PHONE}</Label>
                <Input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="+66 8x xxx xxxx" />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label>{FORM_LABELS.PARTNER_EMAIL}</Label>
                <Input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="contact@partner.com" />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label>{FORM_LABELS.PARTNER_STATUS}</Label>
                <div className="flex gap-2">
                  {(["ACTIVE", "INACTIVE", "SUSPENDED"] as PartnerStatus[]).map((s) => (
                    <button key={s} onClick={() => setForm((f) => ({ ...f, status: s }))} className={cn("flex-1 py-2 text-sm font-medium rounded-md border transition-all", form.status === s ? "bg-indigo-600 text-white border-indigo-600" : "border-border text-muted-foreground hover:border-muted-foreground")}>
                      {s.charAt(0) + s.slice(1).toLowerCase()}
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
            <DialogHeader><DialogTitle>Delete Partner</DialogTitle></DialogHeader>
            <p className="text-sm text-muted-foreground py-2">
              Are you sure you want to delete <span className="font-medium text-foreground">{deletingPartner?.name}</span>? Active cases assigned to this partner will need to be reassigned.
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
