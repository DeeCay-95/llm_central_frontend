// src/App.jsx (updated to include dashboards)
import React, { useState } from 'react';
import { useAuth } from './context/AuthContext.jsx';
import LlmRequestForm from './components/LlmRequestForm.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import DeveloperDashboard from './components/DeveloperDashboard.jsx'; // Import DeveloperDashboard
import AdminReports from './components/AdminReports.jsx'; // Import AdminReports


function App() {
  const { user, login, register, logout, isAuthenticated, loading } = useAuth();
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerFirstName, setRegisterFirstName] = useState('');
  const [registerLastName, setRegisterLastName] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    const result = await login(loginUsername, loginPassword);
    if (result.success) {
      setMessage('Login successful!');
      setLoginUsername('');
      setLoginPassword('');
    } else {
      setMessage(`Login failed: ${result.message}`);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');
    const result = await register({
      username: registerUsername,
      password: registerPassword,
      email: registerEmail,
      first_name: registerFirstName,
      last_name: registerLastName
    });
    if (result.success) {
      setMessage(`Registration successful: ${result.message}. You can now log in.`);
      setRegisterUsername('');
      setRegisterPassword('');
      setRegisterEmail('');
      setRegisterFirstName('');
      setRegisterLastName('');
    } else {
      setMessage(`Registration failed: ${result.message}`);
    }
  };

  if (loading) {
    return <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>Loading authentication...</div>;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>LLM Central System Portal</h1>
      {message && <p style={{ color: 'red' }}>{message}</p>}

      {isAuthenticated ? (
        <div>
          <h2>Welcome, {user.username}!</h2>
          <p>Your role: {user.role}</p>
          <button onClick={logout}>Logout</button>

          {/* Conditional rendering for Dashboards based on role */}
          {user.role === 'llm_admin' && (
            <div style={{ marginTop: '30px' }}>
              <AdminDashboard /> {/* Admin Request Management */}
              <hr style={{ margin: '30px 0' }} />
              <AdminReports /> {/* Admin Usage Reports */}
            </div>
          )}

          {user.role === 'developer' && (
            <div style={{ marginTop: '30px' }}>
              <DeveloperDashboard /> {/* Developer's Personal Usage */}
            </div>
          )}

        </div>
      ) : (
        <>
          {/* Show the Request Form for unauthenticated users */}
          <LlmRequestForm /> 

          <hr style={{ margin: '40px 0' }} /> {/* Separator */}

          {/* Show Login/Register forms for admins or developers who need to log in to view usage */}
          <div style={{ marginTop: '20px' }}>
            <h2>Admin / Existing User Login</h2>
            <form onSubmit={handleLogin}>
              <input
                type="text"
                placeholder="Username"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                required
              />
              <br />
              <input
                type="password"
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
              <br />
              <button type="submit">Login</button>
            </form>

            <h3 style={{ marginTop: '20px' }}>New User Registration (For admins to create system users)</h3>
            <form onSubmit={handleRegister}>
              <input
                type="text"
                placeholder="Username"
                value={registerUsername}
                onChange={(e) => setRegisterUsername(e.target.value)}
                required
              />
              <br />
              <input
                type="password"
                placeholder="Password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                required
              />
              <br />
              <input
                type="email"
                placeholder="Email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                required
              />
              <br />
              <input
                type="text"
                placeholder="First Name"
                value={registerFirstName}
                onChange={(e) => setRegisterFirstName(e.target.value)}
              />
              <br />
              <input
                type="text"
                placeholder="Last Name"
                value={registerLastName}
                onChange={(e) => setRegisterLastName(e.target.value)}
              />
              <br />
              <button type="submit">Register</button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}

export default App;