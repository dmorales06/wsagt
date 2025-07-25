import {jwtDecode} from 'jwt-decode';

export const isLoggedIn = () => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
        const { exp } = jwtDecode(token);
        return Date.now() < exp * 1000;
    } catch {
        return false;
    }
};

export const logout = () => {
    localStorage.removeItem('token');
};
