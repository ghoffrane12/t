import axios, { AxiosRequestHeaders } from 'axios';

// Configuration de l'URL de l'API
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Log de l'URL de l'API
console.log('API URL:', API_URL);

// Configuration globale d'axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Fonction pour obtenir les headers d'authentification
const getAuthHeaders = (): AxiosRequestHeaders => {
  const token = localStorage.getItem('token');
  console.log('Getting auth headers, token:', token ? 'present' : 'absent');
  return {
    'Authorization': token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json',
  } as AxiosRequestHeaders;
};

// Intercepteur pour ajouter le token à toutes les requêtes
api.interceptors.request.use((config) => {
  const headers = getAuthHeaders();
  config.headers = headers;
  
  console.log('Request Config:', {
    url: `${config.baseURL}${config.url}`,
    method: config.method,
    headers: config.headers,
  });
  
  return config;
}, (error) => {
  console.error('Request Error:', error);
  return Promise.reject(error);
});

// Intercepteur pour gérer les erreurs globalement
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      status: response.status,
      url: response.config.url,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error('API Error:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.message,
      data: error.response?.data,
    });

    // Gérer les erreurs d'authentification
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.log('Auth error detected, clearing credentials');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api; 