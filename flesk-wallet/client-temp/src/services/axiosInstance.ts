// src/services/axiosInstance.ts
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000', // remplace par ton URL backend si nécessaire
  withCredentials: true // si tu utilises des cookies / sessions
});

export default axiosInstance;
