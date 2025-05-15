import React, { useState, useEffect } from 'react';
import {
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Typography,
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Circle as CircleIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Notification, getNotifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification } from '../services/notificationService';

/**
 * Composant NotificationBell
 * 
 * Affiche une cloche de notification avec un menu déroulant.
 * Permet de voir, marquer comme lu et supprimer les notifications.
 * Rafraîchit automatiquement les notifications toutes les minutes.
 */
const NotificationBell: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  /**
   * Récupère les notifications depuis le serveur
   * Met à jour l'état des notifications et le compteur de notifications non lues
   */
  const fetchNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.read).length);
      setError(null);
    } catch (error) {
      setError('Erreur lors de la récupération des notifications');
      setNotifications([]);
      setUnreadCount(0);
    }
  };

  // Rafraîchir les notifications toutes les minutes
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  /**
   * Ouvre le menu des notifications et marque les notifications comme lues
   */
  const handleClick = async (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    try {
      // Marquer toutes les notifications comme lues lors de l'ouverture du menu
      await markAllNotificationsAsRead();
      // Mettre à jour l'état local
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Erreur lors du marquage des notifications comme lues:', error);
    }
  };

  /**
   * Ferme le menu des notifications
   */
  const handleClose = () => {
    setAnchorEl(null);
  };

  /**
   * Marque une notification comme lue
   */
  const handleMarkAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id);
      setNotifications(notifications.map(n => 
        n._id === id ? { ...n, read: true } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error);
    }
  };

  /**
   * Supprime une notification
   */
  const handleDelete = async (id: string) => {
    try {
      await deleteNotification(id);
      setNotifications(notifications.filter(n => n._id !== id));
      setUnreadCount(prev => notifications.find(n => n._id === id)?.read ? prev : Math.max(0, prev - 1));
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  /**
   * Redirige vers la page de toutes les notifications
   */
  const handleViewAll = () => {
    handleClose();
    navigate('/notifications');
  };

  /**
   * Retourne l'icône appropriée en fonction du type de notification
   */
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'depassement':
        return '🔴';
      case 'objectif_atteint':
        return '🎯';
      case 'abonnement':
        return '📅';
      default:
        return '📌';
    }
  };

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleClick}
        sx={{ ml: 2 }}
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 360,
            maxHeight: 400,
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Notifications</Typography>
          <Button
            size="small"
            onClick={handleViewAll}
            sx={{ color: '#FF5733' }}
          >
            Voir tout
          </Button>
        </Box>
        <Divider />
        <List sx={{ p: 0 }}>
          {error && (
            <ListItem>
              <ListItemText
                primary={error}
                sx={{ textAlign: 'center', color: 'error.main' }}
              />
            </ListItem>
          )}
          {!error && notifications.slice(0, 3).map((notification) => (
            <ListItem
              key={notification._id}
              sx={{
                bgcolor: notification.read ? 'inherit' : 'action.hover',
                '&:hover': { bgcolor: 'action.selected' },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {getNotificationIcon(notification.type)}
              </ListItemIcon>
              <ListItemText
                primary={notification.title}
                secondary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {notification.message}
                    </Typography>
                    <br />
                    <Typography
                      component="span"
                      variant="caption"
                      color="text.secondary"
                    >
                      {new Date(notification.date).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Typography>
                  </React.Fragment>
                }
              />
              <Box>
                {!notification.read && (
                  <IconButton
                    size="small"
                    onClick={() => handleMarkAsRead(notification._id)}
                    sx={{ color: '#FF5733' }}
                  >
                    <CircleIcon fontSize="small" />
                  </IconButton>
                )}
                <IconButton
                  size="small"
                  onClick={() => handleDelete(notification._id)}
                  sx={{ color: '#FF5733' }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </ListItem>
          ))}
          {!error && notifications.length === 0 && (
            <ListItem>
              <ListItemText
                primary="Aucune notification"
                sx={{ textAlign: 'center', color: 'text.secondary' }}
              />
            </ListItem>
          )}
        </List>
      </Menu>
    </>
  );
};

export default NotificationBell; 