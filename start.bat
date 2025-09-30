@echo off
echo ========================================
echo   Gestion Vacataires 2iE - Demarrage
echo ========================================
echo.

echo Installation des dependances...
call npm run install-all

echo.
echo Demarrage de l'application...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.

call npm run dev

pause