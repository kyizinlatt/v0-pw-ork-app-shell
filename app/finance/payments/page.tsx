"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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
import { Banknote, Clock, AlertCircle, Plus, Search, Receipt } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

const stats = [
  { label: "Total Revenue", value: "฿62.5K", icon: Banknote, color: "text-green-600", bg: "bg-green-50 dark:bg-green-950" },
  { label: "Pending", value: "฿15K", sub: "3 invoices", icon: Clock, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950" },
  { label: "Overdue", value: "฿35K", sub: "1 invoice", icon: AlertCircle, color: "text-red-600", bg: "bg-red-50 dark:bg-red-950" },
]

const payments = [
  { id: "INV-0042", case: "HQ-KS-110326-0001", customer: "Win Tun", amount: 7500, status: "PAID", date: "Mar 11" },
  { id: "INV-0041", case: "HQ-WP-110326-0002", customer: "Aung Aung", amount: 12000, status: "PENDING", date: "Mar 10" },
  { id: "INV-0040", case: "HQ-KS-100326-0003", customer: "Golden Star", amount: 45000, status: "PAID", date: "Mar 9" },
  { id: "INV-0039", case: "HQ-90D-090326-0004", customer: "Htoo Htoo", amount: 3500, status: "OVERDUE", date: "Mar 5" },
  { id: "INV-0038", case: "HQ-KS-080326-0005", customer: "Mya Mya", amount: 7500, status: "PAID", date: "Mar 8" },
]

export default function PaymentsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [tab, setTab] = useState("all")
  const [search, setSearch] = useState("")
  const [recordOpen, setRecordOpen] = useState(false)

  const filtered = payments.filter(p => {
    if (tab !== "all" && p.status !== tab) return false
    if (search && !p.customer.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="flex h-screen bg-muted/30">
      <Sidebar activeItem="Payments" mobileOpen={mobileMenuOpen} onMobileClose={() => setMobileMenuOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header breadcrumb="Finance / Payments" onMenuClick={() => setMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold">Payments</h1>
              <Button size="sm" onClick={() => setRecordOpen(true)}>
                <Plus className="h-4 w-4 mr-1" /> Record
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {stats.map(s => (
                <Card key={s.label}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">{s.label}</p>
                      <p className="text-xl font-semibold">{s.value}</p>
                      {s.sub && <p className="text-xs text-muted-foreground">{s.sub}</p>}
                    </div>
                    <div className={cn("p-2 rounded-lg", s.bg)}>
                      <s.icon className={cn("h-5 w-5", s.color)} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex gap-1 bg-muted p-1 rounded-lg">
                {["all", "PENDING", "PAID", "OVERDUE"].map(t => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={cn(
                      "px-3 py-1.5 text-xs font-medium rounded-md",
                      tab === t ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {t === "all" ? "All" : t.charAt(0) + t.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
              <div className="relative w-48">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-9" />
              </div>
            </div>

            <Card>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Invoice</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Case</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Customer</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">Amount</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Status</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(p => (
                    <tr key={p.id} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="px-4 py-3 font-mono">{p.id}</td>
                      <td className="px-4 py-3">
                        <Link href={`/cases/${p.case}`} className="font-mono text-xs text-indigo-600 hover:underline">{p.case}</Link>
                      </td>
                      <td className="px-4 py-3">{p.customer}</td>
                      <td className="px-4 py-3 text-right font-medium">฿{p.amount.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <Badge variant="secondary" className={cn(
                          "text-xs",
                          p.status === "PAID" && "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
                          p.status === "PENDING" && "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
                          p.status === "OVERDUE" && "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                        )}>
                          {p.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {p.status !== "PAID" && (
                          <Button variant="ghost" size="sm" onClick={() => setRecordOpen(true)}>
                            <Receipt className="h-4 w-4" />
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        </main>
      </div>

      <Dialog open={recordOpen} onOpenChange={setRecordOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
            <DialogDescription>Record payment for invoice</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <label className="text-sm font-medium">Amount (THB)</label>
              <Input type="number" placeholder="0" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Method</label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank">Bank Transfer</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="promptpay">PromptPay</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRecordOpen(false)}>Cancel</Button>
            <Button onClick={() => setRecordOpen(false)}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
