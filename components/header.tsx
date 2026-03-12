"use client"

import { Menu, Bell, Search } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  breadcrumb?: string
  user?: {
    initials: string
    name: string
    email?: string
  }
  notificationCount?: number
  onMenuClick?: () => void
}

export function Header({
  breadcrumb = "Cases",
  user = { initials: "SA", name: "Super Admin", email: "admin@pwork.com" },
  notificationCount = 3,
  onMenuClick,
}: HeaderProps) {
  return (
    <header className="h-14 sticky top-0 z-40 bg-background border-b border-border flex items-center px-4 gap-4">
      {/* Left: hamburger + breadcrumb */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuClick}
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </Button>
        <nav aria-label="Breadcrumb">
          <span className="text-sm font-semibold text-foreground">{breadcrumb}</span>
        </nav>
      </div>

      {/* Center: search */}
      <div className="flex-1 flex justify-center">
        <button
          className="hidden sm:flex items-center gap-2 w-64 px-3 py-2 border border-border rounded-lg text-sm text-muted-foreground hover:bg-muted/50 hover:border-muted-foreground/30 transition-all"
          aria-label="Search cases (Cmd+K)"
        >
          <Search className="w-4 h-4 shrink-0" />
          <span className="flex-1 text-left">Search cases...</span>
          <kbd className="text-[11px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded border border-border font-mono">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: theme toggle + bell + avatar */}
      <div className="flex items-center gap-2">
        <ThemeToggle />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              aria-label={`Notifications (${notificationCount} unread)`}
            >
              <Bell className="w-5 h-5" />
              {notificationCount > 0 && (
                <span className="absolute top-1 right-1 min-w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none px-1">
                  {notificationCount > 99 ? "99+" : notificationCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
              <span className="text-sm font-medium">SLA Warning: HQ-KS-110326-0002</span>
              <span className="text-xs text-muted-foreground">Case due in 24 hours</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
              <span className="text-sm font-medium">New message from Win Tun</span>
              <span className="text-xs text-muted-foreground">Case #HQ-KS-110326-0001</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
              <span className="text-sm font-medium">Document uploaded</span>
              <span className="text-xs text-muted-foreground">passport-copy.pdf added to case</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center text-sm text-indigo-600 font-medium">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-semibold text-white cursor-pointer hover:bg-indigo-700 transition-colors"
              aria-label={user.name}
            >
              {user.initials}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>{user.name}</span>
                <span className="text-xs font-normal text-muted-foreground">{user.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile Settings</DropdownMenuItem>
            <DropdownMenuItem>Help & Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
