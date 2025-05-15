import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  Paper,
  CircularProgress
} from '@mui/material';
import Sidebar from '../../components/Sidebar';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from '../../utils/leafletConfig';

// Import des styles personnalisés
import '../../styles/leaflet.css';

const LocationPage: React.FC = () => {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => {
          setError('Permission refusée ou erreur de géolocalisation.');
        }
      );
    } else {
      setError("La géolocalisation n'est pas supportée par ce navigateur.");
    }
  }, []);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F8F9FA' }}>
      <Sidebar />

      <Box component="main" sx={{ flexGrow: 1, ml: '280px' }}>
        {/* Barre orange supérieure */}
        <AppBar position="static" sx={{ 
          bgcolor: '#F0F3F4', 
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          borderBottom: '2px solid rgba(200, 200, 200, 0.8)',
          borderRadius: 0
        }}>
          <Toolbar sx={{ minHeight: '64px !important' }} />
        </AppBar>

        <Box sx={{ p: 3 }}>
          <Typography variant="h4" sx={{ color: '#000000', mb: 4, fontWeight: 500 }}>
            Localisation
          </Typography>
          {position && (
            <Box sx={{ mb: 2 }}>
              <Typography>Latitude : {position.lat}</Typography>
              <Typography>Longitude : {position.lng}</Typography>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${position.lat},${position.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#1976d2', textDecoration: 'underline', fontWeight: 500 }}
              >
                Voir sur Google Maps
              </a>
            </Box>
          )}
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>
          )}
          {/* Contenu de la page */}
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 3 }}>
            {/* Le contenu spécifique à la localisation sera ajouté ici */}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default LocationPage;
