import React, { useEffect, useState } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Paper,
  Box,
  Badge,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Payment as PaymentIcon,
  Savings as SavingsIcon,
  AccountBalance as AccountBalanceIcon,
} from '@mui/icons-material';
import { Notification } from '../types/notification';
import { getNotifications, markAsRead, deleteNotification } from '../services/notificationService';
import { formatCurrency } from '../utils/currency';

interface NotificationListProps {
  onNotificationUpdate?: () => void;
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'BUDGET_ALERT':
      return <WarningIcon color="error" />;
    case 'UNUSUAL_TRANSACTION':
      return <PaymentIcon color="warning" />;
    case 'SUBSCRIPTION_REMINDER':
      return <AccountBalanceIcon color="info" />;
    case 'SAVING_OPPORTUNITY':
      return <SavingsIcon color="success" />;
    default:
      return <CheckCircleIcon />;
  }
};

const formatNotificationMessage = (notification: Notification): string => {
  const { type, message, data } = notification;
  
  if (!data?.amount) return message;

  switch (type) {
    case 'BUDGET_ALERT':
      if (!data.threshold || !data.category) return message;
      const totalAmount = Math.round(data.amount * 100 / data.threshold);
      return `Attention ! Vous avez dépensé ${data.threshold}% de votre budget ${data.category} (${formatCurrency(data.amount)}/${formatCurrency(totalAmount)}).`;
    
    case 'UNUSUAL_TRANSACTION':
      return `Alerte : Une transaction de ${formatCurrency(data.amount)} chez "LuxeWatches" a été détectée. Confirmez ?`;
    
    case 'SUBSCRIPTION_REMINDER':
      return `Votre abonnement mensuel de ${formatCurrency(data.amount)} sera prélevé demain.`;
    
    default:
      return message;
  }
};

const NotificationList: React.FC<NotificationListProps> = ({ onNotificationUpdate }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    const data = await getNotifications();
    setNotifications(data);
  };

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
    onNotificationUpdate?.();
  };

  const handleDelete = async (id: string) => {
    await deleteNotification(id);
    setNotifications(prev => prev.filter(notif => notif.id !== id));
    onNotificationUpdate?.();
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <Paper sx={{ p: 2, maxHeight: '400px', overflow: 'auto' }}>
      <Box display="flex" alignItems="center" mb={2}>
        <Typography variant="h6">Notifications</Typography>
        {unreadCount > 0 && (
          <Badge
            badgeContent={unreadCount}
            color="error"
            sx={{ ml: 2 }}
          />
        )}
      </Box>
      <List>
        {notifications.map((notification) => (
          <ListItem
            key={notification.id}
            sx={{
              mb: 1,
              bgcolor: notification.isRead ? 'transparent' : 'action.hover',
              borderRadius: 1,
            }}
          >
            <Box mr={2}>
              {getNotificationIcon(notification.type)}
            </Box>
            <ListItemText
              primary={notification.title}
              secondary={
                <>
                  <Typography component="span" variant="body2" color="text.primary">
                    {formatNotificationMessage(notification)}
                  </Typography>
                  <br />
                  <Typography component="span" variant="caption" color="text.secondary">
                    {new Date(notification.timestamp).toLocaleString()}
                  </Typography>
                </>
              }
            />
            {!notification.isRead && (
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="mark as read"
                  onClick={() => handleMarkAsRead(notification.id)}
                >
                  <CheckCircleIcon />
                </IconButton>
              </ListItemSecondaryAction>
            )}
          </ListItem>
        ))}
        {notifications.length === 0 && (
          <Typography color="text.secondary" align="center">
            Aucune notification
          </Typography>
        )}
      </List>
    </Paper>
  );
};

export default NotificationList; 