"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { StatusBadge, type CaseStatus } from "@/components/status-badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  FileText,
  Image as ImageIcon,
  Download,
  Upload,
  Copy,
  Send,
  User,
  Clock,
  MessageSquare,
  StickyNote,
  File,
  DollarSign,
  Info,
  Zap,
  ExternalLink,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Sample case data
const sampleCase = {
  id: "1",
  caseNumber: "HQ-KS-110326-0001",
  status: "CHECKING" as CaseStatus,
  customer: {
    fullName: "Win Tun",
    type: "INDIVIDUAL",
    phone: "+66 81 234 5678",
    email: "wintun@example.com",
    passportNumber: "A12345678",
    nationality: "Myanmar",
    dateOfBirth: "15 Jan 1990",
  },
  service: {
    code: "KS",
    name: "Kyant Sal",
    slaDays: 14,
    price: "7,500.00",
    partnerCost: "5,500.00",
  },
  slaDue: "Mar 25, 2026",
  slaRemaining: 10,
  slaTotalDays: 14,
  submittedDate: null,
  assignedStaff: "SRP Admin",
  organization: "HQ - SRP Head Office",
  publicToken: "abc123xyz",
  createdAt: "11 Mar 2026, 09:00",
  updatedAt: "2 hours ago",
  timeline: [
    { id: 1, action: "SRP Admin advanced to Checking", time: "2 hours ago", type: "status" },
    { id: 2, action: "SRP Admin received case", time: "3 hours ago", type: "status" },
    { id: 3, action: "Case created by system", time: "3 hours ago", type: "create" },
  ],
  messages: [
    {
      id: 1,
      sender: "SRP Admin",
      content: "Please provide passport copy for verification.",
      isOwn: true,
      time: "2 hours ago",
    },
    {
      id: 2,
      sender: "Win Tun",
      content: "I will upload it shortly. Thank you for the quick response!",
      isOwn: false,
      time: "1 hour ago",
    },
  ],
  blockNotes: [
    {
      id: 1,
      content: "Customer mentioned they need expedited processing due to travel plans.",
      author: "SRP Admin",
      time: "1 hour ago",
    },
  ],
  documents: [
    { id: 1, name: "passport-copy.pdf", type: "pdf", uploader: "SRP Admin", time: "2 hours ago", size: "1.2 MB" },
    { id: 2, name: "photo.jpg", type: "image", uploader: "SRP Admin", time: "2 hours ago", size: "450 KB" },
    { id: 3, name: "application-form.pdf", type: "pdf", uploader: "System", time: "3 hours ago", size: "320 KB" },
  ],
  finance: {
    total: "7,500.00",
    partnerCost: "5,500.00",
    paid: "7,500.00",
    outstanding: "0.00",
    currency: "THB",
    transactions: [
      { id: 1, type: "Payment", amount: "7,500.00", method: "Bank Transfer", date: "11 Mar 2026", reference: "TRX-001" },
    ],
  },
}

