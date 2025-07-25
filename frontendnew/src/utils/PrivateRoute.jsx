// PrivateRoute.js
import { Navigate } from 'react-router-dom';
import { isLoggedIn } from './authJWT';

const PrivateRoute = ({ children }) => {
    return isLoggedIn() ? children : <Navigate to="/" replace />;
};

export default PrivateRoute;
