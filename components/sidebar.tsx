"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
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
  ChevronDown,
  X,
  LayoutDashboard,
  Bell,
  BarChart3,
  FileStack,
  Plus,
  Receipt,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

// Service types for Cases submenu
const serviceTypes = [
  { code: "KS", label: "KS - Work Permit", count: 45 },
  { code: "WP", label: "WP - Extension", count: 32 },
  { code: "90D", label: "90D - Report", count: 28 },
  { code: "VISA", label: "VISA - Application", count: 15 },
  { code: "TM30", label: "TM30 - Notification", count: 7 },
]

interface MenuItem {
  label: string
  icon: React.ElementType
  href: string
  badge?: number
  submenu?: { code: string; label: string; count: number }[]
}

interface MenuGroup {
  label: string
  permission?: string
  items: MenuItem[]
}

// Menu items grouped by category
const menuGroups: MenuGroup[] = [
  {
    label: "Main",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
      {
        label: "Cases",
        icon: Briefcase,
        href: "/",
        badge: 127,
        submenu: serviceTypes,
      },
    ],
  },
  {
    label: "Administration",
    permission: "ADMIN",
    items: [
      { label: "Branches", icon: Building2, href: "/admin/branches" },
      { label: "Service Types", icon: Settings, href: "/admin/service-types" },
      { label: "Partners", icon: Building2, href: "/admin/partners" },
      { label: "Users", icon: Users, href: "/admin/users" },
    ],
  },
  {
    label: "Finance",
    permission: "FINANCE",
    items: [
      { label: "Invoices", icon: Receipt, href: "/finance/invoices" },
      { label: "Payments", icon: Banknote, href: "/finance/payments" },
      { label: "Reports", icon: BarChart3, href: "/finance/reports" },
    ],
  },
  {
    label: "System",
    permission: "SUPER_ADMIN",
    items: [
      { label: "Audit Log", icon: ShieldCheck, href: "/admin/audit" },
      { label: "Notifications", icon: Bell, href: "/notifications" },
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
  const [casesOpen, setCasesOpen] = useState(true)
  const pathname = usePathname()

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
      <div className="flex items-center justify-between h-12 px-3 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-white rounded-md flex items-center justify-center">
            <span className="text-indigo-900 font-bold text-xs">P</span>
          </div>
          {!collapsed && (
            <span className="text-base font-semibold text-white">Work</span>
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

      {/* Quick Case Button */}
      <div className="px-2 pt-3 pb-1">
        <Link
          href="/?action=new"
          onClick={onMobileClose}
          className={cn(
            "flex items-center justify-center gap-2 w-full rounded-lg py-2 text-sm font-medium transition-all",
            "bg-white text-indigo-900 hover:bg-white/90 shadow-sm",
            collapsed && "px-0"
          )}
        >
          <Plus className="w-4 h-4" />
          {!collapsed && <span>Quick Case</span>}
        </Link>
      </div>

      {/* Nav Groups */}
      <nav className="flex-1 px-2 py-3 flex flex-col gap-4 overflow-y-auto">
        {visibleGroups.map((group) => (
          <div key={group.label}>
            {/* Group Label */}
            {!collapsed && (
              <p className="px-2 mb-1.5 text-[10px] font-semibold text-white/40 uppercase tracking-wider">
                {group.label}
              </p>
            )}
            {collapsed && <div className="h-px bg-white/10 mx-2 mb-2" />}

            {/* Group Items */}
            <div className="flex flex-col gap-0.5">
              {group.items.map(({ label, icon: Icon, href, badge, submenu }) => {
                const isActive = activeItem === label || pathname === href
                const hasSubmenu = submenu && submenu.length > 0

                // If has submenu and not collapsed, render collapsible
                if (hasSubmenu && !collapsed) {
                  return (
                    <Collapsible
                      key={label}
                      open={casesOpen}
                      onOpenChange={setCasesOpen}
                    >
                      <CollapsibleTrigger asChild>
                        <button
                          className={cn(
                            "flex items-center gap-2.5 w-full rounded-md px-2 py-1.5 text-sm font-medium transition-all",
                            isActive
                              ? "bg-white/15 text-white"
                              : "text-white/70 hover:bg-white/10 hover:text-white"
                          )}
                        >
                          <Icon className="w-4 h-4 shrink-0" />
                          <span className="truncate flex-1 text-left">{label}</span>
                          {badge && (
                            <span className="text-[10px] bg-white/20 text-white px-1.5 py-0.5 rounded">
                              {badge}
                            </span>
                          )}
                          <ChevronDown
                            className={cn(
                              "w-3.5 h-3.5 shrink-0 transition-transform",
                              casesOpen && "rotate-180"
                            )}
                          />
                        </button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="overflow-hidden">
                        <div className="ml-3 pl-3 border-l border-white/10 mt-1 flex flex-col gap-0.5">
                          {/* All Cases Link */}
                          <Link
                            href={href}
                            onClick={onMobileClose}
                            className={cn(
                              "flex items-center gap-2 w-full rounded-md px-2 py-1.5 text-sm transition-all",
                              pathname === href
                                ? "bg-white/10 text-white"
                                : "text-white/60 hover:bg-white/5 hover:text-white"
                            )}
                          >
                            <FileStack className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate flex-1">All Cases</span>
                          </Link>
                          {/* Service Type Submenus */}
                          {submenu.map((service) => {
                            const serviceHref = `/?service=${service.code}`
                            const isServiceActive = pathname === "/" && 
                              typeof window !== "undefined" && 
                              new URLSearchParams(window.location.search).get("service") === service.code
                            return (
                              <Link
                                key={service.code}
                                href={serviceHref}
                                onClick={onMobileClose}
                                className={cn(
                                  "flex items-center gap-2 w-full rounded-md px-2 py-1.5 text-sm transition-all",
                                  isServiceActive
                                    ? "bg-white/10 text-white"
                                    : "text-white/60 hover:bg-white/5 hover:text-white"
                                )}
                              >
                                <span className="w-5 shrink-0 text-xs font-mono text-white/50">
                                  {service.code}
                                </span>
                                <span className="text-xs text-white/40 ml-auto tabular-nums">
                                  {service.count}
                                </span>
                              </Link>
                            )
                          })}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  )
                }

                // Regular menu item
                return (
                  <Link
                    key={label}
                    href={href}
                    onClick={onMobileClose}
                    className={cn(
                      "flex items-center gap-2.5 w-full rounded-md px-2 py-1.5 text-sm font-medium transition-all",
                      isActive
                        ? "bg-white/15 text-white"
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                    )}
                    aria-current={isActive ? "page" : undefined}
                    title={collapsed ? label : undefined}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {!collapsed && (
                      <>
                        <span className="truncate flex-1">{label}</span>
                        {badge && (
                          <span className="text-[10px] bg-white/20 text-white px-1.5 py-0.5 rounded">
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
