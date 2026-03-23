"use client"

import { Building2, BedDouble, Users, CalendarCheck, TrendingUp, DollarSign } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { hotels, reservations, clients, rooms } from "@/lib/data"

const stats = [
  {
    title: "Hotels Actifs",
    value: hotels.filter((h) => h.status === "active").length,
    total: hotels.length,
    icon: Building2,
    trend: "+1 ce mois",
  },
  {
    title: "Chambres Disponibles",
    value: rooms.filter((r) => r.status === "available").length,
    total: rooms.length,
    icon: BedDouble,
    trend: `${rooms.filter((r) => r.status === "occupied").length} occupees`,
  },
  {
    title: "Reservations Actives",
    value: reservations.filter((r) => r.status === "confirmed" || r.status === "checked_in").length,
    total: reservations.length,
    icon: CalendarCheck,
    trend: `${reservations.filter((r) => r.status === "pending").length} en attente`,
  },
  {
    title: "Clients Enregistres",
    value: clients.length,
    total: clients.reduce((sum, c) => sum + c.totalStays, 0),
    icon: Users,
    trend: `${clients.reduce((sum, c) => sum + c.totalStays, 0)} sejours total`,
  },
]

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="border-0 bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {stat.title}
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
              <stat.icon className="h-4 w-4 text-accent" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-accent" />
              {stat.trend}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function RevenueCard() {
  const totalRevenue = reservations.reduce((sum, r) => sum + r.totalPrice, 0)

  return (
    <Card className="border-0 bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-accent" />
          Revenu Total
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-foreground">
          {totalRevenue.toLocaleString("fr-FR")} MAD
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Base sur {reservations.length} reservations
        </p>
      </CardContent>
    </Card>
  )
}
