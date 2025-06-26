// src/services/publicService.js
// const API_BASE_URL = 'http://localhost:5000/api'; // Your Flask API local URL
const API_BASE_URL = 'https://api-llmcentral-gateway-dev-centralindia-dph5esdxhmgrhgab.centralindia-01.azurewebsites.net/api'; // Your Flask API local URL

export const submitLlmAccessRequest = async (requestData) => {
    const response = await fetch(`${API_BASE_URL}/public/llm-request`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Failed to submit LLM access request');
    }
    return data;
};