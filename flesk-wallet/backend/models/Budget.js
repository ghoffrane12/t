const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Le nom du budget est requis'],
    trim: true
  },
  amount: {
    type: Number,
    required: [true, 'Le montant du budget est requis'],
    min: [0, 'Le montant ne peut pas être négatif']
  },
  category: {
    type: String,
    required: [true, 'La catégorie est requise'],
    trim: true
  },
  period: {
    type: String,
    enum: ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'],
    default: 'MONTHLY',
    required: true
  },
  startDate: {
    type: Date,
    required: [true, 'La date de début est requise'],
    default: Date.now
  },
  endDate: {
    type: Date
  },
  currentSpending: {
    type: Number,
    default: 0,
    min: [0, 'Les dépenses ne peuvent pas être négatives']
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE', 'COMPLETED'],
    default: 'ACTIVE'
  },
  notifications: {
    enabled: {
      type: Boolean,
      default: true
    },
    threshold: {
      type: Number,
      default: 80,
      min: [0, 'Le seuil ne peut pas être négatif'],
      max: [100, 'Le seuil ne peut pas dépasser 100']
    }
  },
  description: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index pour améliorer les performances des requêtes
budgetSchema.index({ userId: 1, category: 1 });
budgetSchema.index({ userId: 1, period: 1 });
budgetSchema.index({ userId: 1, status: 1 });

// Méthode virtuelle pour calculer le pourcentage utilisé
budgetSchema.virtual('percentageUsed').get(function() {
  return (this.currentSpending / this.amount) * 100;
});

// Méthode virtuelle pour calculer le montant restant
budgetSchema.virtual('remainingAmount').get(function() {
  return this.amount - (this.currentSpending || 0);
});

// Ajoutez ce middleware
budgetSchema.pre('save', function(next) {
  console.log('Tentative de sauvegarde du budget:', this);
  next();
});

const Budget = mongoose.model('Budget', budgetSchema);
console.log('Modèle Budget créé');
module.exports = Budget;
