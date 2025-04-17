const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: [true, 'Le montant est requis']
  },
  type: {
    type: String,
    enum: ['EXPENSE', 'INCOME'],
    required: [true, 'Le type est requis']
  },
  category: {
    id: {
      type: String,
      required: [true, 'L\'ID de la catégorie est requis']
    },
    name: {
      type: String,
      required: [true, 'Le nom de la catégorie est requis']
    },
    icon: {
      type: String,
      required: [true, 'L\'icône de la catégorie est requise']
    },
    type: {
      type: String,
      enum: ['EXPENSE', 'INCOME'],
      required: [true, 'Le type de la catégorie est requis']
    }
  },
  description: {
    type: String,
    required: [true, 'La description est requise']
  },
  date: {
    type: Date,
    required: [true, 'La date est requise']
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
transactionSchema.index({ userId: 1, date: -1 });
transactionSchema.index({ userId: 1, type: 1 });
transactionSchema.index({ userId: 1, 'category.id': 1 });

module.exports = mongoose.model('Transaction', transactionSchema); 