const mongoose = require('mongoose');
const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  type: String, // 'abonnement', 'depassement', 'objectif_atteint', etc.
  title: String,
  message: String,
  category: String,
  location: String,
  read: { type: Boolean, default: false },
  goalId: { type: mongoose.Schema.Types.ObjectId, ref: 'SavingsGoal', default: null }
});
module.exports = mongoose.model('Notification', notificationSchema); 