// src/services/dataService.js
import { makeAuthenticatedApiCall } from './authService'; // Use our generic authenticated call helper

export const getMyUsage = async () => {
    return await makeAuthenticatedApiCall('/auth/me/usage', {
        method: 'GET',
    });
};

export const getOverallUsage = async () => {
    return await makeAuthenticatedApiCall('/admin/reports/overall-usage', {
        method: 'GET',
    });
};

export const getBackchargeReport = async () => {
    return await makeAuthenticatedApiCall('/admin/reports/backcharge', {
        method: 'GET',
    });
};