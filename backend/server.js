const express = require('express');
const cors = require('cors');
const path = require('path');
const { syncDatabase } = require('./models');

// Import des routes
const authRoutes = require('./routes/auth');
const vacataireRoutes = require('./routes/vacataires');
const applicationRoutes = require('./routes/applications');
const contractRoutes = require('./routes/contracts');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3000'
  ],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/vacataires', vacataireRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/contracts', contractRoutes);

// Route de test
app.get('/api/test', (req, res) => {
  res.json({ message: 'API fonctionnelle !' });
});

// Route pour créer un admin par défaut (à supprimer en production)
app.post('/api/create-admin', async (req, res) => {
  try {
    const { User } = require('./models');
    const { email, password, firstName, lastName } = req.body;

    const existingAdmin = await User.findOne({ where: { email } });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    const admin = await User.create({
      email,
      password,
      firstName,
      lastName,
      role: 'admin'
    });

    res.status(201).json({
      message: 'Admin créé avec succès',
      admin: {
        id: admin.id,
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'admin:', error);
    res.status(500).json({ message: 'Erreur lors de la création de l\'admin' });
  }
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'Fichier trop volumineux (max 5MB)' });
  }
  
  if (err.message === 'Type de fichier non autorisé. Seuls les fichiers PDF, DOC, DOCX et images sont acceptés.') {
    return res.status(400).json({ message: err.message });
  }
  
  res.status(500).json({ message: 'Erreur interne du serveur' });
});

// Route 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

// Démarrer le serveur
const startServer = async () => {
  try {
    // Synchroniser la base de données
    await syncDatabase();
    
    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur le port ${PORT}`);
      console.log(`📊 API disponible sur http://localhost:${PORT}/api`);
      console.log(`🔧 Créez un admin avec POST http://localhost:${PORT}/api/create-admin`);
    });
  } catch (error) {
    console.error('Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
};

startServer();