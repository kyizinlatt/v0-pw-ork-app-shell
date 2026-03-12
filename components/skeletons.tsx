import { cn } from "@/lib/utils"

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export function StatsCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="h-10 w-10 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-4">
      {/* Filter bar skeleton */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <Skeleton className="h-10 w-full sm:w-96" />
        <Skeleton className="h-10 w-full sm:w-52" />
      </div>
      
      {/* Table skeleton */}
      <div className="rounded-lg border border-border overflow-hidden">
        {/* Header */}
        <div className="border-b border-border bg-muted/30 px-3 py-3">
          <div className="flex gap-4">
            {[120, 100, 140, 80, 90, 80, 80].map((w, i) => (
              <Skeleton key={i} className="h-4" style={{ width: w }} />
            ))}
          </div>
        </div>
        {/* Rows */}
        {[...Array(rows)].map((_, i) => (
          <div key={i} className="border-b border-border px-3 py-4 last:border-0">
            <div className="flex gap-4 items-center">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function DrawerSkeleton() {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      
      {/* Sections */}
      {[...Array(5)].map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="h-4 w-24" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}
