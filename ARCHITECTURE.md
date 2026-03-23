# Architecture MERN - HotelManager Pro

## Vue d'Ensemble

HotelManager Pro est une application web complète construite avec la stack **MERN**:
- **M** - MongoDB (Base de données NoSQL)
- **E** - Express.js (Framework Node.js)
- **R** - React (Bibliothèque UI)
- **N** - Node.js (Runtime JavaScript)

## Diagramme Architecturaire

```
┌─────────────────────────────────────────────────────────┐
│                    Client (Navigateur)                   │
│  ┌──────────────────────────────────────────────────┐   │
│  │              React SPA (Vite)                    │   │
│  │  ┌─────────────────────────────────────────┐    │   │
│  │  │  Pages: Home, Login, Admin, Client       │    │   │
│  │  │  Components: Sidebar, Navbar, Chatbot    │    │   │
│  │  │  Stores: Zustand (Auth State)            │    │   │
│  │  └─────────────────────────────────────────┘    │   │
│  └──────────────────────────────────────────────────┘   │
└────────────────┬────────────────────────────────────────┘
                 │ HTTP/REST
                 │ JWT Tokens
                 │ JSON
                 ↓
┌─────────────────────────────────────────────────────────┐
│                    Backend (Node.js)                     │
│  ┌──────────────────────────────────────────────────┐   │
│  │          Express.js Server (Port 5000)          │   │
│  │                                                   │   │
│  │  Routes:                                         │   │
│  │  ├── /api/auth (Login, Register)                │   │
│  │  ├── /api/hotels (CRUD)                         │   │
│  │  ├── /api/rooms (CRUD)                          │   │
│  │  ├── /api/reservations (CRUD)                   │   │
│  │  └── /api/clients (CRUD)                        │   │
│  │                                                   │   │
│  │  Middleware:                                     │   │
│  │  ├── CORS                                        │   │
│  │  ├── JWT Authentication                         │   │
│  │  └── Error Handling                             │   │
│  │                                                   │   │
│  │  Models (Mongoose):                             │   │
│  │  ├── User                                        │   │
│  │  ├── Hotel                                       │   │
│  │  ├── Room                                        │   │
│  │  └── Reservation                                │   │
│  └──────────────────────────────────────────────────┘   │
└────────────────┬────────────────────────────────────────┘
                 │ TCP Connection
                 │ Query/Insert/Update/Delete
                 ↓
┌─────────────────────────────────────────────────────────┐
│               MongoDB (Port 27017)                       │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Collections:                                    │   │
│  │  ├── users (Authentification & Rôles)           │   │
│  │  ├── hotels (Propriétés)                        │   │
│  │  ├── rooms (Chambres)                           │   │
│  │  └── reservations (Réservations)                │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## Flux d'Authentification

```
1. Utilisateur remplit le formulaire de login
   ↓
2. Frontend envoie POST /api/auth/login
   ↓
3. Backend valide les credentials
   ├─ Utilisateur existe?
   └─ Mot de passe correct?
   ↓
4. Backend crée un JWT Token
   ├─ Contient: userId, role, email
   └─ Expire: 7 jours
   ↓
5. Token retourné au frontend
   ├─ Stocké dans localStorage
   └─ Utilisé pour les requêtes suivantes
   ↓
6. Frontend redirects selon le rôle
   ├─ Admin → /admin
   └─ Client → /client
```

## Flux de Réservation

```
1. Client selectionne les dates et la chambre
   ↓
2. Frontend calcule le prix total
   ├─ Prix de la chambre × nombre de nuits
   └─ Applique les remises si nécessaire
   ↓
3. Client valide la réservation
   ↓
4. Frontend envoie POST /api/reservations
   ├─ Contient: room_id, hotel_id, dates, prix, client_id
   └─ Headers: Authorization (JWT Token)
   ↓
5. Backend crée la réservation
   ├─ Valide les données
   ├─ Génère reservation_number unique
   └─ Statut initial: "pending"
   ↓
6. Réservation sauvegardée dans MongoDB
   ↓
7. Réponse retournée au frontend
   ├─ 201 Created
   ├─ Contient: reservationId, number, details
   └─ Frontend redirige vers confirmation
```

## Rôles & Permissions

### Admin
```
Accès:
- Dashboard complet
- CRUD Hôtels
- CRUD Chambres
- CRUD Réservations (toutes)
- Gestion Clients
- Gestion Employés
- Rapports & Analyses

Routes protégées:
POST /api/hotels (création)
PUT /api/hotels/:id (modification)
DELETE /api/hotels/:id (suppression)
GET /api/reservations (tous)
```

### Client
```
Accès:
- Dashboard personnel
- Consulter Hôtels
- Créer Réservations
- Voir ses propres réservations
- Annuler ses réservations

Routes protégées:
POST /api/reservations (ses propres)
GET /api/reservations/my-reservations
PUT /api/reservations/:id/cancel (ses propres)
GET /api/clients/:id (son profil)
```

### Employé
```
Accès:
- Dashboard assigné
- Consulter Réservations
- Mettre à jour états
- Voir ses tâches

