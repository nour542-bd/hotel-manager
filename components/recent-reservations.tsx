"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { reservations } from "@/lib/data"

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  confirmed: { label: "Confirmee", variant: "default" },
  pending: { label: "En attente", variant: "secondary" },
  checked_in: { label: "En cours", variant: "outline" },
  checked_out: { label: "Terminee", variant: "secondary" },
  cancelled: { label: "Annulee", variant: "destructive" },
}

export function RecentReservations() {
  return (
    <Card className="border-0 bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Reservations Recentes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {reservations.slice(0, 5).map((res) => {
            const config = statusConfig[res.status]
            return (
              <div
                key={res.id}
                className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/30 p-3"
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium text-foreground">{res.clientName}</span>
                  <span className="text-xs text-muted-foreground">
                    {res.hotelName} - Chambre {res.roomNumber}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {res.checkIn} - {res.checkOut}
                  </span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge variant={config.variant} className="text-[10px]">
                    {config.label}
                  </Badge>
                  <span className="text-xs font-semibold text-foreground">
                    {res.totalPrice.toLocaleString("fr-FR")} MAD
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
