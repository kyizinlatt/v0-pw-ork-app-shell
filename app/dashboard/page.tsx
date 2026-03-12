"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { StatusBadge, CaseStatus } from "@/components/status-badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Briefcase,
  Clock,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Users,
  Building2,
  FileText,
  ArrowRight,
  Calendar,
  Target,
  Banknote,
} from "lucide-react"
import Link from "next/link"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"

// Mock data for charts
const casesTrendData = [
  { name: "Mon", received: 12, completed: 8 },
  { name: "Tue", received: 19, completed: 15 },
  { name: "Wed", received: 15, completed: 12 },
  { name: "Thu", received: 22, completed: 18 },
  { name: "Fri", received: 18, completed: 20 },
  { name: "Sat", received: 8, completed: 10 },
  { name: "Sun", received: 5, completed: 7 },
]

const serviceTypeData = [
  { name: "KS", value: 45, color: "#6366f1" },
  { name: "WP", value: 32, color: "#8b5cf6" },
  { name: "90D", value: 28, color: "#a855f7" },
  { name: "VISA", value: 15, color: "#d946ef" },
  { name: "TM30", value: 7, color: "#ec4899" },
]

const revenueData = [
  { name: "Jan", revenue: 125000 },
  { name: "Feb", revenue: 148000 },
  { name: "Mar", revenue: 162000 },
  { name: "Apr", revenue: 145000 },
  { name: "May", revenue: 178000 },
  { name: "Jun", revenue: 192000 },
]

const recentCases = [
  { id: "HQ-KS-110326-0001", customer: "John Smith", service: "KS", status: "WORKING" as CaseStatus, sla: 65 },
  { id: "HQ-WP-110326-0002", customer: "Jane Doe", service: "WP", status: "CHECKING" as CaseStatus, sla: 80 },
  { id: "HQ-90D-110326-0003", customer: "Bob Johnson", service: "90D", status: "DONE" as CaseStatus, sla: 100 },
  { id: "HQ-VISA-110326-0004", customer: "Alice Brown", service: "VISA", status: "SUBMITTED" as CaseStatus, sla: 45 },
  { id: "HQ-TM30-110326-0005", customer: "Charlie Wilson", service: "TM30", status: "RECEIVE" as CaseStatus, sla: 90 },
]

const topStaff = [
  { name: "Sarah Johnson", initials: "SJ", cases: 28, efficiency: 94 },
  { name: "Michael Chen", initials: "MC", cases: 25, efficiency: 91 },
  { name: "Emily Davis", initials: "ED", cases: 22, efficiency: 88 },
  { name: "David Lee", initials: "DL", cases: 20, efficiency: 85 },
]

const upcomingDeadlines = [
  { id: "HQ-KS-110326-0001", customer: "John Smith", deadline: "Today, 5:00 PM", urgent: true },
  { id: "HQ-WP-110326-0002", customer: "Jane Doe", deadline: "Tomorrow, 10:00 AM", urgent: false },
  { id: "HQ-VISA-110326-0004", customer: "Alice Brown", deadline: "Mar 15, 2:00 PM", urgent: false },
]

