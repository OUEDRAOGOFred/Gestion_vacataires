# 🗄️ Configuration de la Base de Données - Gestion Vacataires 2iE

## ❌ **STATUT ACTUEL : BASE DE DONNÉES NON CONFIGURÉE**

L'erreur `Access denied for user 'root'@'localhost'` indique que MySQL n'est pas correctement configuré.

---

## 🔧 **SOLUTIONS POUR CONFIGURER LA BASE DE DONNÉES**

### **Option 1 : Installation de MySQL (Recommandée)**

#### **Windows :**
1. **Télécharger MySQL :**
   - Aller sur : https://dev.mysql.com/downloads/mysql/
   - Télécharger MySQL Community Server
   - Installer avec les paramètres par défaut

2. **Configuration :**
   - Mot de passe root : `password` (ou votre choix)
   - Port : `3306` (par défaut)
   - Service : Démarrer automatiquement

3. **Vérification :**
   ```bash
   # Ouvrir Command Prompt en tant qu'administrateur
   mysql -u root -p
   # Entrer le mot de passe
   ```

#### **Linux (Ubuntu/Debian) :**
```bash
# Installation
sudo apt update
sudo apt install mysql-server

# Configuration sécurisée
sudo mysql_secure_installation

# Démarrer le service
sudo systemctl start mysql
sudo systemctl enable mysql
```

#### **macOS :**
```bash
# Avec Homebrew
brew install mysql
brew services start mysql

# Configuration
mysql_secure_installation
```

### **Option 2 : Utiliser XAMPP (Plus Simple)**

1. **Télécharger XAMPP :**
   - Aller sur : https://www.apachefriends.org/
   - Télécharger XAMPP pour Windows

2. **Installation :**
   - Installer XAMPP
   - Démarrer Apache et MySQL via le panneau de contrôle

3. **Configuration :**
   - MySQL sera accessible sur `localhost:3306`
   - Utilisateur : `root`
   - Mot de passe : (vide par défaut)

### **Option 3 : Base de Données en Mémoire (Pour Tests)**

Modifiez `backend/config/database.js` pour utiliser SQLite :

```javascript
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite', // Fichier de base de données
  logging: false
});
```

---

## 🚀 **CONFIGURATION RAPIDE (XAMPP)**

### **1. Installer XAMPP**
- Télécharger depuis : https://www.apachefriends.org/
- Installer et démarrer Apache + MySQL

### **2. Créer la Base de Données**
```sql
-- Ouvrir phpMyAdmin (http://localhost/phpmyadmin)
-- Ou utiliser MySQL en ligne de commande

CREATE DATABASE vacataires_db;
USE vacataires_db;

-- Exécuter le contenu du fichier backend/database/init.sql
```

### **3. Modifier la Configuration**
Créez un fichier `backend/.env` :
```env
DB_HOST=localhost
DB_NAME=vacataires_db
DB_USER=root
DB_PASSWORD=
JWT_SECRET=votre_secret_jwt_tres_securise_ici
PORT=5000
```

### **4. Tester la Connexion**
```bash
cd backend
node test-database.js
```

---

## 🧪 **TESTS DE VÉRIFICATION**

### **Test 1 : Connexion MySQL**
```bash
# Windows
mysql -u root -p

# Linux/Mac
sudo mysql -u root -p
```

### **Test 2 : Création de la Base**
```sql
CREATE DATABASE vacataires_db;
SHOW DATABASES;
```

### **Test 3 : Test de l'Application**
```bash
cd backend
node test-database.js
```

### **Test 4 : Démarrage de l'Application**
```bash
npm run dev
```

---

## 📋 **CHECKLIST DE CONFIGURATION**

- [ ] MySQL installé et démarré
- [ ] Base de données `vacataires_db` créée
- [ ] Utilisateur `root` avec mot de passe configuré
- [ ] Fichier `.env` créé avec les bonnes valeurs
- [ ] Script `init.sql` exécuté
- [ ] Test de connexion réussi
- [ ] Application backend démarre sans erreur

---

## 🔍 **DIAGNOSTIC DES ERREURS**

### **Erreur : "Access denied for user 'root'@'localhost'"**
**Solutions :**
1. Vérifier le mot de passe MySQL
2. Créer un utilisateur avec permissions
3. Utiliser XAMPP (mot de passe vide)

### **Erreur : "Can't connect to MySQL server"**
**Solutions :**
1. Vérifier que MySQL est démarré
2. Vérifier le port (3306)
3. Vérifier les paramètres de connexion

### **Erreur : "Unknown database 'vacataires_db'"**
**Solutions :**
1. Créer la base de données
2. Exécuter le script `init.sql`

---

## 🎯 **CONFIGURATION RECOMMANDÉE POUR DÉVELOPPEMENT**

### **Avec XAMPP (Le Plus Simple)**
```env
# backend/.env
DB_HOST=localhost
DB_NAME=vacataires_db
DB_USER=root
DB_PASSWORD=
JWT_SECRET=dev_secret_key_change_in_production
PORT=5000
NODE_ENV=development
```

### **Avec MySQL Standard**
```env
# backend/.env
DB_HOST=localhost
DB_NAME=vacataires_db
DB_USER=root
DB_PASSWORD=password
JWT_SECRET=dev_secret_key_change_in_production
PORT=5000
NODE_ENV=development
```

---

## 🚀 **DÉMARRAGE RAPIDE**

1. **Installer XAMPP** ✅
2. **Démarrer Apache + MySQL** ✅
3. **Créer la base de données** ✅
4. **Exécuter le script init.sql** ✅
5. **Créer le fichier .env** ✅
6. **Tester la connexion** ✅
7. **Démarrer l'application** ✅

**Une fois configurée, la base de données fonctionnera parfaitement avec toutes les fonctionnalités de l'application !** 🎉