import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Grid,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { createTransaction } from '../services/transactionService';
import { TransactionFormData, TransactionType } from '../types/transaction';
import authService from '../services/authService';

interface FormData {
  amount: string;
  type: TransactionType;
  categoryId: string;
  description: string;
  date: Date;
}

interface TransactionFormProps {
  onTransactionAdded: () => void;
}

const defaultCategories = {
  EXPENSE: [
    { id: 'food', name: 'Alimentation', icon: '🍽️' },
    { id: 'transport', name: 'Transport', icon: '🚗' },
    { id: 'housing', name: 'Logement', icon: '🏠' },
    { id: 'utilities', name: 'Factures', icon: '📄' },
    { id: 'health', name: 'Santé', icon: '🏥' },
    { id: 'leisure', name: 'Loisirs', icon: '🎮' },
    { id: 'other_expense', name: 'Autres dépenses', icon: '📦' },
  ],
  INCOME: [
    { id: 'salary', name: 'Salaire', icon: '💰' },
    { id: 'freelance', name: 'Freelance', icon: '💻' },
    { id: 'investment', name: 'Investissement', icon: '📈' },
    { id: 'other_income', name: 'Autres revenus', icon: '📦' },
  ],
};

const TransactionForm: React.FC<TransactionFormProps> = ({ onTransactionAdded }) => {
  const [formData, setFormData] = useState<FormData>({
    amount: '',
    type: 'EXPENSE',
    categoryId: '',
    description: '',
    date: new Date(),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!authService.isAuthenticated()) {
      setError('Veuillez vous connecter pour ajouter une transaction.');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const selectedCategory = defaultCategories[formData.type].find(
        cat => cat.id === formData.categoryId
      );

      if (!selectedCategory) {
        throw new Error('Catégorie invalide');
      }

      const transactionData = {
        amount: Number(formData.amount),
        type: formData.type,
        category: {
          id: selectedCategory.id,
          name: selectedCategory.name,
          icon: selectedCategory.icon,
          type: formData.type
        },
        description: formData.description,
        date: formData.date.toISOString(),
      };

      await createTransaction(transactionData);
      onTransactionAdded();
      
      // Reset form
      setFormData({
        amount: '',
        type: 'EXPENSE',
        categoryId: '',
        description: '',
        date: new Date(),
      });
      setError(null);
    } catch (err: any) {
      console.error('Erreur lors de la création de la transaction:', err);
      if (err.message.includes('Session expirée')) {
        setError('Votre session a expiré. Veuillez vous reconnecter.');
      } else {
        setError(err.message || 'Erreur lors de la création de la transaction');
      }
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    if (!formData.amount || Number(formData.amount) <= 0) {
      setError('Le montant doit être supérieur à 0');
      return false;
    }
    if (!formData.categoryId) {
      setError('Veuillez sélectionner une catégorie');
      return false;
    }
    if (!formData.description.trim()) {
      setError('La description est requise');
      return false;
    }
    return true;
  };

  const handleChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError(null);
  };

  if (!authService.isAuthenticated()) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="warning">
          Veuillez vous connecter pour ajouter des transactions.
        </Alert>
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h6" gutterBottom>
        Nouvelle Transaction
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Montant"
            type="number"
            value={formData.amount}
            onChange={(e) => handleChange('amount', e.target.value)}
            disabled={loading}
            InputProps={{
              startAdornment: <span>TND </span>,
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            select
            label="Type"
            value={formData.type}
            onChange={(e) => handleChange('type', e.target.value as TransactionType)}
            disabled={loading}
          >
            <MenuItem value="EXPENSE">Dépense</MenuItem>
            <MenuItem value="INCOME">Revenu</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            select
            label="Catégorie"
            value={formData.categoryId}
            onChange={(e) => handleChange('categoryId', e.target.value)}
            disabled={loading}
          >
            {defaultCategories[formData.type].map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.icon} {category.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12}>
          <DatePicker
            label="Date"
            value={formData.date}
            onChange={(newDate) => handleChange('date', newDate)}
            disabled={loading}
            slotProps={{
              textField: { fullWidth: true }
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Ajouter la transaction'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TransactionForm; 