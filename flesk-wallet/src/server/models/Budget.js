const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  period: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly'],
    default: 'monthly'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  notifications: {
    enabled: {
      type: Boolean,
      default: true
    },
    threshold: {
      type: Number,
      default: 80 // Percentage of budget
    }
  },
  recurring: {
    type: Boolean,
    default: true
  },
  notes: {
    type: String
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'completed'],
    default: 'active'
  }
});

// Index for efficient user queries
budgetSchema.index({ user: 1, category: 1 });

// Method to check budget status
budgetSchema.methods.checkStatus = async function(transactions) {
  const spent = transactions.reduce((acc, curr) => acc + curr.amount, 0);
  const percentage = (spent / this.amount) * 100;
  
  return {
    budgeted: this.amount,
    spent,
    remaining: this.amount - spent,
    percentage,
    isOverBudget: spent > this.amount,
    needsNotification: this.notifications.enabled && percentage >= this.notifications.threshold
  };
};

const Budget = mongoose.model('Budget', budgetSchema);

module.exports = Budget; 