# HotelManager Pro - Système Complet de Gestion Hôtelière

Architecture MERN complète pour la gestion professionnelle de propriétés hôtelières, réservations et clients.

## Architecture

```
HotelManager-Pro/
├── backend/                 # Express API + MongoDB
│   ├── models/             # Schémas MongoDB (User, Hotel, Room, Reservation)
│   ├── routes/             # Endpoints API (auth, hotels, rooms, reservations, etc.)
│   ├── middleware/         # Authentification JWT
│   ├── server.js           # Point d'entrée Express
│   └── package.json        # Dépendances backend
│
└── frontend/               # React SPA + Vite
    ├── src/
    │   ├── pages/          # Pages (Home, Login, Admin, Client)
    │   ├── components/     # Composants (Sidebar, Navbar, Chatbot)
    │   ├── store/          # Zustand stores (Auth)
    │   ├── lib/            # API client, utilities
    │   ├── styles/         # Global CSS + Tailwind
    │   └── App.jsx         # Router principal
    └── package.json        # Dépendances frontend
```

## Fonctionnalités

### 1. Authentification & Autorisation
- ✅ Register/Login avec JWT
- ✅ 2 rôles: Admin et Client
- ✅ Protection des routes par rôle
- ✅ Stockage sécurisé du token

### 2. Gestion des Hôtels
- ✅ CRUD complet (Créer, Lire, Mettre à jour, Supprimer)
- ✅ Informations détaillées (nom, description, contact, adresse)
- ✅ Gestion des références
- ✅ Interface admin professionnelle

### 3. Gestion des Réservations
- ✅ Création de réservations par clients
- ✅ Filtrage par statut (pending, confirmed, checked-in, checked-out, cancelled)
- ✅ Calcul automatique du prix
- ✅ Gestion des statuts
- ✅ Dashboard admin avec aperçu

### 4. Gestion des Clients
- ✅ Profils clients complets
- ✅ Historique des réservations
- ✅ Informations de contact
- ✅ Accès client au portail personnel

### 5. Interface Utilisateur
- ✅ Sidebar de navigation professionnelle
- ✅ Navbar avec recherche et notifications
- ✅ Chatbot assistant intégré
- ✅ Design dark mode moderne
- ✅ Responsive mobile-first
- ✅ Accès par rôle

### 6. Chatbot
- ✅ Widget flottant toujours accessible
- ✅ Questions prédéfinies
- ✅ Interface friendly
- ✅ Suggestions intelligentes

## Installation & Démarrage

### Prérequis
- Node.js 16+
- MongoDB (local ou Atlas)
- npm ou pnpm

### 1. Backend (Express + MongoDB)

```bash
cd backend
npm install

# Créer un fichier .env
cp .env.example .env

# Ajouter vos variables:
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hotelmanager
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Démarrer le serveur
npm run dev
# L'API sera disponible sur http://localhost:5000
```

### 2. Frontend (React + Vite)

```bash
cd frontend
npm install

# Créer un fichier .env
echo "VITE_API_URL=http://localhost:5000/api" > .env

# Démarrer le serveur dev
npm run dev
# L'app sera disponible sur http://localhost:5173
```

## Utilisation

### Comptes de Démonstration

**Admin:**
- Email: `admin@hotel.com`
- Password: `password`

**Client:**
- Email: `client@hotel.com`
- Password: `password`

