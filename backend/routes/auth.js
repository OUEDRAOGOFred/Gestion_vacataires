const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile, acceptCharter } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

// Routes publiques
router.post('/register', register);
router.post('/login', login);

// Routes protégées
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);
router.post('/accept-charter', authenticateToken, acceptCharter);

module.exports = router;