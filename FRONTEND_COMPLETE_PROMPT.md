# 🎯 Frontend Authentication Integration - Complete Prompt

Copy this entire prompt to your frontend AI assistant or use it to implement the authentication system.

---

## 📋 Backend API Already Working

Your backend is running on `http://localhost:3002` with these endpoints:

1. **POST** `/api/auth/register` - Register with email/password
   - Body: `{ name, email, password }`
   - Returns: `{ statusCode: 201, data: { user, tokens } }`

2. **POST** `/api/auth/login` - Login with email/password
   - Body: `{ email, password }`
   - Returns: `{ statusCode: 200, data: { user, tokens } }`

3. **POST** `/api/auth/google` - Google Sign-In
   - Body: `{ idToken }`
   - Returns: `{ statusCode: 200, data: { user, tokens } }`

4. **POST** `/api/auth/refresh` - Refresh access token
   - Body: `{ refreshToken }`
   - Returns: `{ data: { tokens: { accessToken } } }`

**Google OAuth Callback Flow:**

- After Google authentication, backend redirects to: `http://localhost:5001/auth/success?accessToken=...&refreshToken=...&user=...`

---

## 🔧 Required Changes in Frontend

### Step 1: Install Dependencies

```bash
npm install axios @react-oauth/google react-router-dom
```

---

### Step 2: Create Environment Variables

Create `.env` file in frontend root:

```env
REACT_APP_API_URL=http://localhost:3002/api
REACT_APP_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
```

Replace `YOUR_GOOGLE_CLIENT_ID` with your actual Google Client ID from Google Cloud Console.

---

### Step 3: Create Auth Success Page

**File:** `src/pages/AuthSuccess.jsx`

```jsx
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function AuthSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    const userString = searchParams.get('user');

    if (accessToken && refreshToken && userString) {
      try {
        // Store tokens in localStorage
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        // Parse and store user data
        const user = JSON.parse(decodeURIComponent(userString));
        localStorage.setItem('user', JSON.stringify(user));

        console.log('✅ Login successful:', user);

        // Redirect to home page
        setTimeout(() => {
          navigate('/');
          window.location.reload(); // Reload to update auth state
        }, 500);
      } catch (error) {
        console.error('❌ Error processing auth:', error);
        alert('Authentication failed. Please try again.');
        navigate('/login');
      }
    } else {
      console.error('❌ Missing auth parameters');
      navigate('/login');
    }
  }, [searchParams, navigate]);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #3498db',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          animation: 'spin 1s linear infinite',
        }}
      ></div>
      <p style={{ marginTop: '20px', fontSize: '18px', color: '#666' }}>
        Completing sign in...
      </p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
```

---

### Step 4: Create API Service

