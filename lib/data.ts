// Mock data store for the hotel management application

export interface Hotel {
  id: string
  name: string
  address: string
  city: string
  stars: number
  rooms: number
  phone: string
  email: string
  status: "active" | "inactive"
}

export interface Room {
  id: string
  hotelId: string
  number: string
  type: "single" | "double" | "suite" | "deluxe"
  price: number
  status: "available" | "occupied" | "maintenance"
  floor: number
}

export interface Client {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  nationality: string
  idNumber: string
  totalStays: number
  createdAt: string
}

export interface Employee {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  role: "manager" | "receptionist" | "housekeeping" | "maintenance" | "chef" | "security"
  hotelId: string
  salary: number
  startDate: string
  status: "active" | "on_leave" | "inactive"
}

export interface Reservation {
  id: string
  clientId: string
  clientName: string
  hotelId: string
  hotelName: string
  roomId: string
  roomNumber: string
  checkIn: string
  checkOut: string
  status: "confirmed" | "pending" | "checked_in" | "checked_out" | "cancelled"
  totalPrice: number
  guests: number
  notes: string
}

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
}

// Sample data
export const hotels: Hotel[] = [
  { id: "h1", name: "Le Royal Palace", address: "12 Avenue Hassan II", city: "Casablanca", stars: 5, rooms: 120, phone: "+212 522 123 456", email: "contact@royalpalace.ma", status: "active" },
  { id: "h2", name: "Atlas Grand Hotel", address: "45 Rue Mohammed V", city: "Marrakech", stars: 4, rooms: 85, phone: "+212 524 789 012", email: "info@atlasgrand.ma", status: "active" },
  { id: "h3", name: "Marina Bay Resort", address: "8 Boulevard Maritime", city: "Tanger", stars: 4, rooms: 95, phone: "+212 539 456 789", email: "contact@marinabay.ma", status: "active" },
  { id: "h4", name: "Desert Oasis Inn", address: "Route de Fes km 5", city: "Errachidia", stars: 3, rooms: 40, phone: "+212 535 321 654", email: "reserve@desertoasis.ma", status: "inactive" },
]

export const rooms: Room[] = [
  { id: "r1", hotelId: "h1", number: "101", type: "single", price: 800, status: "available", floor: 1 },
  { id: "r2", hotelId: "h1", number: "102", type: "double", price: 1200, status: "occupied", floor: 1 },
  { id: "r3", hotelId: "h1", number: "201", type: "suite", price: 2500, status: "available", floor: 2 },
  { id: "r4", hotelId: "h1", number: "301", type: "deluxe", price: 3500, status: "maintenance", floor: 3 },
  { id: "r5", hotelId: "h2", number: "101", type: "single", price: 600, status: "available", floor: 1 },
  { id: "r6", hotelId: "h2", number: "102", type: "double", price: 900, status: "occupied", floor: 1 },
  { id: "r7", hotelId: "h2", number: "201", type: "suite", price: 1800, status: "available", floor: 2 },
  { id: "r8", hotelId: "h3", number: "101", type: "double", price: 1000, status: "available", floor: 1 },
  { id: "r9", hotelId: "h3", number: "102", type: "deluxe", price: 2800, status: "occupied", floor: 1 },
]

export const clients: Client[] = [
  { id: "c1", firstName: "Ahmed", lastName: "Bennani", email: "ahmed.b@email.com", phone: "+212 661 123 456", nationality: "Marocain", idNumber: "AB123456", totalStays: 5, createdAt: "2024-01-15" },
  { id: "c2", firstName: "Sophie", lastName: "Martin", email: "sophie.m@email.com", phone: "+33 6 12 34 56 78", nationality: "Francaise", idNumber: "FR789012", totalStays: 2, createdAt: "2024-03-20" },
  { id: "c3", firstName: "John", lastName: "Smith", email: "john.s@email.com", phone: "+1 555 123 4567", nationality: "Americain", idNumber: "US345678", totalStays: 1, createdAt: "2024-06-10" },
  { id: "c4", firstName: "Fatima", lastName: "El Amrani", email: "fatima.a@email.com", phone: "+212 662 789 012", nationality: "Marocaine", idNumber: "CD901234", totalStays: 8, createdAt: "2023-11-05" },
  { id: "c5", firstName: "Carlos", lastName: "Rodriguez", email: "carlos.r@email.com", phone: "+34 612 345 678", nationality: "Espagnol", idNumber: "ES567890", totalStays: 3, createdAt: "2024-02-28" },
]

