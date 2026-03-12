"use client"

import { useState } from "react"
import {
  Folder,
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
  { label: "Cases", icon: Folder },
  { label: "Service Types", icon: Settings },
  { label: "Partners", icon: Building2 },
  { label: "Users", icon: Users },
  { label: "Holidays", icon: CalendarDays },
  { label: "Finance", icon: Banknote },
  { label: "Audit Log", icon: ShieldCheck },
]

interface SidebarProps {
  activeItem?: string
}

export function Sidebar({ activeItem = "Cases" }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        "flex flex-col h-screen bg-indigo-900 text-white transition-all duration-200 shrink-0",
        collapsed ? "w-14" : "w-60"
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-14 px-3 border-b border-white/10">
        {!collapsed && (
          <span className="text-xl font-bold text-white tracking-tight">PWork</span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-md hover:bg-white/10 transition-colors ml-auto"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4 text-white/70" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-white/70" />
          )}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-2 flex flex-col gap-1 overflow-y-auto">
        {navItems.map(({ label, icon: Icon }) => {
          const isActive = activeItem === label
          return (
            <button
              key={label}
              className={cn(
                "flex items-center gap-3 w-full rounded-lg px-3 py-2 text-sm font-medium transition-colors text-white/80",
                isActive
                  ? "bg-white/20 text-white"
                  : "hover:bg-white/10 hover:text-white"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
            </button>
          )
        })}
      </nav>

      {/* Profile */}
      <div
        className={cn(
          "p-3 border-t border-white/10 flex items-center gap-2",
          collapsed && "justify-center"
        )}
      >
        <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-semibold text-white shrink-0">
          SA
        </div>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Super Admin</p>
            <p className="text-xs text-indigo-200 truncate">SUPER_ADMIN</p>
          </div>
        )}
        {!collapsed && (
          <button
            className="p-1.5 rounded-md hover:bg-white/10 transition-colors"
            aria-label="Log out"
          >
            <LogOut className="w-4 h-4 text-white/60" />
          </button>
        )}
      </div>
    </aside>
  )
}
