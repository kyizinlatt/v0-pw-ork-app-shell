"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import {
  Search,
  Send,
  Paperclip,
  Smile,
  MoreHorizontal,
  Phone,
  Video,
  Star,
  Archive,
  Trash2,
  ChevronDown,
  Check,
  CheckCheck,
  Image as ImageIcon,
  FileText,
  X,
  Plus,
  MessageSquare,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Sample conversations data
const conversations = [
  {
    id: "1",
    name: "Aung Aung",
    avatar: "",
    lastMessage: "I have submitted all documents for the work permit...",
    timestamp: "2 min",
    unread: 3,
    online: true,
    caseId: "HQ-WP-110326-0002",
  },
  {
    id: "2",
    name: "Win Tun",
    avatar: "",
    lastMessage: "Thank you for the update on my visa application",
    timestamp: "15 min",
    unread: 0,
    online: true,
    caseId: "HQ-KS-110326-0001",
  },
  {
    id: "3",
    name: "Mya Mya",
    avatar: "",
    lastMessage: "When will the passport be ready?",
    timestamp: "1 hour",
    unread: 1,
    online: false,
    caseId: "HQ-KS-110326-0004",
  },
  {
    id: "4",
    name: "Golden Star Co., Ltd",
    avatar: "",
    lastMessage: "We need to discuss the bulk WP application",
    timestamp: "2 hours",
    unread: 0,
    online: false,
    caseId: null,
  },
  {
    id: "5",
    name: "Htoo Htoo",
    avatar: "",
    lastMessage: "My 90-day report is complete. Thanks!",
    timestamp: "3 hours",
    unread: 0,
    online: false,
    caseId: "HQ-90D-110326-0003",
  },
  {
    id: "6",
    name: "Partner: ABC Immigration",
    avatar: "",
    lastMessage: "Documents verified and approved",
    timestamp: "5 hours",
    unread: 0,
    online: true,
    caseId: "HQ-WP-110326-0002",
  },
  {
    id: "7",
    name: "Kyaw Kyaw",
    avatar: "",
    lastMessage: "Please check the attached TM6 form",
    timestamp: "1 day",
    unread: 0,
    online: false,
    caseId: "HQ-VISA-110326-0005",
  },
]

// Sample messages for selected conversation
const sampleMessages = [
  {
    id: "1",
    senderId: "customer",
    text: "Hello, I wanted to check on the status of my work permit application.",
    timestamp: "9:30 AM",
    status: "read",
  },
  {
    id: "2",
    senderId: "me",
    text: "Good morning! Your application is currently being processed. We've submitted all documents to the labor department.",
    timestamp: "9:35 AM",
    status: "read",
  },
  {
    id: "3",
    senderId: "customer",
    text: "That's great to hear. How long will it take?",
    timestamp: "9:36 AM",
    status: "read",
  },
  {
    id: "4",
    senderId: "me",
    text: "Based on the current SLA, you should receive approval within 14 business days. We'll notify you immediately once we get any updates.",
    timestamp: "9:40 AM",
    status: "read",
  },
  {
    id: "5",
    senderId: "customer",
    text: "I have submitted all documents for the work permit. Please let me know if anything else is needed.",
    timestamp: "10:15 AM",
    status: "delivered",
    attachments: [
      { type: "image", name: "passport_scan.jpg" },
      { type: "pdf", name: "employment_contract.pdf" },
    ],
  },
]

