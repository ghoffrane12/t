import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  Paper,
  CircularProgress,
  Alert,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  ListItemText,
  Button
} from '@mui/material';
import {
  TrendingDown as ExpensesIcon,
  TrendingUp as RevenuesIcon,
  Subscriptions as SubscriptionsIcon,
  AccountBalance as BalanceIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';
import Sidebar from '../components/Sidebar';
import { calculateDashboardTotals, DashboardTotals } from '../services/dashboardService';
import ExpensePieChart from '../components/Charts/ExpensePieChart';
import { getExpenses, Expense } from '../services/expensesService';
import ExpenseIncomeChart from '../components/ExpenseIncomeChart';
import { useNavigate } from 'react-router-dom';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ErrorIcon from '@mui/icons-material/Error';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import NotificationBell from '../components/NotificationBell';

const Dashboard: React.FC = () => {
  const [totals, setTotals] = useState<DashboardTotals | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [pieData, setPieData] = useState<{ category: string; amount: number }[]>([]);

  
 
   
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
    fetchExpenses();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await calculateDashboardTotals();
      console.log('Dashboard data:', data);
      setTotals(data);
    } catch (err) {
      setError('Erreur lors du chargement des données');
      console.error('Erreur Dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchExpenses = async () => {
    try {
      const data = await getExpenses();
      setExpenses(data);
      // Regrouper par catégorie
      const byCategory: { [key: string]: number } = {};
      data.forEach(exp => {
        byCategory[exp.category] = (byCategory[exp.category] || 0) + exp.amount;
      });
      setPieData(
        Object.entries(byCategory).map(([category, amount]) => ({
          category,
          amount,
        }))
      );
    } catch (err) {
      // Optionnel: gestion d'erreur
    }
  };

  const formatAmount = (amount: number) => {
    return amount.toLocaleString('fr-FR', { 
      style: 'currency', 
      currency: 'TND',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'objectif_atteint': return <EmojiEventsIcon color="success" sx={{ mr: 1 }} />;
      case 'depassement': return <ErrorIcon color="error" sx={{ mr: 1 }} />;
      case 'abonnement': return <AutorenewIcon color="primary" sx={{ mr: 1 }} />;
      default: return <NotificationsActiveIcon sx={{ mr: 1 }} />;
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F8F9FA' }}>
      <Sidebar />
      
      <Box component="main" sx={{ flexGrow: 1, ml: '280px' }}>
        <AppBar position="static" sx={{ bgcolor: '#FF5733', boxShadow: 'none' }}>
          <Toolbar sx={{ minHeight: '64px !important', display: 'flex', justifyContent: 'flex-end' }}>
            <NotificationBell />
          </Toolbar>
        </AppBar>

        {/* Titre de la page */}
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" sx={{ color: '#000000', mb: 4, fontWeight: 500 }}>
            Tableau de bord
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {loading ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Solde total */}
              <Paper 
                sx={{ 
                  p: 4,
                  borderRadius: 2,
                  boxShadow: '0px 2px 4px rgba(0,0,0,0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  bgcolor: totals && totals.balance >= 0 ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                }}
              >
                <BalanceIcon sx={{ 
                  fontSize: 48, 
                  color: totals && totals.balance >= 0 ? '#4CAF50' : '#f44336',
                  mb: 2 
                }} />
                <Typography variant="h6" sx={{ color: '#000000', mb: 1 }}>
                  Solde total
                </Typography>
                <Typography variant="h3" sx={{ 
                  color: totals && totals.balance >= 0 ? '#4CAF50' : '#f44336',
                  fontWeight: 'bold'
                }}>
                  {totals ? formatAmount(totals.balance) : '0 DT'}
                </Typography>
              </Paper>

              {/* Grille des autres totaux */}
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 3 }}>
                {/* Total des dépenses */}
                <Paper 
                  sx={{ 
                    p: 3, 
                    borderRadius: 2, 
                    boxShadow: '0px 2px 4px rgba(0,0,0,0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                  }}
                >
                  <ExpensesIcon sx={{ fontSize: 40, color: '#FF5733', mb: 2 }} />
                  <Typography variant="h6" sx={{ color: '#000000', mb: 1 }}>
                    Total des dépenses
                  </Typography>
                  <Typography variant="h4" sx={{ color: '#FF5733', fontWeight: 'bold' }}>
                    {totals ? formatAmount(totals.totalExpenses) : '0 DT'}
                  </Typography>
                </Paper>

                {/* Total des revenus */}
                <Paper 
                  sx={{ 
                    p: 3, 
                    borderRadius: 2, 
                    boxShadow: '0px 2px 4px rgba(0,0,0,0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                  }}
                >
                  <RevenuesIcon sx={{ fontSize: 40, color: '#4CAF50', mb: 2 }} />
                  <Typography variant="h6" sx={{ color: '#000000', mb: 1 }}>
                    Total des revenus
                  </Typography>
                  <Typography variant="h4" sx={{ color: '#4CAF50', fontWeight: 'bold' }}>
                    {totals ? formatAmount(totals.totalRevenues) : '0 DT'}
                  </Typography>
                </Paper>

                {/* Total des abonnements */}
                <Paper 
                  sx={{ 
                    p: 3, 
                    borderRadius: 2, 
                    boxShadow: '0px 2px 4px rgba(0,0,0,0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                  }}
                >
                  <SubscriptionsIcon sx={{ fontSize: 40, color: '#2196F3', mb: 2 }} />
                  <Typography variant="h6" sx={{ color: '#000000', mb: 1 }}>
                    Total des abonnements
                  </Typography>
                  <Typography variant="h4" sx={{ color: '#2196F3', fontWeight: 'bold' }}>
                    {totals ? formatAmount(totals.totalSubscriptions) : '0 DT'}
                  </Typography>
                </Paper>
              </Box>
              {/* Diagramme circulaire des dépenses par catégorie */}
              <Box sx={{ mt: 4 }}>
                <ExpensePieChart data={pieData} />
              </Box>

              <Grid item xs={12}>
                <ExpenseIncomeChart />
              </Grid>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard; 