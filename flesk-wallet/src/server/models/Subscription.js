const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true }, // e.g., "Netflix"
  amount: { type: Number, required: true },
  renewalDate: { type: Date, required: true },
  category: { type: String, default: 'subscription' },
});

module.exports = mongoose.model('Subscription', subscriptionSchema);