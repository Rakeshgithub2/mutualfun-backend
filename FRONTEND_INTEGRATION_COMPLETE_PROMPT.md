# 🚀 COMPLETE FRONTEND INTEGRATION PROMPT FOR GOOGLE OAUTH

## 📋 FOR FRONTEND DEVELOPER

Copy this entire prompt and share with your frontend developer. It contains everything needed to implement Google OAuth authentication.

---

## 🎯 OBJECTIVE

Implement Google Sign-In button that:

1. Allows users to sign in/register with their Google account
2. Sends authentication request to backend
3. Receives and stores JWT tokens
4. Redirects user to home page
5. Maintains user session

---

## 🔑 AUTHENTICATION CREDENTIALS

### Google OAuth Credentials

```
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com
```

**Note:** Do NOT use the Client Secret in frontend. It's only for backend.

### Backend API Details

```
BACKEND_URL=http://localhost:3002
API_ENDPOINT=/api/auth/google
METHOD=POST
CONTENT_TYPE=application/json
```

**Production Backend URL:** (Update when deploying)

```
PRODUCTION_BACKEND_URL=https://your-backend.vercel.app
```

---

## 📦 REQUIRED NPM PACKAGES

Install these packages in your frontend:

```bash
npm install @react-oauth/google axios
```

**Package Details:**

- `@react-oauth/google` - Official Google OAuth library for React
- `axios` - HTTP client for API requests

---

## 🔐 AUTHENTICATION FLOW

```
1. User clicks "Sign in with Google" button
   ↓
2. Google OAuth popup appears
   ↓
3. User selects Google account and grants permission
   ↓
4. Frontend receives ID token from Google
   ↓
5. Frontend sends POST request to backend with ID token
   ↓
6. Backend verifies token with Google
   ↓
7. Backend creates/updates user in MongoDB
   ↓
8. Backend returns JWT tokens and user data
   ↓
9. Frontend stores tokens in localStorage
   ↓
10. Frontend redirects to home page
   ↓
11. ✅ User is logged in
```

---

## 💻 COMPLETE IMPLEMENTATION CODE

### Step 1: Configure Environment Variables

Create `.env` file in your frontend root:

```env
# Frontend Environment Variables
VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com
VITE_BACKEND_URL=http://localhost:3002

# For Create React App, use REACT_APP_ prefix:
# REACT_APP_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com
# REACT_APP_BACKEND_URL=http://localhost:3002

# For Next.js, use NEXT_PUBLIC_ prefix:
# NEXT_PUBLIC_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com
# NEXT_PUBLIC_BACKEND_URL=http://localhost:3002
```

### Step 2: Wrap App with GoogleOAuthProvider

**For React (Vite):**

```jsx
// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';
import './index.css';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
```

**For React (Create React App):**

```jsx
// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';
import './index.css';

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
```

**For Next.js (App Router):**

```jsx
// app/layout.js
'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          {children}
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
```

**For Next.js (Pages Router):**

```jsx
// pages/_app.js
import { GoogleOAuthProvider } from '@react-oauth/google';

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

function MyApp({ Component, pageProps }) {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Component {...pageProps} />
    </GoogleOAuthProvider>
  );
}

export default MyApp;
```

### Step 3: Create API Service

```javascript
// src/services/authService.js
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3002';
// For CRA: process.env.REACT_APP_BACKEND_URL
// For Next.js: process.env.NEXT_PUBLIC_BACKEND_URL

const api = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  // Google OAuth Sign In
  googleSignIn: async (idToken) => {
    const response = await api.post('/api/auth/google', { idToken });
    return response.data;
  },

  // Email/Password Login
  login: async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  },

  // Email/Password Register
  register: async (email, password, name) => {
    const response = await api.post('/api/auth/register', {
      email,
      password,
      name,
    });
    return response.data;
  },

  // Refresh Token
  refreshToken: async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await api.post('/api/auth/refresh', { refreshToken });
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await api.post('/api/auth/logout');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    return response.data;
  },

  // Get Current User
  getCurrentUser: async () => {
    const response = await api.get('/api/auth/me');
    return response.data;
  },
};

export default authService;
```

### Step 4: Create Authentication Context

```jsx
// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
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

  const login = (userData, tokens) => {
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

### Step 5: Create Google Login Button Component

```jsx
// src/components/GoogleLoginButton.jsx
import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom'; // Remove for Next.js
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/authService';

