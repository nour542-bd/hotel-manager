# 🚀 Quick Start - 3 Minutes

## Installation Express

### Terminal 1 - Backend
```bash
cd backend
npm install
npm run dev
```

Attendez: `🚀 Server running on http://localhost:5000`

### Terminal 2 - Frontend
```bash
cd frontend
npm install
npm run dev
```

Attendez: `➜  Local:   http://localhost:5173/`

### Accédez à l'App
**http://localhost:5173**

## Login de Test

```
Admin:
  Email: admin@hotel.com
  Password: password

Client:
  Email: client@hotel.com
  Password: password
```

## C'est tout! 🎉

L'app est maintenant en cours d'exécution avec:
- ✅ Home page publique
- ✅ Login & Register
- ✅ Admin Dashboard
- ✅ Client Portal
- ✅ CRUD Complets (Hôtels, Réservations, Clients, Employés)
- ✅ Chatbot intégré
- ✅ Dark mode professionnel

## Troubleshooting

| Problème | Solution |
|----------|----------|
| Port 5000 déjà utilisé | `lsof -i :5000` puis `kill -9 <PID>` |
| Port 5173 déjà utilisé | Vite utilisera le prochain disponible |
| MongoDB connection failed | Assurez-vous que MongoDB est lancé |
| CORS errors | Vérifier que Backend est sur port 5000 |

## Prochaines Étapes

1. Explorez le **Home Page** (http://localhost:5173)
2. Créez un **compte admin** (Register)
3. Connectez-vous et testez le **Admin Dashboard**
4. Ajoutez un **Hôtel**
5. Testez les **CRUD** (Create, Read, Update, Delete)
6. Essayez le **Chatbot**
7. Testez un autre rôle (Client)

## Architecture

```
Frontend (React + Vite)
    ↓ HTTP/JWT
Backend (Express + Node)
    ↓ MongoDB Driver
MongoDB
```

## Documentation Complète

- `README.md` - Vue d'ensemble complète
- `SETUP.md` - Installation détaillée
- `ARCHITECTURE.md` - Architecture technique

## Support Rapide

**Issue?** Vérifiez:
1. Les deux serveurs tournent (npm run dev)
2. MongoDB est lancé
3. Pas d'erreurs dans la console
4. Vérifiez les logs du backend

Bon développement! 🎊
