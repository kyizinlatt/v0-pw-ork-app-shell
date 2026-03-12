"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import {
  BTN, FORM_LABELS, FORM_PLACEHOLDERS, EMPTY_STATE,
  ROLE_LABELS, ORG_TYPE_LABELS,
} from "@/lib/constants"
import { Plus, Search, MoreHorizontal, Pencil, Trash2, ShieldCheck, Eye, EyeOff } from "lucide-react"

type UserRole = "SUPER_ADMIN" | "HQ_ADMIN" | "BRANCH_ADMIN" | "STAFF" | "PARTNER_ADMIN" | "PARTNER_STAFF"
type OrgType = "PWIN_HQ" | "PWIN_BRANCH" | "PARTNER"
type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED"

interface User {
  id: string
  name: string
  email: string
  role: UserRole
  orgType: OrgType
  orgName: string
  status: UserStatus
  lastLogin: string | null
  createdAt: string
}

const INITIAL_USERS: User[] = [
  { id: "1", name: "SRP Admin", email: "admin@pwork.th", role: "SUPER_ADMIN", orgType: "PWIN_HQ", orgName: "PWIN HQ", status: "ACTIVE", lastLogin: "2 min ago", createdAt: "Jan 2024" },
  { id: "2", name: "Narin K.", email: "narin.k@pwork.th", role: "HQ_ADMIN", orgType: "PWIN_HQ", orgName: "PWIN HQ", status: "ACTIVE", lastLogin: "1 hr ago", createdAt: "Jan 2024" },
  { id: "3", name: "Thida M.", email: "thida.m@pwork.th", role: "BRANCH_ADMIN", orgType: "PWIN_BRANCH", orgName: "KS Branch", status: "ACTIVE", lastLogin: "Today", createdAt: "Mar 2024" },
  { id: "4", name: "Win Ko", email: "win.ko@pwork.th", role: "STAFF", orgType: "PWIN_BRANCH", orgName: "BKK Branch", status: "ACTIVE", lastLogin: "Yesterday", createdAt: "Apr 2024" },
  { id: "5", name: "Partner Admin A", email: "admin@embassyexpress.th", role: "PARTNER_ADMIN", orgType: "PARTNER", orgName: "Embassy Express Co.", status: "ACTIVE", lastLogin: "3 hr ago", createdAt: "Jan 2024" },
  { id: "6", name: "Partner Staff B", email: "staff.b@visaplus.th", role: "PARTNER_STAFF", orgType: "PARTNER", orgName: "Visa Plus Ltd.", status: "INACTIVE", lastLogin: null, createdAt: "Jun 2024" },
]

const ROLE_COLORS: Record<UserRole, string> = {
  SUPER_ADMIN: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-800",
  HQ_ADMIN: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-400 dark:border-indigo-800",
  BRANCH_ADMIN: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800",
  STAFF: "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-700",
  PARTNER_ADMIN: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800",
  PARTNER_STAFF: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-400 dark:border-orange-800",
}

const STATUS_STYLE: Record<UserStatus, string> = {
  ACTIVE: "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800",
  INACTIVE: "bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-700",
  SUSPENDED: "bg-red-50 text-red-600 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-800",
}

