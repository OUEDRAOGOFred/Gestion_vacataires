@echo off
echo ========================================
echo   Configuration Base de Donnees 2iE
echo ========================================
echo.

echo Verifying MySQL installation...
mysql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ MySQL n'est pas installe ou pas dans le PATH
    echo.
    echo 🔧 SOLUTIONS:
    echo 1. Installer MySQL: https://dev.mysql.com/downloads/mysql/
    echo 2. Installer XAMPP: https://www.apachefriends.org/
    echo 3. Ajouter MySQL au PATH Windows
    echo.
    echo 📋 XAMPP (Recommandé pour Windows):
    echo - Télécharger XAMPP
    echo - Installer et démarrer Apache + MySQL
    echo - MySQL sera accessible sur localhost:3306
    echo.
    pause
    exit /b 1
)

echo ✅ MySQL détecté
echo.

echo Test de connexion à MySQL...
mysql -u root -p -e "SELECT 1;" >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Impossible de se connecter à MySQL
    echo.
    echo 🔧 SOLUTIONS:
    echo 1. Vérifier que MySQL est démarré
    echo 2. Vérifier le mot de passe root
    echo 3. Essayer avec XAMPP (mot de passe vide)
    echo.
    echo Test avec mot de passe vide (XAMPP)...
    mysql -u root -e "SELECT 1;" >nul 2>&1
    if %errorlevel% neq 0 (
        echo ❌ Connexion échouée même avec mot de passe vide
        echo.
        echo 📋 Configuration manuelle requise:
        echo 1. Démarrer MySQL
        echo 2. Créer la base de données
        echo 3. Configurer les permissions
        echo.
        pause
        exit /b 1
    ) else (
        echo ✅ Connexion réussie avec mot de passe vide (XAMPP)
        set MYSQL_PASSWORD=
    )
) else (
    echo ✅ Connexion MySQL réussie
    set MYSQL_PASSWORD=-p
)

echo.
echo Création de la base de données...
mysql -u root %MYSQL_PASSWORD% -e "CREATE DATABASE IF NOT EXISTS vacataires_db;" 2>nul
if %errorlevel% neq 0 (
    echo ❌ Erreur lors de la création de la base de données
    echo.
    echo 🔧 SOLUTIONS:
    echo 1. Vérifier les permissions de l'utilisateur root
    echo 2. Créer manuellement: CREATE DATABASE vacataires_db;
    echo.
    pause
    exit /b 1
)

echo ✅ Base de données 'vacataires_db' créée
echo.

echo Initialisation des tables...
mysql -u root %MYSQL_PASSWORD% vacataires_db < backend/database/init.sql 2>nul
if %errorlevel% neq 0 (
    echo ❌ Erreur lors de l'initialisation des tables
    echo.
    echo 🔧 SOLUTIONS:
    echo 1. Vérifier que le fichier backend/database/init.sql existe
    echo 2. Exécuter manuellement le script SQL
    echo.
    pause
    exit /b 1
)

echo ✅ Tables initialisées avec succès
echo.

echo Création du fichier de configuration...
(
echo # Configuration de la base de données
echo DB_HOST=localhost
echo DB_NAME=vacataires_db
echo DB_USER=root
if "%MYSQL_PASSWORD%"=="" (
    echo DB_PASSWORD=
) else (
    echo DB_PASSWORD=password
)
echo.
echo # Configuration JWT
echo JWT_SECRET=votre_secret_jwt_tres_securise_ici_changez_cela_en_production
echo JWT_EXPIRES_IN=7d
echo.
echo # Configuration serveur
echo PORT=5000
echo NODE_ENV=development
echo.
echo # URL du frontend
echo FRONTEND_URL=http://localhost:3000
) > backend/.env

echo ✅ Fichier .env créé
echo.

echo Test de la configuration...
cd backend
node test-database.js
if %errorlevel% neq 0 (
    echo ❌ Test de la base de données échoué
    echo.
    echo 🔧 Vérifiez la configuration dans backend/.env
    echo.
    pause
    exit /b 1
)

echo.
echo 🎉 CONFIGURATION TERMINÉE AVEC SUCCÈS !
echo ========================================
echo.
echo ✅ MySQL configuré
echo ✅ Base de données créée
echo ✅ Tables initialisées
echo ✅ Données de test insérées
echo ✅ Configuration .env créée
echo.
echo 🚀 Vous pouvez maintenant démarrer l'application:
echo    npm run dev
echo.
echo 👥 Comptes de test disponibles:
echo    Admin: admin@2ie.edu.bf / admin123
echo    RH: rh@2ie.edu.bf / rh123
echo    Vacataire: vacataire1@2ie.edu.bf / vacataire123
echo.
pause