export default function CaseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [messageText, setMessageText] = useState("")
  const [activeTab, setActiveTab] = useState("overview")

  const caseData = sampleCase
  const slaPercentage = ((caseData.slaTotalDays - caseData.slaRemaining) / caseData.slaTotalDays) * 100

  return (
    <div className="flex h-screen bg-background font-sans overflow-hidden">
      <Sidebar
        activeItem="Cases"
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header
          breadcrumb={`Cases / ${caseData.caseNumber}`}
          onMenuClick={() => setMobileMenuOpen(true)}
        />

        <main className="flex-1 overflow-y-auto">
          {/* Case Header */}
          <div className="border-b border-border bg-background sticky top-0 z-10">
            <div className="px-6 py-4">
              <div className="flex items-center gap-3 mb-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/")}
                  className="gap-1.5"
                >
                  <ArrowLeft className="size-4" />
                  Back
                </Button>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <h1 className="text-2xl font-bold tracking-tight text-foreground font-mono">
                    {caseData.caseNumber}
                  </h1>
                  <StatusBadge status={caseData.status} />
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <RotateCcw className="size-3.5 mr-1.5" />
                    Return
                  </Button>
                  <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                    <ArrowRight className="size-3.5 mr-1.5" />
                    Submit to Partner
                  </Button>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="px-6 pt-1">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="h-10 bg-muted/50 p-1 rounded-lg">
                  {[
                    { value: "overview", label: "Overview", count: null },
                    { value: "documents", label: "Documents", count: caseData.documents.length },
                    { value: "messages", label: "Messages", count: caseData.messages.length },
                    { value: "finance", label: "Finance", count: null },
                    { value: "timeline", label: "Timeline", count: null },
                  ].map((tab) => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="h-8 px-3 text-sm font-medium rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm"
                    >
                      {tab.label}
                      {tab.count !== null && (
                        <span className="ml-1.5 text-xs text-muted-foreground">{tab.count}</span>
                      )}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              {/* Overview Tab */}
              <TabsContent value="overview" className="m-0">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column - 2 cols */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Customer Info Card */}
                    <Card className="border-0 shadow-sm bg-card">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                          Customer
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                          <PropertyRow label="Full Name" value={caseData.customer.fullName} />
                          <PropertyRow label="Type" value={caseData.customer.type} />
                          <PropertyRow label="Phone" value={caseData.customer.phone} copyable />
                          <PropertyRow label="Email" value={caseData.customer.email} copyable />
                          <PropertyRow label="Passport" value={caseData.customer.passportNumber} copyable />
                          <PropertyRow label="Nationality" value={caseData.customer.nationality} />
                          <PropertyRow label="Date of Birth" value={caseData.customer.dateOfBirth} />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Service & SLA Card */}
                    <Card className="border-0 shadow-sm bg-card">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                          Service & SLA
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="grid grid-cols-2 gap-x-6 gap-y-3 mb-4">
                          <PropertyRow label="Service" value={`${caseData.service.code} - ${caseData.service.name}`} />
                          <PropertyRow label="SLA Days" value={`${caseData.service.slaDays} days`} />
                          <PropertyRow label="Price" value={`฿${caseData.service.price}`} />
                          <PropertyRow label="Partner Cost" value={`฿${caseData.service.partnerCost}`} />
                        </div>
                        <div className="p-4 bg-muted/50 rounded-lg border border-border">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-foreground">SLA Progress</span>
                            <span className={cn(
                              "text-sm font-semibold",
                              slaPercentage > 70 ? "text-amber-600" : "text-green-600"
                            )}>
                              {caseData.slaRemaining}d remaining
                            </span>
                          </div>
                          <Progress value={slaPercentage} className="h-2" />
                          <p className="text-xs text-muted-foreground mt-2">
                            Due: {caseData.slaDue}
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Block Notes Card */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                          <StickyNote className="size-4 text-muted-foreground" />
                          Internal Notes
                          <span className="text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full ml-1">
                            {caseData.blockNotes.length}
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {caseData.blockNotes.map((note) => (
                            <div
                              key={note.id}
                              className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-lg p-3"
                            >
                              <p className="text-sm text-foreground">{note.content}</p>
                              <p className="text-xs text-muted-foreground mt-2">
                                {note.author} - {note.time}
                              </p>
                            </div>
                          ))}
                        </div>
                        <Button variant="outline" size="sm" className="mt-3">
                          + Add Note
                        </Button>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Right Column - 1 col */}
                  <div className="space-y-6">
                    {/* Assigned Card */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold">Assigned Staff</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                            <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">SA</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{caseData.assignedStaff}</p>
                            <p className="text-xs text-muted-foreground">PWIN Staff</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="mt-3 w-full">
                          Reassign
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Quick Info Card */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                          <Info className="size-4 text-muted-foreground" />
                          Quick Info
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <PropertyRow label="Organization" value={caseData.organization} vertical />
                        <PropertyRow
                          label="Public Token"
                          value={
                            <div className="flex items-center gap-2">
                              <code className="text-xs font-mono bg-muted px-2 py-1 rounded">
                                {caseData.publicToken}
                              </code>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <Copy className="size-3" />
                              </Button>
                            </div>
                          }
                          vertical
                        />
                        <PropertyRow label="Created" value={caseData.createdAt} vertical />
                        <PropertyRow label="Updated" value={caseData.updatedAt} vertical />
                      </CardContent>
                    </Card>

                    {/* Recent Documents Preview */}
                    <Card>
                      <CardHeader className="pb-3 flex flex-row items-center justify-between">
                        <CardTitle className="text-base font-semibold">Recent Documents</CardTitle>
                        <Button variant="ghost" size="sm" onClick={() => setActiveTab("documents")}>
                          View all
                        </Button>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {caseData.documents.slice(0, 2).map((doc) => (
                            <div
                              key={doc.id}
                              className="flex items-center gap-3 p-2 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                            >
                              <div className="flex-shrink-0">
                                {doc.type === "pdf" ? (
                                  <div className="w-8 h-8 rounded bg-red-100 dark:bg-red-950 flex items-center justify-center">
                                    <FileText className="size-4 text-red-600 dark:text-red-400" />
                                  </div>
                                ) : (
                                  <div className="w-8 h-8 rounded bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
                                    <ImageIcon className="size-4 text-blue-600 dark:text-blue-400" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">{doc.name}</p>
                                <p className="text-xs text-muted-foreground">{doc.size}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Documents Tab */}
              <TabsContent value="documents" className="m-0">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base font-semibold">All Documents</CardTitle>
                    <Button variant="outline" size="sm">
                      <Upload className="size-4 mr-2" />
                      Upload Document
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {caseData.documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors group"
                        >
                          <div className="flex-shrink-0">
                            {doc.type === "pdf" ? (
                              <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-950 flex items-center justify-center">
                                <FileText className="size-5 text-red-600 dark:text-red-400" />
                              </div>
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
                                <ImageIcon className="size-5 text-blue-600 dark:text-blue-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{doc.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {doc.size} - {doc.uploader} - {doc.time}
                            </p>
                          </div>
                          <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <Download className="size-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Messages Tab */}
              <TabsContent value="messages" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base font-semibold">Conversation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
                      {caseData.messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={cn("flex", msg.isOwn ? "justify-end" : "justify-start")}
                        >
                          <div
                            className={cn(
                              "max-w-[70%] px-4 py-2.5 text-sm leading-relaxed",
                              msg.isOwn
                                ? "bg-indigo-600 text-white rounded-2xl rounded-tr-sm"
                                : "bg-muted text-foreground rounded-2xl rounded-tl-sm"
                            )}
                          >
                            {!msg.isOwn && (
                              <span className="block text-xs text-muted-foreground mb-1 font-medium">
                                {msg.sender}
                              </span>
                            )}
                            {msg.content}
                            <span
                              className={cn(
                                "block text-[10px] mt-1 text-right",
                                msg.isOwn ? "text-indigo-200" : "text-muted-foreground"
                              )}
                            >
                              {msg.time}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Type a message..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        className="resize-none min-h-[80px]"
                        rows={2}
                      />
                      <Button className="bg-indigo-600 hover:bg-indigo-700 text-white self-end">
                        <Send className="size-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Finance Tab */}
              <TabsContent value="finance" className="m-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base font-semibold">Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <FinanceCard label="Total" value={caseData.finance.total} currency={caseData.finance.currency} />
                        <FinanceCard label="Partner Cost" value={caseData.finance.partnerCost} currency={caseData.finance.currency} />
                        <FinanceCard label="Paid" value={caseData.finance.paid} currency={caseData.finance.currency} variant="success" />
                        <FinanceCard label="Outstanding" value={caseData.finance.outstanding} currency={caseData.finance.currency} variant={parseFloat(caseData.finance.outstanding.replace(",", "")) > 0 ? "warning" : "default"} />
                      </div>
                      <Button variant="outline" size="sm" className="mt-4">
                        Record Payment
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base font-semibold">Transactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {caseData.finance.transactions.map((tx) => (
                          <div key={tx.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                            <div>
                              <p className="text-sm font-medium text-foreground">{tx.type}</p>
                              <p className="text-xs text-muted-foreground">{tx.method} - {tx.date}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-semibold text-green-600">+฿{tx.amount}</p>
                              <p className="text-xs text-muted-foreground">{tx.reference}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Timeline Tab */}
              <TabsContent value="timeline" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base font-semibold">Activity Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative border-l-2 border-border ml-2 pl-6 space-y-6">
                      {caseData.timeline.map((event) => (
                        <div key={event.id} className="relative">
                          <div className={cn(
                            "absolute -left-[29px] top-1 w-3 h-3 rounded-full border-2 border-background",
                            event.type === "status" ? "bg-indigo-500" : "bg-muted-foreground"
                          )} />
                          <p className="text-sm font-medium text-foreground">{event.action}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{event.time}</p>
                        </div>
                      ))}
                    </div>
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

// Helper Components
function PropertyRow({
  label,
  value,
  copyable,
  vertical,
}: {
  label: string
  value: React.ReactNode
  copyable?: boolean
  vertical?: boolean
}) {
  if (vertical) {
    return (
      <div>
        <span className="text-xs text-muted-foreground block mb-1">{label}</span>
        <span className="text-sm text-foreground font-medium flex items-center gap-1">
          {value}
          {copyable && typeof value === "string" && (
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 opacity-50 hover:opacity-100"
              onClick={() => navigator.clipboard.writeText(value)}
            >
              <Copy className="size-3" />
            </Button>
          )}
        </span>
      </div>
    )
  }

  return (
    <div className="flex min-h-[32px] items-center gap-4">
      <span className="w-[100px] flex-shrink-0 text-sm text-muted-foreground">
        {label}
      </span>
      <span className="text-sm text-foreground font-medium flex items-center gap-1">
        {value}
        {copyable && typeof value === "string" && (
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 opacity-50 hover:opacity-100"
            onClick={() => navigator.clipboard.writeText(value)}
          >
            <Copy className="size-3" />
          </Button>
        )}
      </span>
    </div>
  )
}

function FinanceCard({
  label,
  value,
  currency,
  variant = "default",
}: {
  label: string
  value: string
  currency: string
  variant?: "default" | "success" | "warning"
}) {
  return (
    <div className="bg-muted/50 rounded-lg p-3 border border-border">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={cn(
        "text-lg font-semibold mt-0.5",
        variant === "success" && "text-green-600",
        variant === "warning" && "text-amber-600",
        variant === "default" && "text-foreground"
      )}>
        {currency === "THB" ? "฿" : "$"}{value}
      </p>
    </div>
  )
}
