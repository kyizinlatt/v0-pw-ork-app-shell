"use client"

import { useState, useRef, useEffect, useCallback, useLayoutEffect } from "react"
import Link from "next/link"
import {
  Sheet,
  SheetContent,
  SheetClose,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { StatusBadge, StatusFlow, getAvailableTransitions, type CaseStatus } from "@/components/status-badge"
import { cn } from "@/lib/utils"
import {
  ExternalLink,
  X,
  FileText,
  Image as ImageIcon,
  Download,
  Upload,
  Copy,
  Send,
  ChevronDown,
  ChevronRight,
  User,
  Users,
  Clock,
  MessageSquare,
  StickyNote,
  DollarSign,
  Info,
  Zap,
  GripVertical,
  Building2,
  AlertTriangle,
  Reply,
  Trash2,
  CornerUpLeft,
} from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Sample case data with proper flow structure
const sampleCase = {
  id: "1",
  caseNumber: "HQ-KS-110326-0001",
  status: "SUBMITTED" as CaseStatus,
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
    requiresPartner: true,
  },
  slaDue: "Mar 25, 2026",
  slaRemaining: 10,
  slaTotalDays: 14,
  submittedDate: "11 Mar 2026",
  // Assigned staff - separate PWIN and Partner
  assignedPwinStaff: {
    id: "pwin-1",
    name: "SRP Admin",
    role: "STAFF",
  },
  assignedPartnerStaff: null as null | { id: string; name: string; organization: string; workload: number },
  organization: "HQ - SRP Head Office",
  publicToken: "abc123xyz",
  isPublic: false,
  createdAt: "11 Mar 2026, 09:00",
  updatedAt: "2 hours ago",
  timeline: [
    { id: 1, action: "PWIN sent case to Partner", actor: "SRP Admin", time: "1 hour ago", type: "status", from: "CHECKING", to: "SUBMITTED" },
    { id: 2, action: "PWIN started checking documents", actor: "SRP Admin", time: "2 hours ago", type: "status", from: "RECEIVE", to: "CHECKING" },
    { id: 3, action: "Case received from customer", actor: "System", time: "3 hours ago", type: "create", from: null, to: "RECEIVE" },
  ],
  messages: [
    {
      id: 1,
      sender: "Partner Admin A",
      senderType: "PARTNER",
      content: "Received the case. Will start processing today.",
      isOwn: false,
      time: "3 hours ago",
      deleted: false,
      replyTo: null as null | { id: number; sender: string; content: string },
    },
    {
      id: 2,
      sender: "SRP Admin",
      senderType: "PWIN",
      content: "Documents verified. Sending to Partner for processing.",
      isOwn: true,
      time: "1 hour ago",
      deleted: false,
      replyTo: { id: 1, sender: "Partner Admin A", content: "Received the case. Will start processing today." },
    },
    {
      id: 3,
      sender: "Partner Admin A",
      senderType: "PARTNER",
      content: "Passport scan quality is too low, can you re-upload?",
      isOwn: false,
      time: "45 min ago",
      deleted: true,
      replyTo: null as null | { id: number; sender: string; content: string },
    },
  ],
  blockNotes: [
    {
      id: 1,
      content: "Customer mentioned they need expedited processing due to travel plans on April 1st.",
      author: "SRP Admin",
      authorType: "PWIN",
      time: "1 hour ago",
      isInternal: true,
    },
  ],
  documents: [
    { id: 1, name: "passport-copy.pdf", type: "pdf", uploader: "SRP Admin", uploaderType: "PWIN", time: "2 hours ago", size: "1.2 MB", visibility: "INTERNAL" },
    { id: 2, name: "photo.jpg", type: "image", uploader: "SRP Admin", uploaderType: "PWIN", time: "2 hours ago", size: "450 KB", visibility: "INTERNAL" },
  ],
  finance: {
    total: "7,500.00",
    partnerCost: "5,500.00",
    pwinProfit: "2,000.00",
    paid: "7,500.00",
    outstanding: "0.00",
    currency: "THB",
  },
}

// Sample Partner staff for assignment
const partnerStaffList = [
  { id: "ps-1", name: "Partner Admin A", organization: "Bangkok Partner Co.", workload: 5 },
  { id: "ps-2", name: "Partner Staff B", organization: "Bangkok Partner Co.", workload: 8 },
  { id: "ps-3", name: "Partner Admin C", organization: "Samut Partner Ltd.", workload: 3 },
]

