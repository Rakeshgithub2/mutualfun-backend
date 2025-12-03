// ============================================================
// COPY-PASTE READY: Google OAuth Login Component
// ============================================================

// File: src/components/GoogleLoginButton.jsx
// This is a complete, ready-to-use component for Google OAuth

import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Remove this line if using Next.js

// Configuration
const BACKEND_URL = 'http://localhost:3002'; // Change for production

function GoogleLoginButton() {
  const navigate = useNavigate(); // For Next.js, use: const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError(null);

    try {
      console.log('🔐 Google login initiated...');

      // Send ID token to backend
      const response = await axios.post(
        `${BACKEND_URL}/api/auth/google`,
        {
          idToken: credentialResponse.credential,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('✅ Backend response received:', response.data);

      // Extract data
      const { user, tokens } = response.data.data;

      // Store in localStorage
      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
      localStorage.setItem('user', JSON.stringify(user));

      console.log('✅ User logged in:', user.name);
      console.log('✅ User ID:', user.userId);
      console.log('✅ Email:', user.email);

      // Show success message
      alert(`Welcome ${user.name}! Login successful.`);

      // Redirect to home page
      // For React Router:
      navigate('/');

      // For Next.js:
      // router.push('/');

      // Optional: Reload to update auth state everywhere
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error('❌ Login failed:', error);

      let errorMessage = 'Login failed. Please try again.';

      if (error.response) {
        // Backend returned an error
        console.error('Backend error:', error.response.data);
        errorMessage = error.response.data.error || errorMessage;
      } else if (error.request) {
        // Network error - backend not reachable
        console.error('Network error - backend not responding');
        errorMessage =
          'Cannot connect to server. Please check if backend is running on port 3002.';
      }

      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    console.error('❌ Google login failed');
    setError('Google login failed. Please try again.');
  };

  return (
    <div style={styles.container}>
      {loading && (
        <div style={styles.loadingOverlay}>
          <div style={styles.spinner}></div>
          <p>Logging in...</p>
        </div>
      )}

      {error && (
        <div style={styles.error}>
          <p>{error}</p>
        </div>
      )}

      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
        useOneTap={false}
        theme="filled_blue"
        size="large"
        text="signin_with"
        shape="rectangular"
        logo_alignment="left"
      />
    </div>
  );
}

// Basic styles
const styles = {
  container: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
  },
  loadingOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    color: 'white',
  },
  spinner: {
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #3498db',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    animation: 'spin 1s linear infinite',
  },
  error: {
    backgroundColor: '#ffebee',
    color: '#c62828',
    padding: '10px 20px',
    borderRadius: '4px',
    border: '1px solid #ef5350',
  },
};

export default GoogleLoginButton;

// ============================================================
// CSS for spinner animation (add to your CSS file)
// ============================================================

/*
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
*/

// ============================================================
// USAGE IN YOUR LOGIN PAGE
// ============================================================

/*
// File: src/pages/LoginPage.jsx

import React from 'react';
import GoogleLoginButton from '../components/GoogleLoginButton';

function LoginPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f5f5f5',
      padding: '20px',
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        maxWidth: '400px',
        width: '100%',
      }}>
        <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>
          Login to Mutual Funds
        </h1>
        
        <GoogleLoginButton />
        
        <div style={{
          textAlign: 'center',
          margin: '20px 0',
          color: '#666',
        }}>
          <span>or</span>
        </div>
        
        {/* Add your email/password form here *\/}
        <form>
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <button type="submit">Login with Email</button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
*/

// ============================================================
// SETUP IN YOUR APP ROOT
// ============================================================

/*
// File: src/main.jsx (React) or src/app/layout.jsx (Next.js)

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';

const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
*/

// ============================================================
// AUTHENTICATION HOOK (BONUS)
// ============================================================

/*
// File: src/hooks/useAuth.js

import { useState, useEffect } from 'react';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const accessToken = localStorage.getItem('accessToken');
    const userStr = localStorage.getItem('user');

    if (accessToken && userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to parse user data:', error);
        logout();
      }
    }

    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  return { user, isAuthenticated, loading, logout };
}

// Usage in components:
// const { user, isAuthenticated, loading, logout } = useAuth();
*/
