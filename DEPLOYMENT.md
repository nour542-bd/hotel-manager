# Guide de Déploiement - HotelManager Pro

## Déploiement Complet (Cloud)

### Architecture de Déploiement
```
Frontend (Vercel)     → https://app.hotelmanager.com
           ↓
Backend (Railway)     → https://api.hotelmanager.com
           ↓
MongoDB (Atlas)       → Cloud database
```

## 1️⃣ Backend Deployment (Railway/Heroku)

### Option A: Railway (Recommandé)

#### Étape 1: Setup Initial
```bash
# Créer un compte sur https://railway.app
# Installer Railway CLI
npm install -g @railway/cli

# Se connecter
railway login
```

#### Étape 2: Configurer le Projet
```bash
cd backend

# Créer un nouveau projet Railway
railway init

# Ajouter les variables d'environnement
railway variables
```

**Variables d'environnement à ajouter:**
```env
PORT=5000
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/hotelmanager
JWT_SECRET=super_secret_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=production
FRONTEND_URL=https://your-domain.com
```

#### Étape 3: Déployer
```bash
# Déployer vers Railway
railway up

# Voir les logs
railway logs

# URL du backend sera affichée
# Exemple: https://hotelmanager-api-prod.up.railway.app
```

### Option B: Heroku

#### Étape 1: Setup
```bash
# Créer compte sur https://www.heroku.com
# Installer Heroku CLI
npm install -g heroku

# Se connecter
heroku login
```

#### Étape 2: Créer une App
```bash
cd backend

# Créer une nouvelle app
heroku create hotelmanager-api

# Ajouter MongoDB Atlas URI
heroku config:set MONGODB_URI="mongodb+srv://..."

# Autres variables
heroku config:set JWT_SECRET="your_secret_key"
heroku config:set JWT_EXPIRE="7d"
heroku config:set NODE_ENV="production"
heroku config:set FRONTEND_URL="https://your-domain.com"
```

#### Étape 3: Déployer
```bash
# Déployer avec Git
git push heroku main

# Voir les logs
heroku logs --tail

# URL: https://hotelmanager-api.herokuapp.com
```

## 2️⃣ Frontend Deployment (Vercel)

### Étape 1: Préparation
```bash
cd frontend

# Build pour production
npm run build

# Vérifier le build
npm run preview
```

### Étape 2: Déployer sur Vercel

#### Option A: Dashboard Web (Plus simple)
1. Aller à https://vercel.com
2. Cliquer "New Project"
3. Sélectionner le repo GitHub
4. Définir le répertoire racine: `frontend`
5. Ajouter les variables d'environnement

#### Option B: CLI
```bash
# Installer Vercel CLI
npm install -g vercel

# Se connecter
vercel login

# Déployer
vercel --prod
```

### Variables d'Environnement (Vercel)
```
VITE_API_URL=https://hotelmanager-api-prod.up.railway.app/api
```

### Après le Déploiement
```bash
# URL générée: https://hotelmanager.vercel.app
# Vous pouvez ajouter un domaine personnalisé
```

## 3️⃣ Base de Données (MongoDB Atlas)

### Étape 1: Créer un Cluster
1. Aller à https://www.mongodb.com/cloud/atlas
2. Créer un compte gratuit
3. Créer un nouveau projet
4. Créer un cluster (Free tier OK)

### Étape 2: Configuration
```bash
# Attendre que le cluster soit prêt (~5 minutes)
# Cliquer sur "Connect"
# Copier la connection string:
# mongodb+srv://username:password@cluster.mongodb.net/hotelmanager
```

### Étape 3: Network Access
```
# Ajouter une IP Whitelist
# Pour development: 0.0.0.0/0 (ouvre à tout le monde)
# Pour production: Ajouter les IPs de votre serveur
```

## 4️⃣ Domaine Personnalisé

### Ajouter un domaine à Vercel
```
1. Aller aux settings du projet Vercel
2. Cliquer sur "Domains"
3. Ajouter votre domaine
4. Mettre à jour les DNS records
```

### Ajouter un domaine à Railway/Heroku
```
1. Settings → Domains
2. Ajouter le domaine
3. Mettre à jour les DNS records (CNAME)
```

## 5️⃣ Environment Variables Summary

### Backend
```env
# Production
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secure_secret_key
JWT_EXPIRE=7d
FRONTEND_URL=https://your-domain.com
```

### Frontend
```env
# Production
VITE_API_URL=https://your-api-domain.com/api
```

