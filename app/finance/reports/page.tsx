"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { BarChart3, Download, TrendingUp, Briefcase, Banknote, Users } from "lucide-react"
import { cn } from "@/lib/utils"

const stats = [
  { label: "Total Revenue", value: "฿2.2M", change: "+18% vs last period", icon: Banknote, color: "text-green-600" },
  { label: "Cases Completed", value: "193", change: "+12% vs last period", icon: Briefcase, color: "text-indigo-600" },
  { label: "Avg. Processing", value: "12 days", change: "-2 days vs last period", icon: TrendingUp, color: "text-blue-600" },
]

const serviceData = [
  { name: "KS - Kyant Sal", cases: 45, revenue: 450000, percentage: 35 },
  { name: "WP - Work Permit", cases: 32, revenue: 320000, percentage: 25 },
  { name: "VISA - Extension", cases: 28, revenue: 280000, percentage: 22 },
  { name: "90D - Report", cases: 15, revenue: 75000, percentage: 12 },
  { name: "TM30 - Notify", cases: 8, revenue: 24000, percentage: 6 },
]

const partnerData = [
  { name: "Immigration Pro", cases: 85, revenue: "฿425K", sla: 96 },
  { name: "Visa Express", cases: 62, revenue: "฿310K", sla: 92 },
  { name: "Direct (PWIN)", cases: 45, revenue: "฿225K", sla: 98 },
]

export default function ReportsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [period, setPeriod] = useState("month")

  return (
    <div className="flex h-screen bg-muted/30">
      <Sidebar activeItem="Reports" mobileOpen={mobileMenuOpen} onMobileClose={() => setMobileMenuOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header breadcrumb="Finance / Reports" onMenuClick={() => setMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold">Reports</h1>
              <div className="flex items-center gap-2">
                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger className="w-32 h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="quarter">This Quarter</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" /> Export
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {stats.map(s => (
                <Card key={s.label}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-muted">
                        <s.icon className={cn("h-5 w-5", s.color)} />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{s.label}</p>
                        <p className="text-xl font-semibold">{s.value}</p>
                        <p className="text-xs text-green-600">{s.change}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Two column */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* By Service */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" /> Revenue by Service
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {serviceData.map(s => (
                    <div key={s.name} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>{s.name}</span>
                        <span className="font-medium">฿{(s.revenue / 1000).toFixed(0)}K</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={s.percentage} className="h-2 flex-1" />
                        <span className="text-xs text-muted-foreground w-8">{s.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* By Partner */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Users className="h-4 w-4" /> Partner Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 text-xs text-muted-foreground font-medium">Partner</th>
                        <th className="text-right py-2 text-xs text-muted-foreground font-medium">Cases</th>
                        <th className="text-right py-2 text-xs text-muted-foreground font-medium">Revenue</th>
                        <th className="text-right py-2 text-xs text-muted-foreground font-medium">SLA</th>
                      </tr>
                    </thead>
                    <tbody>
                      {partnerData.map(p => (
                        <tr key={p.name} className="border-b last:border-0">
                          <td className="py-2.5">{p.name}</td>
                          <td className="py-2.5 text-right">{p.cases}</td>
                          <td className="py-2.5 text-right font-medium">{p.revenue}</td>
                          <td className="py-2.5 text-right">
                            <span className={cn(
                              "text-xs font-medium px-1.5 py-0.5 rounded",
                              p.sla >= 95 ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                            )}>
                              {p.sla}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
