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
  Settings as SettingsIcon,
} from '@mui/icons-material';

/**
 * Composant Sidebar
 * 
 * Barre latérale de navigation principale de l'application.
 * Contient le logo, les liens de navigation et le bouton de déconnexion.
 * Utilise Material-UI pour le style et la mise en page.
 */
const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * Configuration des éléments du menu de navigation
   * Chaque élément contient un texte, une icône et un chemin de navigation
   */
  const menuItems = [
    { text: 'Tableau de bord', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Dépenses', icon: <ExpensesIcon />, path: '/expenses' },
    { text: 'Revenus', icon: <RevenuesIcon />, path: '/incomes' },
    { text: 'Abonnements', icon: <SubscriptionsIcon />, path: '/subscriptions' },
    { text: 'Épargne', icon: <SavingsIcon />, path: '/savings' },
    { text: 'Budgets', icon: <BudgetIcon />, path: '/budgets' },
    { text: 'Localisation', icon: <LocationIcon />, path: '/location' },
    { text: 'Notification', icon: <NotificationIcon />, path: '/notifications' },
    { text: 'Paramètres', icon: <SettingsIcon />, path: '/settings' },
  ];

  /**
   * Gère la déconnexion de l'utilisateur
   * Redirige vers la page de connexion
   */
  const handleLogout = () => {
    // Ici vous pouvez ajouter la logique de déconnexion
    navigate('/login');
  };

  return (
    <Box
      sx={{
        width: 280,
        flexShrink: 0,
        bgcolor: '#F0F3F4',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        borderRight: '2px solid rgba(200, 200, 200, 0.8)',
        boxShadow: '1px 0 3px rgba(147, 145, 145, 0.05)',
      }}
    >
      {/* Section du logo et du titre */}
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

      {/* Liste des éléments du menu */}
      <List sx={{ px: 2, flex: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <ListItem
              key={item.text}
              button
              onClick={() => navigate(item.path)}
              sx={{
                color: isActive ? '#FF5733' : '#17202A',
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

      {/* Section du bouton de déconnexion */}
      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{
            color: 'rgba(42, 34, 34, 0.7)',
            bgcolor: 'transparent',
            textTransform: 'none',
            justifyContent: 'flex-start',
            padding: '10px 16px',
            '&:hover': {
              bgcolor: 'rgba(95, 93, 93, 0.05)',
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