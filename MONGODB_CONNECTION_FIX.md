# 🔧 MongoDB Connection - Troubleshooting Guide

## ❌ Problème de Connexion MongoDB

Si vous avez une erreur de connexion à MongoDB, voici les solutions:

---

## ✅ Solution 1: Vérifier si MongoDB est installé

### Windows - Vérifier le service:
```bash
# Ouvrez PowerShell en tant qu'administrateur
sc query MongoDB

# OU
services.msc
```
Cherchez "MongoDB" dans la liste des services.

### Si MongoDB n'est PAS installé:

**Option A: Installer MongoDB Localement (Windows)**
1. Téléchargez MongoDB Community Server:
   https://www.mongodb.com/try/download/community
   
2. Installez avec les options par défaut

3. Démarrez le service:
   ```bash
   net start MongoDB
   ```

**Option B: Utiliser MongoDB Atlas (Cloud - GRATUIT)**
→ Voir Solution 3 ci-dessous

---

## ✅ Solution 2: Démarrer MongoDB (si déjà installé)

### Windows:
```bash
# Méthode 1: Via le service
net start MongoDB

# Méthode 2: Via MongoDB Compass
# Lancez MongoDB Compass, il démarrera MongoDB automatiquement

# Méthode 3: En ligne de commande
mongod --dbpath "C:\data\db"
```

### Vérifier que MongoDB tourne:
```bash
mongosh
# ou
mongo
```

Si vous pouvez vous connecter, MongoDB fonctionne! ✅

---

## ✅ Solution 3: MongoDB Atlas (Cloud - Recommandé)

### Avantages:
- ✅ Gratuit (512 MB)
- ✅ Pas d'installation locale
- ✅ Toujours disponible
- ✅ Sauvegardes automatiques

### Étapes:

#### 1. Créer un compte MongoDB Atlas
```
https://www.mongodb.com/cloud/atlas/register
```

#### 2. Créer un cluster gratuit (M0)
- Cliquez sur "Build a Database"
- Choisissez "FREE" (M0 Sandbox)
- Sélectionnez un provider (AWS, Google, Azure)
- Choisissez une région proche (Europe)
- Cliquez sur "Create Cluster"

#### 3. Configurer l'accès
**a. Créer un utilisateur:**
- Database Access → Add New Database User
- Username: `hoteladmin`
- Password: `choisissez_un_mot_de_passe`
- Role: "Read and write to any database"
- Cliquez sur "Add User"

**b. Autoriser votre IP:**
- Network Access → Add IP Address
- Cliquez sur "Allow Access from Anywhere" (0.0.0.0/0)
- Ou ajoutez votre IP actuelle
- Cliquez sur "Confirm"

#### 4. Obtenir la chaîne de connexion
- Cliquez sur "Connect" sur votre cluster
- Choisissez "Connect your application"
- Copiez la chaîne de connexion (elle ressemble à):
```
mongodb+srv://hoteladmin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

#### 5. Mettre à jour .env
Dans `backend/.env`, remplacez:
```env
MONGODB_URI=mongodb+srv://hoteladmin:VOTRE_MOT_DE_PASSE@cluster0.xxxxx.mongodb.net/hotelmanager?retryWrites=true&w=majority
```

**Important:** Remplacez `<password>` par votre vrai mot de passe!

#### 6. Redémarrer le backend
```bash
cd backend
npm run dev
```

Vous devriez voir: "✓ MongoDB connected successfully"

---

## ✅ Solution 4: Utiliser MongoDB Local sans Service

### Télécharger MongoDB Compass (GUI):
```
https://www.mongodb.com/try/download/compass
```

### Connexion locale:
1. Ouvrez MongoDB Compass
2. Connection string: `mongodb://localhost:27017`
3. Cliquez sur "Connect"
4. Si ça marche, MongoDB tourne!

---

## 🔍 Vérifier la connexion

### Test 1: Backend
```bash
cd backend
npm run dev
```

**Succès:**
```
✓ MongoDB connected successfully
🚀 Server running on http://localhost:5000
```

**Erreur:**
```
✗ MongoDB connection error: connect ECONNREFUSED 127.0.0.1:27017
```
→ MongoDB n'est pas démarré

### Test 2: API Health
Dans votre navigateur:
```
http://localhost:5000/api/health
```

**Succès:**
```json
{
  "status": "API running",
  "timestamp": "2024-03-24T..."
}
```

### Test 3: Hotels API
```
http://localhost:5000/api/hotels
```

