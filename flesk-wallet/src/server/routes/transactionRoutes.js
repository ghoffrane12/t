const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const auth = require('../middlewares/authMiddleware'); 
router.use(auth); // Applique le middleware à toutes les routes

// OU appliquez-le individuellement à chaque route :
router.get('/', transactionController.getTransactions);
router.post('/', transactionController.createTransaction);

module.exports = router;
// @route   GET api/transactions
// @desc    Get all transactions for a user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const transactions = []; // TODO: Implement transaction retrieval
    res.json(transactions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/transactions
// @desc    Add a new transaction
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    // TODO: Implement transaction creation
    res.json({ msg: 'Transaction created' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/transactions/:id
// @desc    Update a transaction
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    // TODO: Implement transaction update
    res.json({ msg: 'Transaction updated' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/transactions/:id
// @desc    Delete a transaction
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    // TODO: Implement transaction deletion
    res.json({ msg: 'Transaction deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router; 