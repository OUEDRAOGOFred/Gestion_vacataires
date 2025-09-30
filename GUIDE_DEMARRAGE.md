# 🚀 Guide de Démarrage Rapide - Gestion Vacataires 2iE

## ⚡ Démarrage Express (5 minutes)

### 1. Prérequis
- ✅ Node.js installé
- ✅ MySQL installé et démarré
- ✅ Base de données créée

### 2. Configuration Base de Données
```sql
-- Se connecter à MySQL
mysql -u root -p

-- Créer la base de données
CREATE DATABASE vacataires_db;
USE vacataires_db;

-- Exécuter le script d'initialisation
source backend/database/init.sql;
```

### 3. Démarrage de l'Application

#### Option A: Script automatique (Windows)
```bash
# Double-cliquer sur start.bat
# Ou en ligne de commande:
start.bat
```

#### Option B: Script automatique (Linux/Mac)
```bash
chmod +x start.sh
./start.sh
```

#### Option C: Démarrage manuel
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm start
```

### 4. Accès à l'Application
- 🌐 **Frontend:** http://localhost:3000
- 🔧 **Backend API:** http://localhost:5000/api

## 👥 Comptes de Test

### 🔑 Administrateur
- **Email:** admin@2ie.edu.bf
- **Mot de passe:** admin123
- **Accès:** Toutes les fonctionnalités

### 👔 Ressources Humaines
- **Email:** rh@2ie.edu.bf  
- **Mot de passe:** rh123
- **Accès:** Gestion vacataires, candidatures, contrats

### 👨‍🏫 Vacataires
- **Email:** vacataire1@2ie.edu.bf
- **Mot de passe:** vacataire123
- **Accès:** Profil, candidatures, contrats

## 🎯 Workflow de Test

### 1. Connexion Admin
1. Aller sur http://localhost:3000
2. Se connecter avec admin@2ie.edu.bf / admin123
3. Vérifier le dashboard avec les statistiques

### 2. Gestion des Cours
1. Cliquer sur "Cours" dans le menu
2. Créer un nouveau cours
3. Vérifier qu'il apparaît dans la liste

### 3. Test Vacataire
1. Se déconnecter
2. Se connecter avec vacataire1@2ie.edu.bf / vacataire123
3. Compléter le profil (spécialisation, expérience)
4. Aller dans "Mes Candidatures"
5. Postuler à un cours

### 4. Validation Admin
1. Se reconnecter en admin
2. Aller dans "Vacataires" → valider le profil
3. Aller dans "Candidatures" → traiter la candidature
4. Aller dans "Contrats" → créer un contrat

## 🔧 Dépannage Rapide

### Problème: "Cannot connect to database"
```bash
# Vérifier que MySQL est démarré
sudo service mysql start  # Linux
net start mysql          # Windows
```

### Problème: "Port already in use"
```bash
# Changer le port dans backend/server.js
const PORT = process.env.PORT || 5001;
```

### Problème: "Module not found"
```bash
# Réinstaller les dépendances
cd backend && npm install
cd ../frontend && npm install
```

## 📱 Fonctionnalités Testées

### ✅ Authentification
- [x] Inscription utilisateur
- [x] Connexion/Déconnexion
- [x] Gestion des rôles
- [x] Protection des routes

### ✅ Gestion Vacataires
- [x] Création de profil
- [x] Upload de fichiers (CV, diplômes)
- [x] Validation par admin/RH
- [x] Statuts (pending, approved, rejected)

### ✅ Système de Candidatures
- [x] Consultation des cours
- [x] Soumission de candidatures
- [x] Traitement par admin/RH
- [x] Suivi des statuts

### ✅ Gestion des Contrats
- [x] Création automatique après approbation
- [x] Gestion des paiements
- [x] Suivi des échéances
- [x] Statuts des contrats

### ✅ Interface Utilisateur
- [x] Dashboard avec statistiques
- [x] Navigation responsive
- [x] Formulaires de saisie
- [x] Tableaux de données
- [x] Modales de détail

## 🎉 Application Prête !

L'application est maintenant **100% fonctionnelle** avec toutes les fonctionnalités demandées :

1. ✅ **Authentification complète** (3 rôles)
2. ✅ **Gestion des vacataires** (inscription, validation, upload)
3. ✅ **Système de candidatures** (cours, postulation, traitement)
4. ✅ **Gestion des contrats** (création, paiements, suivi)
5. ✅ **Interface d'administration** (dashboard, statistiques)
6. ✅ **Base de données** (MySQL avec données de test)

**L'application est prête pour la démonstration et l'utilisation !** 🚀