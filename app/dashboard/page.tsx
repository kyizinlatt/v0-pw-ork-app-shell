"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { StatusBadge, type CaseStatus } from "@/components/status-badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Briefcase,
  Clock,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
  Building2,
  Users,
} from "lucide-react"
import Link from "next/link"

// Minimal stats
const stats = [
  { label: "Active Cases", value: 127, icon: Briefcase, change: "+12%", color: "text-indigo-600", bg: "bg-indigo-50 dark:bg-indigo-950" },
  { label: "Pending PWIN", value: 43, icon: Clock, change: "5 urgent", color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950" },
  { label: "With Partner", value: 31, icon: Building2, change: "On track", color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950" },
  { label: "Completed Today", value: 8, icon: CheckCircle2, change: "+3", color: "text-green-600", bg: "bg-green-50 dark:bg-green-950" },
]

// Recent cases - minimal
const recentCases = [
  { id: "HQ-KS-110326-0001", customer: "Win Tun", status: "WORKING" as CaseStatus, sla: 65 },
  { id: "HQ-WP-110326-0002", customer: "Aung Aung", status: "CHECKING" as CaseStatus, sla: 80 },
  { id: "HQ-90D-110326-0003", customer: "Htoo Htoo", status: "DONE" as CaseStatus, sla: 100 },
  { id: "HQ-KS-110326-0004", customer: "Mya Mya", status: "SUBMITTED" as CaseStatus, sla: 45 },
]

// Urgent items
const urgentItems = [
  { id: "HQ-KS-110326-0001", customer: "Win Tun", deadline: "Today 5:00 PM", type: "sla" },
  { id: "HQ-WP-110326-0004", customer: "Golden Star", deadline: "Tomorrow", type: "partner" },
]

export default function DashboardPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex h-screen bg-muted/30">
      <Sidebar
        activeItem="Dashboard"
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          breadcrumb="Dashboard"
          onMenuClick={() => setMobileMenuOpen(true)}
        />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
                <p className="text-sm text-muted-foreground">Overview of case activities</p>
              </div>
              <Button asChild>
                <Link href="/">
                  View All Cases
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat) => (
                <Card key={stat.label}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">{stat.label}</p>
                        <p className="text-2xl font-semibold mt-1">{stat.value}</p>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          {stat.change}
                        </p>
                      </div>
                      <div className={`p-2 rounded-lg ${stat.bg}`}>
                        <stat.icon className={`h-5 w-5 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Two column layout */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Recent Cases */}
              <Card className="lg:col-span-2">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">Recent Cases</CardTitle>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/">View All</Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {recentCases.map((c) => (
                      <Link
                        key={c.id}
                        href={`/cases/${c.id}`}
                        className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center">
                            <Briefcase className="h-4 w-4 text-indigo-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium font-mono">{c.id}</p>
                            <p className="text-xs text-muted-foreground">{c.customer}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <StatusBadge status={c.status} size="xs" />
                          <div className="w-16">
                            <Progress value={c.sla} className="h-1.5" />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Urgent & Queue Summary */}
              <div className="space-y-4">
                {/* Urgent */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                      Needs Attention
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      {urgentItems.map((item) => (
                        <Link
                          key={item.id}
                          href={`/cases/${item.id}`}
                          className="block p-2 rounded border border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/30 hover:bg-amber-100 dark:hover:bg-amber-950/50 transition-colors"
                        >
                          <p className="text-xs font-mono font-medium">{item.id}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.customer} - {item.deadline}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Queue Summary */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Queue Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-3">
                    <Link
                      href="/?queue=pwin"
                      className="flex items-center justify-between p-2 rounded border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-indigo-600" />
                        <span className="text-sm">PWIN Queue</span>
                      </div>
                      <span className="text-sm font-semibold">43</span>
                    </Link>
                    <Link
                      href="/?queue=partner"
                      className="flex items-center justify-between p-2 rounded border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-orange-600" />
                        <span className="text-sm">Partner Queue</span>
                      </div>
                      <span className="text-sm font-semibold">31</span>
                    </Link>
                    <Link
                      href="/?status=DONE"
                      className="flex items-center justify-between p-2 rounded border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Ready to Review</span>
                      </div>
                      <span className="text-sm font-semibold">12</span>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
