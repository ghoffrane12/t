import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

// Token refresh interval in milliseconds (15 minutes)
const TOKEN_REFRESH_INTERVAL = 15 * 60 * 1000;

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    username: string;
    email: string;
  };
  message?: string;
}

const authService = {
  tokenRefreshTimeout: null as NodeJS.Timeout | null,

  async login(data: LoginData): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_URL}/login`, data);
      if (response.data.token) {
        this.setAuthData(response.data.token, response.data.user);
      }
      return response.data;
    } catch (error: any) {
      return this.handleAuthError(error, 'Erreur de connexion');
    }
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_URL}/register`, data);
      if (response.data.token) {
        this.setAuthData(response.data.token, response.data.user);
      }
      return response.data;
    } catch (error: any) {
      return this.handleAuthError(error, 'Erreur lors de l\'inscription');
    }
  },

  logout() {
    if (this.tokenRefreshTimeout) {
      clearTimeout(this.tokenRefreshTimeout);
      this.tokenRefreshTimeout = null;
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('tokenExpiry');
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
  },

  getToken() {
    const token = localStorage.getItem('token');
    const expiry = localStorage.getItem('tokenExpiry');
    
    if (token && expiry) {
      const expiryDate = new Date(expiry);
      if (expiryDate > new Date()) {
        return token;
      }
      // Token expired, logout user
      this.logout();
    }
    return null;
  },

  isAuthenticated() {
    return !!this.getToken();
  },

  setAuthData(token: string, user: any) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    // Set token expiry (30 days from now)
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 30);
    localStorage.setItem('tokenExpiry', expiry.toISOString());

    // Setup token refresh
    this.setupTokenRefresh();
  },

  setupTokenRefresh() {
    if (this.tokenRefreshTimeout) {
      clearTimeout(this.tokenRefreshTimeout);
    }

    this.tokenRefreshTimeout = setTimeout(async () => {
      try {
        const response = await axios.post(`${API_URL}/refresh`, {}, {
          headers: { Authorization: `Bearer ${this.getToken()}` }
        });
        
        if (response.data.token) {
          this.setAuthData(response.data.token, this.getCurrentUser());
        }
      } catch (error) {
        console.error('Failed to refresh token:', error);
        this.logout();
      }
    }, TOKEN_REFRESH_INTERVAL);
  },

  handleAuthError(error: any, defaultMessage: string): AuthResponse {
    if (error.response) {
      const message = error.response.data.message || defaultMessage;
      return { success: false, message };
    }
    return { success: false, message: 'Erreur de connexion au serveur' };
  }
};

export default authService; 