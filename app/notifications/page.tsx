"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  MessageSquare,
  Briefcase,
  AlertCircle,
  Clock,
  Settings,
  Filter,
} from "lucide-react"
import { cn } from "@/lib/utils"

type NotificationType = "message" | "case" | "alert" | "reminder"

interface Notification {
  id: string
  type: NotificationType
  title: string
  description: string
  time: string
  read: boolean
  caseId?: string
}

const sampleNotifications: Notification[] = [
  {
    id: "n1",
    type: "message",
    title: "New message from Partner Admin A",
    description: "Received the case. Will start processing today.",
    time: "5 min ago",
    read: false,
    caseId: "HQ-KS-110326-0001",
  },
  {
    id: "n2",
    type: "case",
    title: "Case status changed",
    description: "HQ-WP-110326-0002 moved to WORKING status",
    time: "1 hour ago",
    read: false,
    caseId: "HQ-WP-110326-0002",
  },
  {
    id: "n3",
    type: "alert",
    title: "SLA Warning",
    description: "Case HQ-90D-090326-0004 is approaching SLA deadline (2 days remaining)",
    time: "2 hours ago",
    read: false,
    caseId: "HQ-90D-090326-0004",
  },
  {
    id: "n4",
    type: "reminder",
    title: "Document upload reminder",
    description: "Customer documents pending for HQ-KS-100326-0003",
    time: "3 hours ago",
    read: true,
    caseId: "HQ-KS-100326-0003",
  },
  {
    id: "n5",
    type: "case",
    title: "New case assigned",
    description: "You have been assigned to case HQ-VISA-110326-0005",
    time: "Yesterday",
    read: true,
    caseId: "HQ-VISA-110326-0005",
  },
  {
    id: "n6",
    type: "message",
    title: "Reply from SRP Admin",
    description: "Documents verified. Sending to Partner for processing.",
    time: "Yesterday",
    read: true,
    caseId: "HQ-KS-110326-0001",
  },
]

const typeIcons: Record<NotificationType, React.ElementType> = {
  message: MessageSquare,
  case: Briefcase,
  alert: AlertCircle,
  reminder: Clock,
}

const typeColors: Record<NotificationType, string> = {
  message: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400",
  case: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-400",
  alert: "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400",
  reminder: "bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-400",
}

export default function NotificationsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [notifications, setNotifications] = useState(sampleNotifications)
  const [filter, setFilter] = useState<"all" | "unread">("all")
  const [showSettings, setShowSettings] = useState(false)

  const unreadCount = notifications.filter((n) => !n.read).length
  const filteredNotifications =
    filter === "unread" ? notifications.filter((n) => !n.read) : notifications

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const clearAll = () => {
    setNotifications([])
  }

  return (
    <div className="flex h-screen bg-muted/30">
      <Sidebar
        activeItem="Notifications"
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          breadcrumb="System / Notifications"
          onMenuClick={() => setMobileMenuOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-semibold">Notifications</h1>
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                    {unreadCount} unread
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSettings(!showSettings)}
                >
                  <Settings className="h-4 w-4 mr-1" />
                  Settings
                </Button>
              </div>
            </div>

            {/* Settings Panel */}
            {showSettings && (
              <Card>
                <CardContent className="p-4 space-y-4">
                  <h3 className="font-medium text-sm">Notification Preferences</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Email notifications</p>
                        <p className="text-xs text-muted-foreground">Receive notifications via email</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Case updates</p>
                        <p className="text-xs text-muted-foreground">Status changes and assignments</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Messages</p>
                        <p className="text-xs text-muted-foreground">New messages on cases</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">SLA alerts</p>
                        <p className="text-xs text-muted-foreground">Warnings for approaching deadlines</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Filters and Actions */}
            <div className="flex items-center justify-between">
              <div className="flex gap-1 bg-muted p-1 rounded-lg">
                <button
                  onClick={() => setFilter("all")}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                    filter === "all"
                      ? "bg-background shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter("unread")}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                    filter === "unread"
                      ? "bg-background shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Unread
                </button>
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                    <CheckCheck className="h-4 w-4 mr-1" />
                    Mark all read
                  </Button>
                )}
                {notifications.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearAll} className="text-muted-foreground hover:text-red-600">
                    <Trash2 className="h-4 w-4 mr-1" />
                    Clear all
                  </Button>
                )}
              </div>
            </div>

            {/* Notifications List */}
            {filteredNotifications.length > 0 ? (
              <div className="space-y-2">
                {filteredNotifications.map((notification) => {
                  const Icon = typeIcons[notification.type]
                  return (
                    <Card
                      key={notification.id}
                      className={cn(
                        "transition-colors",
                        !notification.read && "bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-800"
                      )}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div
                            className={cn(
                              "p-2 rounded-lg shrink-0",
                              typeColors[notification.type]
                            )}
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p
                                  className={cn(
                                    "text-sm",
                                    !notification.read && "font-semibold"
                                  )}
                                >
                                  {notification.title}
                                </p>
                                <p className="text-sm text-muted-foreground mt-0.5">
                                  {notification.description}
                                </p>
                                {notification.caseId && (
                                  <a
                                    href={`/cases/${notification.caseId}`}
                                    className="text-xs text-indigo-600 hover:underline mt-1 inline-block font-mono"
                                  >
                                    {notification.caseId}
                                  </a>
                                )}
                              </div>
                              <span className="text-xs text-muted-foreground shrink-0">
                                {notification.time}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-3">
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 text-xs"
                                  onClick={() => markAsRead(notification.id)}
                                >
                                  <Check className="h-3 w-3 mr-1" />
                                  Mark read
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-xs text-muted-foreground hover:text-red-600"
                                onClick={() => deleteNotification(notification.id)}
                              >
                                <Trash2 className="h-3 w-3 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 rounded-full bg-indigo-500 shrink-0 mt-2" />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="w-12 h-12 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                    <Bell className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium mb-1">No notifications</h3>
                  <p className="text-sm text-muted-foreground">
                    {filter === "unread"
                      ? "You're all caught up!"
                      : "You don't have any notifications yet."}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
