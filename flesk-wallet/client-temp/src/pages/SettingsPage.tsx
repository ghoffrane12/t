import React, { useState, useEffect } from 'react';
import { Box, Typography, Divider, Button, Select, MenuItem, FormControl, InputLabel, Switch, FormControlLabel } from '@mui/material';
import Sidebar from '../components/Sidebar';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EuroIcon from '@mui/icons-material/Euro';
import LanguageIcon from '@mui/icons-material/Language';
import LockIcon from '@mui/icons-material/Lock';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import DeleteIcon from '@mui/icons-material/Delete';
import UserInfoForm from '../components/UserInfoForm';
import ChangePasswordForm from '../components/ChangePasswordForm';
import DeleteAccountDialog from '../components/DeleteAccountDialog';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useThemeMode } from '../ThemeContext';

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  currency: string;
  language: string;
}

const SettingsPage: React.FC = () => {
  const [userData, setUserData] = useState<UserData>({
    firstName: '',
    lastName: '',
    email: '',
    currency: 'TND',
    language: 'fr',
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPasswordFormOpen, setIsPasswordFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { mode, toggleTheme } = useThemeMode();

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserData(response.data.user);
    } catch (err) {
      console.error('Erreur lors du chargement des données utilisateur:', err);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleFormSuccess = () => {
    fetchUserData();
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F8F9FA' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, ml: '280px' }}>
        <Box sx={{ height: 48, bgcolor: '#FF5733', borderRadius: '0 0 10px 10px' }} />
        <Box sx={{ p: 4, maxWidth: 700 }}>
          <Typography variant="h4" sx={{ color: '#000', fontWeight: 700, mb: 4 }}>
            Paramètres
          </Typography>

          {/* Mon Compte */}
          <Typography variant="h6" sx={{ mt: 3, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccountCircleIcon sx={{ color: '#FF5733' }} /> Mon Compte
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1" sx={{ mb: 0.5 }}>Prénom : <b>{userData.firstName}</b></Typography>
            <Typography variant="body1" sx={{ mb: 0.5 }}>Nom : <b>{userData.lastName}</b></Typography>
            <Typography variant="body1" sx={{ mb: 0.5 }}>Email : <b>{userData.email}</b></Typography>
            <Button 
              variant="outlined" 
              size="small" 
              sx={{ mt: 1 }}
              onClick={() => setIsFormOpen(true)}
            >
              Modifier les infos personnelles
            </Button>
          </Box>

          {/* Sécurité */}
          <Typography variant="h6" sx={{ mt: 4, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            <LockIcon sx={{ color: '#FF5733' }} /> Sécurité
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ mb: 2 }}>
            <Button 
              variant="outlined" 
              size="small" 
              startIcon={<LockIcon />} 
              onClick={() => setIsPasswordFormOpen(true)}
            >
              Modifier le mot de passe
            </Button>
          </Box>

          {/* Application */}
          <Typography variant="h6" sx={{ mt: 4, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Brightness4Icon sx={{ color: '#FF5733' }} /> Application
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 3 }}>
            <Button 
              variant="outlined" 
              color="error" 
              size="small" 
              startIcon={<DeleteIcon />} 
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              Supprimer mon compte
            </Button>
          </Box>
        </Box>
      </Box>

      <UserInfoForm 
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={handleFormSuccess}
      />

      <ChangePasswordForm 
        open={isPasswordFormOpen}
        onClose={() => setIsPasswordFormOpen(false)}
      />

      <DeleteAccountDialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onDeleted={() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
        }}
      />
    </Box>
  );
};

export default SettingsPage; 