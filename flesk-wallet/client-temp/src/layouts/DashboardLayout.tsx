import React, { useState, useEffect } from 'react';
import { Box, CssBaseline, Drawer, AppBar, Toolbar, List, Typography, Divider, IconButton, ListItem, ListItemIcon, ListItemText, Menu, Badge } from '@mui/material';
import { Menu as MenuIcon, Dashboard as DashboardIcon, AccountBalance as AccountBalanceIcon, Settings as SettingsIcon, Savings as SavingsIcon, Notifications as NotificationsIcon, Subscriptions as SubscriptionsIcon, AccountBalanceWallet as AccountBalanceWalletIcon } from '@mui/icons-material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import NotificationList from '../components/NotificationList';
import { getNotifications } from '../services/notificationService';
import { Notification } from '../types/notification';

const drawerWidth = 240;

const DashboardLayout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationAnchor, setNotificationAnchor] = useState<null | HTMLElement>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [budgetAlerts, setBudgetAlerts] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  const getPageTitle = (pathname: string): string => {
    const lastSegment = pathname.split('/').pop();
    if (!lastSegment) return 'Dashboard';
    return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
  };

  const loadNotifications = async () => {
    try {
      const notifications = await getNotifications();
      const unreadNotifications = notifications.filter(n => !n.isRead);
      setUnreadCount(unreadNotifications.length);
      
      const unreadBudgetAlerts = unreadNotifications.filter(
        n => n.type === 'BUDGET_ALERT'
      ).length;
      setBudgetAlerts(unreadBudgetAlerts);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  useEffect(() => {
    loadNotifications();
    // Rafraîchir les notifications toutes les minutes
    const interval = setInterval(loadNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  // Recharger les notifications quand on change de page
  useEffect(() => {
    loadNotifications();
  }, [location.pathname]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
    loadNotifications();
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Transactions', icon: <AccountBalanceIcon />, path: '/dashboard/transactions' },
    { 
      text: 'Budgets', 
      icon: budgetAlerts > 0 ? (
        <Badge badgeContent={budgetAlerts} color="error" sx={{ '& .MuiBadge-badge': { right: -3, top: 3 } }}>
          <AccountBalanceWalletIcon />
        </Badge>
      ) : <AccountBalanceWalletIcon />,
      path: '/dashboard/budgets' 
    },
    { text: 'Épargne', icon: <SavingsIcon />, path: '/dashboard/savings' },
    { text: 'Abonnements', icon: <SubscriptionsIcon />, path: '/dashboard/subscriptions' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/dashboard/settings' },
  ];

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Flesk Wallet
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem 
            button 
            key={item.text} 
            onClick={() => {
              navigate(item.path);
              if (item.text === 'Budgets') {
                // Marquer automatiquement les notifications de budget comme lues
                // quand on accède à la page des budgets
                loadNotifications();
              }
            }}
            selected={location.pathname === item.path}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {getPageTitle(location.pathname)}
          </Typography>
          <IconButton color="inherit" onClick={handleNotificationClick}>
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <Menu
            anchorEl={notificationAnchor}
            open={Boolean(notificationAnchor)}
            onClose={handleNotificationClose}
            PaperProps={{
              sx: { width: '400px', maxHeight: '500px' }
            }}
          >
            <NotificationList onNotificationUpdate={loadNotifications} />
          </Menu>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: '#F5F5F5',
          minHeight: '100vh',
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout; 