## 🔒 Sécurité pour Production

### Checklist Sécurité
- [ ] JWT_SECRET = clé complexe et unique
- [ ] NODE_ENV = production
- [ ] HTTPS activé partout
- [ ] CORS correctement configuré
- [ ] MongoDB whitelist d'IPs
- [ ] Pas de secrets en git (utiliser .env)
- [ ] npm audit - vérifier les vulnérabilités
- [ ] Ajouter HTTPS certificates
- [ ] Setup monitoring (Sentry, DataDog)

### Packages de Sécurité (Recommandé)
```bash
cd backend
npm install helmet express-rate-limit

# Mettre à jour server.js:
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

app.use(helmet());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);
```

## 📊 Monitoring & Logs

### Vercel Logs
```bash
vercel logs
```

### Railway Logs
```bash
railway logs
```

### Heroku Logs
```bash
heroku logs --tail
```

### MongoDB Atlas Monitoring
- Dashboard → Monitoring
- Voir: CPU, RAM, Réseau
- Configurer des alertes

## 🔄 Continuous Deployment

### Auto-deploy sur Push
```
Vercel: Automatique quand vous poussez vers main
Railway: Configurez depuis le dashboard
Heroku: Ajouter GitHub auto-deploy
```

## 🆘 Troubleshooting Déploiement

### Erreur: "Cannot find module"
```bash
# Backend
npm install --production
npm run build

# Frontend
npm install
npm run build
```

### Erreur: "Connection to MongoDB failed"
```
# Vérifier:
1. MongoDB URI est correcte
2. IP est whitelistée dans Atlas
3. Credentials sont corrects
4. Cluster est en cours d'exécution
```

### Erreur: "CORS error"
```javascript
// Backend server.js
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

### Erreur: "API not responding"
```
1. Vérifier le backend est en cours d'exécution
2. Vérifier VITE_API_URL est correct au frontend
3. Vérifier les logs du backend
4. Vérifier CORS settings
```

## 📈 Performance en Production

### Frontend Optimization
```bash
# Vérifier la taille du bundle
npm run build

# Utiliser le preview pour vérifier
npm run preview
```

### Backend Optimization
```javascript
// Ajouter compression
import compression from 'compression';
app.use(compression());

// Ajouter caching
app.set('trust proxy', 1);
```

## 🚀 Post-Déploiement

### Tests
1. Tester login et register
2. Tester CRUD complet
3. Tester les différents rôles
4. Tester le chatbot
5. Vérifier les emails (si implémenté)

### Documentation
```bash
# Créer un fichier API.md avec vos endpoints
# Créer un fichier DEPLOYMENT_STATUS.md

Production Endpoints:
- Frontend: https://hotelmanager.com
- API: https://api.hotelmanager.com/api
- MongoDB: Atlas (monitored)

Credentials:
- Admin: [hidden]
- Backup: [location]
```

## 💡 Tips Importants

✅ Toujours tester le build localement avant de pousser
✅ Utiliser des variables d'environnement pour secrets
✅ Monitorer les logs après déploiement
✅ Configurer des alertes pour erreurs
✅ Faire des backups MongoDB réguliers
✅ Utiliser des sessions/cookies sécurisés
✅ Implémenter du rate limiting
✅ Ajouter un CDN pour les assets statiques

## 📞 Support Déploiement

- **Vercel Docs**: https://vercel.com/docs
- **Railway Docs**: https://docs.railway.app
- **Heroku Docs**: https://devcenter.heroku.com
- **MongoDB Atlas**: https://docs.atlas.mongodb.com

## Coûts Estimés

| Service | Free Tier | Coût |
|---------|-----------|------|
| Vercel | ✅ Illimité | $0-$20/mois |
| Railway | ✅ $5 crédits | $5-$50/mois |
| Heroku | ⚠️ Limite | $7-$50/mois |
| MongoDB Atlas | ✅ 512MB | $10-$100+/mois |
| **Total** | **Gratuit** | **$15-$50/mois** |

## Prochaines Étapes

1. ✅ Deploy backend (Railway)
2. ✅ Setup MongoDB Atlas
3. ✅ Deploy frontend (Vercel)
4. ✅ Configurer domaine personnalisé
5. ✅ Ajouter HTTPS certificate
6. ✅ Setup monitoring
7. ✅ Configurer auto-backups

Félicitations! Votre app est maintenant en production! 🎉
