import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  ListItemText,
  Button,
  ListItemIcon
} from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import {
  TrendingDown as ExpensesIcon,
  TrendingUp as RevenuesIcon,
  Subscriptions as SubscriptionsIcon,
  AccountBalance as BalanceIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';
import { calculateDashboardTotals, DashboardTotals } from '../services/dashboardService';
import Sidebar from '../components/Sidebar';
import ExpensePieChart from '../components/Charts/ExpensePieChart';
import { getExpenses } from '../services/expensesService';
import ExpenseIncomeChart from '../components/ExpenseIncomeChart';
import { useNavigate } from 'react-router-dom';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ErrorIcon from '@mui/icons-material/Error';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import NotificationBell from '../components/NotificationBell';
import SavingGoalsSummary from '../components/SavingGoalsSummary';
import RecentTransactionsTable from '../components/RecentTransactionsTable';
import { getSavingsGoals, SavingsGoal } from '../services/savingsService';
import { getRecentTransactions, Transaction } from '../services/transactionService';
import { getRevenues } from '../services/revenuesService';
import BudgetSummary from '../components/BudgetSummary';
import { getBudgets, Budget } from '../services/budgetService';
import ChatbotWidget from '../components/ChatbotWidget';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Dashboard: React.FC = () => {
  const [totals, setTotals] = useState<DashboardTotals | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pieData, setPieData] = useState<{ category: string; amount: number }[]>([]);
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [settingsAnchorEl, setSettingsAnchorEl] = useState<null | HTMLElement>(null);
  const openSettings = Boolean(settingsAnchorEl);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const email = user?.email || '';

  useEffect(() => {
    fetchDashboardData();
    fetchExpenses();
    getSavingsGoals().then(setGoals);
    getBudgets().then(setBudgets);
    // Fusionne les 6 dernières opérations (dépenses + revenus)
    const fetchTransactions = async () => {
      const expenses = (await getExpenses()).map(e => ({
        id: e._id ?? '',
        category: e.category,
        date: e.date,
        description: e.description,
        amount: e.amount,
        currency: 'TND',
        type: 'dépense' as const
      }));
      const revenues = (await getRevenues()).map(r => ({
        id: r._id ?? '',
        category: r.category,
        date: r.date,
        description: r.description,
        amount: r.amount,
        currency: 'TND',
        type: 'revenu' as const
      }));
      const all = [...expenses, ...revenues]
        .filter(t => !!t.id)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 6);
      setTransactions(all);
    };
    fetchTransactions();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await calculateDashboardTotals();
      setTotals(data);
    } catch (err) {
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const fetchExpenses = async () => {
    try {
      const data = await getExpenses();
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

  const colorMap: Record<string, string> = {
    'Voyage': '#4285f4',
    'Voiture': '#34a853',
    'Technologie': '#fbbc05',
    'Maison': '#ea4335',
    'Éducation': '#6c63ff',
    // Ajoute d'autres catégories ici
  };

  const mappedGoals = goals.map(goal => ({
    id: goal.id,
    label: goal.category,
    percent: goal.targetAmount > 0 ? Math.round((goal.currentAmount / goal.targetAmount) * 100) : 0,
    color: colorMap[goal.category] || '#636e72'
  }));

  const handleSettingsClick = (event: React.MouseEvent<HTMLElement>) => {
    setSettingsAnchorEl(event.currentTarget);
  };

  const handleSettingsClose = () => {
    setSettingsAnchorEl(null);
  };

  const handleGoToSettings = () => {
    handleSettingsClose();
    navigate('/settings');
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F8F9FA' }}>
      <Sidebar />
      
      <Box component="main" sx={{ flexGrow: 1, ml: '280px' }}>
        <AppBar position="static" sx={{ 
          bgcolor: '#F0F3F4', 
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          borderBottom: '2px solid rgba(200, 200, 200, 0.8)',
          borderRadius: 0
        }}>
          <Toolbar sx={{ minHeight: '64px !important', display: 'flex', justifyContent: 'flex-end' }}>
            <NotificationBell />
            <IconButton color="inherit" onClick={handleSettingsClick} sx={{ ml: 1 }}>
              <AccountCircleIcon sx={{ color: '#222', fontSize: 32 }} />
            </IconButton>
            <Menu anchorEl={settingsAnchorEl} open={openSettings} onClose={handleSettingsClose}>
              <MenuItem disabled>
                <ListItemText primary={email} />
              </MenuItem>
              <MenuItem onClick={handleGoToSettings}>
                <ListItemIcon><AccountCircleIcon /></ListItemIcon>
                <ListItemText primary="Paramètres" />
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        {/* Titre de la page */}
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" sx={{ color: '#000000', mb: 1, fontWeight: 500 }}>
            Tableau de bord
          </Typography>
          <Typography variant="h6" sx={{ color: '#222', mb: 4, fontWeight: 400 }}>
            Bienvenue {user?.firstName || ''} {user?.lastName || ''}
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
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, alignItems: 'stretch', mb: 4 }}>
                <Box sx={{ flex: 1, minWidth: 320 }}>
                  <BudgetSummary budgets={budgets} />
                </Box>
                <Box sx={{ flex: 2, minWidth: 320 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: '#2d3a66', fontSize: 22 }}>
                    Répartition des Dépenses par Catégorie
                  </Typography>
                  <ExpensePieChart data={pieData} />
                </Box>
              </Box>
              <Grid item xs={12}>
                <ExpenseIncomeChart />
              </Grid>

              <Box sx={{ display: 'flex', gap: 3 }}>
                <Box sx={{ flex: 1 }}>
                  <SavingGoalsSummary goals={mappedGoals} />
                </Box>
                <Box sx={{ flex: 2 }}>
                  <RecentTransactionsTable transactions={transactions} />
                </Box>
              </Box>
            </Box>
          )}
        </Box>
        <ChatbotWidget />
      </Box>
    </Box>
  );
};

export default Dashboard;