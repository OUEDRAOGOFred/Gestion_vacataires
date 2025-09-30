const express = require('express');
const router = express.Router();
const {
  getAllVacataires,
  getVacataireById,
  updateVacataireProfile,
  updateVacataireStatus,
  getVacataireApplications,
  getVacataireStats,
  downloadVacataireDossier,
  downloadVacataireDossierByUser
} = require('../controllers/vacataireController');
const { authenticateToken, isAdminOrRH } = require('../middleware/auth');
const { uploadFiles } = require('../middleware/upload');

// Routes pour les vacataires
router.get('/my-applications', authenticateToken, getVacataireApplications);
router.put('/profile', authenticateToken, uploadFiles, updateVacataireProfile);

// Routes pour admin/RH
router.get('/', authenticateToken, isAdminOrRH, getAllVacataires);
router.get('/stats', authenticateToken, isAdminOrRH, getVacataireStats);
router.get('/user/:userId/dossier', authenticateToken, isAdminOrRH, downloadVacataireDossierByUser);
router.get('/:id/dossier', authenticateToken, isAdminOrRH, downloadVacataireDossier);
router.get('/:id', authenticateToken, isAdminOrRH, getVacataireById);
router.put('/:id/status', authenticateToken, isAdminOrRH, updateVacataireStatus);

module.exports = router;