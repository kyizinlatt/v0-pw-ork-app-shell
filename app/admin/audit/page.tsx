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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ShieldCheck, Search, Activity, LogIn, FileEdit, Briefcase, Eye } from "lucide-react"
import { cn } from "@/lib/utils"

const stats = [
  { label: "Today", value: "156", icon: Activity, color: "text-indigo-600", bg: "bg-indigo-50 dark:bg-indigo-950" },
  { label: "Failed Logins", value: "3", icon: LogIn, color: "text-red-600", bg: "bg-red-50 dark:bg-red-950" },
  { label: "Case Actions", value: "89", icon: Briefcase, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950" },
]

const logs = [
  { id: "1", time: "10:45 AM", user: "SRP Admin", action: "LOGIN", category: "AUTH", desc: "User logged in", ip: "192.168.1.1", success: true },
  { id: "2", time: "10:42 AM", user: "Partner A", action: "UPDATE", category: "CASE", desc: "Updated case HQ-KS-0001 status to WORKING", ip: "10.0.0.5", success: true },
  { id: "3", time: "10:38 AM", user: "SRP Admin", action: "CREATE", category: "CASE", desc: "Created new case HQ-WP-0004", ip: "192.168.1.1", success: true },
  { id: "4", time: "10:30 AM", user: "Unknown", action: "LOGIN", category: "AUTH", desc: "Failed login attempt for admin@pwin.com", ip: "45.33.12.8", success: false },
  { id: "5", time: "10:25 AM", user: "Staff B", action: "UPDATE", category: "PAYMENT", desc: "Recorded payment INV-0041", ip: "192.168.1.15", success: true },
  { id: "6", time: "10:20 AM", user: "SRP Admin", action: "ASSIGN", category: "CASE", desc: "Assigned HQ-KS-0002 to Partner A", ip: "192.168.1.1", success: true },
  { id: "7", time: "09:55 AM", user: "Partner A", action: "VIEW", category: "CASE", desc: "Viewed case HQ-KS-0001", ip: "10.0.0.5", success: true },
]

const categoryColors: Record<string, string> = {
  AUTH: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  CASE: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  PAYMENT: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
}

export default function AuditPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [tab, setTab] = useState("all")
  const [search, setSearch] = useState("")
  const [detailOpen, setDetailOpen] = useState(false)
  const [selected, setSelected] = useState<typeof logs[0] | null>(null)

  const filtered = logs.filter(l => {
    if (tab === "failed" && l.success) return false
    if (tab === "auth" && l.category !== "AUTH") return false
    if (tab === "cases" && l.category !== "CASE") return false
    if (search && !l.desc.toLowerCase().includes(search.toLowerCase()) && !l.user.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const openDetail = (log: typeof logs[0]) => {
    setSelected(log)
    setDetailOpen(true)
  }

  return (
    <div className="flex h-screen bg-muted/30">
      <Sidebar activeItem="Audit Log" mobileOpen={mobileMenuOpen} onMobileClose={() => setMobileMenuOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header breadcrumb="System / Audit Log" onMenuClick={() => setMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-indigo-600" />
                <h1 className="text-xl font-semibold">Audit Log</h1>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {stats.map(s => (
                <Card key={s.label}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">{s.label}</p>
                      <p className="text-xl font-semibold">{s.value}</p>
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
              <div className="flex gap-1 bg-muted p-1 rounded-lg">
                {[
                  { key: "all", label: "All" },
                  { key: "auth", label: "Auth" },
                  { key: "cases", label: "Cases" },
                  { key: "failed", label: "Failed" },
                ].map(t => (
                  <button
                    key={t.key}
                    onClick={() => setTab(t.key)}
                    className={cn(
                      "px-3 py-1.5 text-xs font-medium rounded-md",
                      tab === t.key ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <div className="relative w-48">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-9" />
              </div>
            </div>

            {/* Table */}
            <Card>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Time</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">User</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Category</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Description</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Status</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(log => (
                    <tr key={log.id} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="px-4 py-3 text-muted-foreground">{log.time}</td>
                      <td className="px-4 py-3 font-medium">{log.user}</td>
                      <td className="px-4 py-3">
                        <Badge variant="secondary" className={cn("text-xs", categoryColors[log.category] || "")}>
                          {log.category}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground max-w-xs truncate">{log.desc}</td>
                      <td className="px-4 py-3">
                        <span className={cn(
                          "inline-block w-2 h-2 rounded-full",
                          log.success ? "bg-green-500" : "bg-red-500"
                        )} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="ghost" size="sm" onClick={() => openDetail(log)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        </main>
      </div>

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Log Details</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time</span>
                <span>{selected.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">User</span>
                <span className="font-medium">{selected.user}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Action</span>
                <span>{selected.action}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">IP Address</span>
                <span className="font-mono text-xs">{selected.ip}</span>
              </div>
              <div className="pt-2 border-t">
                <p className="text-muted-foreground mb-1">Description</p>
                <p>{selected.desc}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
