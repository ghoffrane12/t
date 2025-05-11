import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../services/authService';

/**
 * Interface des propriétés du composant PrivateRoute
 * @interface PrivateRouteProps
 * @property {React.ReactNode} children - Les composants enfants à protéger
 */
interface PrivateRouteProps {
  children: React.ReactNode;
}

/**
 * Composant PrivateRoute
 * 
 * Un composant de protection de route qui vérifie si l'utilisateur est authentifié.
 * Si l'utilisateur n'est pas authentifié, il est redirigé vers la page de connexion.
 * 
 * @param {PrivateRouteProps} props - Les propriétés du composant
 * @returns {JSX.Element} Les composants enfants si authentifié, sinon redirection vers /login
 */
const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" />;
};

export default PrivateRoute; 