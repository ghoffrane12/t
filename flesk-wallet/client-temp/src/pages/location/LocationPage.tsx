// Assurez-vous que ce fichier est traité comme un module
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
import { DefaultIcon, UserIcon } from '../../utils/leafletConfig';
import 'leaflet/dist/leaflet.css';
import { fetchNearbyPlaces, NearbyPlace } from '../../utils/fetchNearbyPlaces';
import LinkIcon from '@mui/icons-material/Link';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LanguageIcon from '@mui/icons-material/Language';

// Styles CSS pour le marqueur de l'utilisateur
const userMarkerStyle = `
  .user-marker {
    filter: hue-rotate(120deg) brightness(1.2);
  }
`;

// Interface pour définir la structure des types de lieux
interface PlaceType {
  keywords: string[];
  icon: string;
  description: string;
  amenity?: string;
  shop?: string;
  tourism?: string;
}

// Liste des types de lieux supportés avec plus de détails
const SUPPORTED_PLACE_TYPES: Record<string, PlaceType> = {
  restaurant: {
    keywords: ['restaurant'],
    icon: '🍽️',
    description: 'Restaurants',
    amenity: 'restaurant'
  },
  cafe: {
    keywords: ['cafe'],
    icon: '☕',
    description: 'Cafés',
    amenity: 'cafe'
  },
  fast_food: {
    keywords: ['fast_food'],
    icon: '🍔',
    description: 'Fast-foods',
    amenity: 'fast_food'
  },
  bar: {
    keywords: ['bar'],
    icon: '🍺',
    description: 'Bars',
    amenity: 'bar'
  },
  pharmacie: {
    keywords: ['pharmacy'],
    icon: '💊',
    description: 'Pharmacies',
    shop: 'pharmacy'
  },
  banque: {
    keywords: ['bank'],
    icon: '🏦',
    description: 'Banques',
    amenity: 'bank'
  },
  supermarche: {
    keywords: ['supermarket'],
    icon: '🛒',
    description: 'Supermarchés',
    shop: 'supermarket'
  },
  hotel: {
    keywords: ['hotel'],
    icon: '🏨',
    description: 'Hôtels',
    tourism: 'hotel'
  },
  station: {
    keywords: ['fuel'],
    icon: '⛽',
    description: 'Stations-service',
    amenity: 'fuel'
  },
  ecole: {
    keywords: ['school'],
    icon: '🏫',
    description: 'Écoles',
    amenity: 'school'
  },
  hopital: {
    keywords: ['hospital'],
    icon: '🏥',
    description: 'Hôpitaux',
    amenity: 'hospital'
  },
  poste: {
    keywords: ['post_office'],
    icon: '📮',
    description: 'Bureaux de poste',
    amenity: 'post_office'
  }
};

// Fonction pour générer les liens conditionnels
const generateConditionalLinks = (place: NearbyPlace) => {
  const links = [];
  const hasSocialLinks = place.tags.website || place.tags['facebook'] || place.tags['instagram'];

  if (hasSocialLinks) {
    if (place.tags.website) {
      links.push({
        icon: <LanguageIcon fontSize="small" />,
        url: place.tags.website,
        label: 'Site web'
      });
    }
    
    if (place.tags['facebook']) {
      // Assurez-vous que l'URL est complète si nécessaire
      let facebookUrl = place.tags['facebook'];
      if (!facebookUrl.startsWith('http')) {
         facebookUrl = `https://www.facebook.com/${facebookUrl}`;
      }
      links.push({
        icon: <FacebookIcon fontSize="small" />,
        url: facebookUrl,
        label: 'Facebook'
      });
    }
    
    if (place.tags['instagram']) {
      // Assurez-vous que l'URL est complète si nécessaire
       let instagramUrl = place.tags['instagram'];
       if (!instagramUrl.startsWith('http')) {
          instagramUrl = `https://www.instagram.com/${instagramUrl}`;
       }
      links.push({
        icon: <InstagramIcon fontSize="small" />,
        url: instagramUrl,
        label: 'Instagram'
      });
    }
  } else {
    // Ajouter un lien vers Google Maps si aucun lien social n'existe
    links.push({
      icon: <LinkIcon fontSize="small" />,
      url: `https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lon}`,
      label: 'Voir sur Google Maps'
    });
  }

  return links;
};

