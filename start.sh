#!/bin/bash

echo "========================================"
echo "  Gestion Vacataires 2iE - Démarrage"
echo "========================================"
echo

echo "Installation des dépendances..."
npm run install-all

echo
echo "Démarrage de l'application..."
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:3000"
echo

npm run dev