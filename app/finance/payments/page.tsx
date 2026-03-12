"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Banknote,
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  CreditCard,
  Building,
  Wallet,
  TrendingUp,
  TrendingDown,
  Receipt,
  Calendar,
  FileText,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

type PaymentStatus = "PAID" | "PENDING" | "PARTIAL" | "OVERDUE" | "REFUNDED" | "CANCELLED"
type PaymentMethod = "CASH" | "TRANSFER" | "CARD" | "CHEQUE"

interface Payment {
  id: string
  invoiceNo: string
  caseId: string
  customer: string
  customerType: "COMPANY" | "INDIVIDUAL"
  partner: string
  amount: number
  paidAmount: number
  status: PaymentStatus
  method: PaymentMethod | null
  dueDate: string
  paidDate: string | null
  createdAt: string
}

const mockPayments: Payment[] = [
  {
    id: "1",
    invoiceNo: "INV-2024-0001",
    caseId: "HQ-KS-110326-0001",
    customer: "ABC Corporation Ltd.",
    customerType: "COMPANY",
    partner: "Immigration Pro",
    amount: 25000,
    paidAmount: 25000,
    status: "PAID",
    method: "TRANSFER",
    dueDate: "2024-03-15",
    paidDate: "2024-03-10",
    createdAt: "2024-03-01",
  },
  {
    id: "2",
    invoiceNo: "INV-2024-0002",
    caseId: "HQ-WP-110326-0002",
    customer: "John Smith",
    customerType: "INDIVIDUAL",
    partner: "Visa Express",
    amount: 15000,
    paidAmount: 7500,
    status: "PARTIAL",
    method: "CASH",
    dueDate: "2024-03-20",
    paidDate: null,
    createdAt: "2024-03-05",
  },
  {
    id: "3",
    invoiceNo: "INV-2024-0003",
    caseId: "HQ-90D-110326-0003",
    customer: "XYZ Holdings",
    customerType: "COMPANY",
    partner: "Direct",
    amount: 8000,
    paidAmount: 0,
    status: "PENDING",
    method: null,
    dueDate: "2024-03-25",
    paidDate: null,
    createdAt: "2024-03-08",
  },
  {
    id: "4",
    invoiceNo: "INV-2024-0004",
    caseId: "HQ-VISA-110326-0004",
    customer: "Jane Doe",
    customerType: "INDIVIDUAL",
    partner: "Immigration Pro",
    amount: 35000,
    paidAmount: 0,
    status: "OVERDUE",
    method: null,
    dueDate: "2024-03-01",
    paidDate: null,
    createdAt: "2024-02-15",
  },
  {
    id: "5",
    invoiceNo: "INV-2024-0005",
    caseId: "HQ-TM30-110326-0005",
    customer: "Global Tech Inc.",
    customerType: "COMPANY",
    partner: "Visa Express",
    amount: 12000,
    paidAmount: 12000,
    status: "PAID",
    method: "CARD",
    dueDate: "2024-03-12",
    paidDate: "2024-03-11",
    createdAt: "2024-03-02",
  },
  {
    id: "6",
    invoiceNo: "INV-2024-0006",
    caseId: "HQ-KS-110326-0006",
    customer: "Mike Johnson",
    customerType: "INDIVIDUAL",
    partner: "Direct",
    amount: 18000,
    paidAmount: 18000,
    status: "REFUNDED",
    method: "TRANSFER",
    dueDate: "2024-03-18",
    paidDate: "2024-03-15",
    createdAt: "2024-03-10",
  },
]

