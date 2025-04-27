const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const revenueController = require('../controllers/revenueController');

// Routes protégées par authentification
router.use(protect);

// Routes CRUD
router.post('/', revenueController.createRevenue);
router.get('/', revenueController.getRevenues);
router.get('/:id', revenueController.getRevenue);
router.put('/:id', revenueController.updateRevenue);
router.delete('/:id', revenueController.deleteRevenue);

module.exports = router; 