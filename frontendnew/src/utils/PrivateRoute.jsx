import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { isLoggedIn } from './authJWT';

interface PrivateRouteProps {
    children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
    return isLoggedIn() ? children : <Navigate to="/" replace />;
};

export default PrivateRoute;

