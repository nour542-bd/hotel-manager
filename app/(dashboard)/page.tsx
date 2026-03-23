"use client"

import { DashboardStats, RevenueCard } from "@/components/dashboard-stats"
import { RecentReservations } from "@/components/recent-reservations"
import { DashboardChart } from "@/components/dashboard-chart"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Tableau de Bord</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Vue d&apos;ensemble de votre activite hoteliere
        </p>
      </div>
      <DashboardStats />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <DashboardChart />
          <RevenueCard />
        </div>
        <RecentReservations />
      </div>
    </div>
  )
}
