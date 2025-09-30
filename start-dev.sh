#!/bin/bash

echo "🚀 Démarrage de l'application Gestion Vacataires 2iE"
echo "=================================================="

echo ""
echo "📦 Démarrage du serveur backend..."
cd backend && npm start &
BACKEND_PID=$!

echo ""
echo "⏳ Attente du démarrage du backend (5 secondes)..."
sleep 5

echo ""
echo "🌐 Démarrage du serveur frontend..."
cd ../frontend && npm start &
FRONTEND_PID=$!

echo ""
echo "✅ Les serveurs sont en cours de démarrage..."
echo ""
echo "📋 URLs d'accès :"
echo "   - Frontend: http://localhost:3000"
echo "   - Backend API: http://localhost:5000"
echo ""
echo "🔧 Pour tester l'API :"
echo "   - Ouvrez http://localhost:3000"
echo "   - Allez sur la page Applications"
echo "   - Cliquez sur 'Tester la connexion API'"
echo ""

# Fonction pour arrêter les serveurs
cleanup() {
    echo ""
    echo "🛑 Arrêt des serveurs..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

# Capturer Ctrl+C
trap cleanup SIGINT

# Attendre que l'utilisateur appuie sur Ctrl+C
wait



