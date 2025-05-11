const mongoose = require('mongoose');

const savingsGoalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  targetAmount: {
    type: Number,
    required: true,
    min: 0
  },
  currentAmount: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  deadline: {
    type: Date,
    required: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['IN_PROGRESS', 'COMPLETED', 'FAILED'],
    default: 'IN_PROGRESS'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index pour améliorer les performances des requêtes
savingsGoalSchema.index({ userId: 1, deadline: 1 });

// Méthode pour vérifier et mettre à jour le statut de l'objectif
savingsGoalSchema.methods.checkStatus = function() {
  const now = new Date();
  
  // Si l'objectif est déjà complété, ne rien faire
  if (this.status === 'COMPLETED') {
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

  // Sinon, l'objectif est en cours
  this.status = 'IN_PROGRESS';
};

module.exports = mongoose.model('SavingsGoal', savingsGoalSchema); 