// ============================================================
// AUTH SUCCESS PAGE - Handle OAuth callback and redirect
// ============================================================
// File: src/pages/AuthSuccess.jsx (React Router)
// or: src/app/auth/success/page.jsx (Next.js)

import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
// For Next.js, use: import { useRouter, useSearchParams } from 'next/navigation';

const AuthSuccess = () => {
  const navigate = useNavigate();
  // For Next.js, use: const router = useRouter();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('processing');
  const [message, setMessage] = useState('Processing authentication...');

  useEffect(() => {
    const processAuth = async () => {
      try {
        // Get tokens and user data from URL
        const accessToken = searchParams.get('accessToken');
        const refreshToken = searchParams.get('refreshToken');
        const userParam = searchParams.get('user');

        console.log('🔐 Processing authentication callback...');

        // Validate required parameters
        if (!accessToken || !refreshToken || !userParam) {
          console.error('❌ Missing authentication data');
          setStatus('error');
          setMessage('Authentication failed: Missing credentials');
          return;
        }

        // Parse user data
        let user;
        try {
          user = JSON.parse(decodeURIComponent(userParam));
        } catch (e) {
          console.error('❌ Failed to parse user data:', e);
          setStatus('error');
          setMessage('Authentication failed: Invalid user data');
          return;
        }

        console.log('✅ User authenticated:', user.email);

        // Store authentication data
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));

        // Update status
        setStatus('success');
        setMessage(`Welcome ${user.name}! Redirecting to home page...`);

        console.log('✅ Authentication data stored successfully');
        console.log('🏠 Redirecting to home page in 2 seconds...');

        // Redirect to home page after 2 seconds
        setTimeout(() => {
          // For React Router:
          navigate('/');

          // For Next.js:
          // router.push('/');

          // Force reload to ensure all components get updated auth state
          window.location.href = '/';
        }, 2000);
      } catch (error) {
        console.error('❌ Authentication error:', error);
        setStatus('error');
        setMessage('Authentication failed. Please try again.');
      }
    };

    processAuth();
  }, [searchParams, navigate]);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {status === 'processing' && (
          <>
            <div style={styles.spinner}></div>
            <h2 style={styles.title}>Processing Login</h2>
            <p style={styles.message}>{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div style={styles.successIcon}>✓</div>
            <h2 style={styles.title}>Login Successful!</h2>
            <p style={styles.message}>{message}</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div style={styles.errorIcon}>✕</div>
            <h2 style={styles.title}>Login Failed</h2>
            <p style={styles.message}>{message}</p>
            <button
              style={styles.button}
              onClick={() => navigate('/login')}
              // For Next.js: onClick={() => router.push('/login')}
            >
              Back to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    padding: '20px',
  },
  card: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    maxWidth: '400px',
    width: '100%',
  },
  spinner: {
    margin: '0 auto 20px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #4285f4',
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    animation: 'spin 1s linear infinite',
  },
  successIcon: {
    width: '60px',
    height: '60px',
    margin: '0 auto 20px',
    borderRadius: '50%',
    backgroundColor: '#4caf50',
    color: 'white',
    fontSize: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
  },
  errorIcon: {
    width: '60px',
    height: '60px',
    margin: '0 auto 20px',
    borderRadius: '50%',
    backgroundColor: '#f44336',
    color: 'white',
    fontSize: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
  },
  title: {
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '10px',
    color: '#333',
  },
  message: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '20px',
  },
  button: {
    padding: '12px 24px',
    backgroundColor: '#4285f4',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: '500',
  },
};

// CSS animation (add to your global CSS file or styled-components)
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default AuthSuccess;

// ============================================================
// ROUTING SETUP
// ============================================================

/*
// For React Router (src/App.jsx):
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthSuccess from './pages/AuthSuccess';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/success" element={<AuthSuccess />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
*/

/*
// For Next.js, create: src/app/auth/success/page.jsx
// (The file you're reading IS the page component)
// Next.js will automatically route /auth/success to this component
*/
