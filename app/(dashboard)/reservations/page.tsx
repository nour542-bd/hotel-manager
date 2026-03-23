"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2, MoreHorizontal, Calendar, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CrudDialog } from "@/components/crud-dialog"
import { reservations as initialReservations, hotels, rooms, clients, type Reservation } from "@/lib/data"

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; color: string }> = {
  confirmed: { label: "Confirmee", variant: "default", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  pending: { label: "En attente", variant: "secondary", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  checked_in: { label: "En cours", variant: "outline", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  checked_out: { label: "Terminee", variant: "secondary", color: "bg-slate-500/10 text-slate-400 border-slate-500/20" },
  cancelled: { label: "Annulee", variant: "destructive", color: "bg-red-500/10 text-red-400 border-red-500/20" },
}

export default function ReservationsPage() {
  const [reservationsList, setReservationsList] = useState<Reservation[]>(initialReservations)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Reservation | null>(null)
  const [filter, setFilter] = useState<string>("all")

  const [form, setForm] = useState({
    clientId: "", hotelId: "", roomId: "", checkIn: "", checkOut: "", status: "pending" as Reservation["status"], guests: "1", notes: "",
  })

  const openNew = () => {
    setEditing(null)
    setForm({ clientId: "", hotelId: "", roomId: "", checkIn: "", checkOut: "", status: "pending", guests: "1", notes: "" })
    setDialogOpen(true)
  }

  const openEdit = (res: Reservation) => {
    setEditing(res)
    setForm({ clientId: res.clientId, hotelId: res.hotelId, roomId: res.roomId, checkIn: res.checkIn, checkOut: res.checkOut, status: res.status, guests: String(res.guests), notes: res.notes })
    setDialogOpen(true)
  }

  const save = () => {
    const client = clients.find((c) => c.id === form.clientId)
    const hotel = hotels.find((h) => h.id === form.hotelId)
    const room = rooms.find((r) => r.id === form.roomId)
    const checkInDate = new Date(form.checkIn)
    const checkOutDate = new Date(form.checkOut)
    const nights = Math.max(1, Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)))
    const totalPrice = (room?.price || 0) * nights

    if (editing) {
      setReservationsList(reservationsList.map((r) => r.id === editing.id ? {
        ...r, ...form, clientName: client ? `${client.firstName} ${client.lastName}` : r.clientName, hotelName: hotel?.name || r.hotelName, roomNumber: room?.number || r.roomNumber, guests: Number(form.guests), totalPrice,
      } : r))
    } else {
      const newRes: Reservation = {
        id: `res${Date.now()}`, ...form, clientName: client ? `${client.firstName} ${client.lastName}` : "", hotelName: hotel?.name || "", roomNumber: room?.number || "", guests: Number(form.guests), totalPrice,
      }
      setReservationsList([...reservationsList, newRes])
    }
    setDialogOpen(false)
  }

  const deleteReservation = (id: string) => {
    setReservationsList(reservationsList.filter((r) => r.id !== id))
  }

  const filteredReservations = filter === "all" ? reservationsList : reservationsList.filter((r) => r.status === filter)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Reservations</h1>
          <p className="text-sm text-muted-foreground mt-1">Gerez toutes les reservations de vos hotels</p>
        </div>
        <Button onClick={openNew} size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Plus className="mr-2 h-4 w-4" />Nouvelle Reservation
        </Button>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {[
          { key: "all", label: "Toutes" },
          { key: "confirmed", label: "Confirmees" },
          { key: "pending", label: "En attente" },
          { key: "checked_in", label: "En cours" },
          { key: "checked_out", label: "Terminees" },
          { key: "cancelled", label: "Annulees" },
        ].map((f) => (
          <Button key={f.key} variant={filter === f.key ? "default" : "outline"} size="sm" onClick={() => setFilter(f.key)}
            className={filter === f.key ? "bg-accent text-accent-foreground" : ""}>
            {f.label}
            {f.key !== "all" && (
              <Badge variant="secondary" className="ml-2 text-[10px] h-4 px-1">
                {f.key === "all" ? reservationsList.length : reservationsList.filter((r) => r.status === f.key).length}
              </Badge>
            )}
          </Button>
        ))}
      </div>

      <Card className="border-0 bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            {filteredReservations.length} reservation(s)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="text-muted-foreground">Client</TableHead>
                <TableHead className="text-muted-foreground">Hotel</TableHead>
                <TableHead className="text-muted-foreground">Chambre</TableHead>
                <TableHead className="text-muted-foreground">Dates</TableHead>
                <TableHead className="text-muted-foreground">Statut</TableHead>
                <TableHead className="text-muted-foreground">Total</TableHead>
                <TableHead className="text-muted-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReservations.map((res) => {
                const config = statusConfig[res.status]
                return (
                  <TableRow key={res.id} className="border-border/50">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10">
                          <User className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <span className="font-medium text-foreground text-sm">{res.clientName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{res.hotelName}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">N{res.roomNumber}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{res.checkIn}</span>
                        <span>-</span>
                        <span>{res.checkOut}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${config.color}`}>
                        {config.label}
                      </span>
                    </TableCell>
                    <TableCell className="font-semibold text-foreground">{res.totalPrice.toLocaleString("fr-FR")} MAD</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEdit(res)}><Pencil className="mr-2 h-4 w-4" />Modifier</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => deleteReservation(res.id)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Supprimer</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <CrudDialog open={dialogOpen} onOpenChange={setDialogOpen} title={editing ? "Modifier la Reservation" : "Nouvelle Reservation"} description="Remplissez les details de la reservation">
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label className="text-foreground">Client</Label>
              <Select value={form.clientId} onValueChange={(v) => setForm({ ...form, clientId: v })}>
                <SelectTrigger className="bg-muted/50"><SelectValue placeholder="Choisir un client" /></SelectTrigger>
                <SelectContent>{clients.map((c) => <SelectItem key={c.id} value={c.id}>{c.firstName} {c.lastName}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-foreground">Hotel</Label>
              <Select value={form.hotelId} onValueChange={(v) => setForm({ ...form, hotelId: v, roomId: "" })}>
                <SelectTrigger className="bg-muted/50"><SelectValue placeholder="Choisir un hotel" /></SelectTrigger>
                <SelectContent>{hotels.map((h) => <SelectItem key={h.id} value={h.id}>{h.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label className="text-foreground">Chambre</Label>
              <Select value={form.roomId} onValueChange={(v) => setForm({ ...form, roomId: v })}>
                <SelectTrigger className="bg-muted/50"><SelectValue placeholder="Choisir une chambre" /></SelectTrigger>
                <SelectContent>{rooms.filter((r) => !form.hotelId || r.hotelId === form.hotelId).map((r) => <SelectItem key={r.id} value={r.id}>N{r.number} - {r.type} ({r.price} MAD)</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-foreground">Statut</Label>
              <Select value={form.status} onValueChange={(v: Reservation["status"]) => setForm({ ...form, status: v })}>
                <SelectTrigger className="bg-muted/50"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="confirmed">Confirmee</SelectItem>
                  <SelectItem value="checked_in">En cours</SelectItem>
                  <SelectItem value="checked_out">Terminee</SelectItem>
                  <SelectItem value="cancelled">Annulee</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="res-checkin" className="text-foreground">Check-in</Label>
              <Input id="res-checkin" type="date" value={form.checkIn} onChange={(e) => setForm({ ...form, checkIn: e.target.value })} className="bg-muted/50" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="res-checkout" className="text-foreground">Check-out</Label>
              <Input id="res-checkout" type="date" value={form.checkOut} onChange={(e) => setForm({ ...form, checkOut: e.target.value })} className="bg-muted/50" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="res-guests" className="text-foreground">Invites</Label>
              <Input id="res-guests" type="number" value={form.guests} onChange={(e) => setForm({ ...form, guests: e.target.value })} className="bg-muted/50" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="res-notes" className="text-foreground">Notes</Label>
            <Textarea id="res-notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="bg-muted/50" rows={2} />
          </div>
          <Button onClick={save} className="bg-accent text-accent-foreground hover:bg-accent/90 mt-2">
            {editing ? "Mettre a jour" : "Creer la Reservation"}
          </Button>
        </div>
      </CrudDialog>
    </div>
  )
}
