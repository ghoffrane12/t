// routes/debug.js (temporaire)
const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');

router.get('/expense', async (req, res) => {
  const expenses = await Expense.find();
  res.json(expenses);
});

module.exports = router;