**Succès:**
```json
[
  {
    "_id": "...",
    "name": "Laico Tunis Hotel",
    ...
  },
  ...
]
```

---

## 🚀 Installation Rapide (Windows)

### PowerShell (Admin):
```powershell
# 1. Installer MongoDB via Chocolatey (si installé)
choco install mongodb

# 2. Démarrer le service
net start MongoDB

# 3. Tester la connexion
mongosh
```

### Si Chocolatey n'est pas installé:
1. Téléchargez l'installateur: https://www.mongodb.com/try/download/community
2. Exécutez l'installateur
3. Choisissez "Complete"
4. Installez comme service Windows
5. Démarrez le service

---

## 📋 Fichier .env Correct

### Pour MongoDB Local:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hotelmanager
JWT_SECRET=votre_secret_jwt_tres_long_et_securise
JWT_EXPIRE=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Pour MongoDB Atlas (Cloud):
```env
PORT=5000
MONGODB_URI=mongodb+srv://hoteladmin:VotreMotDePasse@cluster0.xxxxx.mongodb.net/hotelmanager?retryWrites=true&w=majority
JWT_SECRET=votre_secret_jwt_tres_long_et_securise
JWT_EXPIRE=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

---

## 🎯 Solution la Plus Simple (Recommandée)

### Pour les débutants avec MongoDB:

**Utilisez MongoDB Atlas (Cloud)**

Pourquoi?
- ✅ Gratuit (pas besoin de carte bancaire)
- ✅ 512 MB suffisants pour ce projet
- ✅ Pas d'installation complexe
- ✅ Pas de configuration locale
- ✅ Accessible de partout
- ✅ Sauvegardes automatiques

**Temps d'installation:** ~10 minutes

### Étapes rapides:
1. Allez sur https://www.mongodb.com/cloud/atlas/register
2. Créez un compte gratuit
3. Créez un cluster M0 (gratuit)
4. Créez un utilisateur
5. Autorisez votre IP
6. Copiez la chaîne de connexion
7. Mettez à jour `backend/.env`
8. Redémarrez le backend

---

## 📞 Commandes Utiles

### Vérifier MongoDB:
```bash
# Windows (PowerShell Admin)
Get-Service MongoDB

# Démarrer
net start MongoDB

# Arrêter
net stop MongoDB

# Redémarrer
net stop MongoDB && net start MongoDB
```

### Tester la connexion:
```bash
mongosh
# ou
mongo --eval "db.version()"
```

### Voir les bases de données:
```bash
mongosh
> show dbs
> use hotelmanager
> show collections
> db.hotels.count()
```

---

## 🆘 Erreurs Courantes

### Erreur: "ECONNREFUSED"
**Cause:** MongoDB n'est pas démarré
**Solution:** `net start MongoDB`

### Erreur: "Authentication failed"
**Cause:** Mauvais mot de passe
**Solution:** Vérifiez le mot de passe dans .env

### Erreur: "Network timeout"
**Cause:** Problème réseau (Atlas)
**Solution:** Vérifiez votre IP dans Network Access

### Erreur: "MongoServerError: bad auth"
**Cause:** Utilisateur mal configuré
**Solution:** Recréez l'utilisateur dans Database Access

---

## ✅ Checklist de Dépannage

- [ ] MongoDB est-il installé?
- [ ] Le service MongoDB est-il démarré?
- [ ] Le fichier .env existe-t-il?
- [ ] MONGODB_URI est-il correct?
- [ ] Le port 27017 est-il libre?
- [ ] Le firewall ne bloque-t-il pas MongoDB?
- [ ] Avez-vous essayé MongoDB Atlas?

---

## 🎉 Une fois Connecté

Après une connexion réussie:

1. **Seeder la base de données:**
   ```bash
   cd backend
   npm run seed
   ```

2. **Vérifier les hôtels:**
   ```bash
   # Dans le navigateur
   http://localhost:5000/api/hotels
   ```

3. **Lancer le frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

4. **Visiter:**
   ```
   http://localhost:5173/hotels
   ```

Vous devriez voir les **12 hôtels**! 🏨

---

## 📚 Ressources

- **MongoDB Local:** https://docs.mongodb.com/manual/installation/
- **MongoDB Atlas:** https://www.mongodb.com/cloud/atlas
- **MongoDB Compass:** https://www.mongodb.com/products/compass
- **Documentation Mongoose:** https://mongoosejs.com/docs/

---

**Besoin d'aide?** Consultez la section qui correspond à votre cas! 🆘
