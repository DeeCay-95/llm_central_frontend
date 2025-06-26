// src/services/authService.js
const API_BASE_URL = 'http://localhost:5000/api'; // Your Flask API local URL

export const loginUser = async (username, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Failed to login');
    }
    return data;
};

export const registerUser = async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Failed to register');
    }
    return data;
};

// Generic API utility to make authenticated calls
export const makeAuthenticatedApiCall = async (url, options = {}) => {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
        throw new Error('No authentication token found. Please log in.');
    }

    const headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json', // Default for most of our API calls
    };

    const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || `API call to ${url} failed`);
    }
    return data;
};