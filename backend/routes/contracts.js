const express = require('express');
const router = express.Router();
const {
  getAllContracts,
  getContractById,
  updateContract,
  deleteContract,
  createPayment,
  markPaymentAsPaid,
  getVacataireContracts,
  getContractStats
} = require('../controllers/contractController');
const { authenticateToken, isAdminOrRH } = require('../middleware/auth');

// Routes pour les vacataires
router.get('/my-contracts', authenticateToken, getVacataireContracts);

// Routes pour admin/RH
router.get('/', authenticateToken, isAdminOrRH, getAllContracts);
router.get('/stats', authenticateToken, isAdminOrRH, getContractStats);
router.get('/:id', authenticateToken, isAdminOrRH, getContractById);
router.put('/:id', authenticateToken, isAdminOrRH, updateContract);
router.delete('/:id', authenticateToken, isAdminOrRH, deleteContract);
router.post('/:contractId/payments', authenticateToken, isAdminOrRH, createPayment);
router.put('/payments/:paymentId/paid', authenticateToken, isAdminOrRH, markPaymentAsPaid);

module.exports = router;