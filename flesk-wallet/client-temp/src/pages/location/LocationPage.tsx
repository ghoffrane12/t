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
  const [position, setPosition] = useState<[number, number] | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);
      },
      (err) => {
        console.error('Erreur de géolocalisation:', err);
      }
    );
  }, []);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F8F9FA' }}>
      <Sidebar />

      <Box component="main" sx={{ flexGrow: 1, ml: '280px' }}>
        <AppBar position="static" sx={{ bgcolor: '#FF5733', boxShadow: 'none' }}>
          <Toolbar sx={{ minHeight: '64px !important' }} />
        </AppBar>

        <Box sx={{ p: 3 }}>
          <Typography variant="h4" sx={{ color: '#000000', mb: 4, fontWeight: 500 }}>
            Localisation
          </Typography>

          <Paper elevation={3} sx={{ height: '500px' }}>
            {position ? (
              <MapContainer
                center={position}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; OpenStreetMap contributors'
                  url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                />
                <Marker position={position}>
                  <Popup>
                    Vous êtes ici.
                  </Popup>
                </Marker>
              </MapContainer>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                }}
              >
                <CircularProgress />
              </Box>
            )}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default LocationPage;
