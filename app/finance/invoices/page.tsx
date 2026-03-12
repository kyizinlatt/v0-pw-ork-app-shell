"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Receipt,
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  Download,
  Send,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  DollarSign,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

type InvoiceStatus = "DRAFT" | "SENT" | "PAID" | "OVERDUE" | "CANCELLED"

interface InvoiceItem {
  description: string
  quantity: number
  unitPrice: number
}

interface Invoice {
  id: string
  invoiceNumber: string
  caseId: string
  customer: string
  items: InvoiceItem[]
  subtotal: number
  tax: number
  total: number
  status: InvoiceStatus
  issueDate: string
  dueDate: string
  notes?: string
}

const sampleInvoices: Invoice[] = [
  {
    id: "1",
    invoiceNumber: "INV-2026-0042",
    caseId: "HQ-KS-110326-0001",
    customer: "Win Tun",
    items: [
      { description: "Work Permit Application Fee", quantity: 1, unitPrice: 5000 },
      { description: "Processing Service", quantity: 1, unitPrice: 2500 },
    ],
    subtotal: 7500,
    tax: 525,
    total: 8025,
    status: "PAID",
    issueDate: "2026-03-11",
    dueDate: "2026-03-18",
  },
  {
    id: "2",
    invoiceNumber: "INV-2026-0041",
    caseId: "HQ-WP-110326-0002",
    customer: "Aung Aung",
    items: [
      { description: "Work Permit Extension Fee", quantity: 1, unitPrice: 10000 },
      { description: "Rush Processing", quantity: 1, unitPrice: 2000 },
    ],
    subtotal: 12000,
    tax: 840,
    total: 12840,
    status: "SENT",
    issueDate: "2026-03-10",
    dueDate: "2026-03-17",
  },
  {
    id: "3",
    invoiceNumber: "INV-2026-0040",
    caseId: "HQ-KS-100326-0003",
    customer: "Golden Star Co., Ltd.",
    items: [
      { description: "Multiple Work Permits (5)", quantity: 5, unitPrice: 7500 },
      { description: "Document Translation", quantity: 1, unitPrice: 7500 },
    ],
    subtotal: 45000,
    tax: 3150,
    total: 48150,
    status: "PAID",
    issueDate: "2026-03-09",
    dueDate: "2026-03-16",
  },
  {
    id: "4",
    invoiceNumber: "INV-2026-0039",
    caseId: "HQ-90D-090326-0004",
    customer: "Htoo Htoo",
    items: [{ description: "90-Day Report Service", quantity: 1, unitPrice: 3500 }],
    subtotal: 3500,
    tax: 245,
    total: 3745,
    status: "OVERDUE",
    issueDate: "2026-03-05",
    dueDate: "2026-03-12",
  },
  {
    id: "5",
    invoiceNumber: "INV-2026-0038",
    caseId: "HQ-KS-080326-0005",
    customer: "Mya Mya",
    items: [
      { description: "Work Permit Application", quantity: 1, unitPrice: 5000 },
      { description: "Processing Service", quantity: 1, unitPrice: 2500 },
    ],
    subtotal: 7500,
    tax: 525,
    total: 8025,
    status: "DRAFT",
    issueDate: "2026-03-08",
    dueDate: "2026-03-15",
  },
]

