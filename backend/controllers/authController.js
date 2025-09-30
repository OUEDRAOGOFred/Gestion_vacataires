const jwt = require('jsonwebtoken');
const { User, Vacataire } = require('../models');
const { sendEmail } = require('../utils/emailService');

const JWT_SECRET = process.env.JWT_SECRET || 'votre_secret_jwt_tres_securise_ici';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Générer un token JWT
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// Inscription d'un utilisateur
const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone, role = 'vacataire' } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    // Créer l'utilisateur
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      phone,
      role
    });

    // Si c'est un vacataire, créer le profil vacataire
    if (role === 'vacataire') {
      await Vacataire.create({
        userId: user.id
      });
    }

    // Générer le token
    const token = generateToken(user.id);

    // Envoyer l'email de bienvenue
    try {
      await sendEmail(email, 'welcome', {
        firstName,
        lastName,
        email
      });
    } catch (emailError) {
      console.error('Erreur lors de l\'envoi de l\'email de bienvenue:', emailError);
      // On continue même si l'email échoue
    }

    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({ message: 'Erreur lors de l\'inscription' });
  }
};

// Connexion d'un utilisateur
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Trouver l'utilisateur
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Générer le token
    const token = generateToken(user.id);

    res.json({
      message: 'Connexion réussie',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        charterAccepted: user.charterAccepted,
        charterAcceptedAt: user.charterAcceptedAt
      }
    });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({ message: 'Erreur lors de la connexion' });
  }
};

// Obtenir le profil de l'utilisateur connecté
const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [{
        model: Vacataire,
        as: 'vacataire'
      }]
    });

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role,
        charterAccepted: user.charterAccepted,
        charterAcceptedAt: user.charterAcceptedAt,
        vacataire: user.vacataire
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération du profil' });
  }
};

// Mettre à jour le profil
const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone } = req.body;
    const userId = req.user.id;

    await User.update(
      { firstName, lastName, phone },
      { where: { id: userId } }
    );

    const updatedUser = await User.findByPk(userId);
    res.json({
      message: 'Profil mis à jour avec succès',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        phone: updatedUser.phone,
        role: updatedUser.role
      }
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du profil' });
  }
};

// Accepter la charte d'engagement
const acceptCharter = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Mettre à jour les champs de charte
    await user.update({
      charterAccepted: true,
      charterAcceptedAt: new Date()
    });

    res.json({
      message: 'Charte d\'engagement acceptée avec succès',
      charterAccepted: true,
      charterAcceptedAt: user.charterAcceptedAt
    });
  } catch (error) {
    console.error('Erreur lors de l\'acceptation de la charte:', error);
    res.status(500).json({ message: 'Erreur lors de l\'acceptation de la charte' });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  acceptCharter
};