import React from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PaymentIcon from '@mui/icons-material/Payment';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SavingsIcon from '@mui/icons-material/Savings';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import Logo from './Logo';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'Tableau de bord', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Transactions', icon: <PaymentIcon />, path: '/transactions' },
    { text: 'Dépenses', icon: <AccountBalanceWalletIcon />, path: '/depenses' },
    { text: 'Revenus', icon: <AccountBalanceWalletIcon />, path: '/revenus' },
    { text: 'Budgets', icon: <SavingsIcon />, path: '/budgets' },
    { text: 'Localisation', icon: <LocationOnIcon />, path: '/localisation' },
    { text: 'Notification', icon: <NotificationsIcon />, path: '/notifications' },
  ];

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <Box
      sx={{
        width: '240px',
        height: '100vh',
        backgroundColor: '#1B1B3A',
        display: 'flex',
        flexDirection: 'column',
        py: 3,
        px: 2,
      }}
    >
      {/* Logo */}
      <Box sx={{ mb: 4 }}>
        <Logo size={32} />
      </Box>

      {/* Navigation Menu */}
      <List sx={{ flex: 1 }}>
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            button
            selected={location.pathname === item.path}
            onClick={() => navigate(item.path)}
            sx={{
              mb: 1,
              borderRadius: 1,
              height: 40,
              '&.Mui-selected': {
                backgroundColor: 'transparent',
                '& .MuiListItemIcon-root': {
                  color: '#FF5733',
                },
                '& .MuiListItemText-primary': {
                  color: '#FF5733',
                },
              },
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
              },
              '& .MuiListItemIcon-root': {
                minWidth: 35,
                color: 'rgba(255, 255, 255, 0.6)',
              },
              '& .MuiListItemText-primary': {
                fontSize: '0.9rem',
                color: 'rgba(255, 255, 255, 0.6)',
              },
            }}
          >
            <ListItemIcon>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>

      {/* Logout Button */}
      <ListItem
        button
        onClick={handleLogout}
        sx={{
          borderRadius: 1,
          height: 40,
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
          },
          '& .MuiListItemIcon-root': {
            minWidth: 35,
            color: 'rgba(255, 255, 255, 0.6)',
          },
          '& .MuiListItemText-primary': {
            fontSize: '0.9rem',
            color: 'rgba(255, 255, 255, 0.6)',
          },
        }}
      >
        <ListItemIcon>
          <LogoutIcon />
        </ListItemIcon>
        <ListItemText primary="Se déconnecter" />
      </ListItem>
    </Box>
  );
};

export default Sidebar; 