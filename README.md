# 🎓 Application de Gestion des Vacataires 2iE

Application web complète pour la gestion des enseignants vacataires de l'institut 2iE, permettant de gérer le processus complet : candidature → validation → contrat → paiement.

## 🚀 Fonctionnalités

### Pour les Vacataires
- ✅ Inscription et gestion de profil
- ✅ Upload de CV et diplômes
- ✅ Consultation des cours disponibles
- ✅ Soumission de candidatures
- ✅ Suivi des candidatures et contrats
- ✅ Visualisation des paiements

### Pour les Administrateurs/RH
- ✅ Validation des profils vacataires
- ✅ Gestion des cours
- ✅ Traitement des candidatures
- ✅ Création et gestion des contrats
- ✅ Suivi des paiements
- ✅ Tableaux de bord avec statistiques

## 🛠 Stack Technique

### Backend
- **Node.js** + **Express.js**
- **MySQL** avec **Sequelize ORM**
- **JWT** pour l'authentification
- **Multer** pour l'upload de fichiers
- **Bcrypt** pour le hachage des mots de passe

### Frontend
- **React.js** avec Create React App
- **Bootstrap 5** pour l'interface
- **React Router** pour la navigation
- **Axios** pour les requêtes API
- **Font Awesome** pour les icônes

## 📋 Prérequis

- Node.js (version 14 ou supérieure)
- MySQL (version 5.7 ou supérieure)
- npm ou yarn

## 🚀 Installation et Démarrage

### 1. Cloner le projet
```bash
git clone <url-du-repo>
cd gestion-vacataires
```

### 2. Configuration de la base de données

#### Option A: Utiliser le script SQL fourni
```bash
# Se connecter à MySQL
mysql -u root -p

# Exécuter le script d'initialisation
source backend/database/init.sql
```

#### Option B: Créer manuellement
```sql
CREATE DATABASE vacataires_db;
USE vacataires_db;
-- Puis exécuter le contenu du fichier backend/database/init.sql
```

### 3. Configuration du Backend

```bash
cd backend
npm install

# Créer un fichier .env (optionnel, les valeurs par défaut fonctionnent)
# DB_HOST=localhost
# DB_NAME=vacataires_db
# DB_USER=root
# DB_PASSWORD=password
# JWT_SECRET=votre_secret_jwt_tres_securise_ici
# PORT=5000

# Démarrer le serveur
npm run dev
```

Le serveur backend sera accessible sur `http://localhost:5000`

### 4. Configuration du Frontend

```bash
cd frontend
npm install

# Démarrer l'application React
npm start
```

L'application frontend sera accessible sur `http://localhost:3000`

## 👥 Comptes de Test

### Administrateur
- **Email:** admin@2ie.edu.bf
- **Mot de passe:** admin123

### Ressources Humaines
- **Email:** rh@2ie.edu.bf
- **Mot de passe:** rh123

### Vacataires
- **Email:** vacataire1@2ie.edu.bf
- **Mot de passe:** vacataire123

- **Email:** vacataire2@2ie.edu.bf
- **Mot de passe:** vacataire123

- **Email:** vacataire3@2ie.edu.bf
- **Mot de passe:** vacataire123

## 📁 Structure du Projet

```
gestion-vacataires/
├── backend/
│   ├── config/          # Configuration base de données
│   ├── controllers/     # Contrôleurs API
│   ├── middleware/      # Middlewares (auth, upload)
│   ├── models/          # Modèles Sequelize
│   ├── routes/          # Routes API
│   ├── uploads/         # Fichiers uploadés
│   ├── database/        # Scripts SQL
│   └── server.js        # Serveur principal
├── frontend/
│   ├── src/
│   │   ├── components/  # Composants React
│   │   ├── contexts/    # Contextes (Auth)
│   │   ├── pages/       # Pages de l'application
│   │   ├── services/    # Services API
│   │   └── App.js       # Application principale
│   └── public/          # Fichiers statiques
└── README.md
```

## 🔧 API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/profile` - Profil utilisateur
- `PUT /api/auth/profile` - Mise à jour profil

### Vacataires
- `GET /api/vacataires` - Liste des vacataires (admin/RH)
- `PUT /api/vacataires/profile` - Mise à jour profil vacataire
- `PUT /api/vacataires/:id/status` - Changer statut vacataire
- `GET /api/vacataires/:id/dossier` - Télécharger le dossier ZIP du vacataire (admin/RH)

### Candidatures
- `GET /api/applications/courses` - Liste des cours
- `POST /api/applications/submit` - Soumettre candidature
- `GET /api/applications/all` - Toutes les candidatures (admin/RH)
- `PUT /api/applications/:id/status` - Changer statut candidature

### Contrats
- `GET /api/contracts` - Liste des contrats (admin/RH)
- `GET /api/contracts/my-contracts` - Mes contrats (vacataire)
- `PUT /api/contracts/:id` - Mettre à jour contrat
- `POST /api/contracts/:id/payments` - Créer paiement

## 🎯 Utilisation

### 1. Premier démarrage
1. Démarrer le backend et le frontend
2. Se connecter avec le compte admin
3. Créer des cours via la page "Cours"
4. Les vacataires peuvent s'inscrire et postuler

### 2. Workflow typique
1. **Vacataire** s'inscrit et complète son profil
2. **Admin/RH** valide le profil vacataire
3. **Vacataire** consulte les cours et postule
4. **Admin/RH** traite les candidatures
5. **Admin/RH** crée des contrats pour les candidatures approuvées
6. **Admin/RH** gère les paiements

### Télécharger le dossier d'un vacataire (Admin/RH)
1. Ouvrez la page `Gestion des Vacataires`.
2. Dans la ligne d'un vacataire, cliquez sur le bouton `Dossier` (icône téléchargement).
3. Un fichier `dossier_vacataire_<id>.zip` est téléchargé. Il contient:
   - `profil.json` (informations du vacataire)
   - `CV_*.pdf` si disponible
   - `Diplome_*.pdf` si disponible

Notes:
- L'archive est générée même si certains documents manquent.
- L'accès est réservé aux rôles Admin/RH.

## 🐛 Dépannage

### Problèmes de base de données
```bash
# Vérifier que MySQL est démarré
sudo service mysql start

# Vérifier la connexion
mysql -u root -p -e "SHOW DATABASES;"
```

### Problèmes de ports
- Backend: Port 5000 (modifiable dans server.js)
- Frontend: Port 3000 (modifiable avec PORT=3001 npm start)

### Problèmes d'upload de fichiers
- Vérifier que le dossier `backend/uploads` existe
- Vérifier les permissions d'écriture

## 📝 Notes de Développement

- L'application est configurée pour le développement local
- Les mots de passe sont hachés avec bcrypt
- Les tokens JWT expirent après 7 jours
- Les fichiers uploadés sont limités à 5MB
- Types de fichiers acceptés: PDF, DOC, DOCX, images

## 🔒 Sécurité

- Authentification JWT
- Hachage des mots de passe avec bcrypt
- Validation des rôles utilisateur
- Protection des routes sensibles
- Validation des types de fichiers

## 📞 Support

Pour toute question ou problème, contactez l'équipe de développement.

---

**Développé pour l'Institut 2iE** 🎓