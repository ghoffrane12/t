import api from '../config/api';

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await api.post('/auth/login', {
      email,
      password,
    });

    const { token, user } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erreur lors de la connexion');
  }
};

export const register = async (
  email: string, 
  password: string, 
  firstName: string,
  lastName: string
): Promise<LoginResponse> => {
  try {
    const response = await api.post('/auth/register', {
      email,
      password,
      firstName,
      lastName
    });

    const { token, user } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erreur lors de l\'inscription');
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    return JSON.parse(userStr);
  }
  return null;
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
}; 