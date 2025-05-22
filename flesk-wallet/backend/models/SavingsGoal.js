const mongoose = require('mongoose');

const savingsGoalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  targetAmount: {
    type: Number,
    required: true,
    min: 0
  },
  currentAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  deadline: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'COMPLETED', 'CANCELLED', 'FAILED'],
    default: 'ACTIVE'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Mettre à jour updatedAt avant chaque sauvegarde
savingsGoalSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index pour améliorer les performances des requêtes
savingsGoalSchema.index({ user: 1, deadline: 1 });

// Méthode pour vérifier et mettre à jour le statut de l'objectif
savingsGoalSchema.methods.checkStatus = function() {
  const now = new Date();
  
  // Si l'objectif est déjà complété ou annulé, ne rien faire
  if (this.status === 'COMPLETED' || this.status === 'CANCELLED') {
    return;
  }

  // Si le montant actuel atteint ou dépasse l'objectif
  if (this.currentAmount >= this.targetAmount) {
    this.status = 'COMPLETED';
    return;
  }

  // Si la date limite est dépassée et l'objectif n'est pas atteint
  if (now > this.deadline) {
    this.status = 'FAILED';
    return;
  }

  // Sinon, l'objectif est actif
  this.status = 'ACTIVE';
};

module.exports = mongoose.model('SavingsGoal', savingsGoalSchema); 