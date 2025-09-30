@echo off
echo 🚀 Démarrage de l'application Gestion Vacataires 2iE
echo ==================================================

echo.
echo 📦 Démarrage du serveur backend...
start "Backend Server" cmd /k "cd backend && npm start"

echo.
echo ⏳ Attente du démarrage du backend (5 secondes)...
timeout /t 5 /nobreak > nul

echo.
echo 🌐 Démarrage du serveur frontend...
start "Frontend Server" cmd /k "cd frontend && npm start"

echo.
echo ✅ Les serveurs sont en cours de démarrage...
echo.
echo 📋 URLs d'accès :
echo    - Frontend: http://localhost:3000
echo    - Backend API: http://localhost:5000
echo.
echo 🔧 Pour tester l'API :
echo    - Ouvrez http://localhost:3000
echo    - Allez sur la page Applications
echo    - Cliquez sur "Tester la connexion API"
echo.
pause



