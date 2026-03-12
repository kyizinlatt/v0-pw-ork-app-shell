"use client"

import { useState, useEffect } from "react"
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
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Cases", icon: Briefcase, href: "/cases" },
  { label: "Service Types", icon: Settings, href: "/settings/service-types", adminOnly: true },
  { label: "Partners", icon: Building2, href: "/settings/partners", adminOnly: true },
  { label: "Users", icon: Users, href: "/settings/users", adminOnly: true },
  { label: "Holidays", icon: CalendarDays, href: "/settings/holidays", adminOnly: true },
  { label: "Finance", icon: Banknote, href: "/finance", financeOnly: true },
  { label: "Audit Log", icon: ShieldCheck, href: "/admin/audit", superAdminOnly: true },
]

interface SidebarProps {
  activeItem?: string
  user?: {
    name: string
    role: string
    initials: string
  }
}

export function Sidebar({
  activeItem = "Cases",
  user = { name: "Super Admin", role: "SUPER_ADMIN", initials: "SA" },
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

  return (
    <aside
      className={cn(
        "flex flex-col h-screen bg-indigo-900 dark:bg-indigo-950 text-white transition-all duration-200 shrink-0",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className="flex items-center h-14 px-4 border-b border-white/10">
        <span className="text-xl font-bold text-white">
          {collapsed ? "PW" : "PWork"}
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-2 flex flex-col gap-1 overflow-y-auto">
        {navItems.map(({ label, icon: Icon, href }) => {
          const isActive = activeItem === label
          return (
            <a
              key={label}
              href={href}
              className={cn(
                "flex items-center gap-3 w-full rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-white/20 text-white"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
            </a>
          )
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="px-2 pb-2">
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
        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-semibold text-white shrink-0">
          {user.initials}
        </div>
        {!collapsed && (
          <>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
              <p className="text-xs text-indigo-200 truncate">{user.role}</p>
            </div>
            <button
              className="p-1.5 rounded-md hover:bg-white/10 transition-colors"
              aria-label="Log out"
            >
              <LogOut className="w-4 h-4 text-white/60" />
            </button>
          </>
        )}
      </div>
    </aside>
  )
}
