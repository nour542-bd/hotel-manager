"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2, MoreHorizontal, User, Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CrudDialog } from "@/components/crud-dialog"
import { clients as initialClients, type Client } from "@/lib/data"

export default function ClientsPage() {
  const [clientsList, setClientsList] = useState<Client[]>(initialClients)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Client | null>(null)
  const [search, setSearch] = useState("")

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "", nationality: "", idNumber: "",
  })

  const openNew = () => {
    setEditing(null)
    setForm({ firstName: "", lastName: "", email: "", phone: "", nationality: "", idNumber: "" })
    setDialogOpen(true)
  }

  const openEdit = (client: Client) => {
    setEditing(client)
    setForm({ firstName: client.firstName, lastName: client.lastName, email: client.email, phone: client.phone, nationality: client.nationality, idNumber: client.idNumber })
    setDialogOpen(true)
  }

  const save = () => {
    if (editing) {
      setClientsList(clientsList.map((c) => c.id === editing.id ? { ...c, ...form } : c))
    } else {
      const newClient: Client = { id: `c${Date.now()}`, ...form, totalStays: 0, createdAt: new Date().toISOString().split("T")[0] }
      setClientsList([...clientsList, newClient])
    }
    setDialogOpen(false)
  }

  const deleteClient = (id: string) => {
    setClientsList(clientsList.filter((c) => c.id !== id))
  }

  const filtered = clientsList.filter((c) =>
    `${c.firstName} ${c.lastName} ${c.email}`.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Clients</h1>
          <p className="text-sm text-muted-foreground mt-1">Gerez votre base de donnees clients</p>
        </div>
        <Button onClick={openNew} size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Plus className="mr-2 h-4 w-4" />Nouveau Client
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <Input
          placeholder="Rechercher par nom ou email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm bg-card border-border"
        />
        <Badge variant="outline" className="text-xs">{filtered.length} client(s)</Badge>
      </div>

      <Card className="border-0 bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Liste des Clients</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="text-muted-foreground">Client</TableHead>
                <TableHead className="text-muted-foreground">Contact</TableHead>
                <TableHead className="text-muted-foreground">Nationalite</TableHead>
                <TableHead className="text-muted-foreground">ID</TableHead>
                <TableHead className="text-muted-foreground">Sejours</TableHead>
                <TableHead className="text-muted-foreground">Inscrit le</TableHead>
                <TableHead className="text-muted-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((client) => (
                <TableRow key={client.id} className="border-border/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                        {client.firstName[0]}{client.lastName[0]}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">{client.firstName} {client.lastName}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs text-muted-foreground flex items-center gap-1"><Mail className="h-3 w-3" />{client.email}</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1"><Phone className="h-3 w-3" />{client.phone}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px]">{client.nationality}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm font-mono">{client.idNumber}</TableCell>
                  <TableCell>
                    <span className="text-sm font-semibold text-foreground">{client.totalStays}</span>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{client.createdAt}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEdit(client)}><Pencil className="mr-2 h-4 w-4" />Modifier</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => deleteClient(client.id)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Supprimer</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <CrudDialog open={dialogOpen} onOpenChange={setDialogOpen} title={editing ? "Modifier le Client" : "Nouveau Client"} description="Informations du client">
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="client-fn" className="text-foreground">Prenom</Label>
              <Input id="client-fn" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="bg-muted/50" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="client-ln" className="text-foreground">Nom</Label>
              <Input id="client-ln" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="bg-muted/50" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="client-email" className="text-foreground">Email</Label>
              <Input id="client-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="bg-muted/50" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="client-phone" className="text-foreground">Telephone</Label>
              <Input id="client-phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="bg-muted/50" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="client-nationality" className="text-foreground">Nationalite</Label>
              <Input id="client-nationality" value={form.nationality} onChange={(e) => setForm({ ...form, nationality: e.target.value })} className="bg-muted/50" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="client-id" className="text-foreground">Numero ID</Label>
              <Input id="client-id" value={form.idNumber} onChange={(e) => setForm({ ...form, idNumber: e.target.value })} className="bg-muted/50" />
            </div>
          </div>
          <Button onClick={save} className="bg-accent text-accent-foreground hover:bg-accent/90 mt-2">
            {editing ? "Mettre a jour" : "Creer le Client"}
          </Button>
        </div>
      </CrudDialog>
    </div>
  )
}