const LocationPage: React.FC = () => {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [places, setPlaces] = useState<NearbyPlace[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<{ key: string; icon: string; description: string }[]>([]);

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

  // Mise à jour des suggestions lors de la saisie
  useEffect(() => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matches = Object.entries(SUPPORTED_PLACE_TYPES)
        .filter(([key, data]) => 
          key.includes(searchLower) || 
          data.keywords.some(k => k.includes(searchLower)) ||
          data.description.toLowerCase().includes(searchLower)
        )
        .map(([key, data]) => ({
          key,
          ...data
        }));
      setSuggestions(matches);
    } else {
      setSuggestions([]);
    }
  }, [searchTerm]);

  // Fonction améliorée de filtrage des lieux
  const filteredPlaces = places.filter(place => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();
    const name = (place.tags.name || '').toLowerCase();
    const type = ((place.tags.shop || place.tags.amenity || '') as string).toLowerCase();

    // Vérifier si le terme de recherche correspond à un type de lieu supporté
    const matchingTypes = Object.entries(SUPPORTED_PLACE_TYPES).find(([key, data]) => 
      key.includes(searchLower) || 
      data.keywords.some(k => k.includes(searchLower)) ||
      data.description.toLowerCase().includes(searchLower)
    );

    if (matchingTypes) {
      const [_, typeData] = matchingTypes;
      // Vérification exacte du type de lieu
      if (typeData.amenity && place.tags.amenity === typeData.amenity) return true;
      if (typeData.shop && place.tags.shop === typeData.shop) return true;
      if (typeData.tourism && place.tags.tourism === typeData.tourism) return true;
      return false;
    }

    // Si pas de correspondance de type, chercher dans le nom
    return name.includes(searchLower);
  });

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F8F9FA' }}>
      <style>{userMarkerStyle}</style>
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

              {/* Champ de recherche avec suggestions améliorées */}
              <Paper sx={{ p: 2, mb: 3 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Rechercher un type de lieu (ex: restaurant, pharmacie...)"
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
                {suggestions.length > 0 && (
                  <Box sx={{ mt: 1, p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>Suggestions :</Typography>
                    {suggestions.map((suggestion, index) => (
                      <Box 
                        key={index} 
                        sx={{ 
                          cursor: 'pointer',
                          p: 1,
                          '&:hover': { 
                            bgcolor: '#e3f2fd',
                            borderRadius: 1
                          }
                        }}
                        onClick={() => setSearchTerm(suggestion.key)}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography sx={{ fontSize: '1.2rem' }}>{suggestion.icon}</Typography>
                          <Box>
                            <Typography sx={{ fontWeight: 500 }}>{suggestion.key}</Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              {suggestion.description}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                )}
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
                  <Marker 
                    position={[position.lat, position.lng]}
                    icon={UserIcon}
                  >
                    <Popup>
                      <strong>Votre position actuelle</strong>
                    </Popup>
                  </Marker>

                  {filteredPlaces.map((place, index) => (
                    <Marker 
                      key={index} 
                      position={[place.lat, place.lon]}
                      icon={DefaultIcon}
                    >
                      <Popup>
                        <Box sx={{ minWidth: '200px' }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                            {place.tags.name || "Lieu sans nom"}
                          </Typography>
                          
                          <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                            {place.tags.shop && <>Type : {place.tags.shop}</>}
                            {place.tags.amenity && <>Type : {place.tags.amenity}</>}
                            {!place.tags.shop && !place.tags.amenity && <>Type : Inconnu</>}
                          </Typography>

                           {place.tags.opening_hours && (
                            <Typography variant="body2" sx={{ mb: 0.5 }}>
                              Horaires : {place.tags.opening_hours}
                            </Typography>
                          )}

                          {place.tags.phone && (
                            <Typography variant="body2" sx={{ mb: 0.5 }}>
                              Tél : {place.tags.phone}
                            </Typography>
                          )}

                          {/* Afficher les liens sociaux ou Google Maps */} 
                          {generateConditionalLinks(place).length > 0 && (
                             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 1 }}>
                               {generateConditionalLinks(place).map((link, idx) => (
                                 <a
                                   key={idx}
                                   href={link.url}
                                   target="_blank"
                                   rel="noopener noreferrer"
                                   style={{
                                     display: 'flex',
                                     alignItems: 'center',
                                     gap: '4px',
                                     color: '#1976d2',
                                     textDecoration: 'none',
                                     fontSize: '0.875rem'
                                   }}
                                 >
                                   {link.icon}
                                   {link.label}
                                 </a>
                               ))}
                             </Box>
                           )}
                        </Box>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </Paper>

              {/* Liste des lieux suggérés */}
              <Paper sx={{ p: 2, mt: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  {searchTerm ? `Résultats pour "${searchTerm}"` : 'Suggestions de lieux proches'}
                </Typography>
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