const statusConfig: Record<InvoiceStatus, { label: string; icon: React.ElementType; color: string }> = {
  DRAFT: { label: "Draft", icon: FileText, color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" },
  SENT: { label: "Sent", icon: Send, color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" },
  PAID: { label: "Paid", icon: CheckCircle2, color: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" },
  OVERDUE: { label: "Overdue", icon: Clock, color: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300" },
  CANCELLED: { label: "Cancelled", icon: XCircle, color: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400" },
}

const stats = [
  { label: "Total Invoiced", value: "80,785", icon: Receipt, color: "text-indigo-600", bg: "bg-indigo-50 dark:bg-indigo-950" },
  { label: "Paid", value: "56,175", icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50 dark:bg-green-950" },
  { label: "Pending", value: "12,840", icon: Clock, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950" },
  { label: "Overdue", value: "3,745", icon: XCircle, color: "text-red-600", bg: "bg-red-50 dark:bg-red-950" },
]

export default function InvoicesPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [invoices, setInvoices] = useState(sampleInvoices)
  const [tab, setTab] = useState("all")
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    customer: "",
    caseId: "",
    items: [{ description: "", quantity: 1, unitPrice: 0 }] as InvoiceItem[],
    dueDate: "",
    notes: "",
  })

  const filtered = invoices.filter((inv) => {
    if (tab !== "all" && inv.status !== tab) return false
    if (
      search &&
      !inv.customer.toLowerCase().includes(search.toLowerCase()) &&
      !inv.invoiceNumber.toLowerCase().includes(search.toLowerCase())
    )
      return false
    return true
  })

  const resetForm = () => {
    setFormData({
      customer: "",
      caseId: "",
      items: [{ description: "", quantity: 1, unitPrice: 0 }],
      dueDate: "",
      notes: "",
    })
    setSelectedInvoice(null)
  }

  const openCreateDialog = () => {
    resetForm()
    setDialogOpen(true)
  }

  const openEditDialog = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setFormData({
      customer: invoice.customer,
      caseId: invoice.caseId,
      items: invoice.items,
      dueDate: invoice.dueDate,
      notes: invoice.notes || "",
    })
    setDialogOpen(true)
  }

  const openViewDialog = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setViewDialogOpen(true)
  }

  const openDeleteDialog = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setDeleteDialogOpen(true)
  }

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { description: "", quantity: 1, unitPrice: 0 }],
    }))
  }

  const removeItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }))
  }

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }))
  }

  const calculateTotals = () => {
    const subtotal = formData.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    )
    const tax = subtotal * 0.07
    return { subtotal, tax, total: subtotal + tax }
  }

  const handleSave = () => {
    const { subtotal, tax, total } = calculateTotals()
    if (selectedInvoice) {
      // Update
      setInvoices((prev) =>
        prev.map((inv) =>
          inv.id === selectedInvoice.id
            ? {
                ...inv,
                customer: formData.customer,
                caseId: formData.caseId,
                items: formData.items,
                subtotal,
                tax,
                total,
                dueDate: formData.dueDate,
                notes: formData.notes,
              }
            : inv
        )
      )
    } else {
      // Create
      const newInvoice: Invoice = {
        id: String(Date.now()),
        invoiceNumber: `INV-2026-${String(invoices.length + 43).padStart(4, "0")}`,
        caseId: formData.caseId,
        customer: formData.customer,
        items: formData.items,
        subtotal,
        tax,
        total,
        status: "DRAFT",
        issueDate: new Date().toISOString().split("T")[0],
        dueDate: formData.dueDate,
        notes: formData.notes,
      }
      setInvoices((prev) => [newInvoice, ...prev])
    }
    setDialogOpen(false)
    resetForm()
  }

  const handleDelete = () => {
    if (selectedInvoice) {
      setInvoices((prev) => prev.filter((inv) => inv.id !== selectedInvoice.id))
    }
    setDeleteDialogOpen(false)
    setSelectedInvoice(null)
  }

  const handleSendInvoice = (invoice: Invoice) => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === invoice.id ? { ...inv, status: "SENT" as InvoiceStatus } : inv
      )
    )
  }

  const handleMarkPaid = (invoice: Invoice) => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === invoice.id ? { ...inv, status: "PAID" as InvoiceStatus } : inv
      )
    )
  }

  return (
    <div className="flex h-screen bg-muted/30">
      <Sidebar
        activeItem="Invoices"
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          breadcrumb="Finance / Invoices"
          onMenuClick={() => setMobileMenuOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold">Invoices</h1>
              <Button size="sm" onClick={openCreateDialog}>
                <Plus className="h-4 w-4 mr-1" /> New Invoice
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((s) => (
                <Card key={s.label}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">{s.label}</p>
                      <p className="text-lg font-semibold">฿{s.value}</p>
                    </div>
                    <div className={cn("p-2 rounded-lg", s.bg)}>
                      <s.icon className={cn("h-5 w-5", s.color)} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Filters */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex gap-1 bg-muted p-1 rounded-lg overflow-x-auto">
                {["all", "DRAFT", "SENT", "PAID", "OVERDUE"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={cn(
                      "px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors",
                      tab === t
                        ? "bg-background shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {t === "all" ? "All" : t.charAt(0) + t.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
              <div className="relative w-48">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>
            </div>

            {/* Table */}
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/30">
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">
                        Invoice
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">
                        Customer
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">
                        Case
                      </th>
                      <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">
                        Amount
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">
                        Status
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">
                        Due Date
                      </th>
                      <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((inv) => {
                      const status = statusConfig[inv.status]
                      return (
                        <tr
                          key={inv.id}
                          className="border-b last:border-0 hover:bg-muted/50 transition-colors"
                        >
                          <td className="px-4 py-3">
                            <span className="font-mono text-xs">{inv.invoiceNumber}</span>
                          </td>
                          <td className="px-4 py-3">{inv.customer}</td>
                          <td className="px-4 py-3">
                            <Link
                              href={`/cases/${inv.caseId}`}
                              className="font-mono text-xs text-indigo-600 hover:underline"
                            >
                              {inv.caseId}
                            </Link>
                          </td>
                          <td className="px-4 py-3 text-right font-medium">
                            ฿{inv.total.toLocaleString()}
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant="secondary" className={cn("text-xs", status.color)}>
                              {status.label}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">{inv.dueDate}</td>
                          <td className="px-4 py-3 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => openViewDialog(inv)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View
                                </DropdownMenuItem>
                                {inv.status === "DRAFT" && (
                                  <>
                                    <DropdownMenuItem onClick={() => openEditDialog(inv)}>
                                      <Pencil className="h-4 w-4 mr-2" />
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleSendInvoice(inv)}>
                                      <Send className="h-4 w-4 mr-2" />
                                      Send
                                    </DropdownMenuItem>
                                  </>
                                )}
                                {(inv.status === "SENT" || inv.status === "OVERDUE") && (
                                  <DropdownMenuItem onClick={() => handleMarkPaid(inv)}>
                                    <CheckCircle2 className="h-4 w-4 mr-2" />
                                    Mark Paid
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem>
                                  <Download className="h-4 w-4 mr-2" />
                                  Download PDF
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => openDeleteDialog(inv)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      )
                    })}
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                          No invoices found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </main>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedInvoice ? "Edit Invoice" : "New Invoice"}</DialogTitle>
            <DialogDescription>
              {selectedInvoice
                ? "Update invoice details"
                : "Create a new invoice for a case"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">Customer</label>
                <Input
                  value={formData.customer}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, customer: e.target.value }))
                  }
                  placeholder="Customer name"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Case ID</label>
                <Input
                  value={formData.caseId}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, caseId: e.target.value }))
                  }
                  placeholder="e.g., HQ-KS-110326-0001"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Items</label>
                <Button variant="ghost" size="sm" onClick={addItem}>
                  <Plus className="h-4 w-4 mr-1" /> Add Item
                </Button>
              </div>
              <div className="space-y-2">
                {formData.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={item.description}
                      onChange={(e) => updateItem(index, "description", e.target.value)}
                      placeholder="Description"
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(index, "quantity", parseInt(e.target.value) || 1)
                      }
                      className="w-20"
                      min={1}
                    />
                    <Input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) =>
                        updateItem(index, "unitPrice", parseFloat(e.target.value) || 0)
                      }
                      className="w-28"
                      placeholder="Price"
                    />
                    {formData.items.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0"
                        onClick={() => removeItem(index)}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end border-t pt-4">
              <div className="text-right space-y-1">
                <p className="text-sm text-muted-foreground">
                  Subtotal: ฿{calculateTotals().subtotal.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  Tax (7%): ฿{calculateTotals().tax.toLocaleString()}
                </p>
                <p className="text-lg font-semibold">
                  Total: ฿{calculateTotals().total.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Due Date</label>
              <Input
                type="date"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, dueDate: e.target.value }))
                }
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Notes (Optional)</label>
              <Textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, notes: e.target.value }))
                }
                placeholder="Additional notes..."
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {selectedInvoice ? "Update" : "Create"} Invoice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Invoice Details</DialogTitle>
            <DialogDescription>{selectedInvoice?.invoiceNumber}</DialogDescription>
          </DialogHeader>
          {selectedInvoice && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Customer</p>
                  <p className="font-medium">{selectedInvoice.customer}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Case</p>
                  <p className="font-mono text-xs">{selectedInvoice.caseId}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Issue Date</p>
                  <p>{selectedInvoice.issueDate}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Due Date</p>
                  <p>{selectedInvoice.dueDate}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm font-medium mb-2">Items</p>
                <div className="space-y-2">
                  {selectedInvoice.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span>
                        {item.description} x{item.quantity}
                      </span>
                      <span>฿{(item.quantity * item.unitPrice).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4 space-y-1 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>฿{selectedInvoice.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax (7%)</span>
                  <span>฿{selectedInvoice.tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-semibold text-base pt-1">
                  <span>Total</span>
                  <span>฿{selectedInvoice.total.toLocaleString()}</span>
                </div>
              </div>

              {selectedInvoice.notes && (
                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="text-sm">{selectedInvoice.notes}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Close
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-1" /> Download PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Invoice</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete invoice {selectedInvoice?.invoiceNumber}? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