*(Vous pouvez créer de nouveaux comptes via le formulaire d'inscription)*

## Endpoints API

### Authentification
```
POST   /api/auth/register         # Créer un compte
POST   /api/auth/login             # Se connecter
GET    /api/auth/me                # Récupérer l'utilisateur courant
```

### Hôtels
```
GET    /api/hotels                 # Lister tous les hôtels
GET    /api/hotels/:id             # Détails d'un hôtel
POST   /api/hotels                 # Créer un hôtel (admin)
PUT    /api/hotels/:id             # Modifier un hôtel (admin)
DELETE /api/hotels/:id             # Supprimer un hôtel (admin)
```

### Chambres
```
GET    /api/rooms                  # Lister les chambres
GET    /api/rooms/hotel/:hotelId   # Chambres d'un hôtel
POST   /api/rooms                  # Créer une chambre (admin)
PUT    /api/rooms/:id              # Modifier une chambre (admin)
DELETE /api/rooms/:id              # Supprimer une chambre (admin)
```

### Réservations
```
GET    /api/reservations           # Toutes les réservations (admin)
GET    /api/reservations/my-reservations  # Mes réservations
POST   /api/reservations           # Créer une réservation
PUT    /api/reservations/:id       # Modifier (admin)
PUT    /api/reservations/:id/cancel # Annuler
DELETE /api/reservations/:id       # Supprimer (admin)
```

### Clients
```
GET    /api/clients                # Tous les clients (admin)
GET    /api/clients/:id            # Profil client
PUT    /api/clients/:id            # Modifier profil
DELETE /api/clients/:id            # Supprimer client (admin)
```

### Employés
```
GET    /api/employees              # Tous les employés (admin)
POST   /api/employees              # Ajouter employé (admin)
PUT    /api/employees/:id          # Modifier employé (admin)
DELETE /api/employees/:id          # Supprimer employé (admin)
```

## Structure de Base de Données

### Users (Utilisateurs)
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: 'admin' | 'client' | 'employee',
  phone: String,
  avatar: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Hotels (Hôtels)
```javascript
{
  name: String,
  description: String,
  address: {
    street: String,
    city: String,
    country: String,
    zipCode: String
  },
  phone: String,
  email: String,
  website: String,
  amenities: [String],
  manager: ObjectId (User),
  totalRooms: Number,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Rooms (Chambres)
```javascript
{
  roomNumber: String,
  hotel: ObjectId (Hotel),
  type: 'single' | 'double' | 'suite' | 'deluxe' | 'villa',
  capacity: Number,
  price: Number,
  amenities: [String],
  status: 'available' | 'occupied' | 'maintenance' | 'cleaning',
  description: String,
  floor: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Reservations (Réservations)
```javascript
{
  reservationNumber: String (auto-generated),
  client: ObjectId (User),
  room: ObjectId (Room),
  hotel: ObjectId (Hotel),
  checkInDate: Date,
  checkOutDate: Date,
  numberOfGuests: Number,
  status: 'pending' | 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled',
  totalPrice: Number,
  specialRequests: String,
  paymentMethod: String,
  paymentStatus: 'pending' | 'completed' | 'refunded',
  createdAt: Date,
  updatedAt: Date
}
```

## Déploiement

### Backend (Heroku/Railway)
1. Créer un compte sur Heroku/Railway
2. Connecter le dépôt GitHub
3. Ajouter les variables d'environnement
4. Déployer

### Frontend (Vercel)
1. Créer un compte sur Vercel
2. Importer le projet GitHub
3. Définir le répertoire racine: `frontend`
4. Ajouter `VITE_API_URL` pointant vers votre API
5. Déployer

## Technologies Utilisées

### Backend
- **Express.js** - Framework HTTP
- **MongoDB** - Base de données NoSQL
- **Mongoose** - ODM pour MongoDB
- **JWT** - Authentification
- **bcryptjs** - Hachage des mots de passe
- **CORS** - Cross-Origin Resource Sharing

### Frontend
- **React 18** - Bibliothèque UI
- **Vite** - Bundler ultra-rapide
- **React Router** - Navigation
- **Axios** - Client HTTP
- **Zustand** - Gestion d'état
- **Tailwind CSS** - Styling
- **Lucide React** - Icônes
- **date-fns** - Gestion des dates

## Prochains Développements

- [ ] Système de paiement intégré
- [ ] Notifications par email
- [ ] Rapports et analytiques avancées
- [ ] Intégration de calendriers externes
- [ ] Gestion des disponibilités avancée
- [ ] Téléchargement de fichiers
- [ ] Système de notation/avis
- [ ] Multi-langue (i18n)
- [ ] Tests unitaires et d'intégration

## Support

Pour toute question ou problème, veuillez créer une issue sur GitHub.

## License

MIT License - Libre d'utilisation
