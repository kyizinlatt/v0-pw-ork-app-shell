"use client"

import { useState } from "react"
import {
  Sheet,
  SheetContent,
  SheetClose,
  SheetTitle,
} from "@/components/ui/sheet"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { StatusBadge, type CaseStatus } from "@/components/status-badge"
import { cn } from "@/lib/utils"
import {
  ExternalLink,
  X,
  ArrowRight,
  RotateCcw,
  FileText,
  Image as ImageIcon,
  Download,
  Upload,
  Copy,
  Send,
  ChevronDown,
  ChevronRight,
  User,
  Clock,
  MessageSquare,
  StickyNote,
  File,
  DollarSign,
  Info,
  Zap,
} from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Progress } from "@/components/ui/progress"

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
  },
  service: {
    code: "KS",
    name: "Kyant Sal",
    slaDays: 14,
  },
  slaDue: "Mar 25, 2026",
  slaRemaining: 10,
  slaTotalDays: 14,
  submittedDate: null,
  assignedStaff: "SRP Admin",
  organization: "HQ — SRP Head Office",
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
  ],
  finance: {
    total: "7,500.00",
    partnerCost: "5,500.00",
    paid: "7,500.00",
    outstanding: "0.00",
    currency: "THB",
  },
}

interface CaseDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  caseId: string | null
}

