const mongoose = require('mongoose');

const savingGoalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Le nom de l'objectif est requis"],
    trim: true
  },
  targetAmount: {
    type: Number,
    required: [true, "Le montant cible est requis"],
    min: [0, "Le montant doit être positif"]
  },
  currentAmount: {
    type: Number,
    default: 0,
    min: [0, "Le montant actuel doit être positif"]
  },
  deadline: {
    type: Date,
    required: [true, "La date limite est requise"]
  },
  category: {
    type: String,
    enum: ['VOYAGE', 'VOITURE', 'MAISON', 'EDUCATION', 'AUTRE'],
    required: [true, "La catégorie est requise"]
  },
  status: {
    type: String,
    enum: ['EN_COURS', 'ATTEINT', 'EN_RETARD'],
    default: 'EN_COURS'
  },
  description: {
    type: String,
    trim: true
  },
  monthlyContribution: {
    type: Number,
    required: [true, "La contribution mensuelle suggérée est requise"]
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, "L'ID utilisateur est requis"]
  }
}, {
  timestamps: true
});

// Méthode pour calculer le pourcentage de progression
savingGoalSchema.methods.getProgress = function() {
  return (this.currentAmount / this.targetAmount) * 100;
};

// Méthode pour vérifier si l'objectif est en retard
savingGoalSchema.methods.checkStatus = function() {
  const today = new Date();
  const remainingAmount = this.targetAmount - this.currentAmount;
  const monthsLeft = Math.ceil((this.deadline - today) / (1000 * 60 * 60 * 24 * 30));
  
  if (this.currentAmount >= this.targetAmount) {
    this.status = 'ATTEINT';
  } else if (monthsLeft <= 0 || remainingAmount / monthsLeft > this.monthlyContribution * 1.5) {
    this.status = 'EN_RETARD';
  } else {
    this.status = 'EN_COURS';
  }
};

module.exports = mongoose.model('SavingGoal', savingGoalSchema); 