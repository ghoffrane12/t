import React from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText, Typography, Button } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Dashboard as DashboardIcon,
  Payment as PaymentIcon,
  TrendingDown as ExpensesIcon,
  TrendingUp as RevenuesIcon,
  AccountBalance as BudgetIcon,
  LocationOn as LocationIcon,
  Notifications as NotificationIcon,
  Savings as SavingsIcon,
  Logout as LogoutIcon,
  Subscriptions as SubscriptionsIcon,
} from '@mui/icons-material';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'Tableau de bord', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Transactions', icon: <PaymentIcon />, path: '/transactions' },
    { text: 'Dépenses', icon: <ExpensesIcon />, path: '/expenses' },
    { text: 'Revenus', icon: <RevenuesIcon />, path: '/incomes' },
    { text: 'Abonnements', icon: <SubscriptionsIcon />, path: '/subscriptions' },
    { text: 'Épargne', icon: <SavingsIcon />, path: '/savings' },
    { text: 'Budgets', icon: <BudgetIcon />, path: '/budgets' },
    { text: 'Localisation', icon: <LocationIcon />, path: '/location' },
    { text: 'Notification', icon: <NotificationIcon />, path: '/notifications' },
  ];

  const handleLogout = () => {
    // Ici vous pouvez ajouter la logique de déconnexion
    navigate('/login');
  };

  return (
    <Box
      sx={{
        width: 280,
        flexShrink: 0,
        bgcolor: '#1E1E2D',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        display: 'flex',
        flexDirection: 'column',
      }}
    > 

      {/* Logo et titre */}
      <Box
        sx={{
          p: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Box
          component="div"
          sx={{
            width: 32,
            height: 32,
            bgcolor: '#FF5733',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 1,
            color: 'white',
            fontWeight: 'bold',
            fontSize: '1.2rem',
            fontFamily: "'Roboto', sans-serif",
          }}
        >
          F
        </Box>
        <Typography
          variant="h6"
          sx={{
            color: '#FF5733',
            fontWeight: 'bold',
          }}
        >
          FLESK WALLET
        </Typography>
      </Box>

      {/* Menu items */}
      <List sx={{ px: 2, flex: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <ListItem
              key={item.text}
              button
              onClick={() => navigate(item.path)}
              sx={{
                color: isActive ? '#FF5733' : 'rgba(255, 255, 255, 0.7)',
                bgcolor: isActive ? 'rgba(255, 87, 51, 0.1)' : 'transparent',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                },
                borderRadius: '8px',
                mb: 0.5,
                padding: '10px 16px',
              }}
            >
              <ListItemIcon
                sx={{
                  color: 'inherit',
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{
                  '& .MuiListItemText-primary': {
                    fontSize: '0.95rem',
                    fontWeight: isActive ? 600 : 400,
                  },
                }}
              />
            </ListItem>
          );
        })}
      </List>

      {/* Bouton de déconnexion */}
      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            bgcolor: 'transparent',
            textTransform: 'none',
            justifyContent: 'flex-start',
            padding: '10px 16px',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.05)',
            },
          }}
        >
          Se déconnecter
        </Button>
      </Box>
    </Box>
  );
};

export default Sidebar; 