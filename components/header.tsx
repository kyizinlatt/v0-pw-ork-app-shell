"use client"

import { Menu, Bell, Search } from "lucide-react"

interface HeaderProps {
  breadcrumb?: string
  user?: {
    initials: string
    name: string
  }
  notificationCount?: number
}

export function Header({
  breadcrumb = "Cases",
  user = { initials: "SA", name: "Super Admin" },
  notificationCount = 3,
}: HeaderProps) {
  return (
    <header className="h-14 sticky top-0 z-40 bg-background border-b border-border flex items-center px-4 gap-4">
      {/* Left: hamburger + breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          className="p-1.5 rounded-md hover:bg-muted/50 transition-colors md:hidden"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5 text-muted-foreground" />
        </button>
        <nav aria-label="Breadcrumb">
          <span className="text-sm font-semibold text-foreground">{breadcrumb}</span>
        </nav>
      </div>

      {/* Center: search */}
      <div className="flex-1 flex justify-center">
        <button
          className="flex items-center gap-2 w-52 px-3 py-1.5 border border-border rounded-lg text-sm text-muted-foreground hover:bg-muted/50 transition-colors"
          aria-label="Search cases (Cmd+K)"
        >
          <Search className="w-3.5 h-3.5 shrink-0" />
          <span className="flex-1 text-left">Search cases...</span>
          <kbd className="text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded font-mono">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: bell + avatar */}
      <div className="flex items-center gap-3">
        <button
          className="relative p-1.5 rounded-md hover:bg-muted/50 transition-colors"
          aria-label={`Notifications (${notificationCount} unread)`}
        >
          <Bell className="w-5 h-5 text-muted-foreground" />
          {notificationCount > 0 && (
            <span className="absolute top-0.5 right-0.5 min-w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none px-1">
              {notificationCount > 99 ? "99+" : notificationCount}
            </span>
          )}
        </button>
        <div
          className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-semibold text-white cursor-pointer"
          aria-label={user.name}
          title={user.name}
        >
          {user.initials}
        </div>
      </div>
    </header>
  )
}