const emptyForm = {
  name: "", email: "", role: "STAFF" as UserRole,
  orgType: "PWIN_BRANCH" as OrgType, orgName: "", status: "ACTIVE" as UserStatus, password: "",
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS)
  const [search, setSearch] = useState("")
  const [filterRole, setFilterRole] = useState<"ALL" | OrgType>("ALL")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [deletingUser, setDeletingUser] = useState<User | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [showPassword, setShowPassword] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.orgName.toLowerCase().includes(search.toLowerCase())
    const matchRole = filterRole === "ALL" || u.orgType === filterRole
    return matchSearch && matchRole
  })

  function openCreate() {
    setEditingUser(null)
    setForm(emptyForm)
    setShowPassword(false)
    setDialogOpen(true)
  }

  function openEdit(user: User) {
    setEditingUser(user)
    setForm({ name: user.name, email: user.email, role: user.role, orgType: user.orgType, orgName: user.orgName, status: user.status, password: "" })
    setShowPassword(false)
    setDialogOpen(true)
  }

  function openDelete(user: User) {
    setDeletingUser(user)
    setDeleteDialogOpen(true)
  }

  function handleSave() {
    if (!form.name || !form.email) return
    if (editingUser) {
      setUsers((prev) => prev.map((u) => u.id === editingUser.id ? { ...u, name: form.name, email: form.email, role: form.role, orgType: form.orgType, orgName: form.orgName, status: form.status } : u))
    } else {
      const newUser: User = {
        id: String(Date.now()), name: form.name, email: form.email, role: form.role,
        orgType: form.orgType, orgName: form.orgName, status: form.status,
        lastLogin: null,
        createdAt: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      }
      setUsers((prev) => [...prev, newUser])
    }
    setDialogOpen(false)
  }

  function handleDelete() {
    if (!deletingUser) return
    setUsers((prev) => prev.filter((u) => u.id !== deletingUser.id))
    setDeleteDialogOpen(false)
    setDeletingUser(null)
  }

  const orgFilterTabs: { label: string; value: "ALL" | OrgType }[] = [
    { label: "All", value: "ALL" },
    { label: "PWIN HQ", value: "PWIN_HQ" },
    { label: "PWIN Branch", value: "PWIN_BRANCH" },
    { label: "Partner", value: "PARTNER" },
  ]

  return (
    <TooltipProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar mobileOpen={mobileMenuOpen} onMobileClose={() => setMobileMenuOpen(false)} />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header onMobileMenuToggle={() => setMobileMenuOpen((v) => !v)} breadcrumb="Administration / Users" />
          <main className="flex-1 overflow-y-auto">
            <div className="p-6 max-w-6xl mx-auto space-y-6">

              {/* Page header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-lg font-semibold text-foreground">Users</h1>
                  <p className="text-sm text-muted-foreground mt-0.5">{users.filter((u) => u.status === "ACTIVE").length} active users</p>
                </div>
                <Button size="sm" onClick={openCreate} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  <Plus className="size-4 mr-1.5" />
                  {BTN.ADD} User
                </Button>
              </div>

              {/* Toolbar */}
              <div className="flex items-center gap-3 flex-wrap">
                <div className="relative max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={FORM_PLACEHOLDERS.SEARCH} className="pl-9 h-9" />
                </div>
                <div className="flex items-center bg-muted/50 rounded-lg p-1">
                  {orgFilterTabs.map(({ label, value }) => (
                    <button key={value} onClick={() => setFilterRole(value)} className={cn("h-7 px-3 text-xs font-medium rounded-md transition-all", filterRole === value ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stats strip */}
              <div className="grid grid-cols-4 gap-3">
                {([
                  { label: "PWIN HQ", count: users.filter((u) => u.orgType === "PWIN_HQ").length, color: "text-indigo-600" },
                  { label: "PWIN Branch", count: users.filter((u) => u.orgType === "PWIN_BRANCH").length, color: "text-blue-600" },
                  { label: "Partner", count: users.filter((u) => u.orgType === "PARTNER").length, color: "text-amber-600" },
                  { label: "Inactive / Suspended", count: users.filter((u) => u.status !== "ACTIVE").length, color: "text-slate-500" },
                ] as const).map((stat) => (
                  <div key={stat.label} className="border border-border rounded-lg p-3 bg-card">
                    <p className={cn("text-xl font-semibold tabular-nums", stat.color)}>{stat.count}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Table */}
              <div className="border border-border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">User</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Role</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Organization</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Last Login</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Created</th>
                      <th className="px-4 py-3 w-10" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-12 text-center text-sm text-muted-foreground">{EMPTY_STATE.NO_USERS}</td>
                      </tr>
                    ) : (
                      filtered.map((user) => (
                        <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="size-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-xs font-semibold text-indigo-700 dark:text-indigo-300 shrink-0">
                                {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                              </div>
                              <div>
                                <p className="font-medium text-foreground">{user.name}</p>
                                <p className="text-xs text-muted-foreground">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={cn("inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded border", ROLE_COLORS[user.role])}>
                              <ShieldCheck className="size-3" />
                              {ROLE_LABELS[user.role]}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-foreground">{user.orgName}</p>
                            <p className="text-xs text-muted-foreground">{ORG_TYPE_LABELS[user.orgType]}</p>
                          </td>
                          <td className="px-4 py-3">
                            <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded border", STATUS_STYLE[user.status])}>
                              <span className={cn("size-1.5 rounded-full", user.status === "ACTIVE" ? "bg-green-500" : user.status === "SUSPENDED" ? "bg-red-500" : "bg-slate-400")} />
                              {user.status.charAt(0) + user.status.slice(1).toLowerCase()}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">
                            {user.lastLogin ?? <span className="text-xs text-muted-foreground/50">Never</span>}
                          </td>
                          <td className="px-4 py-3 text-xs text-muted-foreground">{user.createdAt}</td>
                          <td className="px-4 py-3">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="size-8">
                                  <MoreHorizontal className="size-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-40">
                                <DropdownMenuItem onClick={() => openEdit(user)}>
                                  <Pencil className="size-3.5 mr-2" />{BTN.EDIT}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => openDelete(user)} className="text-red-600 focus:text-red-600">
                                  <Trash2 className="size-3.5 mr-2" />{BTN.DELETE}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>

        {/* Create / Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingUser ? "Edit User" : "Add User"}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-2">
              <div className="space-y-1.5">
                <Label>{FORM_LABELS.USER_NAME}</Label>
                <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Full name" />
              </div>
              <div className="space-y-1.5">
                <Label>{FORM_LABELS.USER_EMAIL}</Label>
                <Input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="user@org.com" />
              </div>
              {!editingUser && (
                <div className="col-span-2 space-y-1.5">
                  <Label>{FORM_LABELS.USER_PASSWORD}</Label>
                  <div className="relative">
                    <Input type={showPassword ? "text" : "password"} value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} placeholder="Min 8 characters" />
                    <button onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>
              )}
              <div className="space-y-1.5">
                <Label>{FORM_LABELS.USER_ORG} Type</Label>
                <div className="flex flex-col gap-1.5">
                  {(["PWIN_HQ", "PWIN_BRANCH", "PARTNER"] as OrgType[]).map((t) => (
                    <button key={t} onClick={() => setForm((f) => ({ ...f, orgType: t }))} className={cn("py-1.5 px-3 text-xs font-medium rounded-md border text-left transition-all", form.orgType === t ? "bg-indigo-600 text-white border-indigo-600" : "border-border text-muted-foreground hover:border-muted-foreground")}>
                      {ORG_TYPE_LABELS[t]}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>{FORM_LABELS.USER_ROLE}</Label>
                <div className="flex flex-col gap-1.5">
                  {(Object.keys(ROLE_LABELS) as UserRole[]).map((r) => (
                    <button key={r} onClick={() => setForm((f) => ({ ...f, role: r }))} className={cn("py-1.5 px-3 text-xs font-medium rounded-md border text-left transition-all", form.role === r ? "bg-indigo-600 text-white border-indigo-600" : "border-border text-muted-foreground hover:border-muted-foreground")}>
                      {ROLE_LABELS[r]}
                    </button>
                  ))}
                </div>
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label>{FORM_LABELS.USER_ORG} Name</Label>
                <Input value={form.orgName} onChange={(e) => setForm((f) => ({ ...f, orgName: e.target.value }))} placeholder="e.g. PWIN HQ, KS Branch, Embassy Express Co." />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label>{FORM_LABELS.USER_STATUS}</Label>
                <div className="flex gap-2">
                  {(["ACTIVE", "INACTIVE", "SUSPENDED"] as UserStatus[]).map((s) => (
                    <button key={s} onClick={() => setForm((f) => ({ ...f, status: s }))} className={cn("flex-1 py-2 text-sm font-medium rounded-md border transition-all", form.status === s ? "bg-indigo-600 text-white border-indigo-600" : "border-border text-muted-foreground hover:border-muted-foreground")}>
                      {s.charAt(0) + s.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>{BTN.CANCEL}</Button>
              <Button onClick={handleSave} disabled={!form.name || !form.email} className="bg-indigo-600 hover:bg-indigo-700 text-white">{BTN.SAVE}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirm */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader><DialogTitle>Delete User</DialogTitle></DialogHeader>
            <p className="text-sm text-muted-foreground py-2">
              Are you sure you want to delete <span className="font-medium text-foreground">{deletingUser?.name}</span>? They will lose access immediately.
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>{BTN.CANCEL}</Button>
              <Button variant="destructive" onClick={handleDelete}>{BTN.DELETE}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  )
}
