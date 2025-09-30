const express = require('express');
const router = express.Router();
const {
  getAllCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  submitApplication,
  getAllApplications,
  updateApplicationStatus,
  getApplicationStats
} = require('../controllers/applicationController');
const { authenticateToken, isAdminOrRH } = require('../middleware/auth');

// Routes publiques pour les cours
router.get('/courses', getAllCourses);

// Routes pour les vacataires
router.post('/submit', authenticateToken, submitApplication);

// Routes pour admin/RH
router.post('/courses', authenticateToken, isAdminOrRH, createCourse);
router.put('/courses/:id', authenticateToken, isAdminOrRH, updateCourse);
router.delete('/courses/:id', authenticateToken, isAdminOrRH, deleteCourse);
router.get('/all', authenticateToken, isAdminOrRH, getAllApplications);
router.get('/stats', authenticateToken, isAdminOrRH, getApplicationStats);
router.put('/:id/status', authenticateToken, isAdminOrRH, updateApplicationStatus);

module.exports = router;