**File:** `src/services/api.js`

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Add token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');

        const { data } = await axios.post(
          `${process.env.REACT_APP_API_URL}/auth/refresh`,
          { refreshToken }
        );

        const newAccessToken = data.data.tokens.accessToken;
        localStorage.setItem('accessToken', newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
```

---

### Step 5: Create Auth Service

**File:** `src/services/authService.js`

```javascript
import api from './api';

export const authService = {
  // Register with email/password
  async register(name, email, password) {
    try {
      const response = await api.post('/auth/register', {
        name,
        email,
        password,
      });
      const { user, tokens } = response.data.data;

      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
      localStorage.setItem('user', JSON.stringify(user));

      return { success: true, user };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Registration failed',
      };
    }
  },

  // Login with email/password
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, tokens } = response.data.data;

      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
      localStorage.setItem('user', JSON.stringify(user));

      return { success: true, user };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed',
      };
    }
  },

  // Google Sign-In
  async googleSignIn(idToken) {
    try {
      const response = await api.post('/auth/google', { idToken });
      const { user, tokens } = response.data.data;

      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
      localStorage.setItem('user', JSON.stringify(user));

      return { success: true, user };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Google sign-in failed',
      };
    }
  },

  // Logout
  logout() {
    localStorage.clear();
  },

  // Get current user
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if authenticated
  isAuthenticated() {
    return !!localStorage.getItem('accessToken');
  },
};
```

---

### Step 6: Update Login Page

**File:** `src/pages/Login.jsx`

```jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { authService } from '../services/authService';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await authService.login(email, password);

    if (result.success) {
      navigate('/');
      window.location.reload();
    } else {
      setError(result.error);
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('');
    setLoading(true);

    const result = await authService.googleSignIn(
      credentialResponse.credential
    );

    if (result.success) {
      navigate('/');
      window.location.reload();
    } else {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
        }}
      >
        <div
          style={{
            backgroundColor: 'white',
            padding: '40px',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            width: '100%',
            maxWidth: '400px',
          }}
        >
          <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Sign In</h2>

          {error && (
            <div
              style={{
                backgroundColor: '#fee',
                color: '#c00',
                padding: '10px',
                borderRadius: '4px',
                marginBottom: '20px',
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '16px',
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div
            style={{
              textAlign: 'center',
              margin: '20px 0',
              color: '#666',
            }}
          >
            Or continue with
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google sign-in failed')}
              useOneTap
            />
          </div>

          <p style={{ textAlign: 'center', marginTop: '20px' }}>
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}
```

---

### Step 7: Update Register Page

**File:** `src/pages/Register.jsx`

```jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { authService } from '../services/authService';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    const result = await authService.register(name, email, password);

    if (result.success) {
      navigate('/');
      window.location.reload();
    } else {
      setError(result.error);
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('');
    setLoading(true);

    const result = await authService.googleSignIn(
      credentialResponse.credential
    );

    if (result.success) {
      navigate('/');
      window.location.reload();
    } else {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
        }}
      >
        <div
          style={{
            backgroundColor: 'white',
            padding: '40px',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            width: '100%',
            maxWidth: '400px',
          }}
        >
          <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>
            Create Account
          </h2>

          {error && (
            <div
              style={{
                backgroundColor: '#fee',
                color: '#c00',
                padding: '10px',
                borderRadius: '4px',
                marginBottom: '20px',
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '16px',
              }}
            >
              {loading ? 'Creating account...' : 'Register'}
            </button>
          </form>

          <div
            style={{
              textAlign: 'center',
              margin: '20px 0',
              color: '#666',
            }}
          >
            Or continue with
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google sign-in failed')}
            />
          </div>

          <p style={{ textAlign: 'center', marginTop: '20px' }}>
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}
```

---

### Step 8: Update Navigation/Header Component

**Add this to your existing Navbar/Header component:**

```jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    navigate('/login');
  };

  return (
    <nav
      style={{
        padding: '15px 30px',
        backgroundColor: '#333',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <h1>Mutual Funds App</h1>

      <div>
        {!user ? (
          <button
            onClick={() => navigate('/login')}
            style={{
              padding: '8px 20px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Sign In
          </button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <img
              src={user.profilePicture || 'https://via.placeholder.com/40'}
              alt={user.name}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                objectFit: 'cover',
              }}
            />
            <span>{user.name}</span>
            <button
              onClick={handleLogout}
              style={{
                padding: '8px 15px',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
```

---

### Step 9: Update App.jsx Routes

```jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import AuthSuccess from './pages/AuthSuccess';
import Home from './pages/Home';
// ... other imports

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth/success" element={<AuthSuccess />} />
        <Route path="/" element={<Home />} />
        {/* other routes */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

---

## ✅ Testing Checklist

After implementing:

1. **Start backend:** `npx tsx src/server-simple.ts` (port 3002)
2. **Start frontend:** `npm run dev` (port 5001)
3. **Test Register:**
   - Go to `/register`
   - Fill name, email, password
   - Click Register
   - Should redirect to home with avatar showing

4. **Test Login:**
   - Go to `/login`
   - Enter email and password
   - Click Sign In
   - Should redirect to home with avatar showing

5. **Test Google Sign-In:**
   - Click "Sign in with Google" button
   - Select Gmail account (numbers are normal)
   - Click Continue
   - Should redirect to home with Google profile picture

6. **Test Logout:**
   - Click Logout button
   - Should clear tokens and redirect to login
   - Sign In button should show again

---

## 🎯 Expected Result

After successful login/register:

- ✅ "Sign In" button replaced with user avatar and name
- ✅ User profile picture shows (from Google or placeholder)
- ✅ Tokens stored in localStorage
- ✅ User can navigate app while authenticated
- ✅ Logout clears everything and shows Sign In button again

---

**Backend is ready! Just implement these frontend changes and authentication will work perfectly!** 🚀