function StatCard({
  title,
  value,
  change,
  changeType,
  icon,
  iconBg,
}: {
  title: string
  value: string | number
  change: string
  changeType: "positive" | "negative" | "neutral"
  icon: React.ReactNode
  iconBg: string
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-semibold tracking-tight">{value}</p>
            <div className="flex items-center gap-1">
              {changeType === "positive" && <TrendingUp className="h-3 w-3 text-green-600" />}
              {changeType === "negative" && <TrendingDown className="h-3 w-3 text-red-600" />}
              <p
                className={`text-xs font-medium ${
                  changeType === "positive"
                    ? "text-green-600"
                    : changeType === "negative"
                    ? "text-red-600"
                    : "text-muted-foreground"
                }`}
              >
                {change}
              </p>
            </div>
          </div>
          <div className={`p-2.5 rounded-lg ${iconBg}`}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { setTheme, theme } = useTheme()

  const handleToggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

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
          onToggleTheme={handleToggleTheme}
        />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Welcome Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold text-foreground">Good morning, Super Admin</h1>
                <p className="text-muted-foreground">Here is what is happening with your cases today.</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  This Week
                </Button>
                <Button size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Total Active Cases"
                value={127}
                change="+12% from last week"
                changeType="positive"
                icon={<Briefcase className="h-5 w-5 text-indigo-600" />}
                iconBg="bg-indigo-100 dark:bg-indigo-950"
              />
              <StatCard
                title="Pending Action"
                value={43}
                change="5 need attention"
                changeType="neutral"
                icon={<Clock className="h-5 w-5 text-amber-600" />}
                iconBg="bg-amber-100 dark:bg-amber-950"
              />
              <StatCard
                title="Completed Today"
                value={8}
                change="+3 from yesterday"
                changeType="positive"
                icon={<CheckCircle2 className="h-5 w-5 text-green-600" />}
                iconBg="bg-green-100 dark:bg-green-950"
              />
              <StatCard
                title="SLA Breach Risk"
                value={3}
                change="Requires action"
                changeType="negative"
                icon={<AlertTriangle className="h-5 w-5 text-red-600" />}
                iconBg="bg-red-100 dark:bg-red-950"
              />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Cases Trend Chart */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-base font-medium">Cases Trend</CardTitle>
                  <CardDescription>Received vs Completed cases this week</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={casesTrendData}>
                        <defs>
                          <linearGradient id="colorReceived" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="name" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                        <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="received"
                          stroke="#6366f1"
                          fillOpacity={1}
                          fill="url(#colorReceived)"
                          strokeWidth={2}
                        />
                        <Area
                          type="monotone"
                          dataKey="completed"
                          stroke="#22c55e"
                          fillOpacity={1}
                          fill="url(#colorCompleted)"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Service Type Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-medium">By Service Type</CardTitle>
                  <CardDescription>Active cases distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={serviceTypeData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {serviceTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {serviceTypeData.map((item) => (
                      <div key={item.name} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-xs text-muted-foreground">{item.name}</span>
                        <span className="text-xs font-medium ml-auto">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Second Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Cases */}
              <Card className="lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-medium">Recent Cases</CardTitle>
                    <CardDescription>Latest case activities</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/">
                      View All <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentCases.map((caseItem) => (
                      <div
                        key={caseItem.id}
                        className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center">
                            <Briefcase className="h-5 w-5 text-indigo-600" />
                          </div>
                          <div>
                            <Link
                              href={`/cases/${caseItem.id}`}
                              className="text-sm font-medium hover:text-indigo-600 transition-colors"
                            >
                              {caseItem.id}
                            </Link>
                            <p className="text-xs text-muted-foreground">{caseItem.customer}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge variant="secondary" className="font-mono text-xs">
                            {caseItem.service}
                          </Badge>
                          <StatusBadge status={caseItem.status} size="xs" />
                          <div className="w-20">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-muted-foreground">SLA</span>
                              <span
                                className={
                                  caseItem.sla < 50
                                    ? "text-red-600"
                                    : caseItem.sla < 75
                                    ? "text-amber-600"
                                    : "text-green-600"
                                }
                              >
                                {caseItem.sla}%
                              </span>
                            </div>
                            <Progress
                              value={caseItem.sla}
                              className="h-1.5"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Deadlines */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-medium">Upcoming Deadlines</CardTitle>
                  <CardDescription>Cases requiring attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {upcomingDeadlines.map((item) => (
                      <div
                        key={item.id}
                        className={`p-3 rounded-lg border ${
                          item.urgent ? "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30" : "border-border"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <Link
                              href={`/cases/${item.id}`}
                              className="text-sm font-medium hover:text-indigo-600 transition-colors"
                            >
                              {item.id}
                            </Link>
                            <p className="text-xs text-muted-foreground">{item.customer}</p>
                          </div>
                          {item.urgent && (
                            <Badge variant="destructive" className="text-xs">
                              Urgent
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {item.deadline}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Third Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Revenue Chart */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-base font-medium">Revenue Overview</CardTitle>
                  <CardDescription>Monthly revenue for the past 6 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[240px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="name" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                        <YAxis
                          className="text-xs"
                          tick={{ fill: "hsl(var(--muted-foreground))" }}
                          tickFormatter={(value) => `${value / 1000}k`}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                          formatter={(value: number) => [`${value.toLocaleString()} THB`, "Revenue"]}
                        />
                        <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Top Performers */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-medium">Top Performers</CardTitle>
                  <CardDescription>Staff with highest completion</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topStaff.map((staff, index) => (
                      <div key={staff.name} className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-6 text-sm font-medium text-muted-foreground">
                          #{index + 1}
                        </div>
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="text-xs bg-indigo-100 text-indigo-600 dark:bg-indigo-950">
                            {staff.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{staff.name}</p>
                          <p className="text-xs text-muted-foreground">{staff.cases} cases</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-green-600">{staff.efficiency}%</p>
                          <p className="text-xs text-muted-foreground">efficiency</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold">24</p>
                    <p className="text-xs text-muted-foreground">Active Staff</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-950">
                    <Building2 className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold">15</p>
                    <p className="text-xs text-muted-foreground">Partners</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-100 dark:bg-green-950">
                    <Target className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold">92%</p>
                    <p className="text-xs text-muted-foreground">SLA Rate</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-950">
                    <Banknote className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold">192K</p>
                    <p className="text-xs text-muted-foreground">This Month</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
