// src/tests/AuthContext.test.jsx
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { loginUser, registerUser } from '../services/authService';

// Mock the authService functions
vi.mock('../services/authService', () => ({
    loginUser: vi.fn(),
    registerUser: vi.fn(),
}));

// Mock localStorage
const localStorageMock = (function () {
    let store = {};
    return {
        getItem: vi.fn((key) => store[key] || null),
        setItem: vi.fn((key, value) => { store[key] = value.toString(); }),
        removeItem: vi.fn((key) => { delete store[key]; }),
        clear: vi.fn(() => { store = {}; })
    };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('AuthContext', () => {
    beforeEach(() => {
        // Clear mocks and localStorage before each test
        loginUser.mockReset();
        registerUser.mockReset();
        // Call localStorage.clear() directly here, as our mock is now on window.localStorage
        window.localStorage.clear();
    });
    it('should return initial loading state and no user/token after effects run', async () => { // Make this test async
        // Use await act() to ensure all effects and state updates are flushed
        const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

        // The initial loading state is true, but useEffect immediately sets it to false.
        // We want to assert the state *after* this initial effect has run.
        await act(async () => {
            // If there were async operations in useEffect, we'd await them here.
            // For localStorage.getItem, it's synchronous, but act ensures state updates are processed.
        });

        expect(result.current.loading).toBe(false); // Now we expect false
        expect(result.current.user).toBeNull();
        expect(result.current.token).toBeNull();
        expect(result.current.isAuthenticated).toBe(false);
    });

    it('should handle successful login', async () => {
        const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTIzIiwidXNlcm5hbWUiOiJ0ZXN0ZGV2Iiwicm9sZSI6ImRldmVsb3BlciJ9.signature';
        loginUser.mockResolvedValueOnce({ token: mockToken, message: 'Login successful.' });

        const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

        await act(async () => {
            const loginResult = await result.current.login('testdev', 'password');
            expect(loginResult.success).toBe(true);
        });

        expect(loginUser).toHaveBeenCalledWith('testdev', 'password');
        expect(localStorageMock.setItem).toHaveBeenCalledWith('jwt_token', mockToken);
        expect(result.current.token).toBe(mockToken);
        expect(result.current.user).toEqual({ userId: '123', username: 'testdev', role: 'developer' });
        expect(result.current.isAuthenticated).toBe(true);
        expect(result.current.loading).toBe(false); // loading should be false after login
    });
    it('should return initial loading state and no user/token after effects run', async () => { // Make this test async
        const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

        // Use await act() to ensure all effects and state updates are flushed
        await act(async () => {
            // No explicit actions needed here for this test, but 'act' ensures state updates from useEffect are processed.
        });

        // Now, after the useEffect has run, we expect loading to be false.
        expect(result.current.loading).toBe(false);
        expect(result.current.user).toBeNull();
        expect(result.current.token).toBeNull();
        expect(result.current.isAuthenticated).toBe(false);
    });

    it('should handle successful login', async () => {
        const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTIzIiwidXNlcm5hbWUiOiJ0ZXN0ZGV2Iiwicm9sZSI6ImRldmVsb3BlciJ9.signature';
        loginUser.mockResolvedValueOnce({ token: mockToken, message: 'Login successful.' });

        const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

        await act(async () => {
            const loginResult = await result.current.login('testdev', 'password');
            expect(loginResult.success).toBe(true);
        });

        expect(loginUser).toHaveBeenCalledWith('testdev', 'password');
        expect(localStorageMock.setItem).toHaveBeenCalledWith('jwt_token', mockToken);
        expect(result.current.token).toBe(mockToken);
        expect(result.current.user).toEqual({ userId: '123', username: 'testdev', role: 'developer' });
        expect(result.current.isAuthenticated).toBe(true);
        expect(result.current.loading).toBe(false);
    });

    it('should handle login failure', async () => {
        loginUser.mockRejectedValueOnce(new Error('Invalid credentials'));

        const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

        await act(async () => {
            const loginResult = await result.current.login('wrong', 'password');
            expect(loginResult.success).toBe(false);
            expect(loginResult.message).toBe('Invalid credentials');
        });

        expect(localStorageMock.removeItem).toHaveBeenCalledTimes(0); // Token not set, so not removed
        expect(result.current.token).toBeNull();
        expect(result.current.user).toBeNull();
        expect(result.current.isAuthenticated).toBe(false);
        expect(result.current.loading).toBe(false);
    });

    it('should handle logout', async () => {
        localStorageMock.setItem('jwt_token', 'initial_token'); // Pre-set for logout test

        const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

        await act(() => {
            result.current.logout();
        });

        expect(localStorageMock.removeItem).toHaveBeenCalledWith('jwt_token');
        expect(result.current.token).toBeNull();
        expect(result.current.user).toBeNull();
        expect(result.current.isAuthenticated).toBe(false);
    });

    // Add tests for register function similarly
});