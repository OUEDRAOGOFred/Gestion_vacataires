#!/bin/bash

echo "========================================"
echo "  Configuration Base de Données 2iE"
echo "========================================"
echo

echo "Vérification de l'installation MySQL..."
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL n'est pas installé ou pas dans le PATH"
    echo
    echo "🔧 SOLUTIONS:"
    echo "1. Installer MySQL:"
    echo "   Ubuntu/Debian: sudo apt install mysql-server"
    echo "   CentOS/RHEL: sudo yum install mysql-server"
    echo "   macOS: brew install mysql"
    echo
    echo "2. Démarrer MySQL:"
    echo "   sudo systemctl start mysql"
    echo "   sudo systemctl enable mysql"
    echo
    exit 1
fi

echo "✅ MySQL détecté"
echo

echo "Test de connexion à MySQL..."
if ! mysql -u root -p -e "SELECT 1;" &> /dev/null; then
    echo "❌ Impossible de se connecter à MySQL"
    echo
    echo "🔧 SOLUTIONS:"
    echo "1. Vérifier que MySQL est démarré:"
    echo "   sudo systemctl start mysql"
    echo
    echo "2. Configurer MySQL:"
    echo "   sudo mysql_secure_installation"
    echo
    echo "3. Créer un utilisateur si nécessaire:"
    echo "   sudo mysql -u root"
    echo "   CREATE USER 'root'@'localhost' IDENTIFIED BY 'password';"
    echo "   GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost';"
    echo "   FLUSH PRIVILEGES;"
    echo
    exit 1
fi

echo "✅ Connexion MySQL réussie"
echo

echo "Création de la base de données..."
if ! mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS vacataires_db;" &> /dev/null; then
    echo "❌ Erreur lors de la création de la base de données"
    echo
    echo "🔧 SOLUTIONS:"
    echo "1. Vérifier les permissions de l'utilisateur root"
    echo "2. Créer manuellement: CREATE DATABASE vacataires_db;"
    echo
    exit 1
fi

echo "✅ Base de données 'vacataires_db' créée"
echo

echo "Initialisation des tables..."
if ! mysql -u root -p vacataires_db < backend/database/init.sql &> /dev/null; then
    echo "❌ Erreur lors de l'initialisation des tables"
    echo
    echo "🔧 SOLUTIONS:"
    echo "1. Vérifier que le fichier backend/database/init.sql existe"
    echo "2. Exécuter manuellement le script SQL"
    echo
    exit 1
fi

echo "✅ Tables initialisées avec succès"
echo

echo "Création du fichier de configuration..."
cat > backend/.env << EOF
# Configuration de la base de données
DB_HOST=localhost
DB_NAME=vacataires_db
DB_USER=root
DB_PASSWORD=password

# Configuration JWT
JWT_SECRET=votre_secret_jwt_tres_securise_ici_changez_cela_en_production
JWT_EXPIRES_IN=7d

# Configuration serveur
PORT=5000
NODE_ENV=development

# URL du frontend
FRONTEND_URL=http://localhost:3000
EOF

echo "✅ Fichier .env créé"
echo

echo "Test de la configuration..."
cd backend
if ! node test-database.js; then
    echo "❌ Test de la base de données échoué"
    echo
    echo "🔧 Vérifiez la configuration dans backend/.env"
    echo
    exit 1
fi

echo
echo "🎉 CONFIGURATION TERMINÉE AVEC SUCCÈS !"
echo "========================================"
echo
echo "✅ MySQL configuré"
echo "✅ Base de données créée"
echo "✅ Tables initialisées"
echo "✅ Données de test insérées"
echo "✅ Configuration .env créée"
echo
echo "🚀 Vous pouvez maintenant démarrer l'application:"
echo "   npm run dev"
echo
echo "👥 Comptes de test disponibles:"
echo "   Admin: admin@2ie.edu.bf / admin123"
echo "   RH: rh@2ie.edu.bf / rh123"
echo "   Vacataire: vacataire1@2ie.edu.bf / vacataire123"
echo