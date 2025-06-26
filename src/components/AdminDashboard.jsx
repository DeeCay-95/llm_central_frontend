// src/components/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { getPendingLlmRequests, approveLlmRequest, rejectLlmRequest } from '../services/adminService';

function AdminDashboard() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    const fetchRequests = async () => {
        setLoading(true);
        setMessage('');
        try {
            const data = await getPendingLlmRequests();
            setRequests(data);
            setMessage('Pending requests loaded.');
        } catch (error) {
            setMessage(`Error loading requests: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleApprove = async (requestId, requesterContactEmailOrEmployeeID) => {
        setMessage('');
        try {
            await approveLlmRequest(requestId, requesterContactEmailOrEmployeeID);
            setMessage(`Request ${requestId} approved successfully!`);
            fetchRequests(); // Refresh the list
        } catch (error) {
            setMessage(`Error approving request ${requestId}: ${error.message}`);
        }
    };

    const handleReject = async (requestId, requesterContactEmailOrEmployeeID) => {
        setMessage('');
        try {
            await rejectLlmRequest(requestId, requesterContactEmailOrEmployeeID);
            setMessage(`Request ${requestId} rejected successfully!`);
            fetchRequests(); // Refresh the list
        } catch (error) {
            setMessage(`Error rejecting request ${requestId}: ${error.message}`);
        }
    };

    if (loading) {
        return <div style={{ padding: '20px' }}>Loading admin dashboard...</div>;
    }

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h2>Admin Dashboard - Pending LLM Access Requests</h2>
            {message && <p style={{ color: message.startsWith('Error') ? 'red' : 'green' }}>{message}</p>}

            {requests.length === 0 ? (
                <p>No pending LLM access requests.</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f2f2f2' }}>
                            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Requester</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Model</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Purpose</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Teammates</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Submitted</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map(req => (
                            <tr key={req.id}>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                    {req.RequesterName ? `${req.RequesterName} (${req.RequesterEmailOrEmployeeID})` : req.RequesterEmailOrEmployeeID}
                                </td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{req.RequestedModelID}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{req.Purpose}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                    {req.TeammateEmailsOrEmployeeIDs && req.TeammateEmailsOrEmployeeIDs.length > 0
                                        ? req.TeammateEmailsOrEmployeeIDs.join(', ')
                                        : 'None'}
                                </td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                    {new Date(req.SubmissionDate).toLocaleString()}
                                </td>
                                <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                                    <button 
                                        onClick={() => handleApprove(req.id, req.RequesterEmailOrEmployeeID)}
                                        style={{ backgroundColor: '#28a745', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' }}
                                    >
                                        Approve
                                    </button>
                                    <button 
                                        onClick={() => handleReject(req.id, req.RequesterEmailOrEmployeeID)}
                                        style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                                    >
                                        Reject
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default AdminDashboard;