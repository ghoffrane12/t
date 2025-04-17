const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getTransactions,
  getTransactionStats,
  createTransaction,
  updateTransaction,
  deleteTransaction
} = require('../controllers/transactionController');

// Routes protégées par authentification
router.use(protect);

// Obtenir toutes les transactions
router.get('/', getTransactions);

// Obtenir les statistiques des transactions
router.get('/stats', getTransactionStats);

// Créer une nouvelle transaction
router.post('/', createTransaction);

// Mettre à jour une transaction
router.put('/:id', updateTransaction);

// Supprimer une transaction
router.delete('/:id', deleteTransaction);

module.exports = router; 