export const employees: Employee[] = [
  { id: "e1", firstName: "Karim", lastName: "Idrissi", email: "karim.i@hotel.ma", phone: "+212 661 111 222", role: "manager", hotelId: "h1", salary: 15000, startDate: "2020-03-01", status: "active" },
  { id: "e2", firstName: "Nadia", lastName: "Fassi", email: "nadia.f@hotel.ma", phone: "+212 662 333 444", role: "receptionist", hotelId: "h1", salary: 6000, startDate: "2022-06-15", status: "active" },
  { id: "e3", firstName: "Omar", lastName: "Tazi", email: "omar.t@hotel.ma", phone: "+212 663 555 666", role: "chef", hotelId: "h1", salary: 10000, startDate: "2021-01-10", status: "active" },
  { id: "e4", firstName: "Leila", lastName: "Amrani", email: "leila.a@hotel.ma", phone: "+212 664 777 888", role: "housekeeping", hotelId: "h2", salary: 4500, startDate: "2023-09-01", status: "active" },
  { id: "e5", firstName: "Youssef", lastName: "Belhaj", email: "youssef.b@hotel.ma", phone: "+212 665 999 000", role: "security", hotelId: "h2", salary: 5000, startDate: "2022-11-20", status: "on_leave" },
  { id: "e6", firstName: "Sara", lastName: "Ouazzani", email: "sara.o@hotel.ma", phone: "+212 666 111 333", role: "receptionist", hotelId: "h3", salary: 5500, startDate: "2023-04-15", status: "active" },
]

export const reservations: Reservation[] = [
  { id: "res1", clientId: "c1", clientName: "Ahmed Bennani", hotelId: "h1", hotelName: "Le Royal Palace", roomId: "r2", roomNumber: "102", checkIn: "2026-02-10", checkOut: "2026-02-14", status: "checked_in", totalPrice: 4800, guests: 2, notes: "Chambre avec vue mer" },
  { id: "res2", clientId: "c2", clientName: "Sophie Martin", hotelId: "h1", hotelName: "Le Royal Palace", roomId: "r3", roomNumber: "201", checkIn: "2026-02-15", checkOut: "2026-02-18", status: "confirmed", totalPrice: 7500, guests: 2, notes: "" },
  { id: "res3", clientId: "c3", clientName: "John Smith", hotelId: "h2", hotelName: "Atlas Grand Hotel", roomId: "r6", roomNumber: "102", checkIn: "2026-02-12", checkOut: "2026-02-16", status: "checked_in", totalPrice: 3600, guests: 1, notes: "Late check-out demande" },
  { id: "res4", clientId: "c4", clientName: "Fatima El Amrani", hotelId: "h3", hotelName: "Marina Bay Resort", roomId: "r9", roomNumber: "102", checkIn: "2026-02-20", checkOut: "2026-02-25", status: "pending", totalPrice: 14000, guests: 2, notes: "Anniversaire de mariage" },
  { id: "res5", clientId: "c5", clientName: "Carlos Rodriguez", hotelId: "h1", hotelName: "Le Royal Palace", roomId: "r1", roomNumber: "101", checkIn: "2026-01-05", checkOut: "2026-01-08", status: "checked_out", totalPrice: 2400, guests: 1, notes: "" },
  { id: "res6", clientId: "c1", clientName: "Ahmed Bennani", hotelId: "h2", hotelName: "Atlas Grand Hotel", roomId: "r5", roomNumber: "101", checkIn: "2026-03-01", checkOut: "2026-03-05", status: "confirmed", totalPrice: 2400, guests: 1, notes: "" },
  { id: "res7", clientId: "c2", clientName: "Sophie Martin", hotelId: "h3", hotelName: "Marina Bay Resort", roomId: "r8", roomNumber: "101", checkIn: "2026-02-28", checkOut: "2026-03-03", status: "pending", totalPrice: 3000, guests: 2, notes: "Besoin parking" },
]

// Chat bot predefined responses
export const chatbotResponses: Record<string, string> = {
  "bonjour": "Bonjour ! Je suis l'assistant HotelManager Pro. Comment puis-je vous aider aujourd'hui ? Je peux vous renseigner sur les reservations, les chambres disponibles, les clients, ou les statistiques de l'hotel.",
  "reservation": "Pour gerer les reservations, vous pouvez acceder a la section 'Reservations' dans le menu lateral. Vous y trouverez toutes les reservations en cours, confirmees et en attente. Souhaitez-vous creer une nouvelle reservation ?",
  "chambre": "Nos chambres sont classees en 4 categories : Single, Double, Suite et Deluxe. Vous pouvez verifier la disponibilite dans la section 'Hotels & Chambres'. Actuellement, nous avons plusieurs chambres disponibles.",
  "client": "La gestion des clients se fait via la section 'Clients' du menu. Vous pouvez ajouter, modifier ou consulter les informations de chaque client, y compris leur historique de sejours.",
  "employe": "La section 'Employes' vous permet de gerer tout le personnel : managers, receptionnistes, chefs, agents de menage, maintenance et securite. Chaque employe est rattache a un hotel specifique.",
  "statistique": "Voici un apercu rapide : 4 hotels geres, 9 chambres enregistrees, 7 reservations actives, et 5 clients fideles. Pour plus de details, consultez le tableau de bord.",
  "aide": "Je peux vous aider avec : \n- Les reservations (creation, modification, annulation)\n- La gestion des chambres et hotels\n- Les informations clients\n- La gestion du personnel\n- Les statistiques et rapports\n\nQue souhaitez-vous savoir ?",
  "calendrier": "Le calendrier des reservations est accessible depuis la section 'Calendrier' du menu. Il affiche toutes les reservations planifiees avec un code couleur selon leur statut.",
  "default": "Je comprends votre question. Pour une assistance plus precise, essayez de mentionner : reservation, chambre, client, employe, statistique, calendrier ou aide. Je suis la pour vous aider !",
}
