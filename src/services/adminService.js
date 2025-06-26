// src/services/adminService.js
import { makeAuthenticatedApiCall } from './authService'; // Use our generic authenticated call helper

export const getPendingLlmRequests = async () => {
    return await makeAuthenticatedApiCall('/admin/requests', {
        method: 'GET',
    });
};

export const approveLlmRequest = async (requestId, requesterContactEmailOrEmployeeID) => {
    return await makeAuthenticatedApiCall(`/admin/requests/${requestId}/approve`, {
        method: 'POST',
        body: JSON.stringify({ requester_contact_email_or_employee_id: requesterContactEmailOrEmployeeID }),
    });
};

export const rejectLlmRequest = async (requestId, requesterContactEmailOrEmployeeID) => {
    return await makeAuthenticatedApiCall(`/admin/requests/${requestId}/reject`, {
        method: 'POST',
        body: JSON.stringify({ requester_contact_email_or_employee_id: requesterContactEmailOrEmployeeID }),
    });
};

// You can add more admin-specific API calls here later (e.g., get usage reports)