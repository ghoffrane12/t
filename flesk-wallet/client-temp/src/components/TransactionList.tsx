import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  Box,
  Chip,
  Paper,
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Transaction, getAllTransactions, deleteTransaction } from '../services/transactionService';
import authService from '../services/authService';

interface TransactionListProps {
  onUpdate?: () => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ onUpdate }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async () => {
    if (!authService.isAuthenticated()) {
      setError('Veuillez vous connecter pour voir vos transactions.');
      setLoading(false);
      return;
    }

    try {
      console.log('Chargement des transactions...');
      setLoading(true);
      setError(null);
      const data = await getAllTransactions();
      console.log('Transactions reçues:', data);
      setTransactions(data);
    } catch (err: any) {
      console.error('Erreur lors du chargement des transactions:', err);
      if (err.message.includes('Session expirée')) {
        setError('Votre session a expiré. Veuillez vous reconnecter.');
      } else {
        setError(err.message || 'Erreur lors du chargement des transactions');
      }
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleDelete = async (id: string) => {
    if (!authService.isAuthenticated()) {
      setError('Veuillez vous connecter pour supprimer une transaction.');
      return;
    }

    try {
      await deleteTransaction(id);
      await fetchTransactions();
      if (onUpdate) {
        onUpdate();
      }
    } catch (err: any) {
      console.error('Erreur lors de la suppression:', err);
      if (err.message.includes('Session expirée')) {
        setError('Votre session a expiré. Veuillez vous reconnecter.');
      } else {
        setError(err.message || 'Erreur lors de la suppression de la transaction');
      }
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography>Chargement des transactions...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Alert severity="error" sx={{ width: '100%' }}>{error}</Alert>
      </Box>
    );
  }

  if (!authService.isAuthenticated()) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Alert severity="warning" sx={{ width: '100%' }}>
          Veuillez vous connecter pour voir vos transactions.
        </Alert>
      </Box>
    );
  }

  if (transactions.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography>Aucune transaction trouvée.</Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Catégorie</TableCell>
            <TableCell align="right">Montant</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction._id}>
              <TableCell>{new Date(transaction.date).toLocaleDateString('fr-FR')}</TableCell>
              <TableCell>{transaction.description}</TableCell>
              <TableCell>
                <Chip 
                  label={transaction.category.name}
                  color={transaction.type === 'EXPENSE' ? 'error' : 'success'}
                  size="small"
                />
              </TableCell>
              <TableCell align="right">
                <Typography
                  color={transaction.type === 'EXPENSE' ? 'error' : 'success'}
                >
                  {transaction.type === 'EXPENSE' ? '-' : '+'}
                  {transaction.amount.toLocaleString('fr-FR', {
                    style: 'currency',
                    currency: 'TND'
                  })}
                </Typography>
              </TableCell>
              <TableCell align="center">
                <IconButton
                  onClick={() => handleDelete(transaction._id)}
                  color="error"
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TransactionList; 