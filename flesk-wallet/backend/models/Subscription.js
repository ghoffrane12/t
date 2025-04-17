const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom de l\'abonnement est requis'],
    trim: true
  },
  amount: {
    type: Number,
    required: [true, 'Le montant est requis'],
    min: [0, 'Le montant doit être positif']
  },
  frequency: {
    type: String,
    enum: ['MONTHLY', 'YEARLY', 'QUARTERLY'],
    default: 'MONTHLY'
  },
  nextPaymentDate: {
    type: Date,
    required: [true, 'La date du prochain paiement est requise']
  },
  category: {
    type: String,
    required: [true, 'La catégorie est requise'],
    enum: ['ENTERTAINMENT', 'FITNESS', 'SERVICES', 'EDUCATION', 'OTHER']
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'PAUSED', 'CANCELLED'],
    default: 'ACTIVE'
  },
  logo: {
    type: String,
    default: ''
  },
  notes: {
    type: String,
    default: ''
  },
  lastUsed: {
    type: Date,
    default: Date.now
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'L\'ID utilisateur est requis']
  }
}, {
  timestamps: true
});

// Index pour améliorer les performances des requêtes
subscriptionSchema.index({ userId: 1, nextPaymentDate: 1 });
subscriptionSchema.index({ userId: 1, status: 1 });
subscriptionSchema.index({ userId: 1, category: 1 });

module.exports = mongoose.model('Subscription', subscriptionSchema); 