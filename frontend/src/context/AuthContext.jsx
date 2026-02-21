import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => {
        const t = localStorage.getItem('token');
        return (t && t !== 'null' && t !== 'undefined') ? t : null;
    });
    const [loading, setLoading] = useState(false);

    // Set default base URL for axios
    axios.defaults.baseURL = 'http://localhost:5020';

    useEffect(() => {
        // Add a request interceptor to attach the JWT token
        const interceptor = axios.interceptors.request.use(
            (config) => {
                const activeToken = localStorage.getItem('token');
                if (activeToken && activeToken !== 'null' && activeToken !== 'undefined') {
                    config.headers.Authorization = `Bearer ${activeToken}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        return () => axios.interceptors.request.eject(interceptor);
    }, []);

    useEffect(() => {
        // Add a response interceptor to handle 401s globally
        const interceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    console.error("Token expired or unauthorized. Logging out.");
                    logout();
                    window.location.href = '/'; // Redirect to login
                }
                return Promise.reject(error);
            }
        );

        return () => axios.interceptors.response.eject(interceptor);
    }, []);

    useEffect(() => {
        if (token) {
            // In a real app, verify token with backend. 
            // For now, assume it's valid or decode it.
            // We'll just set a flag or keep user null until they fetch profile
            // But let's try to persist basic info if we had it
            const savedUser = localStorage.getItem('user');
            if (savedUser) setUser(JSON.parse(savedUser));
        }
    }, [token]);

    const login = (userData, authToken) => {
        setUser(userData);
        setToken(authToken);
        localStorage.setItem('token', authToken);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
