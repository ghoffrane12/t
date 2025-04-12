const Transaction = require('../models/Transaction');

// Create a transaction
exports.createTransaction = async (req, res) => {
  try {
    const { amount, category, type, date } = req.body;
    const transaction = new Transaction({
      userId: req.user.id,
      amount,
      category,
      type, // 'income' or 'expense'
      date
    });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Error creating transaction', error: error.message });
  }
};

// Get all transactions for a user
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transactions', error: error.message });
  }
};