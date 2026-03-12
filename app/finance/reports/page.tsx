"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import {
  BarChart3,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  Briefcase,
  Banknote,
  Users,
  Building2,
  Clock,
  CheckCircle2,
  Target,
  FileText,
  PieChart,
  LineChart,
  ArrowRight,
  Filter,
} from "lucide-react"
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
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
  LineChart as RechartsLineChart,
  Line,
} from "recharts"

// Mock data
const monthlyRevenueData = [
  { month: "Jan", revenue: 125000, cases: 45, target: 120000 },
  { month: "Feb", revenue: 148000, cases: 52, target: 130000 },
  { month: "Mar", revenue: 162000, cases: 58, target: 140000 },
  { month: "Apr", revenue: 145000, cases: 48, target: 150000 },
  { month: "May", revenue: 178000, cases: 62, target: 160000 },
  { month: "Jun", revenue: 192000, cases: 68, target: 170000 },
  { month: "Jul", revenue: 185000, cases: 65, target: 175000 },
  { month: "Aug", revenue: 205000, cases: 72, target: 180000 },
  { month: "Sep", revenue: 198000, cases: 70, target: 185000 },
  { month: "Oct", revenue: 215000, cases: 75, target: 190000 },
  { month: "Nov", revenue: 228000, cases: 80, target: 200000 },
  { month: "Dec", revenue: 245000, cases: 85, target: 210000 },
]

const serviceTypeRevenue = [
  { name: "KS - Work Permit", revenue: 450000, cases: 45, avgValue: 10000, color: "#6366f1" },
  { name: "WP - Extension", revenue: 320000, cases: 64, avgValue: 5000, color: "#8b5cf6" },
  { name: "90D Report", revenue: 84000, cases: 28, avgValue: 3000, color: "#a855f7" },
  { name: "VISA Application", revenue: 525000, cases: 35, avgValue: 15000, color: "#d946ef" },
  { name: "TM30", revenue: 21000, cases: 21, avgValue: 1000, color: "#ec4899" },
]

const partnerPerformance = [
  { name: "Immigration Pro", cases: 85, revenue: 425000, slaRate: 96, avgDays: 12 },
  { name: "Visa Express", cases: 62, revenue: 310000, slaRate: 92, avgDays: 15 },
  { name: "Direct (No Partner)", cases: 45, revenue: 225000, slaRate: 98, avgDays: 10 },
  { name: "Global Visa Services", cases: 38, revenue: 190000, slaRate: 88, avgDays: 18 },
  { name: "Quick Immigration", cases: 25, revenue: 125000, slaRate: 94, avgDays: 14 },
]

const staffPerformance = [
  { name: "Sarah Johnson", cases: 128, completed: 122, avgDays: 8, slaRate: 98, revenue: 320000 },
  { name: "Michael Chen", cases: 115, completed: 108, avgDays: 9, slaRate: 95, revenue: 287500 },
  { name: "Emily Davis", cases: 98, completed: 92, avgDays: 10, slaRate: 92, revenue: 245000 },
  { name: "David Lee", cases: 85, completed: 78, avgDays: 11, slaRate: 88, revenue: 212500 },
  { name: "Lisa Wang", cases: 72, completed: 68, avgDays: 9, slaRate: 94, revenue: 180000 },
]

const statusDistribution = [
  { name: "Completed", value: 420, color: "#22c55e" },
  { name: "In Progress", value: 85, color: "#6366f1" },
  { name: "Pending", value: 45, color: "#f59e0b" },
  { name: "On Hold", value: 12, color: "#ef4444" },
]

