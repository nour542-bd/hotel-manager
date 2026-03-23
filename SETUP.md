# Guide d'Installation - HotelManager Pro

## Démarrage Rapide (5 minutes)

### 1. MongoDB Local
```bash
# Sur macOS avec Homebrew
brew services start mongodb-community

# Sur Linux
sudo systemctl start mongod

# Sur Windows - utiliser MongoDB Compass
```

### 2. Backend
```bash
cd backend
npm install

# Copier les variables d'environnement
cp .env.example .env

# Modifier .env si nécessaire (defaults OK)
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/hotelmanager
# JWT_SECRET=dev_secret_key
# FRONTEND_URL=http://localhost:5173

# Démarrer le serveur
npm run dev

# Résultat attendu:
# ✓ MongoDB connected
# 🚀 Server running on http://localhost:5000
# ✓ API running
```

### 3. Frontend
```bash
# Nouveau terminal
cd frontend
npm install

# Démarrer Vite
npm run dev

# Résultat attendu:
# ➜  Local:   http://localhost:5173/
# ➜  Press h to show help
```

## Accès à l'Application

### URL
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

### Comptes de Test
```
Admin:
  Email: admin@hotel.com
  Password: password

Client:
  Email: client@hotel.com
  Password: password
```

### Premier Démarrage
1. Allez à http://localhost:5173
2. Cliquez "Se connecter"
3. Utilisez les comptes de test ci-dessus

## MongoDB Atlas (Cloud)

Si vous préférez ne pas installer MongoDB localement:

1. Créez un compte sur https://www.mongodb.com/cloud/atlas
2. Créez un cluster gratuit
3. Obtenez votre connection string
4. Mettez à jour `backend/.env`:
   ```
   MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/hotelmanager?retryWrites=true&w=majority
   ```

## Structure des Fichiers

```
HotelManager/
├── backend/
│   ├── models/              # Schémas (User, Hotel, Room, Reservation)
│   │   ├── User.js
│   │   ├── Hotel.js
│   │   ├── Room.js
│   │   └── Reservation.js
│   ├── routes/              # API endpoints
│   │   ├── auth.js
│   │   ├── hotels.js
│   │   ├── rooms.js
│   │   ├── reservations.js
│   │   ├── clients.js
│   │   └── employees.js
│   ├── middleware/
│   │   └── auth.js          # Middleware JWT
│   ├── server.js            # Point d'entrée
│   ├── package.json
│   ├── .env.example
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── pages/           # Pages principales
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   └── admin/
    │   │       ├── Dashboard.jsx
    │   │       ├── Hotels.jsx
    │   │       ├── Reservations.jsx
    │   │       ├── Clients.jsx
    │   │       └── Employees.jsx
    │   ├── components/      # Composants réutilisables
    │   │   ├── Sidebar.jsx
    │   │   ├── Navbar.jsx
    │   │   ├── Chatbot.jsx
    │   │   ├── DashboardLayout.jsx
    │   │   └── ui/
    │   │       ├── Button.jsx
    │   │       ├── Input.jsx
    │   │       └── Card.jsx
    │   ├── store/
    │   │   └── authStore.js # Zustand store
    │   ├── lib/
    │   │   └── api.js       # Client Axios
    │   ├── styles/
    │   │   └── globals.css
    │   ├── App.jsx          # Routeur principal
    │   └── main.jsx         # Point d'entrée React
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    └── package.json
```

## Troubleshooting

### Erreur: "Cannot connect to MongoDB"
```bash
# Vérifier que MongoDB est en cours d'exécution
ps aux | grep mongod

# Sur macOS
brew services list

# Redémarrer si nécessaire
brew services restart mongodb-community
```

### Erreur: "Port 5000 already in use"
```bash
# Trouver le processus utilisant le port
lsof -i :5000

# Tuer le processus
kill -9 <PID>

# Ou changer le port dans backend/.env
PORT=5001
```

### Erreur: "Cannot GET /api/hotels"
- Vérifier que le backend est en cours d'exécution (npm run dev)
- Vérifier que le token JWT est valide
- Vérifier la console du navigateur pour les erreurs d'authentification

### Erreur CORS
- Vérifier que FRONTEND_URL dans .env est correct
- S'assurer que le backend accepte les requêtes du frontend

## Scripts Utiles

### Backend
```bash
npm run dev      # Démarrer avec nodemon
npm start        # Démarrer normalement
```

### Frontend
```bash
npm run dev      # Démarrer Vite dev server
npm run build    # Build pour production
npm run preview  # Prévisualiser le build
```

## Base de Données - Initialisation

Les collections MongoDB sont créées automatiquement. Cependant, pour tester rapidement, vous pouvez créer des comptes via le formulaire d'inscription ou d'authentification.

### Admins Initiaux
Pour donner les droits d'admin à un compte:
1. Connectez-vous au MongoDB CLI
2. Mettez à jour l'utilisateur:
```javascript
db.users.updateOne(
  { email: "votre@email.com" },
  { $set: { role: "admin" } }
)
```

## Déploiement

### Backend (Heroku)
```bash
# Créer une app Heroku
heroku create hotel-manager-api

# Ajouter les variables d'environnement
heroku config:set JWT_SECRET=your_secret_key
heroku config:set MONGODB_URI=your_mongodb_uri

# Déployer
git push heroku main
```

### Frontend (Vercel)
```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel

# Définir les variables d'environnement
# VITE_API_URL=https://your-api.herokuapp.com/api
```

## Performance & Optimisation

### Frontend
- Tailwind CSS est minimisé en production
- Vite bundle les assets automatiquement
- React Router utilise le code splitting

### Backend
- Mongoose utilise les indexes par défaut
- JWT expire après 7 jours
- CORS active le caching côté client

## Sécurité

### Production Checklist
- [ ] Changer JWT_SECRET en quelque chose de complexe
- [ ] Mettre NODE_ENV=production
- [ ] Utiliser HTTPS
- [ ] Mettre à jour les dépendances (npm audit)
- [ ] Implémenter la validation des entrées
- [ ] Ajouter un rate limiter
- [ ] Mettre en place le logging
- [ ] Configurer CORS correctement
- [ ] Utiliser les variables d'environnement sécurisées

## Support & Aide

Pour les problèmes:
1. Vérifier les logs (terminal)
2. Consulter la console du navigateur
3. Créer une issue sur GitHub

## Prochaines Étapes

Après le démarrage réussi:
1. Créez un compte admin
2. Ajoutez un hôtel
3. Ajoutez des chambres
4. Testez une réservation
5. Explorez le chatbot
6. Testez les différents rôles
