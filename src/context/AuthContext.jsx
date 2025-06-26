// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { loginUser, registerUser } from '../services/authService'; // We'll create this next

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Stores user info (e.g., { userId, username, role })
    const [token, setToken] = useState(localStorage.getItem('jwt_token'));
    const [loading, setLoading] = useState(true); // To indicate initial loading of token

    useEffect(() => {
        // On initial load, try to set user from token if available and valid
        if (token) {
            // In a real app, you'd verify token with your backend here
            // For now, we'll just assume it's valid if present
            try {
                // Decode token to get user info (client-side decode - NOT for security validation)
                // Use a library like 'jwt-decode' (npm install jwt-decode)
                // For simplicity, let's parse it manually for now (replace with jwt-decode later)
                const payload = JSON.parse(atob(token.split('.')[1]));
                setUser({
                    userId: payload.user_id,
                    username: payload.username,
                    role: payload.role
                });
            } catch (e) {
                console.error("Invalid token:", e);
                localStorage.removeItem('jwt_token');
                setToken(null);
                setUser(null);
            }
        }
        setLoading(false);
    }, [token]);

    const login = async (username, password) => {
        setLoading(true);
        try {
            const data = await loginUser(username, password);
            localStorage.setItem('jwt_token', data.token);
            setToken(data.token);
            const payload = JSON.parse(atob(data.token.split('.')[1]));
            setUser({
                userId: payload.user_id,
                username: payload.username,
                role: payload.role
            });
            setLoading(false);
            return { success: true };
        } catch (error) {
            console.error('Login failed:', error);
            setLoading(false);
            return { success: false, message: error.message || 'Login failed' };
        }
    };

    const register = async (userData) => {
        setLoading(true);
        try {
            const data = await registerUser(userData);
            setLoading(false);
            return { success: true, message: data.message };
        } catch (error) {
            console.error('Registration failed:', error);
            setLoading(false);
            return { success: false, message: error.message || 'Registration failed' };
        }
    };

    const logout = () => {
        localStorage.removeItem('jwt_token');
        setToken(null);
        setUser(null);
    };

    const authContextValue = {
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);