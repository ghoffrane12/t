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
import NotificationBell from '../components/NotificationBell';

const drawerWidth = 240;

/**
 * Props interface for the DashboardLayout component
 * @interface DashboardLayoutProps
 * @property {React.ReactNode} children - The child components to be rendered within the layout
 */
interface DashboardLayoutProps {
  children: React.ReactNode;
}

/**
 * DashboardLayout Component
 * 
 * A responsive layout component that provides the main structure for the dashboard.
 * It includes a sidebar navigation, top app bar with user profile, and notification system.
 * 
 * @param {DashboardLayoutProps} props - The component props
 * @returns {JSX.Element} The rendered dashboard layout
 */
const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationCount, setNotificationCount] = useState(0);

  /**
   * Toggles the mobile drawer open/closed state
   * Used for responsive navigation on mobile devices
   */
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  /**
   * Opens the profile menu when clicking on the avatar
   * @param {React.MouseEvent<HTMLElement>} event - The click event
   */
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  /**
   * Closes the profile menu
   */
  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  /**
   * Handles user logout
   * Logs out the user and redirects to the login page
   */
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  /**
   * Navigation menu items configuration
   * Defines the structure and properties of each menu item in the sidebar
   */
  const menuItems = [
    { text: 'Tableau de bord', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Comptes', icon: <AccountBalanceIcon />, path: '/accounts' },
    { text: 'Revenus', icon: <TrendingUpIcon />, path: '/incomes' },
    { text: 'Dépenses', icon: <TrendingDownIcon />, path: '/expenses' },
    { text: 'Paramètres', icon: <SettingsIcon />, path: '/settings' },
  ];

  /**
   * Renders the sidebar drawer content
   * Includes the app logo and navigation menu items
   */
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
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'background.default',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          borderBottom: '2px solid rgba(200, 200, 200, 0.8)',
          borderRadius: 0
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
          <NotificationBell />
          <IconButton onClick={handleProfileMenuOpen} sx={{ p: 0, ml: 2 }}>
            <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
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
              borderRight: '2px solid rgba(44, 62, 80, 0.8)',
              boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
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
              borderRight: '2px solid rgba(44, 62, 80, 0.8)',
              boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
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