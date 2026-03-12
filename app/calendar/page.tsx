"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"

// Sample events data
const sampleEvents = [
  { id: "1", title: "SLA Due: HQ-KS-110326-0001", date: "2026-03-15", type: "sla", caseNumber: "HQ-KS-110326-0001" },
  { id: "2", title: "Partner Meeting", date: "2026-03-13", type: "meeting" },
  { id: "3", title: "SLA Due: HQ-WP-110326-0002", date: "2026-03-18", type: "sla", caseNumber: "HQ-WP-110326-0002" },
  { id: "4", title: "Document Deadline", date: "2026-03-20", type: "deadline" },
  { id: "5", title: "Staff Training", date: "2026-03-25", type: "meeting" },
  { id: "6", title: "SLA Due: HQ-90D-110326-0003", date: "2026-03-13", type: "sla", caseNumber: "HQ-90D-110326-0003" },
]

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

export default function CalendarPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 13)) // March 13, 2026
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date(2026, 2, 13))

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  
  // Get first day of month and total days
  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()

  // Navigate months
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))
  const goToToday = () => {
    const today = new Date(2026, 2, 13)
    setCurrentDate(today)
    setSelectedDate(today)
  }

  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0]
    return sampleEvents.filter((e) => e.date === dateStr)
  }

  // Get events for selected date
  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : []

  // Build calendar grid
  const calendarDays: { date: Date; isCurrentMonth: boolean }[] = []
  
  // Previous month days
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    calendarDays.push({
      date: new Date(year, month - 1, daysInPrevMonth - i),
      isCurrentMonth: false,
    })
  }
  
  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({
      date: new Date(year, month, i),
      isCurrentMonth: true,
    })
  }
  
  // Next month days to fill grid
  const remainingDays = 42 - calendarDays.length
  for (let i = 1; i <= remainingDays; i++) {
    calendarDays.push({
      date: new Date(year, month + 1, i),
      isCurrentMonth: false,
    })
  }

  const isToday = (date: Date) => {
    const today = new Date(2026, 2, 13)
    return date.toDateString() === today.toDateString()
  }

  const isSelected = (date: Date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString()
  }

  return (
    <div className="flex h-screen bg-muted/30">
      <Sidebar
        activeItem="Calendar"
        onMobileClose={() => setMobileMenuOpen(false)}
        mobileOpen={mobileMenuOpen}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />

        <main className="flex-1 overflow-auto">
          <div className="p-6 max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Calendar</h1>
                <p className="text-sm text-muted-foreground">View SLA deadlines, meetings, and events</p>
              </div>
              <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
                <Plus className="size-4" />
                Add Event
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Calendar Grid */}
              <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {months[month]} {year}
              </CardTitle>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={goToToday}>
                  Today
                </Button>
                <Button variant="ghost" size="icon" className="size-8" onClick={prevMonth}>
                  <ChevronLeft className="size-4" />
                </Button>
                <Button variant="ghost" size="icon" className="size-8" onClick={nextMonth}>
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Days of week header */}
            <div className="grid grid-cols-7 mb-2">
              {daysOfWeek.map((day) => (
                <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
              {calendarDays.map(({ date, isCurrentMonth }, idx) => {
                const events = getEventsForDate(date)
                const hasEvents = events.length > 0
                const hasSla = events.some((e) => e.type === "sla")

                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedDate(date)}
                    className={cn(
                      "relative h-20 p-1 text-left transition-colors bg-background hover:bg-muted/50",
                      !isCurrentMonth && "bg-muted/30 text-muted-foreground",
                      isSelected(date) && "ring-2 ring-indigo-500 ring-inset"
                    )}
                  >
                    <span
                      className={cn(
                        "inline-flex items-center justify-center size-6 text-sm rounded-full",
                        isToday(date) && "bg-indigo-600 text-white font-medium"
                      )}
                    >
                      {date.getDate()}
                    </span>
                    {hasEvents && (
                      <div className="mt-1 space-y-0.5">
                        {events.slice(0, 2).map((event) => (
                          <div
                            key={event.id}
                            className={cn(
                              "text-[10px] leading-tight truncate px-1 py-0.5 rounded",
                              event.type === "sla" && "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
                              event.type === "meeting" && "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
                              event.type === "deadline" && "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                            )}
                          >
                            {event.title}
                          </div>
                        ))}
                        {events.length > 2 && (
                          <div className="text-[10px] text-muted-foreground px-1">
                            +{events.length - 2} more
                          </div>
                        )}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Selected Date Events */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {selectedDate ? (
                <>
                  {months[selectedDate.getMonth()]} {selectedDate.getDate()}, {selectedDate.getFullYear()}
                </>
              ) : (
                "Select a date"
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDateEvents.length > 0 ? (
              <div className="space-y-3">
                {selectedDateEvents.map((event) => (
                  <div
                    key={event.id}
                    className={cn(
                      "p-3 rounded-lg border-l-4",
                      event.type === "sla" && "bg-rose-50 border-rose-500 dark:bg-rose-950/20",
                      event.type === "meeting" && "bg-indigo-50 border-indigo-500 dark:bg-indigo-950/20",
                      event.type === "deadline" && "bg-amber-50 border-amber-500 dark:bg-amber-950/20"
                    )}
                  >
                    <p className="text-sm font-medium text-foreground">{event.title}</p>
                    {event.caseNumber && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Case: {event.caseNumber}
                      </p>
                    )}
                    <span
                      className={cn(
                        "inline-block mt-2 text-xs px-2 py-0.5 rounded-full capitalize",
                        event.type === "sla" && "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300",
                        event.type === "meeting" && "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300",
                        event.type === "deadline" && "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
                      )}
                    >
                      {event.type === "sla" ? "SLA Due" : event.type}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">No events for this date</p>
              </div>
            )}
              </CardContent>
              </Card>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-6 mt-6">
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-rose-500" />
                <span className="text-sm text-muted-foreground">SLA Due</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-indigo-500" />
                <span className="text-sm text-muted-foreground">Meeting</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-amber-500" />
                <span className="text-sm text-muted-foreground">Deadline</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
