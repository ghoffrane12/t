import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  Paper,
  CircularProgress,
  TextField,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Sidebar from '../../components/Sidebar';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import * as L from '../../utils/leafletConfig';
import 'leaflet/dist/leaflet.css';
import { fetchNearbyPlaces, NearbyPlace } from '../../utils/fetchNearbyPlaces';

const LocationPage: React.FC = () => {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [places, setPlaces] = useState<NearbyPlace[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setPosition(coords);
          setLoading(false);
        },
        (err) => {
          setError('Permission refusée ou erreur de géolocalisation.');
          setLoading(false);
        }
      );
    } else {
      setError("La géolocalisation n'est pas supportée par ce navigateur.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (position) {
      fetchNearbyPlaces(position.lat, position.lng)
        .then((data: NearbyPlace[]) => setPlaces(data))
        .catch(() => setPlaces([]));
    }
  }, [position]);

  // Filtrer les lieux en fonction du terme de recherche
  const filteredPlaces = places.filter(place => {
    const searchLower = searchTerm.toLowerCase();
    const name = (place.tags.name || '').toLowerCase();
    const type = ((place.tags.shop || place.tags.amenity || '') as string).toLowerCase();
    return name.includes(searchLower) || type.includes(searchLower);
  });

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F8F9FA' }}>
      <Sidebar />

      <Box component="main" sx={{ flexGrow: 1, ml: '280px' }}>
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

          {loading ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>
          ) : position && (
            <>
              <Paper sx={{ p: 2, mb: 3 }}>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${position.lat},${position.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#1976d2', textDecoration: 'underline', fontWeight: 500 }}
                >
                  Voir sur Google Maps
                </a>
              </Paper>

              {/* Champ de recherche */}
              <Paper sx={{ p: 2, mb: 3 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Rechercher un type de lieu (ex: pharmacie, restaurant...)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Paper>

              {/* Carte avec position + lieux */}
              <Paper sx={{ p: 2, height: '500px', width: '100%' }}>
                <MapContainer
                  center={[position.lat, position.lng]}
                  zoom={13}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={[position.lat, position.lng]}>
                    <Popup>Votre position actuelle</Popup>
                  </Marker>

                  {filteredPlaces.map((place, index) => (
                    <Marker key={index} position={[place.lat, place.lon]}>
                      <Popup>
                        <strong>{place.tags.name || "Lieu sans nom"}</strong><br />
                        {place.tags.shop && <>Type : {place.tags.shop}</>}
                        {place.tags.amenity && <>Type : {place.tags.amenity}</>}
                        {!place.tags.shop && !place.tags.amenity && <>Type : Inconnu</>}
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </Paper>

              {/* Liste des lieux suggérés */}
              <Paper sx={{ p: 2, mt: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Suggestions de lieux proches</Typography>
                {filteredPlaces.length === 0 ? (
                  <Typography>Aucun lieu trouvé à proximité.</Typography>
                ) : (
                  filteredPlaces.map((place, index) => (
                    <Box key={index} sx={{ mb: 1 }}>
                      <strong>{place.tags.name || "Lieu sans nom"}</strong> — {place.tags.shop || place.tags.amenity || "Type inconnu"}
                    </Box>
                  ))
                )}
              </Paper>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default LocationPage;
