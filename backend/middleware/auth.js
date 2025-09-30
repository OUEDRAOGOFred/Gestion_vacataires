const jwt = require('jsonwebtoken');
const { User } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'votre_secret_jwt_tres_securise_ici';

// Middleware pour vérifier le token JWT
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Token d\'accès requis' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(decoded.userId);
    
    if (!user) {
      return res.status(403).json({ message: 'Utilisateur non trouvé' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ message: 'Token invalide' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ message: 'Token expiré' });
    }
    return res.status(500).json({ message: 'Erreur d\'authentification' });
  }
};

// Middleware pour vérifier les rôles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentification requise' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    next();
  };
};

// Middleware pour vérifier si l'utilisateur est admin ou RH
const isAdminOrRH = authorize('admin', 'rh');

// Middleware pour vérifier si l'utilisateur est admin
const isAdmin = authorize('admin');

module.exports = {
  authenticateToken,
  authorize,
  isAdminOrRH,
  isAdmin
};