const statusConfig: Record<PaymentStatus, { label: string; icon: React.ElementType; className: string }> = {
  PAID: { label: "Paid", icon: CheckCircle2, className: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300" },
  PENDING: { label: "Pending", icon: Clock, className: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300" },
  PARTIAL: { label: "Partial", icon: AlertCircle, className: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300" },
  OVERDUE: { label: "Overdue", icon: XCircle, className: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300" },
  REFUNDED: { label: "Refunded", icon: Receipt, className: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300" },
  CANCELLED: { label: "Cancelled", icon: XCircle, className: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300" },
}

const methodConfig: Record<PaymentMethod, { label: string; icon: React.ElementType }> = {
  CASH: { label: "Cash", icon: Wallet },
  TRANSFER: { label: "Bank Transfer", icon: Building },
  CARD: { label: "Credit Card", icon: CreditCard },
  CHEQUE: { label: "Cheque", icon: FileText },
}

function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const config = statusConfig[status]
  const Icon = config.icon
  return (
    <Badge variant="secondary" className={`${config.className} gap-1`}>
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  )
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue,
  iconBg,
}: {
  title: string
  value: string
  subtitle: string
  icon: React.ReactNode
  trend?: "up" | "down"
  trendValue?: string
  iconBg: string
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-semibold tracking-tight">{value}</p>
            <div className="flex items-center gap-2">
              {trend && (
                <span className={`flex items-center text-xs ${trend === "up" ? "text-green-600" : "text-red-600"}`}>
                  {trend === "up" ? <TrendingUp className="h-3 w-3 mr-0.5" /> : <TrendingDown className="h-3 w-3 mr-0.5" />}
                  {trendValue}
                </span>
              )}
              <span className="text-xs text-muted-foreground">{subtitle}</span>
            </div>
          </div>
          <div className={`p-2.5 rounded-lg ${iconBg}`}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function PaymentsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [recordPaymentOpen, setRecordPaymentOpen] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const { setTheme, theme } = useTheme()

  const handleToggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  // Filter payments
  const filteredPayments = mockPayments.filter((payment) => {
    const matchesSearch =
      payment.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.caseId.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "pending" && (payment.status === "PENDING" || payment.status === "PARTIAL")) ||
      (activeTab === "paid" && payment.status === "PAID") ||
      (activeTab === "overdue" && payment.status === "OVERDUE")
    return matchesSearch && matchesStatus && matchesTab
  })

  // Calculate stats
  const totalRevenue = mockPayments.reduce((sum, p) => sum + p.paidAmount, 0)
  const pendingAmount = mockPayments
    .filter((p) => p.status === "PENDING" || p.status === "PARTIAL")
    .reduce((sum, p) => sum + (p.amount - p.paidAmount), 0)
  const overdueAmount = mockPayments
    .filter((p) => p.status === "OVERDUE")
    .reduce((sum, p) => sum + p.amount, 0)
  const thisMonthRevenue = mockPayments
    .filter((p) => p.status === "PAID" && p.paidDate?.startsWith("2024-03"))
    .reduce((sum, p) => sum + p.paidAmount, 0)

  return (
    <div className="flex h-screen bg-muted/30">
      <Sidebar
        activeItem="Payments"
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          breadcrumb="Finance / Payments"
          onMenuClick={() => setMobileMenuOpen(true)}
          onToggleTheme={handleToggleTheme}
        />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold text-foreground">Payments</h1>
                <p className="text-muted-foreground">Manage invoices and track payment status</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Dialog open={recordPaymentOpen} onOpenChange={setRecordPaymentOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Record Payment
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Record Payment</DialogTitle>
                      <DialogDescription>
                        Record a new payment for an existing invoice
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Invoice Number</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select invoice" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockPayments
                              .filter((p) => p.status !== "PAID")
                              .map((p) => (
                                <SelectItem key={p.id} value={p.invoiceNo}>
                                  {p.invoiceNo} - {p.customer}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Amount (THB)</label>
                        <Input type="number" placeholder="0.00" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Payment Method</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="CASH">Cash</SelectItem>
                            <SelectItem value="TRANSFER">Bank Transfer</SelectItem>
                            <SelectItem value="CARD">Credit Card</SelectItem>
                            <SelectItem value="CHEQUE">Cheque</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Payment Date</label>
                        <Input type="date" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Reference / Notes</label>
                        <Input placeholder="Transaction reference or notes" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setRecordPaymentOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => setRecordPaymentOpen(false)}>Record Payment</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Total Revenue"
                value={`${totalRevenue.toLocaleString()} THB`}
                subtitle="All time"
                trend="up"
                trendValue="+12%"
                icon={<Banknote className="h-5 w-5 text-green-600" />}
                iconBg="bg-green-100 dark:bg-green-950"
              />
              <StatCard
                title="This Month"
                value={`${thisMonthRevenue.toLocaleString()} THB`}
                subtitle="March 2024"
                trend="up"
                trendValue="+8%"
                icon={<Calendar className="h-5 w-5 text-indigo-600" />}
                iconBg="bg-indigo-100 dark:bg-indigo-950"
              />
              <StatCard
                title="Pending"
                value={`${pendingAmount.toLocaleString()} THB`}
                subtitle={`${mockPayments.filter((p) => p.status === "PENDING" || p.status === "PARTIAL").length} invoices`}
                icon={<Clock className="h-5 w-5 text-amber-600" />}
                iconBg="bg-amber-100 dark:bg-amber-950"
              />
              <StatCard
                title="Overdue"
                value={`${overdueAmount.toLocaleString()} THB`}
                subtitle={`${mockPayments.filter((p) => p.status === "OVERDUE").length} invoices`}
                icon={<AlertCircle className="h-5 w-5 text-red-600" />}
                iconBg="bg-red-100 dark:bg-red-950"
              />
            </div>

            {/* Table Card */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList>
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="pending">Pending</TabsTrigger>
                      <TabsTrigger value="paid">Paid</TabsTrigger>
                      <TabsTrigger value="overdue">Overdue</TabsTrigger>
                    </TabsList>
                  </Tabs>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search invoices..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 w-[200px]"
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[140px]">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="PAID">Paid</SelectItem>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="PARTIAL">Partial</SelectItem>
                        <SelectItem value="OVERDUE">Overdue</SelectItem>
                        <SelectItem value="REFUNDED">Refunded</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Case</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">Paid</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.map((payment) => (
                      <TableRow key={payment.id} className="hover:bg-muted/50">
                        <TableCell>
                          <span className="font-mono text-sm font-medium">{payment.invoiceNo}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-7 w-7">
                              <AvatarFallback className="text-xs bg-indigo-100 text-indigo-600 dark:bg-indigo-950">
                                {payment.customer.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{payment.customer}</p>
                              <p className="text-xs text-muted-foreground">{payment.partner}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Link
                            href={`/cases/${payment.caseId}`}
                            className="text-sm text-indigo-600 hover:underline font-mono"
                          >
                            {payment.caseId}
                          </Link>
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {payment.amount.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {payment.paidAmount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <PaymentStatusBadge status={payment.status} />
                        </TableCell>
                        <TableCell>
                          {payment.method ? (
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                              {(() => {
                                const Icon = methodConfig[payment.method].icon
                                return <Icon className="h-3.5 w-3.5" />
                              })()}
                              {methodConfig[payment.method].label}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(payment.dueDate).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Receipt className="h-4 w-4 mr-2" />
                                Print Invoice
                              </DropdownMenuItem>
                              {payment.status !== "PAID" && (
                                <DropdownMenuItem onClick={() => setRecordPaymentOpen(true)}>
                                  <Banknote className="h-4 w-4 mr-2" />
                                  Record Payment
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <XCircle className="h-4 w-4 mr-2" />
                                Cancel Invoice
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                <div className="flex items-center justify-between px-4 py-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    Showing <span className="font-medium">{filteredPayments.length}</span> of{" "}
                    <span className="font-medium">{mockPayments.length}</span> invoices
                  </p>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" disabled>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="w-8 bg-indigo-600 text-white hover:bg-indigo-700">
                      1
                    </Button>
                    <Button variant="outline" size="sm" disabled>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
