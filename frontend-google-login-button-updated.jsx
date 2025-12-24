// ============================================================
// UPDATED GOOGLE LOGIN BUTTON - With OAuth Callback Flow
// ============================================================
// File: src/components/GoogleLoginButton.jsx

import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

// Configuration - Update these based on your environment
const BACKEND_URL =
  process.env.REACT_APP_API_URL ||
  process.env.VITE_API_URL ||
  'http://localhost:3002';
// For Next.js, use: process.env.NEXT_PUBLIC_API_URL

function GoogleLoginButton({ onSuccess, onError }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError(null);

    try {
      console.log('🔐 Google login initiated...');
      console.log('📤 Sending ID token to backend...');

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

      // Extract data from response
      const { user, tokens } = response.data.data;

      // Store authentication data in localStorage
      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
      localStorage.setItem('user', JSON.stringify(user));

      console.log('✅ User logged in successfully:', user.name);
      console.log('👤 User ID:', user.userId);
      console.log('📧 Email:', user.email);

      // Call success callback if provided
      if (onSuccess) {
        onSuccess(user);
      }

      // Show success message
      alert(`Welcome ${user.name}! Redirecting to home page...`);

      // Redirect to home page
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    } catch (error) {
      console.error('❌ Login failed:', error);

      let errorMessage = 'Login failed. Please try again.';

      if (error.response) {
        // Backend returned an error
        console.error('Backend error:', error.response.data);
        errorMessage =
          error.response.data.error ||
          error.response.data.message ||
          errorMessage;
      } else if (error.request) {
        // Network error - backend not reachable
        console.error('Network error - backend not responding');
        errorMessage =
          'Cannot connect to server. Please check if backend is running.';
      } else {
        console.error('Error:', error.message);
      }

      setError(errorMessage);
      alert(errorMessage);

      // Call error callback if provided
      if (onError) {
        onError(error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = (error) => {
    console.error('❌ Google OAuth error:', error);
    const errorMessage = 'Google login failed. Please try again.';
    setError(errorMessage);
    alert(errorMessage);

    if (onError) {
      onError(error);
    }
  };

  return (
    <div style={styles.container}>
      {loading && (
        <div style={styles.loadingOverlay}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Logging in with Google...</p>
        </div>
      )}

      {error && (
        <div style={styles.error}>
          <p style={styles.errorText}>⚠️ {error}</p>
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

      <p style={styles.helperText}>
        Click above to sign in with your Google account
      </p>
    </div>
  );
}

// Styles
const styles = {
  container: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    width: '100%',
  },
  loadingOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  spinner: {
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #4285f4',
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    color: 'white',
    fontSize: '16px',
    marginTop: '20px',
    fontWeight: '500',
  },
  error: {
    backgroundColor: '#ffebee',
    color: '#c62828',
    padding: '12px 16px',
    borderRadius: '6px',
    border: '1px solid #ef5350',
    width: '100%',
    textAlign: 'center',
  },
  errorText: {
    margin: 0,
    fontSize: '14px',
  },
  helperText: {
    fontSize: '13px',
    color: '#666',
    textAlign: 'center',
    margin: '8px 0 0 0',
  },
};

// Add CSS animation for spinner
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  if (!document.head.querySelector('style[data-spinner]')) {
    styleSheet.setAttribute('data-spinner', 'true');
    document.head.appendChild(styleSheet);
  }
}

export default GoogleLoginButton;

// ============================================================
// USAGE EXAMPLES
// ============================================================

/*
// 1. Simple usage in Login Page:
// File: src/pages/LoginPage.jsx

import React from 'react';
import GoogleLoginButton from '../components/GoogleLoginButton';

function LoginPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f5f5f5',
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px',
      }}>
        <h1 style={{
          textAlign: 'center',
          marginBottom: '30px',
          fontSize: '24px',
          color: '#333',
        }}>
          Welcome to Mutual Funds
        </h1>
        
        <GoogleLoginButton />
      </div>
    </div>
  );
}

export default LoginPage;
*/

/*
// 2. Usage with callbacks:
// File: src/pages/LoginPage.jsx

import React from 'react';
import GoogleLoginButton from '../components/GoogleLoginButton';

function LoginPage() {
  const handleLoginSuccess = (user) => {
    console.log('Login successful for user:', user);
    // Additional logic after successful login
  };

  const handleLoginError = (error) => {
    console.error('Login error:', error);
    // Additional error handling
  };

  return (
    <div>
      <GoogleLoginButton 
        onSuccess={handleLoginSuccess}
        onError={handleLoginError}
      />
    </div>
  );
}

export default LoginPage;
*/

/*
// 3. Setup in App root with GoogleOAuthProvider:
// File: src/main.jsx (React + Vite) or src/index.js (Create React App)

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';

// Get Google Client ID from environment variables
const GOOGLE_CLIENT_ID = 
  import.meta.env.VITE_GOOGLE_CLIENT_ID || // Vite
  process.env.REACT_APP_GOOGLE_CLIENT_ID;  // Create React App

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

/*
// 4. For Next.js (app/layout.jsx):
import { GoogleOAuthProvider } from '@react-oauth/google';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
          {children}
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
*/