function GoogleLoginButton() {
  const navigate = useNavigate(); // For Next.js: const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError(null);

    try {
      console.log('🔐 Google login initiated...');

      // Send ID token to backend
      const response = await authService.googleSignIn(
        credentialResponse.credential
      );

      console.log('✅ Backend response received');

      // Extract data
      const { user, tokens } = response.data;

      // Update auth context
      login(user, tokens);

      console.log('✅ User logged in:', user.name);

      // Show success message
      alert(`Welcome ${user.name}! Login successful.`);

      // Redirect to home
      navigate('/'); // For Next.js: router.push('/');
    } catch (error) {
      console.error('❌ Login failed:', error);

      let errorMessage = 'Login failed. Please try again.';

      if (error.response) {
        errorMessage = error.response.data.error || errorMessage;
      } else if (error.request) {
        errorMessage =
          'Cannot connect to server. Please check if backend is running.';
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
    marginBottom: '10px',
  },
};

export default GoogleLoginButton;
```

### Step 6: Create Login Page

```jsx
// src/pages/LoginPage.jsx
import React from 'react';
import GoogleLoginButton from '../components/GoogleLoginButton';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

function LoginPage() {
  const { isAuthenticated, loading } = useAuth();

  // Redirect if already logged in
  if (loading) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Welcome to Mutual Funds Platform</h1>
        <p style={styles.subtitle}>Sign in to manage your investments</p>

        <div style={styles.googleSection}>
          <GoogleLoginButton />
        </div>

        <div style={styles.divider}>
          <span style={styles.dividerText}>or</span>
        </div>

        {/* Email/Password Login Form (Optional) */}
        <form style={styles.form}>
          <input type="email" placeholder="Email" style={styles.input} />
          <input type="password" placeholder="Password" style={styles.input} />
          <button type="submit" style={styles.button}>
            Login with Email
          </button>
        </form>

        <p style={styles.footer}>
          Don't have an account? <a href="/register">Register here</a>
        </p>
      </div>
    </div>
  );
}

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
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    maxWidth: '400px',
    width: '100%',
  },
  title: {
    textAlign: 'center',
    marginBottom: '10px',
    fontSize: '24px',
    color: '#333',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: '30px',
    color: '#666',
  },
  googleSection: {
    marginBottom: '20px',
  },
  divider: {
    textAlign: 'center',
    margin: '20px 0',
    position: 'relative',
  },
  dividerText: {
    backgroundColor: 'white',
    padding: '0 10px',
    color: '#666',
    position: 'relative',
    zIndex: 1,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  input: {
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
  },
  button: {
    padding: '12px',
    backgroundColor: '#1976d2',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '14px',
    cursor: 'pointer',
  },
  footer: {
    textAlign: 'center',
    marginTop: '20px',
    color: '#666',
    fontSize: '14px',
  },
};

export default LoginPage;
```

### Step 7: Create Protected Route Component

```jsx
// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
```

### Step 8: Update App.jsx with Routes

```jsx
// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        {/* Add more protected routes here */}
      </Routes>
    </AuthProvider>
  );
}

export default App;
```

### Step 9: Add CSS for Spinner Animation

```css
/* src/index.css or src/App.css */

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
```

---

## 🔑 BACKEND API DETAILS

### Endpoint: Google OAuth Sign In

**URL:** `POST http://localhost:3002/api/auth/google`

**Request Body:**

```json
{
  "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjdlM..."
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@gmail.com",
      "name": "John Doe",
      "firstName": "John",
      "lastName": "Doe",
      "picture": "https://lh3.googleusercontent.com/a/...",
      "emailVerified": true,
      "authMethod": "google",
      "preferences": {
        "theme": "light",
        "language": "en",
        "currency": "INR",
        "riskProfile": "moderate",
        "notifications": {
          "email": true,
          "push": true,
          "priceAlerts": true,
          "newsAlerts": true
        }
      },
      "subscription": {
        "plan": "free",
        "autoRenew": false
      },
      "kyc": {
        "status": "pending"
      }
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": 900
    }
  }
}
```

**Error Response (401):**

```json
{
  "success": false,
  "error": "Google token verification failed: Invalid token"
}
```

### Other Available Endpoints

1. **Email/Password Login**
   - URL: `POST /api/auth/login`
   - Body: `{ "email": "user@example.com", "password": "password123" }`

2. **Email/Password Register**
   - URL: `POST /api/auth/register`
   - Body: `{ "email": "user@example.com", "password": "password123", "name": "John Doe" }`

3. **Refresh Token**
   - URL: `POST /api/auth/refresh`
   - Body: `{ "refreshToken": "..." }`

4. **Get Current User** (Protected)
   - URL: `GET /api/auth/me`
   - Headers: `Authorization: Bearer <accessToken>`

5. **Logout** (Protected)
   - URL: `POST /api/auth/logout`
   - Headers: `Authorization: Bearer <accessToken>`

---

## 📊 WHAT GETS STORED IN MONGODB

When user signs in with Google, backend stores this in `users` collection:

```javascript
{
  userId: "550e8400-e29b-41d4-a716-446655440000", // UUID
  googleId: "102837465940283746594",              // Google ID
  email: "user@gmail.com",
  emailVerified: true,
  authMethod: "google",
  name: "John Doe",
  firstName: "John",
  lastName: "Doe",
  picture: "https://lh3.googleusercontent.com/a/...",
  preferences: { theme: "light", language: "en", ... },
  kyc: { status: "pending" },
  subscription: { plan: "free", autoRenew: false },
  refreshTokens: ["jwt-token-1", "jwt-token-2"],
  lastLogin: ISODate("2025-12-03T10:30:00.000Z"),
  loginHistory: [
    {
      timestamp: ISODate("2025-12-03T10:30:00.000Z"),
      ip: "192.168.1.100",
      userAgent: "Mozilla/5.0..."
    }
  ],
  isActive: true,
  isBlocked: false,
  createdAt: ISODate("2025-12-03T10:30:00.000Z"),
  updatedAt: ISODate("2025-12-03T10:30:00.000Z")
}
```

