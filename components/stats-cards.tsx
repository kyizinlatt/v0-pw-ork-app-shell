"use client"

import { cn } from "@/lib/utils"
import { Briefcase, Clock, CheckCircle2, AlertTriangle } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  change?: string
  changeType?: "positive" | "negative" | "neutral"
  icon: React.ReactNode
  iconBg: string
}

function StatCard({ title, value, change, changeType = "neutral", icon, iconBg }: StatCardProps) {
  return (
    <div className="bg-card rounded-xl border border-border p-5 transition-shadow hover:shadow-sm">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-semibold tracking-tight text-foreground">{value}</p>
          {change && (
            <p
              className={cn(
                "text-xs font-medium",
                changeType === "positive" && "text-green-600",
                changeType === "negative" && "text-red-600",
                changeType === "neutral" && "text-muted-foreground"
              )}
            >
              {change}
            </p>
          )}
        </div>
        <div className={cn("p-2.5 rounded-lg", iconBg)}>{icon}</div>
      </div>
    </div>
  )
}

interface StatsCardsProps {
  stats?: {
    totalCases: number
    pendingCases: number
    completedToday: number
    slaBreach: number
  }
}

export function StatsCards({
  stats = {
    totalCases: 127,
    pendingCases: 43,
    completedToday: 8,
    slaBreach: 3,
  },
}: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Active Cases"
        value={stats.totalCases}
        change="+12 from last week"
        changeType="positive"
        icon={<Briefcase className="h-5 w-5 text-indigo-600" />}
        iconBg="bg-indigo-100 dark:bg-indigo-950"
      />
      <StatCard
        title="Pending Action"
        value={stats.pendingCases}
        change="5 need attention"
        changeType="neutral"
        icon={<Clock className="h-5 w-5 text-amber-600" />}
        iconBg="bg-amber-100 dark:bg-amber-950"
      />
      <StatCard
        title="Completed Today"
        value={stats.completedToday}
        change="+3 from yesterday"
        changeType="positive"
        icon={<CheckCircle2 className="h-5 w-5 text-green-600" />}
        iconBg="bg-green-100 dark:bg-green-950"
      />
      <StatCard
        title="SLA Breach Risk"
        value={stats.slaBreach}
        change="Requires immediate action"
        changeType="negative"
        icon={<AlertTriangle className="h-5 w-5 text-red-600" />}
        iconBg="bg-red-100 dark:bg-red-950"
      />
    </div>
  )
}
