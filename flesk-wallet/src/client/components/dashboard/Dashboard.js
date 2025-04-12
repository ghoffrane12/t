import React from 'react';
import { Box, Typography, List, ListItem, ListItemIcon, ListItemText, IconButton } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useNavigate, Routes, Route } from 'react-router-dom';
import DashboardContent from './DashboardContent';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const menuItems = [
    { text: 'Tableau de bord', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Transactions', icon: <AccountBalanceWalletIcon />, path: '/dashboard/transactions' },
    { text: 'Dépenses', icon: <TrendingDownIcon />, path: '/dashboard/expenses' },
    { text: 'Revenues', icon: <TrendingUpIcon />, path: '/dashboard/revenues' },
    { text: 'Budgets', icon: <AccountBalanceWalletIcon />, path: '/dashboard/budgets' },
    { text: 'Localisation', icon: <LocationOnIcon />, path: '/dashboard/location' },
    { text: 'Notification', icon: <NotificationsIcon />, path: '/dashboard/notifications' },
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: 240,
          flexShrink: 0,
          bgcolor: '#1A1B41',
          color: 'white',
          borderRight: '1px solid rgba(255, 255, 255, 0.12)',
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          position: 'fixed',
        }}
      >
        {/* Logo */}
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
          <Box
            component="img"
            src="/logo.png"
            alt="Flesk Wallet"
            sx={{ width: 40, height: 40, mr: 1 }}
          />
          <Typography variant="h6" sx={{ color: '#FF6B6B' }}>
            FLESK WALLET
          </Typography>
        </Box>

        {/* Menu Items */}
        <List sx={{ flexGrow: 1 }}>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => navigate(item.path)}
              sx={{
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.08)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'white' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>

        {/* Logout Button */}
        <List>
          <ListItem
            button
            onClick={handleLogout}
            sx={{
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.08)',
              },
            }}
          >
            <ListItemIcon sx={{ color: 'white' }}>
              <ExitToAppIcon />
            </ListItemIcon>
            <ListItemText primary="Se déconnecter" />
          </ListItem>
        </List>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: '#F5F5F5',
          minHeight: '100vh',
          ml: '240px', // Width of the sidebar
        }}
      >
        <Routes>
          <Route path="/" element={<DashboardContent />} />
          {/* Add other routes here as we implement them */}
        </Routes>
      </Box>
    </Box>
  );
};

export default Dashboard; 