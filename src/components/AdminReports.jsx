// src/components/AdminReports.jsx
import React, { useState, useEffect } from 'react';
import { getOverallUsage, getBackchargeReport } from '../services/dataService';

function AdminReports() {
    const [overallUsage, setOverallUsage] = useState(null);
    const [backchargeReport, setBackchargeReport] = useState([]);
    const [loadingOverall, setLoadingOverall] = useState(true);
    const [loadingBackcharge, setLoadingBackcharge] = useState(true);
    const [messageOverall, setMessageOverall] = useState('');
    const [messageBackcharge, setMessageBackcharge] = useState('');

    useEffect(() => {
        const fetchOverallUsage = async () => {
            setLoadingOverall(true);
            setMessageOverall('');
            try {
                const data = await getOverallUsage();
                setOverallUsage(data);
                setMessageOverall('Overall usage data loaded.');
            } catch (error) {
                setMessageOverall(`Error loading overall usage: ${error.message}`);
            } finally {
                setLoadingOverall(false);
            }
        };

        const fetchBackchargeReport = async () => {
            setLoadingBackcharge(true);
            setMessageBackcharge('');
            try {
                const data = await getBackchargeReport();
                setBackchargeReport(data);
                setMessageBackcharge('Backcharge report loaded.');
            } catch (error) {
                setMessageBackcharge(`Error loading backcharge report: ${error.message}`);
            } finally {
                setLoadingBackcharge(false);
            }
        };

        fetchOverallUsage();
        fetchBackchargeReport();
    }, []);

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h3 style={{ marginTop: '0' }}>System-Wide LLM Usage Report</h3>
            {messageOverall && <p style={{ color: messageOverall.startsWith('Error') ? 'red' : 'green' }}>{messageOverall}</p>}
            {loadingOverall ? (
                <p>Loading overall usage...</p>
            ) : overallUsage ? (
                <div style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px', marginBottom: '30px' }}>
                    <p><strong>Total API Calls:</strong> {overallUsage.TotalCalls}</p>
                    <p><strong>Total Input Tokens:</strong> {overallUsage.TotalInputTokens}</p>
                    <p><strong>Total Output Tokens:</strong> {overallUsage.TotalOutputTokens}</p>
                    <p><strong>Total Tokens Consumed:</strong> {overallUsage.TotalInputTokens + overallUsage.TotalOutputTokens}</p>
                    <p><strong>Estimated Total System Cost:</strong> ${overallUsage.TotalEstimatedCostUSD ? overallUsage.TotalEstimatedCostUSD.toFixed(6) : '0.000000'}</p>
                </div>
            ) : (
                <p>No overall usage data available.</p>
            )}

            <h3 style={{ marginTop: '30px' }}>Backcharging Report (Usage per User/Application)</h3>
            {messageBackcharge && <p style={{ color: messageBackcharge.startsWith('Error') ? 'red' : 'green' }}>{messageBackcharge}</p>}
            {loadingBackcharge ? (
                <p>Loading backcharge report...</p>
            ) : backchargeReport && backchargeReport.length > 0 ? (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px', fontSize: '0.9em' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f9f9f9' }}>
                            <th style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'left' }}>Principal ID</th>
                            <th style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'left' }}>Username / Email</th>
                            <th style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'right' }}>Total Tokens</th>
                            <th style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'right' }}>Estimated Cost ($)</th>
                            <th style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'right' }}>Total Calls</th>
                        </tr>
                    </thead>
                    <tbody>
                        {backchargeReport.map((entry, index) => (
                            <tr key={entry.CallingPrincipalID || index}>
                                <td style={{ border: '1px solid #ddd', padding: '6px' }}>{entry.CallingPrincipalID}</td>
                                <td style={{ border: '1px solid #ddd', padding: '6px' }}>
                                    {entry.username || entry.email || 'N/A'}
                                    {entry.name && entry.name !== ' ' ? ` (${entry.name})` : ''}
                                </td>
                                <td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'right' }}>{entry.TotalTokens}</td>
                                <td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'right' }}>{entry.TotalEstimatedCostUSD ? entry.TotalEstimatedCostUSD.toFixed(6) : 'N/A'}</td>
                                <td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'right' }}>{entry.TotalCalls}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No backcharge data available.</p>
            )}
        </div>
    );
}

export default AdminReports;