const weeklyTrend = [
  { week: "W1", cases: 28, completed: 25 },
  { week: "W2", cases: 32, completed: 30 },
  { week: "W3", cases: 25, completed: 28 },
  { week: "W4", cases: 35, completed: 32 },
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
  value: string
  change: string
  changeType: "positive" | "negative" | "neutral"
  icon: React.ReactNode
  iconBg: string
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
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

export default function ReportsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [dateRange, setDateRange] = useState("year")
  const { setTheme, theme } = useTheme()

  const handleToggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const totalRevenue = monthlyRevenueData.reduce((sum, m) => sum + m.revenue, 0)
  const totalCases = monthlyRevenueData.reduce((sum, m) => sum + m.cases, 0)
  const avgCaseValue = Math.round(totalRevenue / totalCases)

  return (
    <div className="flex h-screen bg-muted/30">
      <Sidebar
        activeItem="Reports"
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          breadcrumb="Finance / Reports"
          onMenuClick={() => setMobileMenuOpen(true)}
          onToggleTheme={handleToggleTheme}
        />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold text-foreground">Reports & Analytics</h1>
                <p className="text-muted-foreground">Comprehensive business insights and performance metrics</p>
              </div>
              <div className="flex items-center gap-2">
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-[160px]">
                    <Calendar className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="quarter">This Quarter</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Total Revenue"
                value={`${(totalRevenue / 1000000).toFixed(2)}M THB`}
                change="+18.5% from last year"
                changeType="positive"
                icon={<Banknote className="h-5 w-5 text-green-600" />}
                iconBg="bg-green-100 dark:bg-green-950"
              />
              <StatCard
                title="Total Cases"
                value={totalCases.toString()}
                change="+24% from last year"
                changeType="positive"
                icon={<Briefcase className="h-5 w-5 text-indigo-600" />}
                iconBg="bg-indigo-100 dark:bg-indigo-950"
              />
              <StatCard
                title="Avg. Case Value"
                value={`${avgCaseValue.toLocaleString()} THB`}
                change="-2.3% from last year"
                changeType="negative"
                icon={<Target className="h-5 w-5 text-amber-600" />}
                iconBg="bg-amber-100 dark:bg-amber-950"
              />
              <StatCard
                title="SLA Compliance"
                value="94.2%"
                change="+1.8% from last year"
                changeType="positive"
                icon={<CheckCircle2 className="h-5 w-5 text-teal-600" />}
                iconBg="bg-teal-100 dark:bg-teal-950"
              />
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
                <TabsTrigger
                  value="overview"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent px-4 py-3"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="revenue"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent px-4 py-3"
                >
                  <LineChart className="h-4 w-4 mr-2" />
                  Revenue
                </TabsTrigger>
                <TabsTrigger
                  value="services"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent px-4 py-3"
                >
                  <PieChart className="h-4 w-4 mr-2" />
                  Services
                </TabsTrigger>
                <TabsTrigger
                  value="partners"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent px-4 py-3"
                >
                  <Building2 className="h-4 w-4 mr-2" />
                  Partners
                </TabsTrigger>
                <TabsTrigger
                  value="staff"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent px-4 py-3"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Staff
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Revenue vs Target Chart */}
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="text-base font-medium">Revenue vs Target</CardTitle>
                      <CardDescription>Monthly revenue compared to targets</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={monthlyRevenueData}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis dataKey="month" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
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
                              formatter={(value: number) => [`${value.toLocaleString()} THB`]}
                            />
                            <Legend />
                            <Bar dataKey="revenue" name="Revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="target" name="Target" fill="#e5e7eb" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Case Status Distribution */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base font-medium">Case Status</CardTitle>
                      <CardDescription>Current case distribution</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsPieChart>
                            <Pie
                              data={statusDistribution}
                              cx="50%"
                              cy="50%"
                              innerRadius={50}
                              outerRadius={80}
                              paddingAngle={2}
                              dataKey="value"
                            >
                              {statusDistribution.map((entry, index) => (
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
                          </RechartsPieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-4">
                        {statusDistribution.map((item) => (
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

                {/* Weekly Trend */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base font-medium">Weekly Trend</CardTitle>
                    <CardDescription>Cases received vs completed this month</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsLineChart data={weeklyTrend}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis dataKey="week" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                          <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "hsl(var(--card))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "8px",
                            }}
                          />
                          <Legend />
                          <Line type="monotone" dataKey="cases" name="Received" stroke="#6366f1" strokeWidth={2} dot={{ fill: "#6366f1" }} />
                          <Line type="monotone" dataKey="completed" name="Completed" stroke="#22c55e" strokeWidth={2} dot={{ fill: "#22c55e" }} />
                        </RechartsLineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Revenue Tab */}
              <TabsContent value="revenue" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base font-medium">Monthly Revenue Trend</CardTitle>
                    <CardDescription>Revenue and case volume over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[350px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={monthlyRevenueData}>
                          <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis dataKey="month" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                          <YAxis
                            yAxisId="left"
                            className="text-xs"
                            tick={{ fill: "hsl(var(--muted-foreground))" }}
                            tickFormatter={(value) => `${value / 1000}k`}
                          />
                          <YAxis
                            yAxisId="right"
                            orientation="right"
                            className="text-xs"
                            tick={{ fill: "hsl(var(--muted-foreground))" }}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "hsl(var(--card))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "8px",
                            }}
                            formatter={(value: number, name: string) => [
                              name === "revenue" ? `${value.toLocaleString()} THB` : value,
                              name === "revenue" ? "Revenue" : "Cases",
                            ]}
                          />
                          <Legend />
                          <Area
                            yAxisId="left"
                            type="monotone"
                            dataKey="revenue"
                            name="Revenue"
                            stroke="#6366f1"
                            fillOpacity={1}
                            fill="url(#colorRevenue)"
                            strokeWidth={2}
                          />
                          <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="cases"
                            name="Cases"
                            stroke="#f59e0b"
                            strokeWidth={2}
                            dot={{ fill: "#f59e0b" }}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Services Tab */}
              <TabsContent value="services" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base font-medium">Revenue by Service Type</CardTitle>
                    <CardDescription>Performance breakdown by service category</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Service Type</TableHead>
                          <TableHead className="text-right">Cases</TableHead>
                          <TableHead className="text-right">Revenue</TableHead>
                          <TableHead className="text-right">Avg. Value</TableHead>
                          <TableHead className="w-[200px]">Share</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {serviceTypeRevenue.map((service) => {
                          const totalServiceRevenue = serviceTypeRevenue.reduce((sum, s) => sum + s.revenue, 0)
                          const percentage = Math.round((service.revenue / totalServiceRevenue) * 100)
                          return (
                            <TableRow key={service.name}>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: service.color }} />
                                  <span className="font-medium">{service.name}</span>
                                </div>
                              </TableCell>
                              <TableCell className="text-right font-mono">{service.cases}</TableCell>
                              <TableCell className="text-right font-mono">{service.revenue.toLocaleString()} THB</TableCell>
                              <TableCell className="text-right font-mono">{service.avgValue.toLocaleString()} THB</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Progress value={percentage} className="h-2 flex-1" />
                                  <span className="text-sm text-muted-foreground w-10 text-right">{percentage}%</span>
                                </div>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Partners Tab */}
              <TabsContent value="partners" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base font-medium">Partner Performance</CardTitle>
                    <CardDescription>Cases and revenue by partner organization</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Partner</TableHead>
                          <TableHead className="text-right">Cases</TableHead>
                          <TableHead className="text-right">Revenue</TableHead>
                          <TableHead className="text-right">SLA Rate</TableHead>
                          <TableHead className="text-right">Avg. Days</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {partnerPerformance.map((partner) => (
                          <TableRow key={partner.name}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center">
                                  <Building2 className="h-4 w-4 text-indigo-600" />
                                </div>
                                <span className="font-medium">{partner.name}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right font-mono">{partner.cases}</TableCell>
                            <TableCell className="text-right font-mono">{partner.revenue.toLocaleString()} THB</TableCell>
                            <TableCell className="text-right">
                              <Badge
                                variant="secondary"
                                className={
                                  partner.slaRate >= 95
                                    ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
                                    : partner.slaRate >= 90
                                    ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                                    : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                                }
                              >
                                {partner.slaRate}%
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right text-muted-foreground">{partner.avgDays} days</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Staff Tab */}
              <TabsContent value="staff" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base font-medium">Staff Performance</CardTitle>
                    <CardDescription>Individual performance metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Staff Member</TableHead>
                          <TableHead className="text-right">Assigned</TableHead>
                          <TableHead className="text-right">Completed</TableHead>
                          <TableHead className="text-right">Avg. Days</TableHead>
                          <TableHead className="text-right">SLA Rate</TableHead>
                          <TableHead className="text-right">Revenue</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {staffPerformance.map((staff, index) => (
                          <TableRow key={staff.name}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <span className="text-sm text-muted-foreground w-4">#{index + 1}</span>
                                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-xs font-medium text-indigo-600">
                                  {staff.name.split(" ").map((n) => n[0]).join("")}
                                </div>
                                <span className="font-medium">{staff.name}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right font-mono">{staff.cases}</TableCell>
                            <TableCell className="text-right font-mono">{staff.completed}</TableCell>
                            <TableCell className="text-right text-muted-foreground">{staff.avgDays} days</TableCell>
                            <TableCell className="text-right">
                              <Badge
                                variant="secondary"
                                className={
                                  staff.slaRate >= 95
                                    ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
                                    : staff.slaRate >= 90
                                    ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                                    : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                                }
                              >
                                {staff.slaRate}%
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right font-mono">{staff.revenue.toLocaleString()} THB</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
