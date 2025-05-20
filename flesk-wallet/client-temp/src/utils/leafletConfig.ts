import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Configuration pour les marqueurs standards (lieux)
const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Configuration pour le marqueur de l'utilisateur
const UserIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [35, 57], // Plus grand que le marqueur standard
  iconAnchor: [17, 57],
  popupAnchor: [1, -34],
  shadowSize: [57, 57],
  className: 'user-marker' // Classe CSS pour personnalisation supplémentaire
});

L.Marker.prototype.options.icon = DefaultIcon;

export { DefaultIcon, UserIcon };