export function CaseDrawer({ open, onOpenChange }: CaseDrawerProps) {
  const [messageText, setMessageText] = useState("")
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    customer: true,
    service: true,
    actions: true,
    assigned: false,
    timeline: true,
    messages: true,
    notes: false,
    documents: true,
    finance: false,
    info: false,
  })
  const caseData = sampleCase

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const slaPercentage = ((caseData.slaTotalDays - caseData.slaRemaining) / caseData.slaTotalDays) * 100

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[60vw] max-w-[60vw] overflow-y-auto p-0 flex flex-col"
      >
        <VisuallyHidden>
          <SheetTitle>Case {caseData.caseNumber}</SheetTitle>
        </VisuallyHidden>

        {/* Sticky Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background px-6 py-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="font-mono font-semibold tracking-tight text-foreground">
              {caseData.caseNumber}
            </span>
            <StatusBadge status={caseData.status} />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(`/cases/${caseData.id}`, "_blank")}
            >
              <ExternalLink className="size-4 mr-1.5" />
              Open
            </Button>
            <SheetClose asChild>
              <Button variant="ghost" size="icon">
                <X className="size-4" />
              </Button>
            </SheetClose>
          </div>
        </div>

        {/* Scrollable Sections */}
        <div className="flex-1 overflow-y-auto">
          {/* Customer Section */}
          <CollapsibleSection
            title="Customer"
            icon={<User className="size-4" />}
            open={expandedSections.customer}
            onToggle={() => toggleSection("customer")}
          >
            <PropertyList>
              <PropertyRow label="Full Name" value={caseData.customer.fullName} />
              <PropertyRow label="Type" value={caseData.customer.type} />
              <PropertyRow label="Phone" value={caseData.customer.phone} copyable />
              <PropertyRow label="Email" value={caseData.customer.email} copyable />
            </PropertyList>
          </CollapsibleSection>

          {/* Service & SLA Section */}
          <CollapsibleSection
            title="Service & SLA"
            icon={<Clock className="size-4" />}
            open={expandedSections.service}
            onToggle={() => toggleSection("service")}
          >
            <PropertyList>
              <PropertyRow
                label="Service"
                value={`${caseData.service.code} — ${caseData.service.name}`}
              />
              <PropertyRow label="SLA Days" value={`${caseData.service.slaDays} days`} />
            </PropertyList>
            <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">SLA Progress</span>
                <span className={cn(
                  "text-sm font-semibold",
                  slaPercentage > 70 ? "text-amber-600" : "text-green-600"
                )}>
                  {caseData.slaRemaining}d remaining
                </span>
              </div>
              <Progress 
                value={slaPercentage} 
                className="h-2"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Due: {caseData.slaDue}
              </p>
            </div>
          </CollapsibleSection>

          {/* Status Actions Section */}
          <CollapsibleSection
            title="Actions"
            icon={<Zap className="size-4" />}
            open={expandedSections.actions}
            onToggle={() => toggleSection("actions")}
            highlight
          >
            <div className="flex flex-wrap items-center gap-3">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                <ArrowRight className="size-4 mr-2" />
                Submit to Embassy
              </Button>
              <Button variant="outline">
                <RotateCcw className="size-4 mr-2" />
                Return
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Transition will be recorded in timeline
            </p>
          </CollapsibleSection>

          {/* Assigned Staff Section */}
          <CollapsibleSection
            title="Assigned"
            icon={<User className="size-4" />}
            open={expandedSections.assigned}
            onToggle={() => toggleSection("assigned")}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">SA</span>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{caseData.assignedStaff}</p>
                <p className="text-xs text-muted-foreground">PWIN Staff</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="mt-3">
              Reassign
            </Button>
          </CollapsibleSection>

          {/* Timeline Section */}
          <CollapsibleSection
            title="Timeline"
            icon={<Clock className="size-4" />}
            open={expandedSections.timeline}
            onToggle={() => toggleSection("timeline")}
            badge={caseData.timeline.length}
          >
            <div className="relative border-l-2 border-border ml-2 pl-4 space-y-4">
              {caseData.timeline.map((event) => (
                <div key={event.id} className="relative">
                  <div className={cn(
                    "absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-background",
                    event.type === "status" ? "bg-indigo-500" : "bg-muted-foreground"
                  )} />
                  <p className="text-sm text-foreground">{event.action}</p>
                  <p className="text-xs text-muted-foreground">{event.time}</p>
                </div>
              ))}
            </div>
          </CollapsibleSection>

          {/* Messages Section */}
          <CollapsibleSection
            title="Messages"
            icon={<MessageSquare className="size-4" />}
            open={expandedSections.messages}
            onToggle={() => toggleSection("messages")}
            badge={caseData.messages.length}
          >
            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {caseData.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn("flex", msg.isOwn ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "max-w-[80%] px-4 py-2.5 text-sm leading-relaxed",
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
          </CollapsibleSection>

          {/* Block Notes Section */}
          <CollapsibleSection
            title="Block Notes"
            icon={<StickyNote className="size-4" />}
            open={expandedSections.notes}
            onToggle={() => toggleSection("notes")}
            badge={caseData.blockNotes.length}
          >
            <div className="space-y-3">
              {caseData.blockNotes.map((note) => (
                <div
                  key={note.id}
                  className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-lg p-3"
                >
                  <p className="text-sm text-foreground">{note.content}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {note.author} · {note.time}
                  </p>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" className="mt-3">
              + Add Note
            </Button>
          </CollapsibleSection>

          {/* Documents Section */}
          <CollapsibleSection
            title="Documents"
            icon={<File className="size-4" />}
            open={expandedSections.documents}
            onToggle={() => toggleSection("documents")}
            badge={caseData.documents.length}
          >
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
                    <p className="text-sm font-medium text-foreground truncate">
                      {doc.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {doc.size} · {doc.uploader} · {doc.time}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Download className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" className="mt-3">
              <Upload className="size-4 mr-2" />
              Upload Document
            </Button>
          </CollapsibleSection>

          {/* Finance Section */}
          <CollapsibleSection
            title="Finance"
            icon={<DollarSign className="size-4" />}
            open={expandedSections.finance}
            onToggle={() => toggleSection("finance")}
          >
            <div className="grid grid-cols-2 gap-4">
              <FinanceCard label="Total" value={caseData.finance.total} currency={caseData.finance.currency} />
              <FinanceCard label="Partner Cost" value={caseData.finance.partnerCost} currency={caseData.finance.currency} />
              <FinanceCard label="Paid" value={caseData.finance.paid} currency={caseData.finance.currency} variant="success" />
              <FinanceCard label="Outstanding" value={caseData.finance.outstanding} currency={caseData.finance.currency} variant={parseFloat(caseData.finance.outstanding.replace(",", "")) > 0 ? "warning" : "default"} />
            </div>
            <Button variant="outline" size="sm" className="mt-4">
              Record Payment
            </Button>
          </CollapsibleSection>

          {/* Quick Info Section */}
          <CollapsibleSection
            title="Quick Info"
            icon={<Info className="size-4" />}
            open={expandedSections.info}
            onToggle={() => toggleSection("info")}
          >
            <PropertyList>
              <PropertyRow label="Organization" value={caseData.organization} />
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
              />
              <PropertyRow label="Created" value={caseData.createdAt} />
              <PropertyRow label="Updated" value={caseData.updatedAt} />
            </PropertyList>
          </CollapsibleSection>
        </div>
      </SheetContent>
    </Sheet>
  )
}

// Helper Components
interface CollapsibleSectionProps {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
  open: boolean
  onToggle: () => void
  badge?: number
  highlight?: boolean
}

function CollapsibleSection({
  title,
  icon,
  children,
  open,
  onToggle,
  badge,
  highlight,
}: CollapsibleSectionProps) {
  return (
    <Collapsible open={open} onOpenChange={onToggle}>
      <div className={cn(
        "border-b border-border",
        highlight && "bg-indigo-50/50 dark:bg-indigo-950/20"
      )}>
        <CollapsibleTrigger className="flex items-center justify-between w-full px-6 py-4 hover:bg-muted/30 transition-colors">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">{icon}</span>
            <span className="text-sm font-semibold text-foreground">{title}</span>
            {badge !== undefined && badge > 0 && (
              <span className="text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full">
                {badge}
              </span>
            )}
          </div>
          {open ? (
            <ChevronDown className="size-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="size-4 text-muted-foreground" />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-6 pb-5">{children}</div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
}

function PropertyList({ children }: { children: React.ReactNode }) {
  return <div className="space-y-1">{children}</div>
}

function PropertyRow({
  label,
  value,
  copyable,
}: {
  label: string
  value: React.ReactNode
  copyable?: boolean
}) {
  return (
    <div className="flex min-h-[36px] items-center gap-4">
      <span className="w-[120px] flex-shrink-0 text-sm text-muted-foreground">
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
