"use client"

import { Menu, Bell, Search } from "lucide-react"

interface HeaderProps {
  breadcrumb?: string
}

export function Header({ breadcrumb = "Cases" }: HeaderProps) {
  return (
    <header className="h-14 sticky top-0 z-10 bg-white border-b border-gray-200 flex items-center px-4 gap-4">
      {/* Left: hamburger + breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5 text-gray-500" />
        </button>
        <nav aria-label="Breadcrumb">
          <span className="text-sm font-semibold text-gray-800">{breadcrumb}</span>
        </nav>
      </div>

      {/* Center: search */}
      <div className="flex-1 flex justify-center">
        <button
          className="flex items-center gap-2 w-52 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-400 hover:border-gray-300 hover:bg-gray-50 transition-colors"
          aria-label="Search cases"
        >
          <Search className="w-3.5 h-3.5 shrink-0" />
          <span className="flex-1 text-left">Search cases...</span>
          <kbd className="text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded font-mono">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: bell + avatar */}
      <div className="flex items-center gap-3">
        <button
          className="relative p-1.5 rounded-md hover:bg-gray-100 transition-colors"
          aria-label="Notifications (3 unread)"
        >
          <Bell className="w-5 h-5 text-gray-500" />
          <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
            3
          </span>
        </button>
        <div
          className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-semibold text-white"
          aria-label="Super Admin"
        >
          SA
        </div>
      </div>
    </header>
  )
}