export default function InboxPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [selectedConversation, setSelectedConversation] = useState(conversations[0])
  const [messageText, setMessageText] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [filter, setFilter] = useState<"all" | "unread" | "starred">("all")

  const commonEmojis = ["😀", "😂", "😍", "👍", "👎", "❤️", "🔥", "✅", "🎉", "💯", "🙏", "👏"]

  const filteredConversations = conversations.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filter === "all" || (filter === "unread" && c.unread > 0)
    return matchesSearch && matchesFilter
  })

  const handleSend = () => {
    if (!messageText.trim()) return
    // In production, send message via API
    setMessageText("")
    setShowEmojiPicker(false)
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="flex h-screen bg-muted/30">
      <Sidebar
        activeItem="Inbox"
        onMobileClose={() => setMobileMenuOpen(false)}
        mobileOpen={mobileMenuOpen}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />

        <main className="flex-1 overflow-hidden flex">
          {/* Conversations List */}
          <div className="w-80 border-r border-border bg-background flex flex-col shrink-0">
            {/* List Header */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">Messages</h2>
                <Button size="sm" className="h-8 gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white">
                  <Plus className="size-3.5" />
                  New
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 px-4 py-2 border-b border-border">
              {(["all", "unread", "starred"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-md transition-colors capitalize",
                    filter === f
                      ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {f}
                  {f === "unread" && (
                    <span className="ml-1.5 px-1.5 py-0.5 text-[10px] bg-rose-500 text-white rounded-full">
                      {conversations.filter((c) => c.unread > 0).length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv)}
                  className={cn(
                    "w-full flex items-start gap-3 p-4 text-left transition-colors border-b border-border/50",
                    selectedConversation.id === conv.id
                      ? "bg-indigo-50 dark:bg-indigo-950/30"
                      : "hover:bg-muted/50"
                  )}
                >
                  <div className="relative shrink-0">
                    <Avatar className="size-10">
                      <AvatarImage src={conv.avatar} />
                      <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs">
                        {getInitials(conv.name)}
                      </AvatarFallback>
                    </Avatar>
                    {conv.online && (
                      <span className="absolute bottom-0 right-0 size-3 bg-green-500 border-2 border-background rounded-full" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className={cn("text-sm truncate", conv.unread > 0 ? "font-semibold" : "font-medium")}>
                        {conv.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground shrink-0">{conv.timestamp}</span>
                    </div>
                    <p className={cn("text-xs truncate mt-0.5", conv.unread > 0 ? "text-foreground font-medium" : "text-muted-foreground")}>
                      {conv.lastMessage}
                    </p>
                    {conv.caseId && (
                      <span className="inline-block mt-1 px-1.5 py-0.5 text-[10px] bg-muted text-muted-foreground rounded font-mono">
                        {conv.caseId}
                      </span>
                    )}
                  </div>
                  {conv.unread > 0 && (
                    <span className="shrink-0 size-5 flex items-center justify-center bg-indigo-600 text-white text-[10px] font-medium rounded-full">
                      {conv.unread}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col bg-background min-w-0">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="size-10">
                        <AvatarImage src={selectedConversation.avatar} />
                        <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs">
                          {getInitials(selectedConversation.name)}
                        </AvatarFallback>
                      </Avatar>
                      {selectedConversation.online && (
                        <span className="absolute bottom-0 right-0 size-3 bg-green-500 border-2 border-background rounded-full" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold">{selectedConversation.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {selectedConversation.online ? "Online" : "Offline"}
                        {selectedConversation.caseId && ` · Case: ${selectedConversation.caseId}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="size-8">
                      <Phone className="size-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="size-8">
                      <Video className="size-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="size-8">
                      <Star className="size-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Archive className="size-4 mr-2" />
                          Archive
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Star className="size-4 mr-2" />
                          Star conversation
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-rose-600">
                          <Trash2 className="size-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {sampleMessages.map((msg) => {
                    const isMe = msg.senderId === "me"
                    return (
                      <div key={msg.id} className={cn("flex", isMe ? "justify-end" : "justify-start")}>
                        <div className={cn("max-w-[70%]", isMe ? "order-2" : "order-1")}>
                          <div
                            className={cn(
                              "px-4 py-2.5 rounded-2xl text-sm",
                              isMe
                                ? "bg-indigo-600 text-white rounded-br-md"
                                : "bg-muted text-foreground rounded-bl-md"
                            )}
                          >
                            {msg.text}
                          </div>
                          {msg.attachments && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {msg.attachments.map((att, i) => (
                                <div
                                  key={i}
                                  className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg text-xs"
                                >
                                  {att.type === "image" ? (
                                    <ImageIcon className="size-4 text-indigo-600" />
                                  ) : (
                                    <FileText className="size-4 text-rose-600" />
                                  )}
                                  <span className="truncate max-w-[120px]">{att.name}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          <div className={cn("flex items-center gap-1.5 mt-1 text-[10px] text-muted-foreground", isMe && "justify-end")}>
                            <span>{msg.timestamp}</span>
                            {isMe && (
                              msg.status === "read" ? (
                                <CheckCheck className="size-3 text-indigo-500" />
                              ) : (
                                <Check className="size-3" />
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Emoji Picker */}
                {showEmojiPicker && (
                  <div className="border-t border-border bg-muted/40 p-3">
                    <div className="flex flex-wrap gap-1">
                      {commonEmojis.map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => {
                            setMessageText((prev) => prev + emoji)
                            setShowEmojiPicker(false)
                          }}
                          className="size-9 flex items-center justify-center hover:bg-muted rounded transition-colors text-lg"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Message Input */}
                <div className="p-4 border-t border-border">
                  <div className="flex items-end gap-2">
                    <div className="flex-1 bg-muted rounded-2xl">
                      <textarea
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault()
                            handleSend()
                          }
                        }}
                        placeholder="Type a message..."
                        rows={1}
                        className="w-full px-4 py-3 bg-transparent text-sm resize-none focus:outline-none"
                      />
                      <div className="flex items-center justify-between px-3 pb-2">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            className={cn(
                              "size-8 rounded-full flex items-center justify-center transition-colors",
                              showEmojiPicker
                                ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                            )}
                          >
                            <Smile className="size-5" />
                          </button>
                          <button className="size-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                            <Paperclip className="size-5" />
                          </button>
                          <button className="size-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                            <ImageIcon className="size-5" />
                          </button>
                        </div>
                        <span className="text-[10px] text-muted-foreground">
                          {messageText.length > 0 ? `${messageText.length} chars` : "Enter to send"}
                        </span>
                      </div>
                    </div>
                    <Button
                      onClick={handleSend}
                      disabled={!messageText.trim()}
                      size="icon"
                      className="size-11 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shrink-0"
                    >
                      <Send className="size-5" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              /* Empty State */
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <div className="size-20 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-4">
                  <MessageSquare className="size-10 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold mb-1">No conversation selected</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Select a conversation from the list or start a new one to begin messaging.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
