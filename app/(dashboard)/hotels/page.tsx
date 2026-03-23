"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2, Star, MoreHorizontal, BedDouble } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CrudDialog } from "@/components/crud-dialog"
import { hotels as initialHotels, rooms as initialRooms, type Hotel, type Room } from "@/lib/data"

export default function HotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>(initialHotels)
  const [rooms, setRooms] = useState<Room[]>(initialRooms)
  const [hotelDialogOpen, setHotelDialogOpen] = useState(false)
  const [roomDialogOpen, setRoomDialogOpen] = useState(false)
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null)
  const [editingRoom, setEditingRoom] = useState<Room | null>(null)

  const [hotelForm, setHotelForm] = useState({ name: "", address: "", city: "", stars: "4", rooms: "50", phone: "", email: "", status: "active" as "active" | "inactive" })
  const [roomForm, setRoomForm] = useState({ hotelId: "", number: "", type: "single" as Room["type"], price: "", floor: "", status: "available" as Room["status"] })

  const openNewHotel = () => {
    setEditingHotel(null)
    setHotelForm({ name: "", address: "", city: "", stars: "4", rooms: "50", phone: "", email: "", status: "active" })
    setHotelDialogOpen(true)
  }

  const openEditHotel = (hotel: Hotel) => {
    setEditingHotel(hotel)
    setHotelForm({ name: hotel.name, address: hotel.address, city: hotel.city, stars: String(hotel.stars), rooms: String(hotel.rooms), phone: hotel.phone, email: hotel.email, status: hotel.status })
    setHotelDialogOpen(true)
  }

  const saveHotel = () => {
    if (editingHotel) {
      setHotels(hotels.map((h) => h.id === editingHotel.id ? { ...h, ...hotelForm, stars: Number(hotelForm.stars), rooms: Number(hotelForm.rooms) } : h))
    } else {
      const newHotel: Hotel = { id: `h${Date.now()}`, ...hotelForm, stars: Number(hotelForm.stars), rooms: Number(hotelForm.rooms) }
      setHotels([...hotels, newHotel])
    }
    setHotelDialogOpen(false)
  }

  const deleteHotel = (id: string) => {
    setHotels(hotels.filter((h) => h.id !== id))
    setRooms(rooms.filter((r) => r.hotelId !== id))
  }

  const openNewRoom = () => {
    setEditingRoom(null)
    setRoomForm({ hotelId: hotels[0]?.id || "", number: "", type: "single", price: "", floor: "", status: "available" })
    setRoomDialogOpen(true)
  }

  const openEditRoom = (room: Room) => {
    setEditingRoom(room)
    setRoomForm({ hotelId: room.hotelId, number: room.number, type: room.type, price: String(room.price), floor: String(room.floor), status: room.status })
    setRoomDialogOpen(true)
  }

  const saveRoom = () => {
    if (editingRoom) {
      setRooms(rooms.map((r) => r.id === editingRoom.id ? { ...r, ...roomForm, price: Number(roomForm.price), floor: Number(roomForm.floor) } : r))
    } else {
      const newRoom: Room = { id: `r${Date.now()}`, ...roomForm, price: Number(roomForm.price), floor: Number(roomForm.floor) }
      setRooms([...rooms, newRoom])
    }
    setRoomDialogOpen(false)
  }

  const deleteRoom = (id: string) => {
    setRooms(rooms.filter((r) => r.id !== id))
  }

  const roomStatusColors: Record<string, string> = {
    available: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    occupied: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    maintenance: "bg-red-500/10 text-red-400 border-red-500/20",
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Hotels & Chambres</h1>
          <p className="text-sm text-muted-foreground mt-1">Gerez vos hotels et leurs chambres</p>
        </div>
      </div>

      <Tabs defaultValue="hotels" className="w-full">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="hotels">Hotels ({hotels.length})</TabsTrigger>
          <TabsTrigger value="rooms">Chambres ({rooms.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="hotels" className="mt-4">
          <Card className="border-0 bg-card shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Liste des Hotels</CardTitle>
              <Button onClick={openNewHotel} size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Plus className="mr-2 h-4 w-4" />Ajouter Hotel
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Hotel</TableHead>
                    <TableHead className="text-muted-foreground">Ville</TableHead>
                    <TableHead className="text-muted-foreground">Etoiles</TableHead>
                    <TableHead className="text-muted-foreground">Chambres</TableHead>
                    <TableHead className="text-muted-foreground">Statut</TableHead>
                    <TableHead className="text-muted-foreground text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {hotels.map((hotel) => (
                    <TableRow key={hotel.id} className="border-border/50">
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">{hotel.name}</span>
                          <span className="text-xs text-muted-foreground">{hotel.address}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{hotel.city}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: hotel.stars }).map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-accent text-accent" />
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{hotel.rooms}</TableCell>
                      <TableCell>
                        <Badge variant={hotel.status === "active" ? "default" : "secondary"} className="text-[10px]">
                          {hotel.status === "active" ? "Actif" : "Inactif"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditHotel(hotel)}>
                              <Pencil className="mr-2 h-4 w-4" />Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => deleteHotel(hotel.id)} className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rooms" className="mt-4">
          <Card className="border-0 bg-card shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Liste des Chambres</CardTitle>
              <Button onClick={openNewRoom} size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Plus className="mr-2 h-4 w-4" />Ajouter Chambre
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Chambre</TableHead>
                    <TableHead className="text-muted-foreground">Hotel</TableHead>
                    <TableHead className="text-muted-foreground">Type</TableHead>
                    <TableHead className="text-muted-foreground">Etage</TableHead>
                    <TableHead className="text-muted-foreground">Prix/Nuit</TableHead>
                    <TableHead className="text-muted-foreground">Statut</TableHead>
                    <TableHead className="text-muted-foreground text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rooms.map((room) => {
                    const hotel = hotels.find((h) => h.id === room.hotelId)
                    return (
                      <TableRow key={room.id} className="border-border/50">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <BedDouble className="h-4 w-4 text-accent" />
                            <span className="font-medium text-foreground">N{room.number}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{hotel?.name || "N/A"}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[10px] capitalize">{room.type}</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{room.floor}</TableCell>
                        <TableCell className="font-medium text-foreground">{room.price.toLocaleString("fr-FR")} MAD</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${roomStatusColors[room.status]}`}>
                            {room.status === "available" ? "Disponible" : room.status === "occupied" ? "Occupee" : "Maintenance"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openEditRoom(room)}>
                                <Pencil className="mr-2 h-4 w-4" />Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => deleteRoom(room.id)} className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />Supprimer
                              </DropdownMenuItem>
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
        </TabsContent>
      </Tabs>

      {/* Hotel Dialog */}
      <CrudDialog open={hotelDialogOpen} onOpenChange={setHotelDialogOpen} title={editingHotel ? "Modifier l'Hotel" : "Nouvel Hotel"} description="Remplissez les informations de l'hotel">
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="hotel-name" className="text-foreground">Nom</Label>
              <Input id="hotel-name" value={hotelForm.name} onChange={(e) => setHotelForm({ ...hotelForm, name: e.target.value })} className="bg-muted/50" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="hotel-city" className="text-foreground">Ville</Label>
              <Input id="hotel-city" value={hotelForm.city} onChange={(e) => setHotelForm({ ...hotelForm, city: e.target.value })} className="bg-muted/50" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="hotel-address" className="text-foreground">Adresse</Label>
            <Input id="hotel-address" value={hotelForm.address} onChange={(e) => setHotelForm({ ...hotelForm, address: e.target.value })} className="bg-muted/50" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <Label className="text-foreground">Etoiles</Label>
              <Select value={hotelForm.stars} onValueChange={(v) => setHotelForm({ ...hotelForm, stars: v })}>
                <SelectTrigger className="bg-muted/50"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((s) => <SelectItem key={s} value={String(s)}>{s} etoiles</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="hotel-rooms" className="text-foreground">Chambres</Label>
              <Input id="hotel-rooms" type="number" value={hotelForm.rooms} onChange={(e) => setHotelForm({ ...hotelForm, rooms: e.target.value })} className="bg-muted/50" />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-foreground">Statut</Label>
              <Select value={hotelForm.status} onValueChange={(v: "active" | "inactive") => setHotelForm({ ...hotelForm, status: v })}>
                <SelectTrigger className="bg-muted/50"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="inactive">Inactif</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="hotel-phone" className="text-foreground">Telephone</Label>
              <Input id="hotel-phone" value={hotelForm.phone} onChange={(e) => setHotelForm({ ...hotelForm, phone: e.target.value })} className="bg-muted/50" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="hotel-email" className="text-foreground">Email</Label>
              <Input id="hotel-email" type="email" value={hotelForm.email} onChange={(e) => setHotelForm({ ...hotelForm, email: e.target.value })} className="bg-muted/50" />
            </div>
          </div>
          <Button onClick={saveHotel} className="bg-accent text-accent-foreground hover:bg-accent/90 mt-2">
            {editingHotel ? "Mettre a jour" : "Creer l'Hotel"}
          </Button>
        </div>
      </CrudDialog>

      {/* Room Dialog */}
      <CrudDialog open={roomDialogOpen} onOpenChange={setRoomDialogOpen} title={editingRoom ? "Modifier la Chambre" : "Nouvelle Chambre"} description="Remplissez les informations de la chambre">
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label className="text-foreground">Hotel</Label>
              <Select value={roomForm.hotelId} onValueChange={(v) => setRoomForm({ ...roomForm, hotelId: v })}>
                <SelectTrigger className="bg-muted/50"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {hotels.map((h) => <SelectItem key={h.id} value={h.id}>{h.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="room-number" className="text-foreground">Numero</Label>
              <Input id="room-number" value={roomForm.number} onChange={(e) => setRoomForm({ ...roomForm, number: e.target.value })} className="bg-muted/50" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <Label className="text-foreground">Type</Label>
              <Select value={roomForm.type} onValueChange={(v: Room["type"]) => setRoomForm({ ...roomForm, type: v })}>
                <SelectTrigger className="bg-muted/50"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="double">Double</SelectItem>
                  <SelectItem value="suite">Suite</SelectItem>
                  <SelectItem value="deluxe">Deluxe</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="room-price" className="text-foreground">Prix/Nuit (MAD)</Label>
              <Input id="room-price" type="number" value={roomForm.price} onChange={(e) => setRoomForm({ ...roomForm, price: e.target.value })} className="bg-muted/50" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="room-floor" className="text-foreground">Etage</Label>
              <Input id="room-floor" type="number" value={roomForm.floor} onChange={(e) => setRoomForm({ ...roomForm, floor: e.target.value })} className="bg-muted/50" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-foreground">Statut</Label>
            <Select value={roomForm.status} onValueChange={(v: Room["status"]) => setRoomForm({ ...roomForm, status: v })}>
              <SelectTrigger className="bg-muted/50"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Disponible</SelectItem>
                <SelectItem value="occupied">Occupee</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={saveRoom} className="bg-accent text-accent-foreground hover:bg-accent/90 mt-2">
            {editingRoom ? "Mettre a jour" : "Creer la Chambre"}
          </Button>
        </div>
      </CrudDialog>
    </div>
  )
}