---

## 🧪 TESTING CHECKLIST

### Before Starting

- [ ] Backend server is running on `http://localhost:3002`
- [ ] Can access `http://localhost:3002/health` successfully
- [ ] MongoDB is connected (check backend logs)

### After Implementation

- [ ] Google OAuth button appears on login page
- [ ] Clicking button opens Google account picker
- [ ] After selecting account, backend receives request
- [ ] Backend returns user data and tokens
- [ ] Tokens are stored in localStorage
- [ ] User is redirected to home page
- [ ] User object is available in AuthContext
- [ ] Can access protected routes
- [ ] Logout works correctly
- [ ] Refresh works correctly

### Verify in Browser DevTools

```javascript
// Open browser console and check:
localStorage.getItem('accessToken'); // Should show JWT token
localStorage.getItem('refreshToken'); // Should show JWT token
localStorage.getItem('user'); // Should show user JSON
```

---

## 🐛 TROUBLESHOOTING

### Issue: "Cannot connect to server"

**Solution:** Make sure backend is running:

```bash
cd e:\mutual-funds-backend
npm run dev
```

### Issue: CORS errors

**Solution:** Backend must allow your frontend URL. Check `src/app.ts` in backend has:

```javascript
cors({
  origin: [
    'http://localhost:5001',
    'http://localhost:3000',
    'http://localhost:5173', // Add your Vite port
    // Add your frontend URL here
  ],
  credentials: true,
});
```

### Issue: "Google token verification failed"

**Solution:** Verify you're using correct Google Client ID in frontend

### Issue: User not appearing in database

**Solution:** Check backend logs for errors, verify MongoDB connection

### Issue: Redirect not working

**Solution:** Make sure routes are configured correctly in App.jsx

---

## 🔒 SECURITY NOTES

1. **NEVER store Google Client Secret in frontend** - It's only for backend
2. **Store tokens in localStorage** - They're needed for API requests
3. **Access Token expires in 15 minutes** - Use refresh token to get new one
4. **Refresh Token expires in 7 days** - User must login again after that
5. **Always use HTTPS in production**

---

## 📦 COMPLETE PORT INFORMATION

### Development Ports

- **Backend:** `http://localhost:3002`
- **Frontend (Vite):** `http://localhost:5173` (default)
- **Frontend (CRA):** `http://localhost:3000` (default)
- **Frontend (Next.js):** `http://localhost:3000` (default)

### Production URLs

- **Backend:** Update to your deployed backend URL (e.g., Vercel, Railway)
- **Frontend:** Update to your deployed frontend URL

---

## 🚀 DEPLOYMENT CHECKLIST

### Frontend Deployment

- [ ] Update `VITE_BACKEND_URL` to production backend URL
- [ ] Verify CORS settings in backend include production frontend URL
- [ ] Test login flow in production
- [ ] Verify tokens are stored correctly
- [ ] Test protected routes

### Backend Deployment (Already Done)

- [x] Google OAuth credentials configured
- [x] MongoDB connected
- [x] JWT secrets set
- [x] All endpoints working

---

## 📞 SUPPORT

### Backend Details

- **Repository:** `e:\mutual-funds-backend`
- **Port:** `3002`
- **Start Command:** `npm run dev`

### Google OAuth Config

- **Client ID:** `YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com`
- **Client Secret:** (Backend only, DO NOT USE in frontend)
- **Authorized Origins:** `http://localhost:5001`, `http://localhost:3000`, etc.
- **Redirect URIs:** `http://localhost:3002/api/auth/google/callback` (Backend only)

### Key Files Created

- Environment variables: `.env`
- Auth Service: `src/services/authService.js`
- Auth Context: `src/contexts/AuthContext.jsx`
- Google Button: `src/components/GoogleLoginButton.jsx`
- Login Page: `src/pages/LoginPage.jsx`
- Protected Route: `src/components/ProtectedRoute.jsx`

---

## ✅ SUMMARY

This implementation provides:

1. ✅ Complete Google OAuth integration
2. ✅ User authentication context
3. ✅ Protected routes
4. ✅ Token management
5. ✅ Error handling
6. ✅ Loading states
7. ✅ Logout functionality
8. ✅ Session persistence

**Total Implementation Time:** ~30 minutes

**All user data (Google ID, email, name, picture, etc.) is automatically stored in MongoDB by the backend!**

---

## 🎯 QUICK START (3 Steps)

1. **Install packages:**

   ```bash
   npm install @react-oauth/google axios
   ```

2. **Copy all the code above** into your frontend

3. **Start both servers:**

   ```bash
   # Terminal 1 - Backend
   cd e:\mutual-funds-backend
   npm run dev

   # Terminal 2 - Frontend
   cd your-frontend-folder
   npm run dev
   ```

**Done!** 🎉 Test by clicking the Google Sign-In button.
