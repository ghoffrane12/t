import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import Dashboard from './pages/Dashboard';
import TransactionsPage from './pages/TransactionsPage';
import ExpensesPage from './pages/ExpensesPage';
import SubscriptionsPage from './pages/SubscriptionsPage';
import RevenuesPage from './pages/revenues/RevenuesPage';
import SavingsPage from './pages/SavingsPage';
import BudgetsPage from './pages/budgets/BudgetsPage';
import LocationPage from './pages/location/LocationPage';
import NotificationsPage from './pages/notifications/NotificationsPage';
import PrivateRoute from './components/PrivateRoute';
import SettingsPage from './pages/SettingsPage';

// Création du thème personnalisé
const theme = createTheme({
  palette: {
    primary: {
      main: '#4CAF50',
    },
    secondary: {
      main: '#FF5733',
    },
    background: {
      default: '#F8F9FA',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/transactions"
            element={
              <PrivateRoute>
                <TransactionsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/expenses"
            element={
              <PrivateRoute>
                <ExpensesPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/subscriptions"
            element={
              <PrivateRoute>
                <SubscriptionsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/incomes"
            element={
              <PrivateRoute>
                <RevenuesPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/savings"
            element={
              <PrivateRoute>
                <SavingsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/budgets"
            element={
              <PrivateRoute>
                <BudgetsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/location"
            element={
              <PrivateRoute>
                <LocationPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <PrivateRoute>
                <NotificationsPage />
              </PrivateRoute>
            }
          />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App; 