interface CaseDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  caseId: string | null
}

const MIN_WIDTH = 400
const MAX_WIDTH = 1200
const DEFAULT_WIDTH = 700

// Current user simulation (in real app, from auth context)
const currentUser = {
  orgType: "PWIN_HQ" as const,
  role: "ADMIN",
  name: "SRP Admin",
}

type Message = typeof sampleCase.messages[0]

// Available users for mentions
const mentionableUsers = [
  { id: "pwin-1", name: "SRP Admin", type: "PWIN" },
  { id: "partner-1", name: "Partner Admin A", type: "PARTNER" },
  { id: "partner-2", name: "Partner Staff B", type: "PARTNER" },
]

export function CaseDrawer({ open, onOpenChange }: CaseDrawerProps) {
  const [messageText, setMessageText] = useState("")
  const [messages, setMessages] = useState<Message[]>(sampleCase.messages)
  const [replyTo, setReplyTo] = useState<Message | null>(null)
  const [showMentions, setShowMentions] = useState(false)
  const [mentionQuery, setMentionQuery] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    customer: true,
    service: true,
    actions: true,
    pwinStaff: false,
    partnerStaff: true,
    timeline: true,
    messages: true,
    notes: false,
    documents: true,
    finance: false,
    info: false,
  })
  const [drawerWidth, setDrawerWidth] = useState(DEFAULT_WIDTH)
  const [isResizing, setIsResizing] = useState(false)
  const [showAssignPartnerDialog, setShowAssignPartnerDialog] = useState(false)
  const [selectedPartnerStaff, setSelectedPartnerStaff] = useState<string>("")
  const [showReasonDialog, setShowReasonDialog] = useState(false)
  const [transitionReason, setTransitionReason] = useState("")
  const [pendingTransition, setPendingTransition] = useState<{ toStatus: CaseStatus; label: string } | null>(null)
  const resizeRef = useRef<HTMLDivElement>(null)
  const caseData = sampleCase

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const slaPercentage = ((caseData.slaTotalDays - caseData.slaRemaining) / caseData.slaTotalDays) * 100

  // Get available transitions based on current status and user role
  const availableTransitions = getAvailableTransitions(caseData.status, currentUser.orgType)

  // Handle transition click
  const handleTransitionClick = (transition: ReturnType<typeof getAvailableTransitions>[0]) => {
    if (transition.requiresPartnerAssignment && !caseData.assignedPartnerStaff) {
      setShowAssignPartnerDialog(true)
      return
    }
    if (transition.requiresReason) {
      setPendingTransition({ toStatus: transition.toStatus, label: transition.label })
      setShowReasonDialog(true)
      return
    }
    // Execute transition
    console.log(`[v0] Transition: ${caseData.status} → ${transition.toStatus}`)
  }

  // Handle partner assignment
  const handleAssignPartner = () => {
    if (selectedPartnerStaff) {
      console.log(`[v0] Assigned partner staff: ${selectedPartnerStaff}`)
      setShowAssignPartnerDialog(false)
      setSelectedPartnerStaff("")
    }
  }

  // Handle transition with reason
  const handleTransitionWithReason = () => {
    if (pendingTransition && transitionReason.trim()) {
      console.log(`[v0] Transition: ${caseData.status} → ${pendingTransition.toStatus}, Reason: ${transitionReason}`)
      setShowReasonDialog(false)
      setTransitionReason("")
      setPendingTransition(null)
    }
  }

  // Handle mouse move for resizing
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return
    const newWidth = window.innerWidth - e.clientX
    if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) {
      setDrawerWidth(newWidth)
    }
  }, [isResizing])

  // Handle mouse up to stop resizing
  const handleMouseUp = useCallback(() => {
    setIsResizing(false)
    document.body.style.cursor = ""
    document.body.style.userSelect = ""
  }, [])

  // Add and remove event listeners
  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = "ew-resize"
      document.body.style.userSelect = "none"
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isResizing, handleMouseMove, handleMouseUp])

  const handleMouseDown = () => {
    setIsResizing(true)
  }

  // Send message
  const handleSendMessage = () => {
    const trimmed = messageText.trim()
    if (!trimmed) return
    const newMsg: Message = {
      id: Date.now(),
      sender: currentUser.name,
      senderType: "PWIN",
      content: trimmed,
      isOwn: true,
      time: "Just now",
      deleted: false,
      replyTo: replyTo ? { id: replyTo.id, sender: replyTo.sender, content: replyTo.content } : null,
    }
    setMessages((prev) => [...prev, newMsg])
    setMessageText("")
    setReplyTo(null)
  }

  // Delete message (own only)
  const handleDeleteMessage = (id: number) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, deleted: true } : m))
    )
  }

  // Keyboard send: Enter to send, Ctrl/Cmd+Enter for new line
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
    if (e.key === "Escape") {
      if (showMentions) {
        e.preventDefault()
        setShowMentions(false)
      } else if (replyTo) {
        e.preventDefault()
        setReplyTo(null)
      }
    }
  }

  // Handle text input for mention detection
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
    setMessageText(text)

    // Detect @ mentions
    const lastAt = text.lastIndexOf("@")
    if (lastAt !== -1 && (lastAt === 0 || text[lastAt - 1] === " ")) {
      const query = text.substring(lastAt + 1).toLowerCase()
      setMentionQuery(query)
      setShowMentions(true)
    } else {
      setShowMentions(false)
    }
  }

  // Insert mention into message
  const insertMention = (user: typeof mentionableUsers[0]) => {
    const lastAt = messageText.lastIndexOf("@")
    const beforeAt = messageText.substring(0, lastAt)
    const afterMention = messageText.substring(messageText.indexOf(" ", lastAt) + 1 || messageText.length)
    const newText = `${beforeAt}@${user.name} ${afterMention}`.trim() + " "
    setMessageText(newText)
    setShowMentions(false)
    textareaRef.current?.focus()
  }

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Focus textarea on reply
  useEffect(() => {
    if (replyTo) textareaRef.current?.focus()
  }, [replyTo])

  const useTwoColumns = drawerWidth >= 600

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="right"
          className="overflow-y-auto p-0 flex flex-col"
          style={{ width: `${drawerWidth}px`, maxWidth: `${drawerWidth}px` }}
        >
          <VisuallyHidden>
            <SheetTitle>Case {caseData.caseNumber}</SheetTitle>
            <SheetDescription>Case details and management panel</SheetDescription>
          </VisuallyHidden>

          {/* Resize Handle */}
          <div
            ref={resizeRef}
            onMouseDown={handleMouseDown}
            className={cn(
              "absolute left-0 top-0 bottom-0 w-1 cursor-ew-resize z-50 group flex items-center",
              "hover:bg-indigo-500/50 transition-colors",
              isResizing && "bg-indigo-500"
            )}
          >
            <div className={cn(
              "absolute left-0 w-4 h-12 flex items-center justify-center rounded-r-md",
              "bg-muted border border-border border-l-0 opacity-0 group-hover:opacity-100 transition-opacity",
              isResizing && "opacity-100"
            )}>
              <GripVertical className="size-3 text-muted-foreground" />
            </div>
          </div>

          {/* Sticky Header */}
          <div className="sticky top-0 z-10 flex flex-col border-b border-border bg-background flex-shrink-0">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-3">
                <Link
                  href={`/cases/${caseData.id}`}
                  className="font-mono font-semibold tracking-tight text-foreground hover:text-indigo-600 transition-colors underline-offset-4 hover:underline"
                >
                  {caseData.caseNumber}
                </Link>
                <StatusBadge status={caseData.status} />
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/cases/${caseData.id}`}>
                    <ExternalLink className="size-4 mr-1.5" />
                    Full Page
                  </Link>
                </Button>
                <SheetClose asChild>
                  <Button variant="ghost" size="icon">
                    <X className="size-4" />
                  </Button>
                </SheetClose>
              </div>
            </div>
            {/* Status Flow Indicator */}
            <div className="px-6 pb-3">
              <StatusFlow currentStatus={caseData.status} />
            </div>
          </div>

          {/* Scrollable Sections */}
          <div className="flex-1 overflow-y-auto">
            {/* Customer & Service Row */}
            {useTwoColumns ? (
              <div className="grid grid-cols-2 border-b border-border">
                {/* Customer Section */}
                <div className="border-r border-border p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <User className="size-4 text-muted-foreground" />
                    <span className="text-sm font-semibold text-foreground">Customer</span>
                  </div>
                  <PropertyList>
                    <PropertyRow label="Name" value={caseData.customer.fullName} />
                    <PropertyRow label="Type" value={caseData.customer.type} />
                    <PropertyRow label="Phone" value={caseData.customer.phone} copyable />
                    <PropertyRow label="Email" value={caseData.customer.email} copyable />
                  </PropertyList>
                </div>

                {/* Service Section */}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="size-4 text-muted-foreground" />
                    <span className="text-sm font-semibold text-foreground">Service & SLA</span>
                  </div>
                  <PropertyList>
                    <PropertyRow
                      label="Service"
                      value={`${caseData.service.code} - ${caseData.service.name}`}
                    />
                    <PropertyRow label="SLA" value={`${caseData.service.slaDays} days`} />
                    <PropertyRow 
                      label="Requires Partner" 
                      value={caseData.service.requiresPartner ? "Yes" : "No"} 
                    />
                  </PropertyList>
                  {caseData.status !== "RECEIVE" && caseData.status !== "CLOSED" && (
                    <div className="mt-3 p-3 bg-muted/50 rounded-lg border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-foreground">SLA Progress</span>
                        <span className={cn(
                          "text-xs font-semibold",
                          slaPercentage > 70 ? "text-amber-600" : "text-green-600"
                        )}>
                          {caseData.slaRemaining}d left
                        </span>
                      </div>
                      <Progress value={slaPercentage} className="h-1.5" />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
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

                <CollapsibleSection
                  title="Service & SLA"
                  icon={<Clock className="size-4" />}
                  open={expandedSections.service}
                  onToggle={() => toggleSection("service")}
                >
                  <PropertyList>
                    <PropertyRow
                      label="Service"
                      value={`${caseData.service.code} - ${caseData.service.name}`}
                    />
                    <PropertyRow label="SLA Days" value={`${caseData.service.slaDays} days`} />
                  </PropertyList>
                </CollapsibleSection>
              </>
            )}

            {/* Status Actions Section */}
            <CollapsibleSection
              title="Actions"
              icon={<Zap className="size-4" />}
              open={expandedSections.actions}
              onToggle={() => toggleSection("actions")}
              highlight
            >
              {availableTransitions.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    {availableTransitions.map((transition) => (
                      <Button
                        key={transition.toStatus}
                        onClick={() => handleTransitionClick(transition)}
                        size="sm"
                        className={cn(
                          "font-medium",
                          transition.variant === "primary" && "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm",
                          transition.variant === "destructive" && "bg-red-600 hover:bg-red-700 text-white"
                        )}
                        variant={transition.variant === "secondary" ? "outline" : "default"}
                      >
                        {transition.label}
                      </Button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                    <span>Current owner: <span className="font-medium text-foreground">{caseData.status === "WORKING" ? "Partner" : "PWIN"}</span></span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No actions available for your role.</p>
              )}
            </CollapsibleSection>

            {/* Staff Assignment Section */}
            {useTwoColumns ? (
              <div className="grid grid-cols-2 border-b border-border">
                {/* PWIN Staff */}
                <div className="border-r border-border p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Building2 className="size-4 text-muted-foreground" />
                    <span className="text-sm font-semibold text-foreground">PWIN Staff</span>
                  </div>
                  {caseData.assignedPwinStaff ? (
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                        <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                          {caseData.assignedPwinStaff.name.split(" ").map(n => n[0]).join("")}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{caseData.assignedPwinStaff.name}</p>
                        <p className="text-xs text-muted-foreground">{caseData.assignedPwinStaff.role}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Not assigned</p>
                  )}
                </div>

                {/* Partner Staff */}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="size-4 text-muted-foreground" />
                    <span className="text-sm font-semibold text-foreground">Partner Staff</span>
                    {!caseData.assignedPartnerStaff && caseData.status === "SUBMITTED" && (
                      <span className="text-xs bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300 px-1.5 py-0.5 rounded">
                        Required
                      </span>
                    )}
                  </div>
                  {caseData.assignedPartnerStaff ? (
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                        <span className="text-xs font-semibold text-orange-600 dark:text-orange-400">
                          {caseData.assignedPartnerStaff.name.split(" ").map(n => n[0]).join("")}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{caseData.assignedPartnerStaff.name}</p>
                        <p className="text-xs text-muted-foreground">{caseData.assignedPartnerStaff.organization}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Not assigned</p>
                      {caseData.status === "SUBMITTED" && currentUser.orgType !== "PARTNER" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowAssignPartnerDialog(true)}
                        >
                          Assign Partner
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <CollapsibleSection
                  title="PWIN Staff"
                  icon={<Building2 className="size-4" />}
                  open={expandedSections.pwinStaff}
                  onToggle={() => toggleSection("pwinStaff")}
                >
                  {caseData.assignedPwinStaff ? (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                        <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                          {caseData.assignedPwinStaff.name.split(" ").map(n => n[0]).join("")}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{caseData.assignedPwinStaff.name}</p>
                        <p className="text-xs text-muted-foreground">{caseData.assignedPwinStaff.role}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Not assigned</p>
                  )}
                </CollapsibleSection>

                <CollapsibleSection
                  title="Partner Staff"
                  icon={<Users className="size-4" />}
                  open={expandedSections.partnerStaff}
                  onToggle={() => toggleSection("partnerStaff")}
                  badge={!caseData.assignedPartnerStaff && caseData.status === "SUBMITTED" ? "!" : undefined}
                >
                  {caseData.assignedPartnerStaff ? (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                        <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">
                          {caseData.assignedPartnerStaff.name.split(" ").map(n => n[0]).join("")}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{caseData.assignedPartnerStaff.name}</p>
                        <p className="text-xs text-muted-foreground">{caseData.assignedPartnerStaff.organization}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Not assigned</p>
                      {caseData.status === "SUBMITTED" && currentUser.orgType !== "PARTNER" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowAssignPartnerDialog(true)}
                        >
                          Assign Partner
                        </Button>
                      )}
                    </div>
                  )}
                </CollapsibleSection>
              </>
            )}

            {/* Timeline Section */}
            <CollapsibleSection
              title="Timeline"
              icon={<Clock className="size-4" />}
              open={expandedSections.timeline}
              onToggle={() => toggleSection("timeline")}
              badge={caseData.timeline.length}
            >
              <div className="relative border-l border-border ml-1.5 pl-4 space-y-3">
                {caseData.timeline.map((event, i) => (
                  <div key={event.id} className="relative">
                    <div className={cn(
                      "absolute -left-[17px] top-1 w-2 h-2 rounded-full",
                      event.type === "status" ? "bg-indigo-500" : "bg-muted-foreground"
                    )} />
                    <p className="text-sm text-foreground leading-snug">{event.action}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {event.actor} - {event.time}
                    </p>
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
              customBadge={
                <div className="flex items-center gap-2">
                  {/* Participant avatars */}
                  <div className="flex items-center -space-x-1.5">
                    {Array.from(new Set(messages.map((m) => m.sender)))
                      .slice(0, 3)
                      .map((sender, idx) => {
                        const msg = messages.find((m) => m.sender === sender)
                        const getInitials = (name: string) => name.split(" ").map((n) => n[0]).join("").toUpperCase()
                        const getAvatarColor = (type: string) =>
                          type === "PWIN" ? "bg-indigo-600" : "bg-amber-600"
                        return (
                          <div
                            key={sender}
                            className={cn(
                              "size-5 rounded-full flex items-center justify-center text-[9px] font-semibold text-white border border-background",
                              msg ? getAvatarColor(msg.senderType) : "bg-gray-500"
                            )}
                            title={sender}
                          >
                            {getInitials(sender)}
                          </div>
                        )
                      })}
                  </div>
                  {/* +N badge if more participants */}
                  {Array.from(new Set(messages.map((m) => m.sender))).length > 3 && (
                    <span className="text-xs font-semibold text-muted-foreground">
                      +{Array.from(new Set(messages.map((m) => m.sender))).length - 3}
                    </span>
                  )}
                  {/* Message count */}
                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                    {messages.filter((m) => !m.deleted).length}
                  </span>
                </div>
              }
            >
              {/* Message list */}
              <div className="space-y-3 mb-3 max-h-72 overflow-y-auto px-0.5">
                {messages.map((msg) => {
                  const getInitials = (name: string) => name.split(" ").map((n) => n[0]).join("").toUpperCase()
                  const getAvatarColor = (type: string) =>
                    type === "PWIN" ? "bg-indigo-600" : "bg-amber-600"

                  return (
                    <div 
                      key={msg.id} 
                      className={cn(
                        "group flex gap-2.5 items-start",
                        msg.isOwn ? "flex-row-reverse" : "flex-row"
                      )}
                    >
                      {/* Avatar */}
                      <div
                        className={cn(
                          "size-8 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0",
                          getAvatarColor(msg.senderType)
                        )}
                        title={`${msg.sender} (${msg.senderType})`}
                      >
                        {getInitials(msg.sender)}
                      </div>

                      {/* Message content */}
                      <div className={cn(
                        "flex-1 min-w-0 flex flex-col",
                        msg.isOwn ? "items-end" : "items-start"
                      )}>
                        {/* Header: Sender + time */}
                        <div className={cn(
                          "flex items-center gap-2 mb-1",
                          msg.isOwn ? "flex-row-reverse" : "flex-row"
                        )}>
                          <span className="text-sm font-medium text-foreground">{msg.sender}</span>
                          <span className="text-xs text-muted-foreground">{msg.time}</span>
                        </div>

                        {/* Bubble */}
                        {msg.deleted ? (
                          <div className="px-3 py-2 rounded-lg bg-muted/40 border border-dashed border-border inline-block">
                            <span className="text-sm text-muted-foreground italic">This message was deleted</span>
                          </div>
                        ) : (
                          <>
                            {/* Reply-to preview */}
                            {msg.replyTo && (
                              <div className={cn(
                                "flex items-start gap-1.5 mb-1.5 px-2.5 py-1.5 rounded-md text-xs max-w-sm border-l-2",
                                msg.isOwn
                                  ? "bg-indigo-100 dark:bg-indigo-950/30 border-indigo-400 text-indigo-900 dark:text-indigo-100"
                                  : "bg-muted/50 border-indigo-400 text-foreground"
                              )}>
                                <CornerUpLeft className="size-3 shrink-0 mt-0.5" />
                                <div className="min-w-0">
                                  <span className="font-medium block truncate">{msg.replyTo.sender}</span>
                                  <span className="truncate block opacity-80">{msg.replyTo.content}</span>
                                </div>
                              </div>
                            )}
                            <div className={cn(
                              "px-3.5 py-2.5 rounded-xl text-sm leading-relaxed max-w-sm",
                              msg.isOwn
                                ? "bg-indigo-600 text-white rounded-br-sm"
                                : "bg-muted text-foreground rounded-bl-sm"
                            )}>
                              {msg.content}
                            </div>
                          </>
                        )}

                        {/* Action buttons — below bubble, appear on hover */}
                        {!msg.deleted && (
                          <div className={cn(
                            "flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity",
                            msg.isOwn ? "flex-row-reverse" : "flex-row"
                          )}>
                            <button
                              onClick={() => setReplyTo(msg)}
                              className="h-6 w-6 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                              title="Reply"
                            >
                              <Reply className="size-3.5" />
                            </button>
                            {msg.isOwn && (
                              <button
                                onClick={() => handleDeleteMessage(msg.id)}
                                className="h-6 w-6 rounded flex items-center justify-center text-muted-foreground hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Compose area */}
              <div className="border border-border rounded-xl overflow-hidden bg-background focus-within:ring-2 focus-within:ring-indigo-500/30 focus-within:border-indigo-400 transition-all">
                {/* Reply preview bar */}
                {replyTo && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-indigo-50 dark:bg-indigo-950/30 border-b border-indigo-200 dark:border-indigo-800">
                    <CornerUpLeft className="size-3.5 text-indigo-500 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-medium text-indigo-700 dark:text-indigo-300">{replyTo.sender}</span>
                      <span className="text-xs text-indigo-600/70 dark:text-indigo-400/70 ml-2 truncate">{replyTo.content}</span>
                    </div>
                    <button
                      onClick={() => setReplyTo(null)}
                      className="text-indigo-400 hover:text-indigo-600 transition-colors"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                )}
                <Textarea
                  ref={textareaRef}
                  placeholder="Type a message... (Enter to send, Ctrl+Enter for new line, @ to mention)"
                  value={messageText}
                  onChange={handleTextChange}
                  onKeyDown={handleKeyDown}
                  className="min-h-[64px] border-0 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none text-sm rounded-none bg-transparent px-3 pt-2.5 pb-1"
                />
                {/* Mention dropdown */}
                {showMentions && (
                  <div className="border-t border-border bg-muted/40 max-h-32 overflow-y-auto">
                    {mentionableUsers
                      .filter((u) => u.name.toLowerCase().includes(mentionQuery))
                      .map((user) => (
                        <button
                          key={user.id}
                          onClick={() => insertMention(user)}
                          className="w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors flex items-center gap-2"
                        >
                          <div className={cn(
                            "size-5 rounded-full flex items-center justify-center text-[9px] font-semibold text-white",
                            user.type === "PWIN" ? "bg-indigo-600" : "bg-amber-600"
                          )}>
                            {user.name.split(" ").map((n) => n[0]).join("").toUpperCase()}
                          </div>
                          <span className="font-medium">{user.name}</span>
                          <span className="text-xs text-muted-foreground ml-auto">{user.type}</span>
                        </button>
                      ))}
                  </div>
                )}
                <div className="flex items-center justify-between px-2 py-1.5 bg-muted/30">
                  <span className="text-[10px] text-muted-foreground">
                    {messageText.length > 0 ? `${messageText.length} chars` : "Enter to send"}
                  </span>
                  <Button
                    size="sm"
                    onClick={handleSendMessage}
                    disabled={!messageText.trim()}
                    className="h-7 px-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs gap-1.5"
                  >
                    <Send className="size-3" />
                    Send
                  </Button>
                </div>
              </div>
            </CollapsibleSection>

            {/* Block Notes Section */}
            <CollapsibleSection
              title="Internal Notes"
              icon={<StickyNote className="size-4" />}
              open={expandedSections.notes}
              onToggle={() => toggleSection("notes")}
              badge={caseData.blockNotes.length}
            >
              <div className="space-y-2">
                {caseData.blockNotes.map((note) => (
                  <div
                    key={note.id}
                    className="bg-amber-50/70 dark:bg-amber-950/20 border-l-2 border-amber-400 rounded-r-md px-3 py-2.5"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-amber-700 dark:text-amber-400">
                        {note.author}
                      </span>
                      <span className="text-[10px] text-muted-foreground">{note.time}</span>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">{note.content}</p>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="mt-3 w-full justify-center">
                + Add Note
              </Button>
            </CollapsibleSection>

            {/* Documents Section */}
            <CollapsibleSection
              title="Documents"
              icon={<FileText className="size-4" />}
              open={expandedSections.documents}
              onToggle={() => toggleSection("documents")}
              badge={caseData.documents.length}
            >
              <div className="space-y-1.5 mb-3">
                {caseData.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center gap-2.5 p-2.5 rounded-md bg-muted/40 hover:bg-muted/70 transition-colors group"
                  >
                    <div className="flex-shrink-0">
                      {doc.type === "pdf" ? (
                        <div className="w-8 h-8 rounded-md bg-red-100 dark:bg-red-950 flex items-center justify-center">
                          <FileText className="size-4 text-red-500" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-md bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
                          <ImageIcon className="size-4 text-blue-500" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-medium text-foreground truncate">{doc.name}</p>
                        <span className="text-[9px] font-medium px-1 py-0.5 rounded bg-muted text-muted-foreground uppercase tracking-wide">
                          {doc.visibility}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {doc.size} - {doc.uploader} ({doc.uploaderType})
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Download className="size-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="w-full justify-center">
                <Upload className="size-3.5 mr-1.5" />
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
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Total Price</p>
                    <p className="text-lg font-semibold text-foreground">
                      {caseData.finance.currency} {caseData.finance.total}
                    </p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Partner Cost</p>
                    <p className="text-lg font-semibold text-foreground">
                      {caseData.finance.currency} {caseData.finance.partnerCost}
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                    <p className="text-xs text-green-600 dark:text-green-400">PWIN Profit</p>
                    <p className="text-lg font-semibold text-green-700 dark:text-green-300">
                      {caseData.finance.currency} {caseData.finance.pwinProfit}
                    </p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Outstanding</p>
                    <p className={cn(
                      "text-lg font-semibold",
                      parseFloat(caseData.finance.outstanding) > 0 ? "text-amber-600" : "text-green-600"
                    )}>
                      {caseData.finance.currency} {caseData.finance.outstanding}
                    </p>
                  </div>
                </div>
              </div>
            </CollapsibleSection>

            {/* Quick Info Section */}
            <CollapsibleSection
              title="Quick Info"
              icon={<Info className="size-4" />}
              open={expandedSections.info}
              onToggle={() => toggleSection("info")}
            >
              <PropertyList>
                <PropertyRow label="Case ID" value={<span className="font-mono text-xs">{caseData.caseNumber}</span>} />
                <PropertyRow label="Branch" value={caseData.branch || "HQ - Head Office"} />
                <PropertyRow label="Service" value={`${caseData.service.code} - ${caseData.service.name}`} />
                <PropertyRow label="Status" value={<StatusBadge status={caseData.status} size="sm" />} />
                <PropertyRow label="SLA" value={`${caseData.slaRemaining} of ${caseData.slaTotalDays} days`} />
                <PropertyRow label="Organization" value={caseData.organization} />
                <PropertyRow label="Public" value={caseData.isPublic ? "Yes" : "No"} />
                {caseData.isPublic && (
                  <PropertyRow
                    label="Track Link"
                    value={
                      <div className="flex items-center gap-2">
                        <code className="text-xs font-mono bg-muted px-2 py-1 rounded truncate max-w-[150px]">
                          /track/{caseData.publicToken}
                        </code>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <Copy className="size-3" />
                        </Button>
                      </div>
                    }
                  />
                )}
                <PropertyRow label="Created" value={caseData.createdAt} />
                <PropertyRow label="Updated" value={caseData.updatedAt} />
              </PropertyList>
            </CollapsibleSection>
          </div>
        </SheetContent>
      </Sheet>

      {/* Assign Partner Dialog */}
      <Dialog open={showAssignPartnerDialog} onOpenChange={setShowAssignPartnerDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Partner Staff</DialogTitle>
            <DialogDescription>
              Select a partner staff member to process this case with the government/embassy.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Partner Staff</Label>
              <Select value={selectedPartnerStaff} onValueChange={setSelectedPartnerStaff}>
                <SelectTrigger>
                  <SelectValue placeholder="Select partner staff..." />
                </SelectTrigger>
                <SelectContent>
                  {partnerStaffList.map((staff) => (
                    <SelectItem key={staff.id} value={staff.id}>
                      <div className="flex items-center justify-between w-full gap-4">
                        <span>{staff.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {staff.organization} ({staff.workload} cases)
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAssignPartnerDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignPartner} disabled={!selectedPartnerStaff}>
              Assign & Start Working
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reason Dialog */}
      <Dialog open={showReasonDialog} onOpenChange={setShowReasonDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{pendingTransition?.label}</DialogTitle>
            <DialogDescription>
              Please provide a reason for this action. This will be recorded in the timeline.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Reason</Label>
              <Textarea
                placeholder="Enter reason..."
                value={transitionReason}
                onChange={(e) => setTransitionReason(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowReasonDialog(false)
              setTransitionReason("")
              setPendingTransition(null)
            }}>
              Cancel
            </Button>
            <Button onClick={handleTransitionWithReason} disabled={!transitionReason.trim()}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

// Collapsible Section Component
interface CollapsibleSectionProps {
  title: string
  icon: React.ReactNode
  open: boolean
  onToggle: () => void
  children: React.ReactNode
  badge?: number | string
  customBadge?: React.ReactNode
  highlight?: boolean
}

function CollapsibleSection({
  title,
  icon,
  open,
  onToggle,
  children,
  badge,
  customBadge,
  highlight,
}: CollapsibleSectionProps) {
  return (
    <Collapsible open={open} onOpenChange={onToggle}>
      <div className={cn(
        "border-b border-border",
        highlight && "bg-indigo-50/50 dark:bg-indigo-950/20"
      )}>
        <CollapsibleTrigger className="flex items-center justify-between w-full px-6 py-3 hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">{icon}</span>
            <span className="text-sm font-semibold text-foreground">{title}</span>
            {customBadge ? (
              customBadge
            ) : badge !== undefined && (
              <span className={cn(
                "text-xs px-1.5 py-0.5 rounded-full",
                badge === "!" 
                  ? "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
                  : "bg-muted text-muted-foreground"
              )}>
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
          <div className="px-6 pb-4">{children}</div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
}

// Property List Components
function PropertyList({ children }: { children: React.ReactNode }) {
  return <div className="space-y-2">{children}</div>
}

interface PropertyRowProps {
  label: string
  value: React.ReactNode
  copyable?: boolean
  vertical?: boolean
}

function PropertyRow({ label, value, copyable, vertical }: PropertyRowProps) {
  const handleCopy = () => {
    if (typeof value === "string") {
      navigator.clipboard.writeText(value)
    }
  }

  if (vertical) {
    return (
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <div className="flex items-center gap-2">
          {typeof value === "string" ? (
            <p className="text-sm font-medium text-foreground">{value}</p>
          ) : (
            value
          )}
          {copyable && typeof value === "string" && (
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCopy}>
              <Copy className="size-3" />
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-xs text-muted-foreground shrink-0">{label}</span>
      <div className="flex items-center gap-2">
        {typeof value === "string" ? (
          <span className="text-sm font-medium text-foreground text-right">{value}</span>
        ) : (
          value
        )}
        {copyable && typeof value === "string" && (
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCopy}>
            <Copy className="size-3" />
          </Button>
        )}
      </div>
    </div>
  )
}