Routes protégées:
GET /api/reservations (filtrées par hôtel)
```

## Modèle de Données

### Users
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (bcrypt),
  role: 'admin' | 'client',
  phone: String,
  avatar: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Hotels
```javascript
{
  _id: ObjectId,
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
  image: String,
  totalRooms: Number,
  manager: ObjectId (ref: User),
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Rooms
```javascript
{
  _id: ObjectId,
  roomNumber: String,
  hotel: ObjectId (ref: Hotel),
  type: 'single' | 'double' | 'suite' | 'deluxe' | 'villa',
  capacity: Number,
  price: Number (par nuit),
  amenities: [String],
  images: [String],
  status: 'available' | 'occupied' | 'maintenance' | 'cleaning',
  description: String,
  floor: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Reservations
```javascript
{
  _id: ObjectId,
  reservationNumber: String (unique auto-generated),
  client: ObjectId (ref: User),
  room: ObjectId (ref: Room),
  hotel: ObjectId (ref: Hotel),
  checkInDate: Date,
  checkOutDate: Date,
  numberOfGuests: Number,
  status: 'pending' | 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled',
  totalPrice: Number,
  specialRequests: String,
  paymentMethod: String,
  paymentStatus: 'pending' | 'completed' | 'refunded',
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Flux API - Exemple Complet

### Créer une Réservation

**Request:**
```bash
POST http://localhost:5000/api/reservations
Headers:
  Content-Type: application/json
  Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

Body:
{
  "room": "507f1f77bcf86cd799439011",
  "hotel": "507f1f77bcf86cd799439012",
  "checkInDate": "2024-04-01T14:00:00Z",
  "checkOutDate": "2024-04-05T12:00:00Z",
  "numberOfGuests": 2,
  "totalPrice": 400,
  "specialRequests": "Chambre avec vue"
}
```

**Backend Processing:**
```javascript
1. Authentification: Vérifie le JWT
2. Autorisation: Vérifie le rôle
3. Validation: Valide les données
4. Logique Métier:
   - Vérifie que la chambre existe
   - Vérifie que l'hôtel existe
   - Génère reservation_number
5. Persistence: Sauvegarde dans MongoDB
6. Response: Retourne les détails
```

**Response:**
```json
{
  "status": 201,
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "reservationNumber": "RES-1711864800000-1",
    "client": "507f1f77bcf86cd799439001",
    "room": "507f1f77bcf86cd799439011",
    "hotel": "507f1f77bcf86cd799439012",
    "checkInDate": "2024-04-01T14:00:00Z",
    "checkOutDate": "2024-04-05T12:00:00Z",
    "numberOfGuests": 2,
    "status": "pending",
    "totalPrice": 400,
    "paymentStatus": "pending",
    "createdAt": "2024-03-31T10:00:00Z"
  }
}
```

## Sécurité

### Authentification JWT
```
1. Utilisateur login
2. Backend crée JWT: jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '7d' })
3. Token retourné au frontend
4. Frontend stocke dans localStorage
5. Pour chaque requête: Authorization: Bearer <token>
6. Backend vérifie: jwt.verify(token, JWT_SECRET)
```

### Hachage des Mots de Passe
```
1. Utilisateur fournit mot de passe
2. Backend: salt = bcrypt.genSalt(10)
3. Backend: hash = bcrypt.hash(password, salt)
4. Stocke hash dans DB
5. Pour login: bcrypt.compare(inputPassword, storedHash)
```

### Middleware de Protection
```javascript
// Tous les endpoints sauf login/register
router.post('/reservations', protect, async (req, res) => {
  // req.user contient: { id, role, email }
  // Si pas de token → 401 Unauthorized
  // Si token expiré → 401 Unauthorized
});

// Endpoints admin-only
router.delete('/hotels/:id', protect, authorize('admin'), async (req, res) => {
  // Si rôle ≠ 'admin' → 403 Forbidden
});
```

### CORS
```javascript
// Backend accepte requêtes que du frontend
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

## Performance

### Frontend
- **Vite**: Bundle splitting automatique
- **React Router**: Code splitting par page
- **Lazy Loading**: Images et composants
- **Zustand**: State minimal

### Backend
- **Mongoose Indexes**: _id par défaut
- **JWT Cache**: Pas de DB lookup à chaque requête
- **Connection Pooling**: Mongoose gère automatiquement
- **Pagination**: Implémentable pour grandes listes

### Base de Données
- **Indexes**: Sur email, userId, hotel_id
- **Queries Optimisées**: Projections de champs
- **References**: Populate seulement si nécessaire

## Évolutivité Future

### Améliorations Possibles
1. **Microservices**: Séparation en services
2. **Cache**: Redis pour les données fréquentes
3. **Queue**: Celery/Bull pour emails async
4. **Search**: Elasticsearch pour les hôtels
5. **Analytics**: BigQuery pour les rapports
6. **Load Balancing**: Nginx/HAProxy
7. **CDN**: CloudFlare pour assets statiques

## Déploiement Multi-Environnement

```
Development (localhost):
├── Frontend: http://localhost:5173
├── Backend: http://localhost:5000
└── MongoDB: mongodb://localhost:27017

Staging (cloud):
├── Frontend: https://staging.app.com
├── Backend: https://api-staging.app.com
└── MongoDB: MongoDB Atlas

Production (cloud):
├── Frontend: https://app.com (Vercel/Netlify)
├── Backend: https://api.app.com (Heroku/Railway)
└── MongoDB: MongoDB Atlas (replicated, backed up)
```

## Monitoring & Logging

### Recommandé pour Production
- Morgan: HTTP request logging
- Winston: Application logging
- Sentry: Error tracking
- New Relic: Performance monitoring
- DataDog: Full stack monitoring

## Conclusion

Cette architecture MERN offre:
✅ Séparation claire frontend/backend
✅ Authentification sécurisée
✅ Permissions basées sur les rôles
✅ Base de données scalable
✅ API RESTful clean
✅ Interface utilisateur réactive
✅ Facilement extensible
