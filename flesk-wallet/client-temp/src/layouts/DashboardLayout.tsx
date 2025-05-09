import React, { useState, useEffect } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  Avatar,
  Menu,
  MenuItem,
  Badge,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  AccountBalance as AccountBalanceIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../services/authService';
console.log(">>> DashboardLayout.tsx modifié");

const drawerWidth = 240;

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationCount, setNotificationCount] = useState(0);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationsClick = () => {
    navigate('/notifications');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Simulation de chargement des notifications
  useEffect(() => {
    // À remplacer par un appel API réel
    const fetchNotifications = async () => {
      // Exemple: const count = await notificationService.getUnreadCount();
      setNotificationCount(3); // Valeur temporaire
    };
    fetchNotifications();
  }, []);

  const menuItems = [
    { text: 'Tableau de bord', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Comptes', icon: <AccountBalanceIcon />, path: '/accounts' },
    { text: 'Revenus', icon: <TrendingUpIcon />, path: '/incomes' },
    { text: 'Dépenses', icon: <TrendingDownIcon />, path: '/expenses' },
    { text: 'Paramètres', icon: <SettingsIcon />, path: '/settings' },
  ];

  const drawer = (
    <Box>
      <Toolbar>
        <Typography variant="h6" sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>
          FLESK WALLET
        </Typography>
      </Toolbar>
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => navigate(item.path)}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(255, 87, 51, 0.08)',
              },
            }}
          >
            <ListItemIcon sx={{ color: theme.palette.text.primary }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', bgcolor: 'background.default', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
          width: '100%',
          bgcolor: 'primary.main',
          boxShadow: 'none',
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'white', 
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
            onClick={() => navigate('/dashboard')}
          >
            FLESK WALLET
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          
          {/* Icône de notifications */}
          <IconButton
            size="large"
            aria-label="show notifications"
            color="inherit"
            onClick={handleNotificationsClick}
            sx={{
              mr: 2,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <Badge
              badgeContent={notificationCount}
              color="error"
              max={9}
              sx={{
                '& .MuiBadge-badge': {
                  right: -3,
                  top: 5,
                  border: '2px solid',
                  borderColor: 'primary.main',
                  padding: '0 4px',
                },
              }}
            >
              <NotificationsIcon />
            </Badge>
          </IconButton>
          
          {/* Avatar utilisateur */}
          <IconButton onClick={handleProfileMenuOpen} sx={{ p: 0 }}>
            <Avatar sx={{ bgcolor: 'white', color: 'primary.main' }}>
              {user?.firstName?.[0]?.toUpperCase() || 'U'}
            </Avatar>
          </IconButton>
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
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              bgcolor: 'background.default',
              borderRight: '1px solid rgba(255, 255, 255, 0.12)',
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              bgcolor: 'background.default',
              borderRight: '1px solid rgba(255, 255, 255, 0.12)',
            },
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
          mt: '64px',
        }}
      >
        {children}
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        onClick={handleProfileMenuClose}
        PaperProps={{
          sx: {
            bgcolor: 'background.default',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            minWidth: 180,
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => navigate('/profile')}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Profil</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Déconnexion</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default DashboardLayout;