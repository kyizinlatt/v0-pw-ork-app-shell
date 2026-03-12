"use client"

import { useState } from "react"
import {
  Sheet,
  SheetContent,
  SheetClose,
} from "@/components/ui/sheet"
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
} from "lucide-react"

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
  slaRemaining: "14d left",
  submittedDate: null,
  assignedStaff: "SRP Admin",
  organization: "HQ — SRP Head Office",
  publicToken: "abc123xyz",
  createdAt: "11 Mar 2026, 09:00",
  updatedAt: "2 hours ago",
  timeline: [
    { id: 1, action: "SRP Admin advanced to Checking", time: "2 hours ago" },
    { id: 2, action: "SRP Admin received case", time: "3 hours ago" },
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
      content: "I will upload it shortly.",
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
    { id: 1, name: "passport-copy.pdf", type: "pdf", uploader: "SRP Admin", time: "2 hours ago" },
    { id: 2, name: "photo.jpg", type: "image", uploader: "SRP Admin", time: "2 hours ago" },
  ],
  finance: {
    total: "7,500.00",
    partnerCost: "5,500.00",
    paid: "7,500.00",
    outstanding: "0.00",
  },
}

interface CaseDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  caseId: string | null
}

export function CaseDrawer({ open, onOpenChange }: CaseDrawerProps) {
  const [messageText, setMessageText] = useState("")
  const caseData = sampleCase

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[60vw] max-w-[60vw] overflow-y-auto p-0 flex flex-col"
      >
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
        <div className="flex-1 overflow-y-auto divide-y divide-border">
          {/* Customer Section */}
          <DrawerSection title="Customer">
            <PropertyList>
              <PropertyRow label="Full Name" value={caseData.customer.fullName} />
              <PropertyRow label="Type" value={caseData.customer.type} />
              <PropertyRow label="Phone" value={caseData.customer.phone} />
              <PropertyRow label="Email" value={caseData.customer.email} />
            </PropertyList>
          </DrawerSection>

          {/* Service & SLA Section */}
          <DrawerSection title="Service & SLA">
            <PropertyList>
              <PropertyRow
                label="Service"
                value={`${caseData.service.code} — ${caseData.service.name}`}
              />
              <PropertyRow label="SLA Days" value={`${caseData.service.slaDays} days`} />
              <PropertyRow
                label="Due Date"
                value={
                  <span className="text-amber-600 font-medium">
                    {caseData.slaDue}{" "}
                    <span className="text-xs">({caseData.slaRemaining})</span>
                  </span>
                }
              />
              <PropertyRow
                label="Submitted"
                value={caseData.submittedDate || "Not yet submitted"}
              />
            </PropertyList>
          </DrawerSection>

          {/* Status Actions Section */}
          <DrawerSection title="Actions">
            <div className="flex items-center gap-3">
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
          </DrawerSection>

          {/* Assigned Staff Section */}
          <DrawerSection title="Assigned">
            <PropertyList>
              <PropertyRow label="PWIN Staff" value={caseData.assignedStaff} />
            </PropertyList>
            <Button variant="outline" size="sm" className="mt-3">
              Reassign
            </Button>
          </DrawerSection>

          {/* Timeline Section */}
          <DrawerSection title="Timeline">
            <div className="relative border-l-2 border-border ml-2 pl-4 space-y-4">
              {caseData.timeline.map((event) => (
                <div key={event.id} className="relative">
                  <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-indigo-500 border-2 border-background" />
                  <p className="text-sm text-foreground">{event.action}</p>
                  <p className="text-xs text-muted-foreground">{event.time}</p>
                </div>
              ))}
            </div>
          </DrawerSection>

          {/* Messages Section */}
          <DrawerSection title="Messages">
            <div className="space-y-3 mb-4">
              {caseData.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn("flex", msg.isOwn ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "max-w-[70%] px-4 py-2 text-sm leading-relaxed",
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
                className="resize-none"
                rows={2}
              />
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white self-end">
                <Send className="size-4" />
              </Button>
            </div>
          </DrawerSection>

          {/* Block Notes Section */}
          <DrawerSection title="Block Notes">
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
          </DrawerSection>

          {/* Documents Section */}
          <DrawerSection title="Documents">
            <div className="space-y-2">
              {caseData.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center gap-3 py-2.5 border-b border-border last:border-0"
                >
                  <div className="flex-shrink-0">
                    {doc.type === "pdf" ? (
                      <FileText className="size-8 text-red-500" />
                    ) : (
                      <ImageIcon className="size-8 text-blue-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {doc.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {doc.uploader} · {doc.time}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Download className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" className="mt-3">
              <Upload className="size-4 mr-2" />
              Upload Document
            </Button>
          </DrawerSection>

          {/* Finance Section */}
          <DrawerSection title="Finance">
            <div className="bg-muted rounded-lg p-4 border border-border">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Total</p>
                  <p className="text-sm font-medium text-foreground">
                    ฿{caseData.finance.total}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Partner Cost</p>
                  <p className="text-sm font-medium text-foreground">
                    ฿{caseData.finance.partnerCost}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Paid</p>
                  <p className="text-sm font-medium text-green-600">
                    ฿{caseData.finance.paid}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Outstanding</p>
                  <p className="text-sm font-medium text-foreground">
                    ฿{caseData.finance.outstanding}
                  </p>
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" className="mt-3">
              Record Payment
            </Button>
          </DrawerSection>

          {/* Quick Info Section */}
          <DrawerSection title="Quick Info">
            <PropertyList>
              <PropertyRow label="Organization" value={caseData.organization} />
              <PropertyRow
                label="Public Token"
                value={
                  <div className="flex items-center gap-2">
                    <code className="text-xs font-mono bg-muted px-2 py-0.5 rounded">
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
          </DrawerSection>
        </div>
      </SheetContent>
    </Sheet>
  )
}

// Helper Components
function DrawerSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="px-6 py-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        {title}
      </p>
      {children}
    </section>
  )
}

function PropertyList({ children }: { children: React.ReactNode }) {
  return <div className="divide-y divide-border">{children}</div>
}

function PropertyRow({
  label,
  value,
}: {
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="flex min-h-[36px] items-center gap-4 pl-0">
      <span className="w-[140px] flex-shrink-0 text-sm text-muted-foreground">
        {label}
      </span>
      <span className="text-sm text-foreground font-medium">{value}</span>
    </div>
  )
}
