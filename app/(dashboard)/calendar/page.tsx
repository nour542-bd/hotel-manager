"use client"

import { useState, useMemo } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { reservations } from "@/lib/data"

const MONTHS_FR = [
  "Janvier", "Fevrier", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Decembre",
]
const DAYS_FR = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]

const statusColors: Record<string, string> = {
  confirmed: "bg-emerald-500",
  pending: "bg-amber-500",
  checked_in: "bg-blue-500",
  checked_out: "bg-slate-500",
  cancelled: "bg-red-500",
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 1)) // Feb 2026
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfWeek = (new Date(year, month, 1).getDay() + 6) % 7 // Monday-based

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))

  const calendarDays = useMemo(() => {
    const days: { date: number; dateStr: string; isCurrentMonth: boolean }[] = []

    // Previous month padding
    const prevMonthDays = new Date(year, month, 0).getDate()
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const d = prevMonthDays - i
      const m = month === 0 ? 12 : month
      const y = month === 0 ? year - 1 : year
      days.push({ date: d, dateStr: `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`, isCurrentMonth: false })
    }

    // Current month
    for (let d = 1; d <= daysInMonth; d++) {
      days.push({
        date: d,
        dateStr: `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
        isCurrentMonth: true,
      })
    }

    // Next month padding
    const remaining = 42 - days.length
    for (let d = 1; d <= remaining; d++) {
      const m = month + 2 > 12 ? 1 : month + 2
      const y = month + 2 > 12 ? year + 1 : year
      days.push({ date: d, dateStr: `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`, isCurrentMonth: false })
    }

    return days
  }, [year, month, daysInMonth, firstDayOfWeek])

  const getReservationsForDate = (dateStr: string) => {
    return reservations.filter((r) => {
      const checkIn = new Date(r.checkIn)
      const checkOut = new Date(r.checkOut)
      const date = new Date(dateStr)
      return date >= checkIn && date <= checkOut
    })
  }

  const selectedReservations = selectedDate ? getReservationsForDate(selectedDate) : []

  const todayStr = new Date().toISOString().split("T")[0]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Calendrier</h1>
        <p className="text-sm text-muted-foreground mt-1">Visualisez les reservations sur le calendrier</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <Card className="border-0 bg-card shadow-sm lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={prevMonth} className="h-8 w-8">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <CardTitle className="text-lg font-semibold text-foreground min-w-[180px] text-center">
                {MONTHS_FR[month]} {year}
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={nextMonth} className="h-8 w-8">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="hidden md:flex items-center gap-4 text-[10px]">
              {Object.entries({ confirmed: "Confirmee", pending: "En attente", checked_in: "En cours", checked_out: "Terminee", cancelled: "Annulee" }).map(([key, label]) => (
                <div key={key} className="flex items-center gap-1.5">
                  <span className={`h-2 w-2 rounded-full ${statusColors[key]}`} />
                  <span className="text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-px">
              {DAYS_FR.map((day) => (
                <div key={day} className="p-2 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {day}
                </div>
              ))}
              {calendarDays.map((day, idx) => {
                const dayReservations = getReservationsForDate(day.dateStr)
                const isToday = day.dateStr === todayStr
                const isSelected = day.dateStr === selectedDate
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedDate(day.dateStr)}
                    className={`
                      min-h-[80px] rounded-lg p-1.5 text-left transition-colors border
                      ${day.isCurrentMonth ? "bg-card" : "bg-muted/20"}
                      ${isSelected ? "border-accent ring-1 ring-accent" : "border-transparent"}
                      ${isToday ? "bg-accent/5" : ""}
                      hover:bg-muted/50
                    `}
                  >
                    <span className={`
                      text-xs font-medium
                      ${day.isCurrentMonth ? "text-foreground" : "text-muted-foreground/40"}
                      ${isToday ? "text-accent font-bold" : ""}
                    `}>
                      {day.date}
                    </span>
                    <div className="mt-1 flex flex-col gap-0.5">
                      {dayReservations.slice(0, 2).map((res) => (
                        <div key={res.id} className={`flex items-center gap-1 rounded px-1 py-0.5`}>
                          <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${statusColors[res.status]}`} />
                          <span className="text-[9px] text-muted-foreground truncate">{res.clientName.split(" ")[0]}</span>
                        </div>
                      ))}
                      {dayReservations.length > 2 && (
                        <span className="text-[9px] text-accent font-medium px-1">+{dayReservations.length - 2}</span>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              {selectedDate ? `Reservations du ${selectedDate}` : "Selectionnez une date"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedReservations.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                {selectedDate ? "Aucune reservation pour cette date." : "Cliquez sur une date pour voir les reservations."}
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {selectedReservations.map((res) => (
                  <div key={res.id} className="rounded-lg border border-border/50 bg-muted/30 p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">{res.clientName}</span>
                      <Badge variant="outline" className="text-[10px]">
                        {res.status === "confirmed" ? "Confirmee" : res.status === "pending" ? "En attente" : res.status === "checked_in" ? "En cours" : res.status === "checked_out" ? "Terminee" : "Annulee"}
                      </Badge>
                    </div>
                    <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                      <span>{res.hotelName}</span>
                      <span>Chambre {res.roomNumber}</span>
                      <span>{res.checkIn} - {res.checkOut}</span>
                      <span className="font-semibold text-foreground mt-1">{res.totalPrice.toLocaleString("fr-FR")} MAD</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
