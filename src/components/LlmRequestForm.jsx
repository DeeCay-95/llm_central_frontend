// src/components/LlmRequestForm.jsx
import React, { useState, useEffect } from 'react';
import { submitLlmAccessRequest } from '../services/publicService';

function LlmRequestForm() {
    const [requesterEmailOrEmployeeID, setRequesterEmailOrEmployeeID] = useState('');
    const [requesterName, setRequesterName] = useState('');
    const [requestedModelID, setRequestedModelID] = useState('');
    const [purpose, setPurpose] = useState('');
    const [teammateContacts, setTeammateContacts] = useState(['']); // Start with one empty field
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Hardcoded list of models for dropdown (ensure these match your Azure AI Foundry deployments)
    const availableModels = [
        "gpt35turbo-dev", // Ensure this matches your deployment name
        "gpt-4o",
        "gpt-4o-mini",
        // Add other models as they become available for request
    ];

    useEffect(() => {
        // Set a default selected model if available
        if (availableModels.length > 0 && !requestedModelID) {
            setRequestedModelID(availableModels[0]);
        }
    }, [availableModels, requestedModelID]);

    const handleTeammateChange = (index, value) => {
        const newTeammateContacts = [...teammateContacts];
        newTeammateContacts[index] = value;
        setTeammateContacts(newTeammateContacts);
    };

    const addTeammateField = () => {
        if (teammateContacts.length < 10) {
            setTeammateContacts([...teammateContacts, '']);
        } else {
            setMessage('Maximum 10 teammates allowed.');
        }
    };

    const removeTeammateField = (index) => {
        const newTeammateContacts = teammateContacts.filter((_, i) => i !== index);
        setTeammateContacts(newTeammateContacts);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsLoading(true);

        const requestData = {
            requester_email_or_employee_id: requesterEmailOrEmployeeID,
            requester_name: requesterName,
            requested_model_id: requestedModelID,
            purpose: purpose,
            teammate_emails_or_employee_ids: teammateContacts.filter(contact => contact.trim() !== '') // Filter out empty fields
        };

        try {
            const result = await submitLlmAccessRequest(requestData);
            setMessage(`Request submitted successfully! Request ID: ${result.request_id}`);
            // Clear form
            setRequesterEmailOrEmployeeID('');
            setRequesterName('');
            setRequestedModelID(availableModels[0] || '');
            setPurpose('');
            setTeammateContacts(['']);
        } catch (error) {
            setMessage(`Error submitting request: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>Request LLM Access</h2>
            {message && <p style={{ color: isLoading ? 'blue' : 'green' }}><span style={{ color: 'red' }}>{message.startsWith('Error') ? 'Error: ' : ''}</span>{message}</p>}
            
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="requesterEmailOrEmployeeID">Your Email or Employee ID (Required)</label>
                    <input
                        type="text"
                        id="requesterEmailOrEmployeeID"
                        value={requesterEmailOrEmployeeID}
                        onChange={(e) => setRequesterEmailOrEmployeeID(e.target.value)}
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                        required
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="requesterName">Your Name (Optional)</label>
                    <input
                        type="text"
                        id="requesterName"
                        value={requesterName}
                        onChange={(e) => setRequesterName(e.target.value)}
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="requestedModelID">Requested LLM Model (Required)</label>
                    <select
                        id="requestedModelID"
                        value={requestedModelID}
                        onChange={(e) => setRequestedModelID(e.target.value)}
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                        required
                    >
                        {availableModels.map(model => (
                            <option key={model} value={model}>{model}</option>
                        ))}
                    </select>
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="purpose">Purpose of Use (Required)</label>
                    <textarea
                        id="purpose"
                        value={purpose}
                        onChange={(e) => setPurpose(e.target.value)}
                        rows="4"
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                        required
                    ></textarea>
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label>Teammate Emails/Employee IDs (Up to 10)</label>
                    {teammateContacts.map((contact, index) => (
                        <div key={index} style={{ display: 'flex', marginBottom: '8px' }}>
                            <input
                                type="text"
                                placeholder={`Teammate ${index + 1}`}
                                value={contact}
                                onChange={(e) => handleTeammateChange(index, e.target.value)}
                                style={{ flexGrow: 1, padding: '8px', boxSizing: 'border-box', marginRight: '5px' }}
                            />
                            {teammateContacts.length > 1 && (
                                <button type="button" onClick={() => removeTeammateField(index)} style={{ padding: '8px 12px' }}>Remove</button>
                            )}
                        </div>
                    ))}
                    {teammateContacts.length < 10 && (
                        <button type="button" onClick={addTeammateField} style={{ padding: '8px 12px', marginTop: '5px' }}>Add Teammate</button>
                    )}
                </div>
                
                <button type="submit" disabled={isLoading} style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    {isLoading ? 'Submitting...' : 'Submit Request'}
                </button>
            </form>
        </div>
    );
}

export default LlmRequestForm;