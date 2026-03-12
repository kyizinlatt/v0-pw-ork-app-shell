"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Briefcase,
  Settings,
  Building2,
  Users,
  CalendarDays,
  Banknote,
  ShieldCheck,
  Plus,
  Search,
  Moon,
  Sun,
} from "lucide-react"

interface CommandPaletteProps {
  onCreateCase?: () => void
  onToggleTheme?: () => void
}

export function CommandPalette({ onCreateCase, onToggleTheme }: CommandPaletteProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = useCallback((command: () => void) => {
    setOpen(false)
    command()
  }, [])

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Quick Actions">
          <CommandItem onSelect={() => runCommand(() => onCreateCase?.())}>
            <Plus className="mr-2 h-4 w-4" />
            Create New Case
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => onToggleTheme?.())}>
            <Sun className="mr-2 h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute mr-2 h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            Toggle Theme
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => runCommand(() => router.push("/"))}>
            <Briefcase className="mr-2 h-4 w-4" />
            Cases
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/settings/service-types"))}>
            <Settings className="mr-2 h-4 w-4" />
            Service Types
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/settings/partners"))}>
            <Building2 className="mr-2 h-4 w-4" />
            Partners
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/settings/users"))}>
            <Users className="mr-2 h-4 w-4" />
            Users
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/settings/holidays"))}>
            <CalendarDays className="mr-2 h-4 w-4" />
            Holidays
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/finance"))}>
            <Banknote className="mr-2 h-4 w-4" />
            Finance
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/admin/audit"))}>
            <ShieldCheck className="mr-2 h-4 w-4" />
            Audit Log
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Recent Cases">
          <CommandItem onSelect={() => runCommand(() => {})}>
            <Search className="mr-2 h-4 w-4" />
            HQ-KS-110326-0001 — Win Tun
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => {})}>
            <Search className="mr-2 h-4 w-4" />
            HQ-KS-110326-0002 — Aung Aung
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => {})}>
            <Search className="mr-2 h-4 w-4" />
            HQ-WP-110326-0004 — Golden Star Co.
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
