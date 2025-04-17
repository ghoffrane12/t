import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Transaction, TransactionType, TransactionFormData, TransactionCategory } from '../../types/transaction';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import TransactionModal from '../../components/transactions/TransactionModal';
import { getAllTransactions, createTransaction, deleteTransaction } from '../../services/transactionService';

const defaultCategories: Record<TransactionType, Array<{ id: string; name: string; icon: string; type: TransactionType }>> = {
  EXPENSE: [
    { id: 'transport', name: 'Transport', icon: '🚗', type: 'EXPENSE' },
    { id: 'food', name: 'Alimentation', icon: '🍽️', type: 'EXPENSE' },
    { id: 'housing', name: 'Logement', icon: '🏠', type: 'EXPENSE' },
    { id: 'health', name: 'Santé', icon: '⚕️', type: 'EXPENSE' },
    { id: 'leisure', name: 'Loisirs', icon: '🎮', type: 'EXPENSE' },
  ],
  INCOME: [
    { id: 'salary', name: 'Salaire', icon: '💰', type: 'INCOME' },
    { id: 'freelance', name: 'Freelance', icon: '💻', type: 'INCOME' },
    { id: 'investment', name: 'Investissements', icon: '📈', type: 'INCOME' },
    { id: 'other', name: 'Autres', icon: '📝', type: 'INCOME' },
  ],
};

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface TransactionStats {
  labels: string[];
  expenses: number[];
  incomes: number[];
}

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState({
    labels: [] as string[],
    datasets: [
      {
        label: 'Dépenses',
        data: [] as number[],
        borderColor: '#FF5733',
        tension: 0.4,
      },
      {
        label: 'Revenus',
        data: [] as number[],
        borderColor: '#4CAF50',
        tension: 0.4,
      },
    ],
  });

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Évolution des transactions',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const loadTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllTransactions();
      const mappedData = data.map(transaction => {
        const type = transaction.type as TransactionType;
        return {
          id: transaction._id,
          amount: transaction.amount,
          description: transaction.description,
          date: transaction.date,
          type,
          category: transaction.category,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      });
      setTransactions(mappedData);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors du chargement des transactions');
      console.error('Erreur lors du chargement des transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const handleSubmitTransaction = async (formData: TransactionFormData) => {
    try {
      setError(null);
      const category = defaultCategories[formData.type].find(cat => cat.id === formData.categoryId);
      if (!category) {
        throw new Error('Catégorie invalide');
      }

      const serviceData = {
        amount: formData.amount,
        type: formData.type,
        category: {
          id: category.id,
          name: category.name,
          icon: category.icon,
          type: category.type
        },
        description: formData.description,
        date: formData.date
      };

      if (editingTransaction) {
        await createTransaction(serviceData);
        await loadTransactions();
      } else {
        await createTransaction(serviceData);
        await loadTransactions();
      }
      handleCloseModal();
    } catch (err: any) {
      setError(err.message || (
        editingTransaction
          ? 'Erreur lors de la mise à jour de la transaction'
          : 'Erreur lors de la création de la transaction'
      ));
      console.error('Erreur lors de la transaction:', err);
    }
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingTransaction(null);
    setError(null);
  };

  const formatAmount = (amount: number, type: TransactionType) => {
    const formattedAmount = new Intl.NumberFormat('fr-TN', {
      style: 'currency',
      currency: 'TND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
    return type === 'EXPENSE' ? `-${formattedAmount}` : formattedAmount;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5">Transactions</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setShowAddModal(true)}
            >
              Nouvelle Transaction
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Catégorie</TableCell>
                  <TableCell align="right">Montant</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      Aucune transaction trouvée
                    </TableCell>
                  </TableRow>
                ) : (
                  transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{new Date(transaction.date).toLocaleDateString('fr-FR')}</TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>
                        <Chip
                          label={transaction.category.name}
                          color={transaction.type === 'INCOME' ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        {formatAmount(transaction.amount, transaction.type)}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={() => setEditingTransaction(transaction)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={async () => {
                            try {
                              await deleteTransaction(transaction.id);
                              loadTransactions();
                            } catch (err: any) {
                              setError(err.message || 'Erreur lors de la suppression de la transaction');
                            }
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      <TransactionModal
        open={showAddModal || !!editingTransaction}
        onClose={handleCloseModal}
        onSubmit={handleSubmitTransaction}
        initialData={
          editingTransaction
            ? {
                amount: editingTransaction.amount,
                type: editingTransaction.type,
                categoryId: editingTransaction.category.id,
                description: editingTransaction.description,
                date: editingTransaction.date,
              }
            : undefined
        }
      />
    </Box>
  );
};

export default TransactionsPage; 