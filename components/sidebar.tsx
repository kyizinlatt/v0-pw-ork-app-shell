"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Briefcase,
  Settings,
  Building2,
  Users,
  CalendarDays,
  Banknote,
  ShieldCheck,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
  LayoutDashboard,
  FileText,
  Bell,
  BarChart3,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

// Menu items grouped by category
const menuGroups = [
  {
    label: "Main",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
      { label: "Cases", icon: Briefcase, href: "/", badge: 127 },
    ],
  },
  {
    label: "Administration",
    permission: "ADMIN",
    items: [
      { label: "Service Types", icon: Settings, href: "/settings/service-types" },
      { label: "Partners", icon: Building2, href: "/settings/partners" },
      { label: "Users", icon: Users, href: "/settings/users" },
      { label: "Holidays", icon: CalendarDays, href: "/settings/holidays" },
    ],
  },
  {
    label: "Finance",
    permission: "FINANCE",
    items: [
      { label: "Payments", icon: Banknote, href: "/finance/payments" },
      { label: "Reports", icon: BarChart3, href: "/finance/reports" },
    ],
  },
  {
    label: "System",
    permission: "SUPER_ADMIN",
    items: [
      { label: "Audit Log", icon: ShieldCheck, href: "/admin/audit" },
      { label: "Notifications", icon: Bell, href: "/admin/notifications" },
    ],
  },
]

interface SidebarProps {
  activeItem?: string
  user?: {
    name: string
    role: string
    initials: string
    email?: string
    permissions?: string[]
  }
  mobileOpen?: boolean
  onMobileClose?: () => void
}

export function Sidebar({
  activeItem = "Cases",
  user = {
    name: "Super Admin",
    role: "SUPER_ADMIN",
    initials: "SA",
    email: "admin@pwork.com",
    permissions: ["ADMIN", "FINANCE", "SUPER_ADMIN"],
  },
  mobileOpen = false,
  onMobileClose,
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  // Persist collapsed state
  useEffect(() => {
    const stored = localStorage.getItem("pwork-sidebar-collapsed")
    if (stored !== null) {
      setCollapsed(stored === "true")
    }
  }, [])

  const toggleCollapsed = () => {
    const newValue = !collapsed
    setCollapsed(newValue)
    localStorage.setItem("pwork-sidebar-collapsed", String(newValue))
  }

  // Filter menu groups based on user permissions
  const visibleGroups = menuGroups.filter((group) => {
    if (!group.permission) return true
    return user.permissions?.includes(group.permission) || user.role === "SUPER_ADMIN"
  })

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="flex items-center justify-between h-14 px-4 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <span className="text-indigo-900 font-bold text-sm">P</span>
          </div>
          {!collapsed && (
            <span className="text-xl font-bold text-white">Work</span>
          )}
        </Link>
        {/* Mobile close button */}
        {mobileOpen && (
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white hover:bg-white/10"
            onClick={onMobileClose}
          >
            <X className="w-5 h-5" />
          </Button>
        )}
      </div>

      {/* Nav Groups */}
      <nav className="flex-1 p-2 flex flex-col gap-4 overflow-y-auto">
        {visibleGroups.map((group) => (
          <div key={group.label}>
            {/* Group Label */}
            {!collapsed && (
              <p className="px-3 mb-2 text-xs font-semibold text-white/40 uppercase tracking-wider">
                {group.label}
              </p>
            )}
            {collapsed && <div className="h-px bg-white/10 mx-2 mb-2" />}

            {/* Group Items */}
            <div className="flex flex-col gap-0.5">
              {group.items.map(({ label, icon: Icon, href, badge }) => {
                const isActive = activeItem === label
                return (
                  <Link
                    key={label}
                    href={href}
                    onClick={onMobileClose}
                    className={cn(
                      "flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                      isActive
                        ? "bg-white/15 text-white shadow-sm"
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                    )}
                    aria-current={isActive ? "page" : undefined}
                    title={collapsed ? label : undefined}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    {!collapsed && (
                      <>
                        <span className="truncate flex-1">{label}</span>
                        {badge && (
                          <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full">
                            {badge}
                          </span>
                        )}
                      </>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Collapse toggle - desktop only */}
      <div className="px-2 pb-2 hidden md:block">
        <button
          onClick={toggleCollapsed}
          className={cn(
            "flex items-center gap-3 w-full rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            "text-white/60 hover:bg-white/10 hover:text-white"
          )}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5 shrink-0" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5 shrink-0" />
              <span className="truncate">Collapse</span>
            </>
          )}
        </button>
      </div>

      {/* Profile */}
      <div
        className={cn(
          "p-3 border-t border-white/10 flex items-center gap-3",
          collapsed && "justify-center"
        )}
      >
        <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-semibold text-white shrink-0 ring-2 ring-white/20">
          {user.initials}
        </div>
        {!collapsed && (
          <>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
              <p className="text-xs text-indigo-200 truncate">{user.email}</p>
            </div>
            <button
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Log out"
            >
              <LogOut className="w-4 h-4 text-white/60" />
            </button>
          </>
        )}
      </div>
    </>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col h-screen bg-indigo-900 dark:bg-indigo-950 text-white transition-all duration-200 shrink-0",
          collapsed ? "w-16" : "w-60"
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={onMobileClose}
          />
          <aside className="fixed inset-y-0 left-0 w-60 bg-indigo-900 dark:bg-indigo-950 text-white z-50 md:hidden flex flex-col">
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  )
}
