// src/components/DeveloperDashboard.jsx
import React, { useState, useEffect } from 'react';
import { getMyUsage } from '../services/dataService';

function DeveloperDashboard() {
    const [usageData, setUsageData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchUsage = async () => {
            setLoading(true);
            setMessage('');
            try {
                const data = await getMyUsage();
                setUsageData(data);
                setMessage('Personal usage data loaded.');
            } catch (error) {
                setMessage(`Error loading personal usage data: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };
        fetchUsage();
    }, []);

    if (loading) {
        return <div style={{ padding: '20px' }}>Loading your usage dashboard...</div>;
    }

    if (message.startsWith('Error')) {
        return <div style={{ padding: '20px', color: 'red' }}>{message}</div>;
    }

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', border: '1px solid #eee', borderRadius: '8px', marginTop: '20px' }}>
            <h3>Your LLM Usage Summary</h3>
            {usageData ? (
                <div>
                    <p><strong>Total Input Tokens:</strong> {usageData.total_input_tokens}</p>
                    <p><strong>Total Output Tokens:</strong> {usageData.total_output_tokens}</p>
                    <p><strong>Total Tokens Consumed:</strong> {usageData.total_tokens}</p>
                    <p><strong>Estimated Total Cost:</strong> ${usageData.total_cost_usd}</p>

                    <h4 style={{ marginTop: '20px' }}>Recent Usage Logs (Last 100)</h4>
                    {usageData.usage_logs_sample && usageData.usage_logs_sample.length > 0 ? (
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px', fontSize: '0.9em' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f9f9f9' }}>
                                    <th style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'left' }}>Timestamp</th>
                                    <th style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'left' }}>Model</th>
                                    <th style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'right' }}>Input Tokens</th>
                                    <th style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'right' }}>Output Tokens</th>
                                    <th style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'right' }}>Cost ($)</th>
                                    <th style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'right' }}>Latency (ms)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usageData.usage_logs_sample.map((log, index) => (
                                    <tr key={log.id || index}>
                                        <td style={{ border: '1px solid #ddd', padding: '6px' }}>{new Date(log.Timestamp).toLocaleString()}</td>
                                        <td style={{ border: '1px solid #ddd', padding: '6px' }}>{log.ModelID}</td>
                                        <td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'right' }}>{log.PromptTokens}</td>
                                        <td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'right' }}>{log.CompletionTokens}</td>
                                        <td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'right' }}>{log.EstimatedCostUSD ? log.EstimatedCostUSD.toFixed(6) : 'N/A'}</td>
                                        <td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'right' }}>{log.LatencyMs}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No recent usage logs found.</p>
                    )}
                </div>
            ) : (
                <p>No usage data available.</p>
            )}
        </div>
    );
}

export default DeveloperDashboard;